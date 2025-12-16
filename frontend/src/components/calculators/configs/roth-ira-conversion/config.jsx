import { z } from 'zod';
import { 
  calculateCompoundGrowth,
  calculateAfterTaxReturn,
  calculateCapitalGainsTax,
  createAgeValidator,
  createPercentageValidator,
  createCurrencyValidator
} from '../../utils';


// SCHEMA

export const schema = z.object({
  amountToConvert: createCurrencyValidator(),
  nonDeductibleContributions: createCurrencyValidator(),
  currentAge: createAgeValidator(),
  retirementAge: createAgeValidator(),
  rateOfReturn: createPercentageValidator(-100, 100),
  currentTaxRate: createPercentageValidator(),
  retirementTaxRate: createPercentageValidator(),
  investmentTaxRate: createPercentageValidator(),
}).refine((data) => data.retirementAge > data.currentAge, {
  message: "Retirement age must be greater than current age",
  path: ["retirementAge"],
});


// DEFAULTS

export const defaults = {
  amountToConvert: 10000,
  nonDeductibleContributions: 0,
  currentAge: 45,
  retirementAge: 65,
  rateOfReturn: 7,
  currentTaxRate: 24,
  retirementTaxRate: 22,
  investmentTaxRate: 15,
};


// INPUTS

export const inputs = [
  {
    name: 'amountToConvert',
    label: 'Amount to convert',
    type: 'number',
    format: 'currency',
    required: true,
    hint: 'Amount to convert from a traditional IRA to a Roth IRA. Assumes taxes are paid with funds outside the account.'
  },
  {
    name: 'nonDeductibleContributions',
    label: 'Non-deductible contributions',
    type: 'number',
    format: 'currency',
    required: true,
    hint: 'After-tax contributions made to your traditional IRA. These are not taxed again on conversion.'
  },
  {
    name: 'currentAge',
    label: 'Current age',
    type: 'number',
    required: true,
    hint: 'Your current age (must be less than 72 as this calculator does not account for RMDs)'
  },
  {
    name: 'retirementAge',
    label: 'Age at retirement',
    type: 'number',
    required: true,
    hint: 'Age you wish to retire'
  },
  {
    name: 'rateOfReturn',
    label: 'Rate of return',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    hint: 'Expected annual rate of return for your IRA (compounded annually)'
  },
  {
    name: 'currentTaxRate',
    label: 'Current tax rate',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    hint: 'Current marginal income tax rate that will apply to the conversion amount'
  },
  {
    name: 'retirementTaxRate',
    label: 'Tax rate at retirement',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    hint: 'Expected marginal income tax rate at retirement'
  },
  {
    name: 'investmentTaxRate',
    label: 'Investment tax rate',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    hint: 'Expected tax rate on taxable investments (typically long-term capital gains rate)'
  },
];


// RESULTS

export const results = [
  {
    key: 'taxableAmount',
    label: 'Taxable amount of conversion',
    format: 'currency',
    description: 'Amount subject to income tax (conversion amount minus non-deductible contributions)'
  },
  {
    key: 'conversionTaxes',
    label: 'Taxes owed on conversion',
    format: 'currency',
    description: 'Income tax due on the conversion at your current tax rate'
  },
  {
    key: 'rothBalanceAtRetirement',
    label: 'Roth IRA balance at retirement',
    format: 'currency',
    description: 'Total Roth IRA value at retirement (tax-free withdrawals)'
  },
  {
    key: 'traditionalBalanceAtRetirement',
    label: 'Traditional IRA balance at retirement',
    format: 'currency',
    description: 'Total traditional IRA value at retirement if not converted (before taxes)'
  },
  {
    key: 'traditionalAfterTax',
    label: 'Traditional IRA after-tax value',
    format: 'currency',
    description: 'Traditional IRA value after paying retirement taxes'
  },
  {
    key: 'taxableInvestmentBalance',
    label: 'Taxable investment balance',
    format: 'currency',
    description: 'Value of investing the conversion taxes in a taxable account'
  },
  {
    key: 'taxableInvestmentAfterTax',
    label: 'Taxable investment after-tax value',
    format: 'currency',
    description: 'After-tax value of the taxable investment account'
  },
  {
    key: 'traditionalPlusTaxableInvestment',
    label: 'Traditional IRA + taxable investment',
    format: 'currency',
    description: 'Combined after-tax value if you don\'t convert'
  },
  {
    key: 'conversionAdvantage',
    label: 'Roth conversion advantage',
    format: 'currency',
    description: 'Additional after-tax value from converting to Roth IRA'
  },
  {
    key: 'conversionAdvantagePercent',
    label: 'Advantage percentage',
    format: 'percentage',
    description: 'Percentage advantage of converting'
  },
  {
    key: 'betterChoice',
    label: 'Better choice',
    format: 'text',
    description: 'Whether to convert or keep traditional IRA'
  },
  {
    key: 'yearsToRetirement',
    label: 'Years to retirement',
    format: 'number'
  },
];


