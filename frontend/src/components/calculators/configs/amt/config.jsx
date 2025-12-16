import { schema } from './schema';
import { defaults } from './defaults';
import { inputs } from './inputs';
import { results } from './results';

// 2025 Tax Constants (Updated per IRS)
const TAX_CONSTANTS_2024 = {
  standardDeductions: {
    single: 14600,
    married: 29200,
    marriedSeparate: 14600,
    headOfHousehold: 21900
  },
  amtExemptions: {
    single: 88100,
    married: 137000,
    marriedSeparate: 68650,
    headOfHousehold: 88100
  },
  amtPhaseoutThresholds: {
    single: 626350,
    married: 1252700,
    marriedSeparate: 626350,
    headOfHousehold: 626350
  },
  amtRateThreshold: {
    single: 220700,
    married: 220700,
    marriedSeparate: 110350,
    headOfHousehold: 220700
  },
  regularTaxBrackets: {
    single: [
      { limit: 11600, rate: 0.10 },
      { limit: 47150, rate: 0.12 },
      { limit: 100525, rate: 0.22 },
      { limit: 191950, rate: 0.24 },
      { limit: 243725, rate: 0.32 },
      { limit: 609350, rate: 0.35 },
      { limit: Infinity, rate: 0.37 }
    ],
    married: [
      { limit: 23200, rate: 0.10 },
      { limit: 94300, rate: 0.12 },
      { limit: 201050, rate: 0.22 },
      { limit: 383900, rate: 0.24 },
      { limit: 487450, rate: 0.32 },
      { limit: 731200, rate: 0.35 },
      { limit: Infinity, rate: 0.37 }
    ],
    marriedSeparate: [
      { limit: 11600, rate: 0.10 },
      { limit: 47150, rate: 0.12 },
      { limit: 100525, rate: 0.22 },
      { limit: 191950, rate: 0.24 },
      { limit: 243725, rate: 0.32 },
      { limit: 365600, rate: 0.35 },
      { limit: Infinity, rate: 0.37 }
    ],
    headOfHousehold: [
      { limit: 16550, rate: 0.10 },
      { limit: 63100, rate: 0.12 },
      { limit: 100500, rate: 0.22 },
      { limit: 191950, rate: 0.24 },
      { limit: 243700, rate: 0.32 },
      { limit: 609350, rate: 0.35 },
      { limit: Infinity, rate: 0.37 }
    ]
  }
};

