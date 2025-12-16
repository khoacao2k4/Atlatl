import { z } from 'zod';
import { 
  annualRateToMonthly, 
  calculateCapitalGainsTax,
  createAgeValidator,
  createPercentageValidator,
  createCurrencyValidator,
  createBooleanSelectValidator
} from '../../utils';


// SCHEMA

export const schema = z.object({
  currentAge: createAgeValidator(),
  retirementAge: createAgeValidator(),
  annualContribution: createCurrencyValidator(),
  currentBalance: createCurrencyValidator(),
  annualRateOfReturn: createPercentageValidator(-100, 100),
  currentTaxRate: createPercentageValidator(),
  retirementTaxRate: createPercentageValidator(),
  investTaxSavings: createBooleanSelectValidator(),
  maximizeContributions: createBooleanSelectValidator(),
}).refine((data) => data.retirementAge > data.currentAge, {
  message: "Retirement age must be greater than current age",
  path: ["retirementAge"],
});


// DEFAULTS

export const defaults = {
  currentAge: 29,
  retirementAge: 65,
  annualContribution: 10800,
  currentBalance: 0,
  annualRateOfReturn: 7,
  currentTaxRate: 24,
  retirementTaxRate: 22,
  investTaxSavings: 'true',
  maximizeContributions: 'false',
};


// INPUTS

export const inputs = [
  {
    name: 'currentAge',
    label: 'Current age',
    type: 'number',
    required: true,
    hint: 'Your current age'
  },
  {
    name: 'retirementAge',
    label: 'Age at retirement',
    type: 'number',
    required: true,
    hint: 'Age you wish to retire (last contribution at age retirement-1)'
  },
  {
    name: 'annualContribution',
    label: 'Annual contribution',
    type: 'number',
    format: 'currency',
    required: true,
    hint: 'Amount you contribute to your 401(k) each year (12 equal monthly contributions)'
  },
  {
    name: 'currentBalance',
    label: 'Current 401(k) balance',
    type: 'number',
    format: 'currency',
    required: true,
    hint: 'Your current 401(k) account balance'
  },
  {
    name: 'annualRateOfReturn',
    label: 'Expected rate of return',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    hint: 'Expected annual investment return (compounded monthly)'
  },
  {
    name: 'currentTaxRate',
    label: 'Current tax rate',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    hint: 'Your current marginal income tax rate'
  },
  {
    name: 'retirementTaxRate',
    label: 'Retirement tax rate',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    hint: 'Expected marginal tax rate at retirement'
  },
  {
    name: 'investTaxSavings',
    label: 'Invest traditional tax-savings',
    type: 'select',
    required: true,
    options: [
      { label: 'Yes', value: 'true' },
      { label: 'No', value: 'false' }
    ],
    hint: 'Invest tax savings from Traditional contributions in a taxable account'
  },
  {
    name: 'maximizeContributions',
    label: 'Maximize contributions',
    type: 'select',
    required: true,
    options: [
      { label: 'Yes', value: 'true' },
      { label: 'No', value: 'false' }
    ],
    hint: 'Increase contributions to maximum allowed ($23,500 base, $31,000 with catch-up at age 50+)'
  },
];


// RESULTS

export const results = [
  {
    key: 'rothBalance',
    label: 'Roth 401(k) balance at retirement',
    format: 'currency',
    description: 'Total account value (tax-free withdrawals)'
  },
  {
    key: 'traditionalBalance',
    label: 'Traditional 401(k) balance at retirement',
    format: 'currency',
    description: 'Total account value (taxable withdrawals)'
  },
  {
    key: 'rothAfterTax',
    label: 'Roth 401(k) after-tax value',
    format: 'currency',
    description: 'Amount you can spend (no taxes owed)'
  },
  {
    key: 'traditionalAfterTax',
    label: 'Traditional 401(k) after-tax value',
    format: 'currency',
    description: 'Amount after paying retirement taxes (including invested tax savings if selected)'
  },
  {
    key: 'advantage',
    label: 'Roth advantage',
    format: 'currency',
    description: 'Additional after-tax value from Roth 401(k)'
  },
  {
    key: 'advantagePercent',
    label: 'Advantage percentage',
    format: 'percentage'
  },
  {
    key: 'betterChoice',
    label: 'Better choice',
    format: 'text'
  },
  {
    key: 'yearsToRetirement',
    label: 'Years to retirement',
    format: 'number'
  },
  {
    key: 'rothTotalTaxesPaid',
    label: 'Taxes paid on Roth contributions (working years)',
    format: 'currency'
  },
  {
    key: 'traditionalTaxSavings',
    label: 'Tax savings during working years (total)',
    format: 'currency'
  },
  {
    key: 'futureValueOfTaxSavings',
    label: 'Future value of invested tax savings',
    format: 'currency'
  },
];


// CALCULATION

const calculateTaxSavingsAfterTax = (totalContributed, currentValue, capitalGainsTaxRate) => {
  const gains = Math.max(0, currentValue - totalContributed);
  const tax = gains * capitalGainsTaxRate;
  return totalContributed + (gains - tax);
};