// CALCULATION HELPERS

const calculateTaxableInvestmentAfterTax = (principal, currentValue, taxRate) => {
  const gains = Math.max(0, currentValue - principal);
  const capitalGainsTax = gains * taxRate;
  return currentValue - capitalGainsTax;
};

const calculateYearSnapshot = (
  age,
  amountToConvert,
  conversionTaxes,
  annualRate,
  afterTaxReturn,
  retirementTaxRate,
  years
) => {
  const rothBalance = calculateCompoundGrowth(amountToConvert, annualRate, years);
  
  const tradBalance = calculateCompoundGrowth(amountToConvert, annualRate, years);
  const tradTax = tradBalance * retirementTaxRate;
  const tradAfterTax = tradBalance - tradTax;
  
  // Taxable investment grows at after-tax return (taxes paid annually)
  const taxableInv = calculateCompoundGrowth(conversionTaxes, afterTaxReturn, years);
  
  const tradPlusTaxable = tradAfterTax + taxableInv;

  return {
    age,
    rothBalance: Math.round(rothBalance),
    traditionalBalance: Math.round(tradBalance),
    traditionalAfterTax: Math.round(tradAfterTax),
    taxableInvestment: Math.round(taxableInv),
    traditionalPlusTaxable: Math.round(tradPlusTaxable),
  };
};


// CALCULATION

const calculate = (data) => {
  const amountToConvert = Number(data.amountToConvert) || 0;
  const nonDeductibleContributions = Number(data.nonDeductibleContributions) || 0;
  const currentAge = Number(data.currentAge);
  const retirementAge = Number(data.retirementAge);
  const years = Math.max(0, retirementAge - currentAge);

  const annualRate = Number(data.rateOfReturn) / 100;
  const currentTaxRate = Number(data.currentTaxRate) / 100;
  const retirementTaxRate = Number(data.retirementTaxRate) / 100;
  const investmentTaxRate = Number(data.investmentTaxRate) / 100;

  // Conversion taxes
  const taxableAmount = Math.max(0, amountToConvert - nonDeductibleContributions);
  const conversionTaxes = taxableAmount * currentTaxRate;

  // Scenario 1: Convert to Roth IRA (grows tax-free)
  const rothBalanceAtRetirement = calculateCompoundGrowth(
    amountToConvert,
    annualRate,
    years
  );

  // Scenario 2: Keep Traditional IRA
  const traditionalBalanceAtRetirement = calculateCompoundGrowth(
    amountToConvert,
    annualRate,
    years
  );
  const traditionalTaxes = traditionalBalanceAtRetirement * retirementTaxRate;
  const traditionalAfterTax = traditionalBalanceAtRetirement - traditionalTaxes;

  // Invest the conversion taxes in a taxable account
  // Use after-tax return since taxes are paid annually on taxable investments
  const afterTaxReturn = calculateAfterTaxReturn(annualRate, investmentTaxRate);
  const taxableInvestmentBalance = calculateCompoundGrowth(
    conversionTaxes,
    afterTaxReturn,
    years
  );
  
  // For display: Calculate what the after-tax value would be if we also paid capital gains
  // (though in practice, with annual taxation, there's less capital gains tax to pay)
  const taxableInvestmentAfterTax = calculateTaxableInvestmentAfterTax(
    conversionTaxes,
    taxableInvestmentBalance,
    investmentTaxRate
  );

  // Total value if you don't convert
  // Use the taxable investment balance (which already accounts for annual taxes via reduced return)
  const traditionalPlusTaxableInvestment = 
    traditionalAfterTax + taxableInvestmentBalance;

  // Comparison
  const conversionAdvantage = 
    rothBalanceAtRetirement - traditionalPlusTaxableInvestment;
  const conversionAdvantagePercent = 
    traditionalPlusTaxableInvestment !== 0 
      ? (conversionAdvantage / traditionalPlusTaxableInvestment) * 100 
      : 0;

  const betterChoice = conversionAdvantage > 0 
    ? "Convert to Roth IRA" 
    : "Keep Traditional IRA";

  // Build yearly series for charts
  const yearlySeries = Array.from({ length: years }, (_, i) => 
    calculateYearSnapshot(
      currentAge + i + 1,
      amountToConvert,
      conversionTaxes,
      annualRate,
      afterTaxReturn,
      retirementTaxRate,
      i + 1
    )
  );

  return {
    taxableAmount,
    conversionTaxes,
    rothBalanceAtRetirement,
    traditionalBalanceAtRetirement,
    traditionalAfterTax,
    taxableInvestmentBalance,
    taxableInvestmentAfterTax,
    traditionalPlusTaxableInvestment,
    conversionAdvantage,
    conversionAdvantagePercent,
    betterChoice,
    yearsToRetirement: years,
    yearlySeries,
  };
};


