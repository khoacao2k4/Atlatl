import { z } from 'zod';

// VALIDATION SCHEMA
export const schema = z.object({
  // Property Information
  propertyAddress: z.string().optional(),
  purchasePrice: z.number().min(0).max(100000000, 'Must be between $0 and $100,000,000'),
  cashInvested: z.number().min(0).max(100000000, 'Must be between $0 and $100,000,000'),
  landValue: z.number().min(0).max(100000000, 'Must be between $0 and $100,000,000'),
  personalProperty: z.number().min(0).max(100000000, 'Must be between $0 and $100,000,000'),
  annualRent: z.number().min(0).max(100000000, 'Must be between $0 and $100,000,000'),
  vacancy: z.number().min(0).max(100000000, 'Must be between $0 and $100,000,000'),
  personalPropertyDepRate: z.number().min(0).max(50, 'Must be between 0% and 50%'),
  buildingDepRate: z.number().min(0).max(10, 'Must be between 0% and 10%'),

  // Financing - Loan 1
  loan1Amount: z.number().min(0).max(100000000, 'Must be between $0 and $100,000,000'),
  interestRate1: z.number().min(0).max(100, 'Must be between 0% and 100%'),
  termInMonths1: z.number().int('Must be a whole number').min(0).max(360, 'Must be between 0 and 360'),
  interestOnly1: z.coerce.boolean(),

  // Financing - Loan 2
  loan2Amount: z.number().min(0).max(100000000, 'Must be between $0 and $100,000,000'),
  interestRate2: z.number().min(0).max(100, 'Must be between 0% and 100%'),
  termInMonths2: z.number().int('Must be a whole number').min(0).max(360, 'Must be between 0 and 360'),
  interestOnly2: z.coerce.boolean(),

  // Annual Expenses
  realEstateTaxes: z.number().min(0).max(1000000, 'Must be between $0 and $1,000,000'),
  utilities: z.number().min(0).max(10000000, 'Must be between $0 and $10,000,000'),
  insurance: z.number().min(0).max(10000000, 'Must be between $0 and $10,000,000'),
  maintenanceRepairs: z.number().min(0).max(10000000, 'Must be between $0 and $10,000,000'),
  advertising: z.number().min(0).max(10000000, 'Must be between $0 and $10,000,000'),
  adminLegal: z.number().min(0).max(10000000, 'Must be between $0 and $10,000,000'),
  supplies: z.number().min(0).max(10000000, 'Must be between $0 and $10,000,000'),
  propertyMgmtExpense: z.number().min(0).max(100, 'Must be between 0% and 100%'),
  miscellaneous: z.number().min(0).max(10000000, 'Must be between $0 and $10,000,000'),

  // Analysis
  taxBracket: z.number().min(0).max(100, 'Must be between 0% and 100%'),
  appreciationRate: z.number().min(0).max(100, 'Must be between 0% and 100%'),
  costOfCapital: z.number().min(0).max(100, 'Must be between 0% and 100%'),
}).refine((data) => {
  const totalLoans = data.loan1Amount + data.loan2Amount;
  return totalLoans <= data.purchasePrice;
}, {
  message: "Total loans cannot exceed purchase price",
  path: ["loan1Amount"],
});

// DEFAULT VALUES
export const defaults = {
  // Property Information
  propertyAddress: '',
  purchasePrice: 300000,
  cashInvested: 60000,
  landValue: 50000,
  personalProperty: 10000,
  annualRent: 36000,
  vacancy: 1800,
  personalPropertyDepRate: 20,
  buildingDepRate: 3.636,

  // Financing the Purchase - Loan 1
  loan1Amount: 240000,
  interestRate1: 7,
  termInMonths1: 360,
  interestOnly1: false,

  // Financing the Purchase - Loan 2
  loan2Amount: 0,
  interestRate2: 7,
  termInMonths2: 360,
  interestOnly2: false,

  // Annual Expenses
  realEstateTaxes: 3000,
  utilities: 1200,
  insurance: 1200,
  maintenanceRepairs: 1500,
  advertising: 0,
  adminLegal: 0,
  supplies: 300,
  propertyMgmtExpense: 8,
  miscellaneous: 500,

  // Analysis
  taxBracket: 25,
  appreciationRate: 3,
  costOfCapital: 8,
};

