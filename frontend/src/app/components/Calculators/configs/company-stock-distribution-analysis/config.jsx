import { z } from 'zod';

// VALIDATION SCHEMA
export const schema = z.object({
  balanceAtDistribution: z.number().min(0, 'Must be 0 or greater'),
  costBasis: z.number().min(0, 'Must be 0 or greater'),
  rateOfReturn: z.number().min(-100, 'Must be -100% or greater').max(200, 'Must be 200% or less'),
  holdingPeriodYears: z.number().int('Must be a whole number').min(0, 'Must be 0 or greater').max(50, 'Must be 50 years or less'),
  holdingPeriodMonths: z.number().int('Must be a whole number').min(0, 'Must be 0 or greater').max(11, 'Must be 11 months or less'),
  capitalGainsRate: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
  marginalTaxRate: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
  inflationRate: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
  currentAge: z.number().int('Must be a whole number').min(0, 'Must be 0 or greater').max(120, 'Must be 120 or less'),
  separatedAtAge55: z.string().transform(val => val === 'true'),
  retirementDistributionAfter59Half: z.string().transform(val => val === 'true'),
  iraDistributionAfter59Half: z.string().transform(val => val === 'true'),
});

// DEFAULT VALUES
export const defaults = {
  balanceAtDistribution: 250000,
  costBasis: 100000,
  rateOfReturn: 8,
  holdingPeriodYears: 2,
  holdingPeriodMonths: 0,
  capitalGainsRate: 13.5,
  marginalTaxRate: 25,
  inflationRate: 3,
  currentAge: 60,
  separatedAtAge55: 'true',
  retirementDistributionAfter59Half: 'true',
  iraDistributionAfter59Half: 'true',
};

// INPUT CONFIGURATION
export const inputs = [
  // Stock Information
  {
    name: 'balanceAtDistribution',
    label: 'Balance at Time of Distribution (FMV)',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Stock Information',
    hint: 'Fair market value of company stock to be distributed'
  },
  {
    name: 'costBasis',
    label: 'Total Stock Purchases (Cost Basis)',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Stock Information',
    hint: 'Total amount paid for the stock (you and/or employer contributions)'
  },

  // Investment Assumptions
  {
    name: 'rateOfReturn',
    label: 'Expected Annual Rate of Return',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Investment Assumptions',
    hint: 'Expected annual return on company stock after distribution'
  },
  {
    name: 'holdingPeriodYears',
    label: 'Holding Period (Years)',
    type: 'number',
    required: true,
    section: 'Investment Assumptions',
    hint: 'Years you expect to hold the stock after distribution'
  },
  {
    name: 'holdingPeriodMonths',
    label: 'Holding Period (Additional Months)',
    type: 'number',
    section: 'Investment Assumptions',
    hint: 'Additional months beyond full years (0-11)'
  },
  {
    name: 'inflationRate',
    label: 'Expected Inflation Rate',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Investment Assumptions',
    hint: 'Long-term average inflation rate for present value calculations'
  },

  // Tax Information
  {
    name: 'marginalTaxRate',
    label: 'Marginal Income Tax Rate',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Tax Information',
    hint: 'Your ordinary income tax rate (federal + state)'
  },
  {
    name: 'capitalGainsRate',
    label: 'Long-Term Capital Gains Tax Rate',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Tax Information',
    hint: 'Long-term capital gains tax rate (typically 0%, 15%, or 20% federal)'
  },

  // Penalty Considerations
  {
    name: 'currentAge',
    label: 'Current Age',
    type: 'number',
    required: true,
    section: 'Penalty Considerations',
    hint: 'Your current age (used for informational purposes)'
  },
  {
    name: 'separatedAtAge55',
    label: 'Separated from Service at Age 55 or Older?',
    type: 'select',
    section: 'Penalty Considerations',
    options: [
      { value: false, label: 'No' },
      { value: true, label: 'Yes' }
    ],
    hint: 'If you separated in/after the year you turned 55, no 10% penalty on retirement plan distribution'
  },
  {
    name: 'retirementDistributionAfter59Half',
    label: 'Retirement Plan Distribution at Age 59½+?',
    type: 'select',
    section: 'Penalty Considerations',
    options: [
      { value: false, label: 'No' },
      { value: true, label: 'Yes' }
    ],
    hint: 'If distribution occurs at/after age 59½, no 10% penalty on cost basis'
  },
  {
    name: 'iraDistributionAfter59Half',
    label: 'IRA Distribution at Age 59½+?',
    type: 'select',
    section: 'Penalty Considerations',
    options: [
      { value: false, label: 'No' },
      { value: true, label: 'Yes' }
    ],
    hint: 'If IRA distribution occurs at/after age 59½, no 10% penalty on IRA rollover'
  },
];