// CHARTS

const createBarChart = (title, description, dataFn, bars) => ({
  title,
  type: 'bar',
  height: 350,
  xKey: title.includes('Breakdown') ? 'component' : 'scenario',
  format: 'currency',
  showLegend: false,
  data: dataFn,
  bars,
  description,
});

const charts = [
  createBarChart(
    'After-Tax Value at Retirement',
    'What you actually get to spend at retirement',
    (results) => [
      {
        scenario: 'Convert to Roth',
        value: results.rothBalanceAtRetirement || 0,
        color: '#10B981',
      },
      {
        scenario: 'Keep Traditional + Taxable',
        value: results.traditionalPlusTaxableInvestment || 0,
        color: '#3B82F6',
      },
    ],
    [{ key: 'value', name: 'After-Tax Value', fill: 'color' }]
  ),
  createBarChart(
    'Traditional IRA Breakdown (No Conversion)',
    'Components if you keep your traditional IRA',
    (results) => [
      {
        component: 'Traditional IRA (after-tax)',
        value: results.traditionalAfterTax || 0,
        color: '#3B82F6',
      },
      {
        component: 'Taxable Investment (after-tax)',
        value: results.taxableInvestmentAfterTax || 0,
        color: '#8B5CF6',
      },
    ],
    [{ key: 'value', name: 'Value', fill: 'color' }]
  ),
  createBarChart(
    'Tax Impact Comparison',
    'Taxes paid now (conversion) vs later (retirement withdrawals)',
    (results) => [
      {
        scenario: 'Convert to Roth',
        value: results.conversionTaxes || 0,
        color: '#EF4444',
      },
      {
        scenario: 'Keep Traditional',
        value: (results.traditionalBalanceAtRetirement - results.traditionalAfterTax) || 0,
        color: '#F59E0B',
      },
    ],
    [{ key: 'value', name: 'Taxes Paid', fill: 'color' }]
  ),
  {
    title: 'Growth Over Time',
    type: 'line',
    height: 400,
    xKey: 'age',
    format: 'currency',
    showLegend: true,
    data: (results) => results.yearlySeries || [],
    lines: [
      { key: 'rothBalance', name: 'Roth IRA (tax-free)', stroke: '#10B981' },
      { key: 'traditionalPlusTaxable', name: 'Traditional + Taxable (after-tax)', stroke: '#3B82F6' },
    ],
    description: 'After-tax account values over time',
  },
];


// CONFIG EXPORT

export const config = {
  title: 'Roth IRA Conversion Calculator',
  description: 'Compare converting a traditional IRA to a Roth IRA versus keeping it traditional',
  schema,
  defaultValues: defaults,
  inputs,
  results,
  calculate,
  charts,
};