// INPUT CONFIGURATION
export const inputs = [
  // Property Information
  {
    name: 'propertyAddress',
    label: 'Property address',
    type: 'text',
    section: 'Property Information',
    hint: 'Address of the investment property'
  },
  {
    name: 'purchasePrice',
    label: 'Purchase Price',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Property Information',
    hint: 'Total purchase price of the investment property'
  },
  {
    name: 'cashInvested',
    label: 'Cash Invested',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Property Information',
    hint: 'The cash amount out of pocket required for the purchase of this property'
  },
  {
    name: 'landValue',
    label: 'Land Value',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Property Information',
    hint: 'The approximate value of the land that the property sits on. You cannot depreciate land value'
  },
  {
    name: 'personalProperty',
    label: 'Personal Property',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Property Information',
    hint: 'Washer/dryer, range, refrigerator, lawn equipment, fixtures and other'
  },
  {
    name: 'annualRent',
    label: 'Annual Rent',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Property Information',
    hint: 'Total annual rental income'
  },
  {
    name: 'vacancy',
    label: 'Vacancy',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Property Information',
    hint: 'Expected vacancy loss in dollars'
  },
  {
    name: 'personalPropertyDepRate',
    label: 'Personal property depreciation rate',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Property Information',
    hint: 'The rate annually you can depreciate on the personal property'
  },
  {
    name: 'buildingDepRate',
    label: 'Building depreciation rate',
    type: 'number',
    format: 'percentage',
    step: 0.001,
    required: true,
    section: 'Property Information',
    hint: 'Annual depreciation rate for building value'
  },

  // Financing the Purchase - Loan 1
  {
    name: 'loan1Amount',
    label: 'Loan 1 Amount',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Financing the Purchase',
    hint: 'First loan amount'
  },
  {
    name: 'interestRate1',
    label: 'Interest Rate 1',
    type: 'number',
    format: 'percentage',
    step: 0.01,
    required: true,
    section: 'Financing the Purchase',
    hint: 'Interest rate for first loan'
  },
  {
    name: 'termInMonths1',
    label: 'Term in Months',
    type: 'number',
    required: true,
    section: 'Financing the Purchase',
    hint: 'Loan term in months for first loan'
  },
  {
    name: 'interestOnly1',
    label: 'Interest only',
    type: 'checkbox',
    section: 'Financing the Purchase',
    hint: 'Check here for an interest only loan'
  },

  // Financing the Purchase - Loan 2
  {
    name: 'loan2Amount',
    label: 'Loan 2 Amount',
    type: 'number',
    format: 'currency',
    section: 'Financing the Purchase',
    hint: 'Second loan amount (optional)'
  },
  {
    name: 'interestRate2',
    label: 'Interest Rate 2',
    type: 'number',
    format: 'percentage',
    step: 0.01,
    section: 'Financing the Purchase',
    hint: 'Interest rate for second loan'
  },
  {
    name: 'termInMonths2',
    label: 'Term in Months',
    type: 'number',
    section: 'Financing the Purchase',
    hint: 'Loan term in months for second loan'
  },
  {
    name: 'interestOnly2',
    label: 'Interest only',
    type: 'checkbox',
    section: 'Financing the Purchase',
    hint: 'Check here for an interest only loan'
  },

  // Annual Expenses
  {
    name: 'realEstateTaxes',
    label: 'Real Estate Taxes',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Annual Expenses',
    hint: 'Annual property taxes'
  },
  {
    name: 'utilities',
    label: 'Utilities',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Annual Expenses',
    hint: 'Annual utility costs'
  },
  {
    name: 'insurance',
    label: 'Insurance',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Annual Expenses',
    hint: 'Annual property insurance'
  },
  {
    name: 'maintenanceRepairs',
    label: 'Maintenance/Repairs',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Annual Expenses',
    hint: 'Annual maintenance and repairs'
  },
  {
    name: 'advertising',
    label: 'Advertising',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Annual Expenses',
    hint: 'Annual advertising costs'
  },
  {
    name: 'adminLegal',
    label: 'Admin/Legal',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Annual Expenses',
    hint: 'Annual administrative and legal costs'
  },
  {
    name: 'supplies',
    label: 'Supplies',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Annual Expenses',
    hint: 'Annual supplies'
  },
  {
    name: 'propertyMgmtExpense',
    label: 'Property management expense',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Annual Expenses',
    hint: 'Percentage of gross income paid for property management'
  },
  {
    name: 'miscellaneous',
    label: 'Miscellaneous',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Annual Expenses',
    hint: 'Other miscellaneous annual expenses'
  },

  // Analysis of Operating and Investment Results
  {
    name: 'taxBracket',
    label: 'Tax bracket',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Analysis of Operating and Investment Results',
    hint: 'Your marginal income tax rate'
  },
  {
    name: 'appreciationRate',
    label: 'Appreciation rate',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Analysis of Operating and Investment Results',
    hint: 'The amount the property is appreciating on an annual basis'
  },
  {
    name: 'costOfCapital',
    label: 'Cost of capital for NPV',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Analysis of Operating and Investment Results',
    hint: 'The rate of return used to calculate the net present value of cash flows'
  },
];