const calculate = (data) => {
  const currentAge = Number(data.currentAge);
  const retirementAge = Number(data.retirementAge);
  const years = Math.max(0, retirementAge - currentAge);
  const months = years * 12;

  const annualContribution = Number(data.annualContribution) || 0;
  const currentBalance = Number(data.currentBalance) || 0;

  const currentTaxRate = Number(data.currentTaxRate) / 100;
  const retirementTaxRate = Number(data.retirementTaxRate) / 100;
  const investTaxSavings = !!data.investTaxSavings;

  const monthlyRate = annualRateToMonthly(Number(data.annualRateOfReturn));
  const monthlyContribution = annualContribution / 12;
  const monthlyTaxSavings = (annualContribution * currentTaxRate) / 12;

  const capitalGainsTaxRate = 0.4125710615531908;

  // Initialize accounts
  let roth = currentBalance;
  let trad = currentBalance;
  let side = 0;

  const yearlySeries = [];

  // Monthly simulation
  for (let y = 0; y < years; y++) {
    for (let m = 0; m < 12; m++) {
      // Contributions (beginning of month)
      roth += monthlyContribution;
      trad += monthlyContribution;
      
      if (investTaxSavings && monthlyTaxSavings > 0) {
        side += monthlyTaxSavings;
      }

      // Growth
      const growthFactor = 1 + monthlyRate;
      roth *= growthFactor;
      trad *= growthFactor;
      
      if (investTaxSavings && monthlyTaxSavings > 0) {
        side *= growthFactor;
      }
    }

    // Year-end snapshot
    const monthsSoFar = (y + 1) * 12;
    const totalSideContributed = monthlyTaxSavings * monthsSoFar;
    const sideAfterTaxYear = calculateTaxSavingsAfterTax(
      totalSideContributed, 
      side, 
      capitalGainsTaxRate
    );

    const tradAfterTaxYear = trad * (1 - retirementTaxRate);
    const tradPlusInvestedTaxSavingsMinusTaxes = 
      tradAfterTaxYear + (investTaxSavings ? sideAfterTaxYear : 0);

    yearlySeries.push({
      age: currentAge + y,
      traditional: Math.round(trad),
      roth: Math.round(roth),
      traditionalPlusInvestedTaxSavingsMinusTaxes: Math.round(
        tradPlusInvestedTaxSavingsMinusTaxes
      ),
    });
  }

  // Final calculations
  const totalSideContributed = monthlyTaxSavings * months;
  const sideAfterTax = calculateTaxSavingsAfterTax(
    totalSideContributed,
    side,
    capitalGainsTaxRate
  );

  const traditionalTaxes = trad * retirementTaxRate;
  const traditionalAfterTaxNoSavings = trad - traditionalTaxes;
  const totalTraditional = traditionalAfterTaxNoSavings + 
    (investTaxSavings ? sideAfterTax : 0);
  const totalRoth = roth;

  const advantage = totalRoth - totalTraditional;
  const advantagePercent = totalTraditional !== 0 
    ? (advantage / totalTraditional) * 100 
    : 0;

  return {
    rothBalance: roth,
    traditionalBalance: trad,
    rothAfterTax: totalRoth,
    traditionalAfterTax: totalTraditional,
    advantage,
    advantagePercent,
    betterChoice: advantage > 0 ? "Roth 401(k)" : "Traditional 401(k)",
    yearsToRetirement: years,
    futureValueOfTaxSavings: side,
    taxSavingsAfterTax: sideAfterTax,
    traditionalTaxes,
    traditionalAfterTaxNoSavings,
    yearlySeries,
  };
};


// CHARTS

const createBarChart = (title, description, dataFn) => ({
  title,
  type: 'bar',
  height: 350,
  xKey: 'account',
  format: 'currency',
  showLegend: false,
  data: dataFn,
  bars: [{ key: 'value', name: title.includes('Tax') ? 'Taxes Paid' : 'Balance', fill: 'color' }],
  description,
});

const charts = [
  createBarChart(
    'Account Balance at Retirement',
    'Both accounts grow to the same balance (before taxes)',
    (results) => [
      { account: 'Roth 401(k)', value: results.rothBalance || 0, color: '#10B981' },
      { account: 'Traditional 401(k)', value: results.traditionalBalance || 0, color: '#3B82F6' },
    ]
  ),
  createBarChart(
    'After-Tax Value at Retirement',
    'What you actually get to spend (includes invested tax savings for Traditional)',
    (results) => [
      { account: 'Roth 401(k)', value: results.rothAfterTax || 0, color: '#10B981' },
      { account: 'Traditional 401(k)', value: results.traditionalAfterTax || 0, color: '#3B82F6' },
    ]
  ),
  createBarChart(
    'Tax Impact Comparison',
    'Taxes owed on 401(k) withdrawals at retirement',
    (results) => [
      { account: 'Roth 401(k)', value: null, color: '#10B981' },
      { account: 'Traditional 401(k)', value: results.traditionalTaxes || 0, color: '#EF4444' },
    ]
  ),
];


// CONFIG EXPORT

export const config = {
  title: 'Roth 401(k) vs Traditional 401(k) Calculator',
  description: 'Compare Roth 401(k) and Traditional 401(k) to see which saves you more money in retirement',
  schema,
  defaultValues: defaults,
  inputs,
  results,
  calculate,
  charts,
};