// RESULTS CONFIGURATION
export const results = [
  {
    key: 'nua',
    label: 'Net Unrealized Appreciation (NUA)',
    format: 'currency'
  },
  {
    key: 'betterStrategy',
    label: 'Recommended Strategy',
    format: 'text'
  },
  {
    key: 'pvNuaTotalTax',
    label: 'NUA Strategy: Total Taxes (PV)',
    format: 'currency',
    description: 'Immediate taxes + present value of future taxes'
  },
  {
    key: 'pvIraTax',
    label: 'IRA Rollover: Total Taxes (PV)',
    format: 'currency',
    description: 'Present value of all taxes'
  },
  {
    key: 'advantage',
    label: 'NUA Strategy Advantage (Future Value)',
    format: 'currency',
    description: 'How much more you would have with NUA vs IRA rollover'
  },
  {
    key: 'advantagePercent',
    label: 'Advantage %',
    format: 'percentage'
  },
  {
    key: 'pvAdvantage',
    label: 'NUA Strategy Advantage (Present Value)',
    format: 'currency',
    description: 'Advantage adjusted for inflation'
  },
  {
    key: 'pvAdvantagePercent',
    label: 'Advantage % (PV)',
    format: 'percentage'
  },
];

// CALCULATION FUNCTION
const calculate = (data) => {
  // Extract and convert inputs
  const balanceAtDistribution = Number(data.balanceAtDistribution) || 0;
  const costBasis = Number(data.costBasis) || 0;
  const marginalTaxRate = Number(data.marginalTaxRate) || 0;
  const capitalGainsRate = Number(data.capitalGainsRate) || 0;
  const rateOfReturn = Number(data.rateOfReturn) || 0;
  const inflationRate = Number(data.inflationRate) || 0;

  // Calculate NUA and holding period
  const nua = Math.max(0, balanceAtDistribution - costBasis);
  const holdingMonths = (Number(data.holdingPeriodYears) || 0) * 12 + (Number(data.holdingPeriodMonths) || 0);
  const holdingYears = holdingMonths / 12;

  // Calculate future value and appreciation
  const fmvAtSale = balanceAtDistribution * Math.pow(1 + rateOfReturn / 100, holdingYears);
  const appreciationAfterDistribution = Math.max(0, fmvAtSale - balanceAtDistribution);

  // Determine penalty applicability
  const nuaInitialPenaltyApplies = !data.separatedAtAge55 && !data.retirementDistributionAfter59Half;
  const iraEarlyWithdrawalApplies = !data.iraDistributionAfter59Half;

  // === NUA STRATEGY ===
  const nuaInitialTax = costBasis * (marginalTaxRate / 100);
  const nuaInitialPenalty = nuaInitialPenaltyApplies ? costBasis * 0.10 : 0;
  const nuaTotalInitialTax = nuaInitialTax + nuaInitialPenalty;

  const nuaPortionTaxAtSale = nua * (capitalGainsRate / 100);

  const isLongTerm = holdingMonths >= 12;
  const appreciationTaxRate = isLongTerm ? (capitalGainsRate / 100) : (marginalTaxRate / 100);
  const appreciationTaxAtSale = appreciationAfterDistribution * appreciationTaxRate;

  const nuaTotalFutureTax = nuaPortionTaxAtSale + appreciationTaxAtSale;
  const nuaTotalTax = nuaTotalInitialTax + nuaTotalFutureTax;
  const nuaNetProceeds = fmvAtSale - nuaTotalFutureTax - nuaTotalInitialTax;

  // Present value calculations
  const discountRate = inflationRate / 100 || 0;
  const pvNuaNetProceeds = nuaNetProceeds / Math.pow(1 + discountRate, holdingYears);
  const pvNuaFutureTax = nuaTotalFutureTax / Math.pow(1 + discountRate, holdingYears);
  const pvNuaTotalTax = nuaTotalInitialTax + pvNuaFutureTax;

  // === IRA ROLLOVER STRATEGY ===
  const iraFmvAtSale = fmvAtSale;
  const iraTotalTaxAtSale = iraFmvAtSale * (marginalTaxRate / 100);
  const iraPenaltyAtSale = iraEarlyWithdrawalApplies ? iraFmvAtSale * 0.10 : 0;
  const iraTotalTaxWithPenalty = iraTotalTaxAtSale + iraPenaltyAtSale;
  const iraNetProceeds = iraFmvAtSale - iraTotalTaxWithPenalty;

  const pvIraNetProceeds = iraNetProceeds / Math.pow(1 + discountRate, holdingYears);
  const pvIraTax = iraTotalTaxWithPenalty / Math.pow(1 + discountRate, holdingYears);

  // === COMPARISON ===
  const advantage = nuaNetProceeds - iraNetProceeds;
  const advantagePercent = iraNetProceeds !== 0 ? (advantage / Math.abs(iraNetProceeds)) * 100 : 0;

  const pvAdvantage = pvNuaNetProceeds - pvIraNetProceeds;
  const pvAdvantagePercent = pvIraNetProceeds !== 0 ? (pvAdvantage / Math.abs(pvIraNetProceeds)) * 100 : 0;

  const betterStrategy = pvAdvantage > 0 ? 'NUA Strategy' : 'IRA Rollover';

  // Helper for formatting
  const round2 = (v) => (isFinite(v) ? Math.round(v * 100) / 100 : 0);

  return {
    // Basic metrics
    nua,
    fmvAtSale,
    appreciationAfterDistribution,

    // NUA Strategy
    nuaInitialTax,
    nuaInitialPenalty,
    nuaTotalInitialTax,
    nuaPortionTaxAtSale,
    appreciationTaxAtSale,
    nuaTotalFutureTax,
    nuaTotalTax,
    nuaNetProceeds,
    pvNuaFutureTax,
    pvNuaTotalTax,
    pvNuaNetProceeds,

    // IRA Rollover
    iraTotalTaxAtSale,
    iraPenaltyAtSale,
    iraTotalTaxWithPenalty,
    iraNetProceeds,
    pvIraTax,
    pvIraNetProceeds,

    // Comparison
    advantage,
    advantagePercent,
    pvAdvantage,
    pvAdvantagePercent,
    betterStrategy,

    // Breakdowns
    breakdown: [
      { label: 'NUA Amount', value: nua, format: 'currency' },
      { label: 'Cost Basis', value: costBasis, format: 'currency' },
      { label: 'Initial Distribution FMV', value: balanceAtDistribution, format: 'currency' },
      { label: 'Projected FMV at Sale', value: fmvAtSale, format: 'currency' },
      { label: 'Post-Distribution Appreciation', value: appreciationAfterDistribution, format: 'currency' },
    ],

    nuaBreakdown: [
      { label: 'Tax on Cost Basis (Ordinary Income)', value: nuaInitialTax, format: 'currency' },
      { label: 'Penalty on Cost Basis (if applicable)', value: nuaInitialPenalty, format: 'currency' },
      { label: 'Total Initial Tax', value: nuaTotalInitialTax, format: 'currency' },
      { label: 'Tax on NUA (Capital Gains)', value: nuaPortionTaxAtSale, format: 'currency' },
      { label: 'Tax on Appreciation (At Sale)', value: appreciationTaxAtSale, format: 'currency' },
      { label: 'Total Future Tax', value: nuaTotalFutureTax, format: 'currency' },
      { label: 'Total Tax (All)', value: nuaTotalTax, format: 'currency' },
      { label: 'Net Proceeds (Future Value)', value: nuaNetProceeds, format: 'currency' },
      { label: 'Net Proceeds (Present Value)', value: pvNuaNetProceeds, format: 'currency' },
    ],

    iraBreakdown: [
      { label: 'Tax on Full Amount (Ordinary Income)', value: iraTotalTaxAtSale, format: 'currency' },
      { label: 'Early Withdrawal Penalty (if applicable)', value: iraPenaltyAtSale, format: 'currency' },
      { label: 'Total Tax', value: iraTotalTaxWithPenalty, format: 'currency' },
      { label: 'Net Proceeds (Future Value)', value: iraNetProceeds, format: 'currency' },
      { label: 'Net Proceeds (Present Value)', value: pvIraNetProceeds, format: 'currency' },
    ],

    // Notes
    notes: [
      `Holding period: ${Math.floor(holdingMonths / 12)} years and ${holdingMonths % 12} months`,
      nuaInitialPenaltyApplies
        ? 'Early withdrawal penalty (10%) applied to NUA initial distribution (cost basis).'
        : 'No early withdrawal penalty on NUA initial distribution.',
      iraEarlyWithdrawalApplies
        ? 'Early withdrawal penalty (10%) will apply to IRA withdrawal.'
        : 'No early withdrawal penalty on IRA withdrawal.',
      `NUA portion is treated as long-term capital gain (taxed at ${capitalGainsRate}%).`,
      isLongTerm
        ? 'Appreciation after distribution will be taxed as long-term capital gain (>= 12 months).'
        : 'Appreciation after distribution will be taxed as ordinary income (short-term, < 12 months).',
      `Recommendation (present-value basis): ${betterStrategy} provides ${Math.abs(round2(pvAdvantagePercent))}% ${pvAdvantage > 0 ? 'more' : 'less'} net proceeds on a present-value basis.`,
    ],
  };
};