// RESULTS CONFIGURATION
export const results = [
  // Property Information calculated fields
  {
    key: 'buildingValue',
    label: 'Building Value',
    format: 'currency',
    description: 'Purchase price minus land value',
    section: 'Property Information',
    readonly: true
  },
  {
    key: 'personalPropertyDepreciation',
    label: 'Personal property depreciation',
    format: 'currency',
    description: 'Annual depreciation on personal property',
    section: 'Property Information',
    readonly: true
  },
  {
    key: 'buildingDepreciation',
    label: 'Building depreciation',
    format: 'currency',
    description: 'Annual depreciation on building',
    section: 'Property Information',
    readonly: true
  },
  {
    key: 'totalDepreciation',
    label: 'Total depreciation',
    format: 'currency',
    description: 'Total annual depreciation',
    section: 'Property Information',
    readonly: true
  },

  // Financing calculated fields
  {
    key: 'principalAndInterest1',
    label: 'Principal and Interest',
    format: 'currency',
    description: 'Monthly payment for loan 1',
    section: 'Financing the Purchase',
    readonly: true
  },
  {
    key: 'principalAndInterest2',
    label: 'Principal and Interest',
    format: 'currency',
    description: 'Monthly payment for loan 2',
    section: 'Financing the Purchase',
    readonly: true
  },

  // Annual Expenses calculated fields
  {
    key: 'totalOperatingExpense',
    label: 'Total operating expense',
    format: 'currency',
    description: 'Total annual operating expenses',
    section: 'Annual Expenses',
    readonly: true
  },
  {
    key: 'operatingExpenseRatio',
    label: 'Operating expense ratio',
    format: 'percentage',
    description: "Percentage based on income, 23-30% is considered average",
    section: 'Annual Expenses',
    readonly: true
  },

  // Analysis results
  {
    key: 'netOperatingIncome',
    label: 'Net operating income',
    format: 'currency',
    description: 'Income after operating expenses',
    section: 'Analysis of Operating and Investment Results',
    readonly: true
  },
  {
    key: 'annualDebtService',
    label: 'Annual debt service',
    format: 'currency',
    description: 'Total annual loan payments',
    section: 'Analysis of Operating and Investment Results',
    readonly: true
  },
  {
    key: 'debtServiceRatio',
    label: 'Debt service coverage ratio',
    format: 'number',
    description: 'Net operating income divided by annual debt service (DSCR). Values > 1.25 are considered healthy',
    section: 'Analysis of Operating and Investment Results',
    readonly: true
  },
  {
    key: 'cashFlowBeforeTax',
    label: 'Cash flow before tax',
    format: 'currency',
    description: "What's left after expenses and debt service",
    section: 'Analysis of Operating and Investment Results',
    readonly: true
  },
  {
    key: 'taxableIncome',
    label: 'Taxable income',
    format: 'currency',
    description: 'Income subject to taxation',
    section: 'Analysis of Operating and Investment Results',
    readonly: true
  },
  {
    key: 'cashFlowAfterTax',
    label: 'Cash flow after-tax',
    format: 'currency',
    description: 'Net cash flow after taxes',
    section: 'Analysis of Operating and Investment Results',
    readonly: true
  },
  {
    key: 'roiWithAppreciation',
    label: 'ROI with appreciation',
    format: 'percentage',
    description: 'Return on investment including appreciation',
    section: 'Analysis of Operating and Investment Results',
    readonly: true
  },
  {
    key: 'roiWithoutAppreciation',
    label: 'ROI without appreciation',
    format: 'percentage',
    description: 'Return on investment excluding appreciation',
    section: 'Analysis of Operating and Investment Results',
    readonly: true
  },
  {
    key: 'capRate',
    label: 'Cap rate',
    format: 'percentage',
    description: 'Net operating income divided by purchase price',
    section: 'Analysis of Operating and Investment Results',
    readonly: true
  },
  {
    key: 'cashOnCash',
    label: 'Cash on cash',
    format: 'percentage',
    description: 'Cash flow before tax divided by cash invested',
    section: 'Analysis of Operating and Investment Results',
    readonly: true
  },
];