export const config = {
  title: 'Alternative Minimum Tax (AMT) Calculator',
  description: 'Calculate your AMT liability from exercising Incentive Stock Options (ISOs)',
  schema,
  defaultValues: defaults,
  inputs,
  results,

  calculate: (data) => {
    // Parse inputs
    const filingStatus = data.filingStatus;
    const useStandardDeduction = typeof data.standardDeduction === 'string'
      ? data.standardDeduction === 'true'
      : Boolean(data.standardDeduction);

    // Calculate ISO Spread (Bargain Element)
    const isoSpread = Math.max(0, (data.fmv409a - data.strikePrice) * data.sharesExercised);
    
    // Total ordinary income (wages + short-term capital gains)
    const ordinaryIncome = data.annualIncome + data.capitalGainsShortTerm;

    // ===== REGULAR TAX CALCULATION =====
    
    // Step 1: Calculate standard or itemized deduction
    const standardDeduction = TAX_CONSTANTS_2024.standardDeductions[filingStatus];
    const totalDeductions = useStandardDeduction 
      ? standardDeduction 
      : Math.max(data.itemizedDeductions + data.saltDeduction, standardDeduction);
    
    // Step 2: Calculate taxable income
    const regularTaxableIncome = Math.max(0, ordinaryIncome - totalDeductions);
    
    // Step 3: Calculate regular tax using progressive brackets
    const regularTax = calculateTaxFromBrackets(
      regularTaxableIncome,
      TAX_CONSTANTS_2024.regularTaxBrackets[filingStatus]
    );
    
    // Step 4: Add capital gains tax (15% for most taxpayers)
    const capitalGainsTax = data.capitalGainsLongTerm * 0.15;
    const totalRegularTax = regularTax + capitalGainsTax;

    // ===== AMT CALCULATION (Following Form 6251) =====
    
    // Step 1: Start with taxable income (per Bench.co guidance)
    let amti = regularTaxableIncome;
    
    // Step 2: Make required adjustments (add back AMT preference items)
    
    // Add back state and local taxes (SALT) - disallowed under AMT
    amti += data.saltDeduction;
    
    // Add back ISO spread (incentive stock option exercise)
    amti += isoSpread;
    
    // If using standard deduction, add it back (AMT uses exemption instead)
    if (useStandardDeduction) {
      amti += standardDeduction;
    }
    
    // Add long-term capital gains for exemption calculation
    const amtiForExemption = amti + data.capitalGainsLongTerm;
    
    // Step 3: Calculate and subtract AMT exemption
    const amtExemption = TAX_CONSTANTS_2024.amtExemptions[filingStatus];
    const phaseoutThreshold = TAX_CONSTANTS_2024.amtPhaseoutThresholds[filingStatus];
    
    let exemptionAmount = amtExemption;
    if (amtiForExemption > phaseoutThreshold) {
      // Exemption phases out at 25 cents per dollar over threshold
      const phaseoutReduction = (amtiForExemption - phaseoutThreshold) * 0.25;
      exemptionAmount = Math.max(0, amtExemption - phaseoutReduction);
    }
    
    // Subtract exemption to get final AMTI
    const finalAMTI = Math.max(0, amti - exemptionAmount);
    
    // Step 4: Apply AMT tax rates (26% or 28%)
    const rateThreshold = TAX_CONSTANTS_2024.amtRateThreshold[filingStatus];
    let amtTax = 0;
    
    if (finalAMTI <= rateThreshold) {
      amtTax = finalAMTI * 0.26;
    } else {
      amtTax = (rateThreshold * 0.26) + ((finalAMTI - rateThreshold) * 0.28);
    }
    
    // Add capital gains tax (same treatment as regular tax)
    const totalAMTTax = amtTax + capitalGainsTax;
    
    // ===== FINAL CALCULATION =====
    
    // You pay the HIGHER of regular tax or AMT
    const additionalTaxOwed = Math.max(0, totalAMTTax - totalRegularTax);
    const totalTaxOwed = Math.max(totalRegularTax, totalAMTTax);
    
    // Calculate effective rate
    const totalEconomicIncome = ordinaryIncome + data.capitalGainsLongTerm + isoSpread;
    const effectiveTaxRate = totalEconomicIncome > 0 
      ? (totalTaxOwed / totalEconomicIncome) * 100 
      : 0;

    return {
      // Main Results
      regularTax: totalRegularTax,
      amtTax: totalAMTTax,
      additionalTaxOwed,
      totalTaxOwed,
      isoSpread,
      effectiveTaxRate,
      
      // Detailed Breakdowns
      regularTaxBreakdown: [
        { label: 'Ordinary Income', value: ordinaryIncome, format: 'currency' },
        { label: 'Less: Total Deductions', value: -totalDeductions, format: 'currency' },
        { label: 'Taxable Income (Line 15, Form 1040)', value: regularTaxableIncome, format: 'currency' },
        { label: 'Tax on Taxable Income', value: regularTax, format: 'currency' },
        { label: 'Long-Term Capital Gains (15%)', value: data.capitalGainsLongTerm, format: 'currency' },
        { label: 'Capital Gains Tax', value: capitalGainsTax, format: 'currency' },
        { label: 'Total Regular Tax', value: totalRegularTax, format: 'currency' }
      ],
      
      amtBreakdown: [
        { label: '1. Start: Taxable Income', value: regularTaxableIncome, format: 'currency' },
        { label: '2. Add: SALT Taxes', value: data.saltDeduction, format: 'currency' },
        { label: '3. Add: ISO Spread', value: isoSpread, format: 'currency' },
        { label: '4. Add: Standard Deduction (if used)', value: useStandardDeduction ? standardDeduction : 0, format: 'currency' },
        { label: '5. Alternative Min. Taxable Income (AMTI)', value: amti, format: 'currency' },
        { label: '6. AMTI for Exemption Calc', value: amtiForExemption, format: 'currency' },
        { label: '7. Less: AMT Exemption', value: -exemptionAmount, format: 'currency' },
        { label: '8. Final AMTI', value: finalAMTI, format: 'currency' },
        { label: '9. AMT Tax (26%/28%)', value: amtTax, format: 'currency' },
        { label: '10. Capital Gains Tax (15%)', value: capitalGainsTax, format: 'currency' },
        { label: 'Total AMT', value: totalAMTTax, format: 'currency' }
      ],

      breakdown: [
        { label: 'ISO Shares Exercised', value: data.sharesExercised, format: 'number' },
        { label: 'Strike Price', value: data.strikePrice, format: 'currency' },
        { label: '409A Fair Market Value', value: data.fmv409a, format: 'currency' },
        { label: 'Spread Per Share', value: data.fmv409a - data.strikePrice, format: 'currency' },
        { label: 'Total ISO Spread', value: isoSpread, format: 'currency' },
      ],

      notes: [
        `You exercised ${data.sharesExercised.toLocaleString()} ISO shares`,
        `ISO spread (bargain element): ${formatCurrency(isoSpread)}`,
        totalAMTTax > totalRegularTax 
          ? `⚠️ AMT applies - You owe an additional ${formatCurrency(additionalTaxOwed)} in taxes`
          : `✓ AMT does not apply - Your regular tax is higher`,
        `Filing status: ${getFilingStatusLabel(filingStatus)}`,
        `Effective tax rate: ${effectiveTaxRate.toFixed(2)}%`,
        'This is an estimate for planning purposes only. Consult a tax professional for accuracy.'
      ]
    };
  },

  charts: [
    {
      title: 'Tax System Comparison',
      type: 'bar',
      height: 350,
      xKey: 'system',
      format: 'currency',
      showLegend: false,
      data: (results) => [
        {
          system: 'Regular Tax',
          value: results.regularTax,
        },
        {
          system: 'AMT',
          value: results.amtTax,
        },
        {
          system: 'You Owe',
          value: results.totalTaxOwed,
        }
      ],
      bars: [
        { key: 'value', name: 'Tax Amount', color: '#3B82F6' }
      ],
      description: 'Comparison of tax calculations - you pay the higher amount'
    },
    {
      title: 'ISO Exercise Impact',
      type: 'bar',
      height: 350,
      xKey: 'component',
      format: 'currency',
      showLegend: false,
      data: (results) => [
        {
          component: 'ISO Spread',
          value: results.isoSpread,
        },
        {
          component: 'Additional AMT',
          value: results.additionalTaxOwed,
        }
      ],
      bars: [
        { key: 'value', name: 'Amount', color: '#F59E0B' }
      ],
      description: 'How your ISO exercise affects your taxes'
    }
  ]
};

// Helper function to calculate tax from brackets
function calculateTaxFromBrackets(income, brackets) {
  let tax = 0;
  let previousLimit = 0;

  for (const bracket of brackets) {
    if (income <= previousLimit) break;
    
    const taxableInBracket = Math.min(income, bracket.limit) - previousLimit;
    tax += taxableInBracket * bracket.rate;
    
    previousLimit = bracket.limit;
    if (income <= bracket.limit) break;
  }

  return tax;
}

// Helper function to format currency
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Helper function to get filing status label
function getFilingStatusLabel(status) {
  const labels = {
    single: 'Single',
    married: 'Married Filing Jointly',
    marriedSeparate: 'Married Filing Separately',
    headOfHousehold: 'Head of Household'
  };
  return labels[status] || status;
}