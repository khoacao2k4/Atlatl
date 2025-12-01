import { z } from 'zod';

export const config = {
  title: 'Roth IRA Conversion Calculator',
  description: 'Analyze the benefits of converting a traditional IRA to a Roth IRA',
  schema: z.object({
    amountToConvert: z.number().min(0),
    nonDeductibleContributions: z.number().min(0),
    currentAge: z.number().min(18).max(71),
    retirementAge: z.number().min(20).max(100),
    rateOfReturn: z.number().min(-100).max(100),
    currentTaxRate: z.number().min(0).max(100),
    retirementTaxRate: z.number().min(0).max(100),
    investmentTaxRate: z.number().min(0).max(100),
  }),
  defaultValues: {
    amountToConvert: 100000,
    nonDeductibleContributions: 0,
    currentAge: 45,
    retirementAge: 67,
    rateOfReturn: 7,
    currentTaxRate: 24,
    retirementTaxRate: 22,
    investmentTaxRate: 15,
  },
  inputs: [
    { 
      name: 'amountToConvert', 
      label: 'Amount to Convert', 
      type: 'number', 
      required: true,
      helpText: 'Amount to convert from traditional IRA to Roth IRA (assumes taxes paid from outside funds)'
    },
    { 
      name: 'nonDeductibleContributions', 
      label: 'Non-Deductible Contributions', 
      type: 'number',
      helpText: 'After-tax contributions already made to traditional IRA (not subject to conversion tax)'
    },
    { 
      name: 'currentAge', 
      label: 'Current Age', 
      type: 'number', 
      required: true,
      helpText: 'Current age of account owner (must be less than 72)'
    },
    { 
      name: 'retirementAge', 
      label: 'Age at Retirement', 
      type: 'number', 
      required: true,
      helpText: 'Desired age at retirement'
    },
    { 
      name: 'rateOfReturn', 
      label: 'Rate of Return (%)', 
      type: 'number', 
      step: 0.1,
      helpText: 'Expected annual rate of return (compounded annually)'
    },
    { 
      name: 'currentTaxRate', 
      label: 'Current Tax Rate (%)', 
      type: 'number', 
      step: 0.1,
      helpText: 'Current marginal income tax rate that will apply to conversion'
    },
    { 
      name: 'retirementTaxRate', 
      label: 'Tax Rate at Retirement (%)', 
      type: 'number', 
      step: 0.1,
      helpText: 'Expected marginal income tax rate at retirement'
    },
    { 
      name: 'investmentTaxRate', 
      label: 'Investment Tax Rate (%)', 
      type: 'number', 
      step: 0.1,
      helpText: 'Expected tax rate for taxable investments (typically capital gains rate)'
    },
  ],
  calculate: (data) => {
    const yearsToRetirement = data.retirementAge - data.currentAge;
    const annualRate = data.rateOfReturn / 100;
    
    // Calculate taxable portion of conversion
    const taxableAmount = data.amountToConvert - data.nonDeductibleContributions;
    const nonTaxableAmount = data.nonDeductibleContributions;
    
    // Tax owed on conversion
    const conversionTax = taxableAmount * (data.currentTaxRate / 100);
    
    // === ROTH IRA CONVERSION SCENARIO ===
    
    // Amount that goes into Roth IRA (full amount converts)
    const rothConversionAmount = data.amountToConvert;
    
    // Roth IRA grows tax-free
    const rothBalanceAtRetirement = rothConversionAmount * Math.pow(1 + annualRate, yearsToRetirement);
    
    // No tax on Roth withdrawals (already paid tax at conversion)
    const rothAfterTaxValue = rothBalanceAtRetirement;
    
    // Cost: taxes paid at conversion
    const rothTotalTaxPaid = conversionTax;
    
    // === TRADITIONAL IRA (NO CONVERSION) SCENARIO ===
    
    // Traditional IRA grows tax-deferred
    const traditionalBalanceAtRetirement = data.amountToConvert * Math.pow(1 + annualRate, yearsToRetirement);
    
    // Tax owed when withdrawing from traditional IRA at retirement
    const traditionalTaxableGrowth = traditionalBalanceAtRetirement - data.nonDeductibleContributions;
    const traditionalTaxAtRetirement = traditionalTaxableGrowth * (data.retirementTaxRate / 100);
    
    const traditionalAfterTaxValue = traditionalBalanceAtRetirement - traditionalTaxAtRetirement;
    
    // Tax savings from not converting (invest this amount)
    const taxSavingsInvested = conversionTax;
    
    // These tax savings grow in a taxable account
    const taxSavingsGrowth = taxSavingsInvested * Math.pow(1 + annualRate, yearsToRetirement);
    
    // Calculate taxes on the taxable investment account
    // Only the gains are taxed
    const taxableAccountGains = taxSavingsGrowth - taxSavingsInvested;
    const taxOnTaxableAccount = taxableAccountGains * (data.investmentTaxRate / 100);
    
    const taxSavingsAfterTax = taxSavingsGrowth - taxOnTaxableAccount;
    
    // Total for no conversion: Traditional IRA after tax + invested tax savings after tax
    const noConversionTotalValue = traditionalAfterTaxValue + taxSavingsAfterTax;
    
    // Total tax paid in no conversion scenario
    const noConversionTotalTax = traditionalTaxAtRetirement + taxOnTaxableAccount;
    
    // COMPARISON
    
    const conversionAdvantage = rothAfterTaxValue - noConversionTotalValue;
    const conversionAdvantagePercent = (conversionAdvantage / noConversionTotalValue) * 100;
    
    const betterOption = conversionAdvantage > 0 ? 'Convert to Roth IRA' : 'Keep Traditional IRA';
    
    const taxSavingsAmount = noConversionTotalTax - rothTotalTaxPaid;
    const taxSavingsPercent = (taxSavingsAmount / noConversionTotalTax) * 100;
    
    // Breakeven analysis - at what retirement tax rate would conversion break even?
    // This requires solving: rothAfterTaxValue = traditionalAfterTaxValue + taxSavingsAfterTax
    // Simplified breakeven: when current tax rate equals retirement tax rate (approximately)
    const breakevenTaxRate = data.currentTaxRate;
    
    // Year-by-year growth comparison
    const yearlyGrowth = [];
    for (let year = 0; year <= yearsToRetirement; year++) {
      const age = data.currentAge + year;
      
      const rothBalance = rothConversionAmount * Math.pow(1 + annualRate, year);
      const tradBalance = data.amountToConvert * Math.pow(1 + annualRate, year);
      const taxSavingsBalance = taxSavingsInvested * Math.pow(1 + annualRate, year);
      
      // Calculate after-tax values
      const rothAfterTax = rothBalance;
      const tradTaxableGains = tradBalance - data.nonDeductibleContributions;
      const tradTax = tradTaxableGains * (data.retirementTaxRate / 100);
      const tradAfterTax = tradBalance - tradTax;
      
      const taxSavingsGains = taxSavingsBalance - taxSavingsInvested;
      const taxSavingsTax = taxSavingsGains * (data.investmentTaxRate / 100);
      const taxSavingsAfterTaxYear = taxSavingsBalance - taxSavingsTax;
      
      const noConversionTotal = tradAfterTax + taxSavingsAfterTaxYear;
      
      if (year % 5 === 0 || year === yearsToRetirement) {
        yearlyGrowth.push({
          year: year,
          age: age,
          rothBalance: rothBalance,
          rothAfterTax: rothAfterTax,
          traditionalBalance: tradBalance,
          traditionalAfterTax: tradAfterTax,
          taxSavingsAccount: taxSavingsAfterTaxYear,
          noConversionTotal: noConversionTotal,
          advantage: rothAfterTax - noConversionTotal
        });
      }
    }
    
    return {
      // Input calculations
      yearsToRetirement,
      taxableAmount,
      nonTaxableAmount,
      conversionTax,
      
      // Roth conversion results
      rothConversionAmount,
      rothBalanceAtRetirement,
      rothAfterTaxValue,
      rothTotalTaxPaid,
      
      // Traditional IRA (no conversion) results
      traditionalBalanceAtRetirement,
      traditionalTaxAtRetirement,
      traditionalAfterTaxValue,
      taxSavingsInvested,
      taxSavingsGrowth,
      taxOnTaxableAccount,
      taxSavingsAfterTax,
      noConversionTotalValue,
      noConversionTotalTax,
      
      // Comparison
      conversionAdvantage,
      conversionAdvantagePercent,
      betterOption,
      taxSavingsAmount,
      taxSavingsPercent,
      breakevenTaxRate,
      
      // Chart data
      yearlyGrowth,
      
      comparisonData: [
        { 
          scenario: 'Roth Conversion', 
          balance: rothBalanceAtRetirement,
          afterTaxValue: rothAfterTaxValue,
          totalTaxPaid: rothTotalTaxPaid,
          taxableAccount: 0
        },
        { 
          scenario: 'No Conversion', 
          balance: traditionalBalanceAtRetirement,
          afterTaxValue: noConversionTotalValue,
          totalTaxPaid: noConversionTotalTax,
          taxableAccount: taxSavingsAfterTax
        }
      ],
      
      taxBreakdown: [
        { 
          scenario: 'Roth Conversion',
          timing: 'Now (at conversion)',
          amount: conversionTax,
          description: 'Tax on taxable amount'
        },
        { 
          scenario: 'No Conversion',
          timing: 'At retirement',
          amount: traditionalTaxAtRetirement,
          description: 'Tax on traditional IRA withdrawal'
        },
        { 
          scenario: 'No Conversion',
          timing: 'At retirement',
          amount: taxOnTaxableAccount,
          description: 'Tax on taxable investment gains'
        }
      ]
    };
  },
  results: [
    { key: 'betterOption', label: 'Recommended Strategy', format: 'text', section: 'Recommendation' },
    { key: 'conversionAdvantage', label: 'Roth Conversion Advantage', format: 'currency', section: 'Recommendation' },
    { key: 'conversionAdvantagePercent', label: 'Advantage %', format: 'percent', section: 'Recommendation' },
    { key: 'taxSavingsAmount', label: 'Lifetime Tax Savings', format: 'currency', section: 'Recommendation' },
    { key: 'yearsToRetirement', label: 'Years to Retirement', format: 'number', section: 'Summary' },
    { key: 'taxableAmount', label: 'Taxable Amount (for conversion)', format: 'currency', section: 'Summary' },
    { key: 'conversionTax', label: 'Tax Due on Conversion (paid now)', format: 'currency', section: 'Summary' },
    { key: 'rothBalanceAtRetirement', label: 'Roth IRA Balance at Retirement', format: 'currency', section: 'Roth Conversion' },
    { key: 'rothAfterTaxValue', label: 'Roth After-Tax Value', format: 'currency', section: 'Roth Conversion' },
    { key: 'rothTotalTaxPaid', label: 'Total Tax Paid (Roth)', format: 'currency', section: 'Roth Conversion' },
    { key: 'traditionalBalanceAtRetirement', label: 'Traditional IRA Balance at Retirement', format: 'currency', section: 'No Conversion' },
    { key: 'traditionalAfterTaxValue', label: 'Traditional IRA After-Tax', format: 'currency', section: 'No Conversion' },
    { key: 'taxSavingsAfterTax', label: 'Invested Tax Savings After-Tax', format: 'currency', section: 'No Conversion' },
    { key: 'noConversionTotalValue', label: 'Total After-Tax Value (No Conversion)', format: 'currency', section: 'No Conversion' },
    { key: 'noConversionTotalTax', label: 'Total Tax Paid (No Conversion)', format: 'currency', section: 'No Conversion' },
    { key: 'breakevenTaxRate', label: 'Approximate Breakeven Tax Rate', format: 'percent', section: 'Analysis' },
  ],
  charts: [
    { 
      type: 'bar', 
      title: 'After-Tax Value at Retirement', 
      data: (r) => r.comparisonData, 
      xKey: 'scenario', 
      valueKey: 'afterTaxValue',
      format: 'currency', 
      height: 300,
      color: '#10b981'
    },
    { 
      type: 'bar', 
      title: 'Total Tax Paid (Lifetime)', 
      data: (r) => r.comparisonData, 
      xKey: 'scenario', 
      valueKey: 'totalTaxPaid',
      format: 'currency', 
      height: 300,
      color: '#ef4444'
    },
    { 
      type: 'line', 
      title: 'After-Tax Value Over Time', 
      data: (r) => r.yearlyGrowth, 
      xKey: 'age',
      lines: [
        { key: 'rothAfterTax', label: 'Roth IRA (After-Tax)', color: '#10b981' },
        { key: 'noConversionTotal', label: 'No Conversion (After-Tax Total)', color: '#3b82f6' }
      ],
      format: 'currency', 
      height: 400
    },
    { 
      type: 'line', 
      title: 'Conversion Advantage Over Time', 
      data: (r) => r.yearlyGrowth, 
      xKey: 'age',
      lines: [
        { key: 'advantage', label: 'Roth Advantage', color: '#8b5cf6' }
      ],
      format: 'currency', 
      height: 400
    }
  ]
};