// HELPER FUNCTIONS
const calculateMonthlyPayment = (principal, annualRate, months, isInterestOnly) => {
  if (principal <= 0 || months <= 0) return 0;
  if (isInterestOnly) {
    return principal * (annualRate / 12);
  }
  if (annualRate === 0) {
    return principal / months;
  }
  const monthlyRate = annualRate / 12;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
};

const calculateFirstYearInterest = (principal, annualRate, monthlyPayment, months, isInterestOnly) => {
  if (principal <= 0 || months <= 0) return 0;
  if (isInterestOnly) {
    return principal * annualRate;
  }
  let balance = principal;
  let totalInterest = 0;
  const monthlyRate = annualRate / 12;
  const paymentsInYear = Math.min(12, months);
  for (let i = 0; i < paymentsInYear; i++) {
    const interest = balance * monthlyRate;
    totalInterest += interest;
    const principalPmt = monthlyPayment - interest;
    balance = Math.max(0, balance - principalPmt);
  }
  return totalInterest;
};

// CALCULATION FUNCTION
const calculate = (data) => {
  const round2 = (x) => Math.round(x * 100) / 100;

  // Extract inputs
  const purchasePrice = Number(data.purchasePrice) || 0;
  const cashInvested = Number(data.cashInvested) || 0;
  const landValue = Number(data.landValue) || 0;
  const personalProperty = Number(data.personalProperty) || 0;
  const buildingValue = purchasePrice - landValue;

  const annualRent = Number(data.annualRent) || 0;
  const vacancy = Number(data.vacancy) || 0;
  const personalPropertyDepRate = (Number(data.personalPropertyDepRate) || 0) / 100;
  const buildingDepRate = (Number(data.buildingDepRate) || 0) / 100;

  // Loan 1
  const loan1Amount = Number(data.loan1Amount) || 0;
  const interestRate1 = (Number(data.interestRate1) || 0) / 100;
  const termInMonths1 = Number(data.termInMonths1) || 0;
  const interestOnly1 = Boolean(data.interestOnly1);

  // Loan 2
  const loan2Amount = Number(data.loan2Amount) || 0;
  const interestRate2 = (Number(data.interestRate2) || 0) / 100;
  const termInMonths2 = Number(data.termInMonths2) || 0;
  const interestOnly2 = Boolean(data.interestOnly2);

  // Annual Expenses
  const realEstateTaxes = Number(data.realEstateTaxes) || 0;
  const utilities = Number(data.utilities) || 0;
  const insurance = Number(data.insurance) || 0;
  const maintenanceRepairs = Number(data.maintenanceRepairs) || 0;
  const advertising = Number(data.advertising) || 0;
  const adminLegal = Number(data.adminLegal) || 0;
  const supplies = Number(data.supplies) || 0;
  const propertyMgmtExpense = (Number(data.propertyMgmtExpense) || 0) / 100;
  const miscellaneous = Number(data.miscellaneous) || 0;

  // Analysis
  const taxBracket = (Number(data.taxBracket) || 0) / 100;
  const appreciationRate = (Number(data.appreciationRate) || 0) / 100;

  // Depreciation
  const personalPropertyDepreciation = personalProperty * personalPropertyDepRate;
  const buildingDepreciation = buildingValue * buildingDepRate;
  const totalDepreciation = personalPropertyDepreciation + buildingDepreciation;

  // Calculate monthly payments
  const principalAndInterest1 = calculateMonthlyPayment(loan1Amount, interestRate1, termInMonths1, interestOnly1);
  const principalAndInterest2 = calculateMonthlyPayment(loan2Amount, interestRate2, termInMonths2, interestOnly2);

  // Annual debt service
  const annualDebtService = (principalAndInterest1 + principalAndInterest2) * 12;

  // Calculate first year interest
  const firstYearInterest1 = calculateFirstYearInterest(loan1Amount, interestRate1, principalAndInterest1, termInMonths1, interestOnly1);
  const firstYearInterest2 = calculateFirstYearInterest(loan2Amount, interestRate2, principalAndInterest2, termInMonths2, interestOnly2);
  const totalFirstYearInterest = firstYearInterest1 + firstYearInterest2;

  // Calculate first year principal
  const firstYearPrincipal = annualDebtService - totalFirstYearInterest;

  // Income calculations
  const grossOperatingIncome = annualRent - vacancy;
  const propertyMgmtExpenseAmount = grossOperatingIncome * propertyMgmtExpense;

  // Total operating expenses
  const totalOperatingExpense = realEstateTaxes + utilities + insurance +
    maintenanceRepairs + advertising + adminLegal +
    supplies + propertyMgmtExpenseAmount + miscellaneous;

  // Operating expense ratio
  const operatingExpenseRatio = grossOperatingIncome > 0
    ? (totalOperatingExpense / grossOperatingIncome) * 100
    : 0;

  // Net operating income
  const netOperatingIncome = grossOperatingIncome - totalOperatingExpense;

  // Cash flow before tax
  const cashFlowBeforeTax = netOperatingIncome - annualDebtService;

  // Taxable income
  const taxableIncome = netOperatingIncome - totalFirstYearInterest - totalDepreciation;
  const taxesPaid = taxableIncome * taxBracket;

  // Cash flow after tax
  const cashFlowAfterTax = cashFlowBeforeTax - taxesPaid;

  // Debt Service Coverage Ratio (as a ratio, not percentage)
  const debtServiceRatio = annualDebtService > 0
    ? netOperatingIncome / annualDebtService
    : 0;

  // Cap Rate
  const capRate = purchasePrice > 0
    ? (netOperatingIncome / purchasePrice) * 100
    : 0;

  // Cash on Cash Return
  const cashOnCash = cashInvested > 0
    ? (cashFlowBeforeTax / cashInvested) * 100
    : 0;

  // ROI without appreciation
  const roiWithoutAppreciation = cashInvested > 0
    ? ((cashFlowBeforeTax + firstYearPrincipal - taxesPaid) / cashInvested) * 100
    : 0;

  // ROI with appreciation
  const appreciationAmount = purchasePrice * appreciationRate;
  const roiWithAppreciation = cashInvested > 0
    ? ((cashFlowBeforeTax + firstYearPrincipal - taxesPaid + appreciationAmount) / cashInvested) * 100
    : 0;

  return {
    // Property calculations
    buildingValue: round2(buildingValue),
    personalPropertyDepreciation: round2(personalPropertyDepreciation),
    buildingDepreciation: round2(buildingDepreciation),
    totalDepreciation: round2(totalDepreciation),

    // Loan payments
    principalAndInterest1: round2(principalAndInterest1),
    principalAndInterest2: round2(principalAndInterest2),

    // Operating expenses
    totalOperatingExpense: round2(totalOperatingExpense),
    operatingExpenseRatio: round2(operatingExpenseRatio),

    // Analysis results
    netOperatingIncome: round2(netOperatingIncome),
    annualDebtService: round2(annualDebtService),
    debtServiceRatio: round2(debtServiceRatio),
    cashFlowBeforeTax: round2(cashFlowBeforeTax),
    taxableIncome: round2(taxableIncome),
    cashFlowAfterTax: round2(cashFlowAfterTax),
    roiWithAppreciation: round2(roiWithAppreciation),
    roiWithoutAppreciation: round2(roiWithoutAppreciation),
    capRate: round2(capRate),
    cashOnCash: round2(cashOnCash),

    // Additional values for display
    firstYearInterest: round2(totalFirstYearInterest),
    firstYearPrincipal: round2(firstYearPrincipal),
    appreciationAmount: round2(appreciationAmount),
    taxesPaid: round2(taxesPaid),
    grossOperatingIncome: round2(grossOperatingIncome),
    propertyMgmtExpenseAmount: round2(propertyMgmtExpenseAmount),

    // Breakdowns
    propertyBreakdown: [
      { label: 'Purchase Price', value: round2(purchasePrice) },
      { label: 'Cash Invested', value: round2(cashInvested) },
      { label: 'Land Value', value: round2(landValue) },
      { label: 'Building Value', value: round2(buildingValue) },
      { label: 'Personal Property', value: round2(personalProperty) },
    ],

    incomeBreakdown: [
      { label: 'Annual Rent', value: round2(annualRent) },
      { label: 'Less: Vacancy', value: round2(-vacancy) },
      { label: 'Gross Operating Income', value: round2(grossOperatingIncome) },
    ],

    expenseBreakdown: [
      { label: 'Real Estate Taxes', value: round2(realEstateTaxes) },
      { label: 'Utilities', value: round2(utilities) },
      { label: 'Insurance', value: round2(insurance) },
      { label: 'Maintenance/Repairs', value: round2(maintenanceRepairs) },
      { label: 'Advertising', value: round2(advertising) },
      { label: 'Admin/Legal', value: round2(adminLegal) },
      { label: 'Supplies', value: round2(supplies) },
      { label: 'Property Management', value: round2(propertyMgmtExpenseAmount) },
      { label: 'Miscellaneous', value: round2(miscellaneous) },
      { label: 'Total Operating Expense', value: round2(totalOperatingExpense) },
    ],

    cashFlowBreakdown: [
      { label: 'Gross Operating Income', value: round2(grossOperatingIncome) },
      { label: 'Less: Operating Expenses', value: round2(-totalOperatingExpense) },
      { label: 'Net Operating Income', value: round2(netOperatingIncome) },
      { label: 'Less: Annual Debt Service', value: round2(-annualDebtService) },
      { label: 'Cash Flow Before Tax', value: round2(cashFlowBeforeTax) },
      { label: 'Less: Taxes Paid', value: round2(-taxesPaid) },
      { label: 'Cash Flow After Tax', value: round2(cashFlowAfterTax) },
    ],

    returnBreakdown: [
      { label: 'Cash Flow Before Tax', value: round2(cashFlowBeforeTax) },
      { label: 'Plus: Principal Reduction', value: round2(firstYearPrincipal) },
      { label: 'Less: Taxes Paid', value: round2(-taxesPaid) },
      { label: 'ROI without Appreciation', value: `${round2(roiWithoutAppreciation)}%` },
      { label: 'Plus: Appreciation', value: round2(appreciationAmount) },
      { label: 'ROI with Appreciation', value: `${round2(roiWithAppreciation)}%` },
    ],

    performanceMetrics: [
      {
        label: 'Cap Rate',
        value: `${round2(capRate)}%`,
        description: 'Net operating income ÷ purchase price'
      },
      {
        label: 'Cash on Cash',
        value: `${round2(cashOnCash)}%`,
        description: 'Cash flow before tax ÷ cash invested'
      },
      {
        label: 'Debt Service Coverage Ratio',
        value: `${round2(debtServiceRatio)}x`,
        description: 'Net operating income ÷ annual debt service (>1.25 is healthy)'
      },
      {
        label: 'Operating Expense Ratio',
        value: `${round2(operatingExpenseRatio)}%`,
        description: 'Operating expenses ÷ gross operating income'
      },
    ],
  };
};