// CHART CONFIGURATION
const charts = [
  {
    title: 'Strategy Comparison: Net Proceeds',
    type: 'bar',
    height: 350,
    xKey: 'strategy',
    format: 'currency',
    showLegend: false,
    data: (results) => [
      {
        strategy: 'NUA Strategy',
        value: results.pvNuaNetProceeds,
        color: '#378CE7',
      },
      {
        strategy: 'IRA Rollover',
        value: results.pvIraNetProceeds,
        color: '#245383',
      },
    ],
    bars: [{ key: 'value', name: 'Net Proceeds', color: '#378CE7' }],
    description: 'Present value comparison of net proceeds after all taxes',
  },
  {
    title: 'Total Tax Comparison',
    type: 'bar',
    height: 350,
    xKey: 'strategy',
    format: 'currency',
    showLegend: false,
    data: (results) => [
      {
        strategy: 'NUA Strategy',
        value: results.pvNuaTotalTax,
        color: '#F87171',
      },
      {
        strategy: 'IRA Rollover',
        value: results.pvIraTax,
        color: '#DC2626',
      },
    ],
    bars: [{ key: 'value', name: 'Total Tax', color: '#F87171' }],
    description: 'Present value of total tax liability for each strategy',
  },
  {
    title: 'Present Value Comparison',
    type: 'bar',
    height: 350,
    xKey: 'strategy',
    format: 'currency',
    showLegend: false,
    data: (results) => [
      {
        strategy: 'NUA Strategy',
        value: results.pvNuaNetProceeds,
        color: '#378CE7',
      },
      {
        strategy: 'IRA Rollover',
        value: results.pvIraNetProceeds,
        color: '#245383',
      },
    ],
    bars: [{ key: 'value', name: 'Present Value Net Proceeds', color: '#378CE7' }],
    description: `Net proceeds adjusted for ${defaults.inflationRate}% inflation rate`,
  },
];

// MAIN CONFIG EXPORT
export const config = {
  title: 'Company Stock Distribution Analysis Calculator',
  description: 'Compare NUA (Net Unrealized Appreciation) strategy versus IRA rollover for company stock distributions from your retirement plan',
  schema,
  defaultValues: defaults,
  inputs,
  results,
  calculate,
  charts,
};