// CHART CONFIGURATION
const charts = [
  {
    title: 'Income vs. Expenses',
    type: 'bar',
    height: 350,
    xKey: 'category',
    format: 'currency',
    showLegend: false,
    data: (results) => [
      { category: 'Gross Operating Income', value: results.grossOperatingIncome, color: '#10B981' },
      { category: 'Operating Expenses', value: results.totalOperatingExpense, color: '#EF4444' },
      { category: 'Net Operating Income', value: results.netOperatingIncome, color: '#3B82F6' },
    ],
    bars: [
      { key: 'value', name: 'Amount', color: '#3B82F6' }
    ],
    description: 'Annual income and expense comparison'
  },
  {
    title: 'Monthly Loan Payments',
    type: 'bar',
    height: 350,
    xKey: 'loan',
    format: 'currency',
    showLegend: false,
    data: (results) => {
      const data = [];
      if (results.principalAndInterest1 > 0) {
        data.push({ loan: 'Loan 1', value: results.principalAndInterest1, color: '#3B82F6' });
      }
      if (results.principalAndInterest2 > 0) {
        data.push({ loan: 'Loan 2', value: results.principalAndInterest2, color: '#8B5CF6' });
      }
      if (data.length === 0) {
        data.push({ loan: 'No Loans', value: 0, color: '#9CA3AF' });
      }
      return data;
    },
    bars: [
      { key: 'value', name: 'Monthly Payment', color: '#3B82F6' }
    ],
    description: 'Monthly principal and interest payments'
  },
  {
    title: 'Return Components',
    type: 'bar',
    height: 350,
    xKey: 'component',
    format: 'currency',
    showLegend: false,
    data: (results) => [
      { component: 'Cash Flow', value: results.cashFlowBeforeTax, color: '#3B82F6' },
      { component: 'Principal Reduction', value: results.firstYearPrincipal, color: '#10B981' },
      { component: 'Appreciation', value: results.appreciationAmount, color: '#8B5CF6' },
    ],
    bars: [
      { key: 'value', name: 'Amount', color: '#3B82F6' }
    ],
    description: 'Components of total investment return'
  },
  {
    title: 'Key Performance Metrics',
    type: 'bar',
    height: 350,
    xKey: 'metric',
    format: 'percentage',
    showLegend: false,
    data: (results) => [
      { metric: 'Cap Rate', value: results.capRate, color: '#3B82F6' },
      { metric: 'Cash on Cash', value: results.cashOnCash, color: '#10B981' },
      { metric: 'ROI w/o Appreciation', value: results.roiWithoutAppreciation, color: '#F59E0B' },
      { metric: 'ROI w/ Appreciation', value: results.roiWithAppreciation, color: '#8B5CF6' },
    ],
    bars: [
      { key: 'value', name: 'Percentage', color: '#3B82F6' }
    ],
    description: 'Investment performance ratios'
  },
  {
    title: 'Expense Breakdown',
    type: 'bar',
    height: 400,
    xKey: 'expense',
    format: 'currency',
    showLegend: false,
    data: (results) => {
      const expenses = results.expenseBreakdown.filter(e =>
        e.label !== 'Total Operating Expense' && e.value > 0
      );
      const expenseColors = ['#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E', '#10B981', '#14B8A6', '#06B6D4'];
      return expenses.map((e, idx) => ({
        expense: e.label,
        value: e.value,
        color: expenseColors[idx % expenseColors.length]
      }));
    },
    bars: [
      { key: 'value', name: 'Amount', color: '#EF4444' }
    ],
    description: 'Annual operating expense breakdown'
  },
];

// MAIN CONFIG EXPORT
export const config = {
  title: 'Investment Property Calculator',
  description: 'Examine the potential return you might receive from an investment property',
  schema,
  defaultValues: defaults,
  inputs,
  results,
  calculate,
  charts,
};