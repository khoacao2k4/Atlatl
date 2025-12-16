import { z } from 'zod';

// VALIDATION SCHEMA
export const schema = z.object({
  purchasePrice: z.number()
    .min(0, 'Purchase price must be 0 or greater')
    .max(10000000, 'Purchase price seems unreasonably high'),
  downPayment: z.number()
    .min(0, 'Down payment cannot be negative')
    .max(10000000, 'Down payment seems unreasonably high'),
  salesTaxRate: z.number()
    .min(0, 'Sales tax rate cannot be negative')
    .max(20, 'Sales tax rate seems unreasonably high'),
  investmentReturnRate: z.number()
    .min(0, 'Investment return rate cannot be negative')
    .max(100, 'Investment return rate seems unreasonably high'),
  // Buy option fields
  loanTermMonths: z.number()
    .int('Must be a whole number')
    .min(12, 'Loan term must be at least 12 months')
    .max(96, 'Loan term cannot exceed 96 months'),
  loanInterestRate: z.number()
    .min(0, 'Interest rate cannot be negative')
    .max(100, 'Interest rate seems unreasonably high'),
  buyOtherFees: z.number()
    .min(0, 'Fees cannot be negative')
    .max(1000000, 'Fees seem unreasonably high'),
  annualDepreciationRate: z.number()
    .min(0, 'Depreciation rate cannot be negative')
    .max(100, 'Depreciation rate seems unreasonably high'),
  // Lease option fields
  leaseTermMonths: z.number()
    .int('Must be a whole number')
    .min(12, 'Lease term must be at least 12 months')
    .max(60, 'Lease term cannot exceed 60 months'),
  leaseInterestRate: z.number()
    .min(0, 'Interest rate cannot be negative')
    .max(100, 'Interest rate seems unreasonably high'),
  leaseOtherFees: z.number()
    .min(0, 'Fees cannot be negative')
    .max(1000000, 'Fees seem unreasonably high'),
  residualPercent: z.number()
    .min(0, 'Residual percent cannot be negative')
    .max(100, 'Residual percent cannot exceed 100%'),
  securityDeposit: z.number()
    .min(0, 'Security deposit cannot be negative')
    .max(1000000, 'Security deposit seems unreasonably high'),
})
  .refine(
    (data) => data.downPayment <= data.purchasePrice,
    {
      message: 'Down payment cannot exceed purchase price',
      path: ['downPayment'],
    }
  );

// DEFAULT VALUES
export const defaults = {
  // Common fields
  purchasePrice: 20000,
  downPayment: 1000,
  salesTaxRate: 6,
  investmentReturnRate: 7,
  // Buy option fields
  loanTermMonths: 60,
  loanInterestRate: 8,
  buyOtherFees: 0,
  annualDepreciationRate: 20,
  // Lease option fields
  leaseTermMonths: 24,
  leaseInterestRate: 8,
  leaseOtherFees: 100,
  residualPercent: 60,
  securityDeposit: 500,
};

// INPUT CONFIGURATION
export const inputs = [
  // Vehicle Information
  {
    name: 'purchasePrice',
    label: 'Purchase Price',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Vehicle Information',
    hint: 'Total purchase price (after any manufacturer\'s rebate)'
  },
  {
    name: 'downPayment',
    label: 'Down Payment / Capital Reduction',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Vehicle Information',
    hint: 'Amount paid upfront (for leases, this is often called capital reduction)'
  },
  {
    name: 'salesTaxRate',
    label: 'Sales Tax Rate',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Vehicle Information',
    hint: 'Sales tax is included in each lease payment. For buying, it\'s charged on the total sale amount.'
  },
  {
    name: 'investmentReturnRate',
    label: 'Investment Rate of Return',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Vehicle Information',
    hint: 'Expected annual return if you invest your down payment instead'
  },
  // Buy Option
  {
    name: 'loanTermMonths',
    label: 'Loan Term (Months)',
    type: 'number',
    required: true,
    section: 'Buy Option',
    hint: 'Typical terms are 36, 48, 60, or 72 months'
  },
  {
    name: 'loanInterestRate',
    label: 'Loan Interest Rate',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Buy Option',
    hint: 'Annual interest rate for your auto loan'
  },
  {
    name: 'buyOtherFees',
    label: 'Other Fees (Buy)',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Buy Option',
    hint: 'License, title transfer fees, etc. paid at time of purchase'
  },
  {
    name: 'annualDepreciationRate',
    label: 'Annual Depreciation Rate',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Buy Option',
    hint: 'High: 20%, Medium: 15%, Low: 10%'
  },
  // Lease Option
  {
    name: 'leaseTermMonths',
    label: 'Lease Term (Months)',
    type: 'number',
    required: true,
    section: 'Lease Option',
    hint: 'Term in months for your auto lease'
  },
  {
    name: 'leaseInterestRate',
    label: 'Lease Interest Rate',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Lease Option',
    hint: 'Annual interest rate (money factor × 2400) for your lease'
  },
  {
    name: 'leaseOtherFees',
    label: 'Other Fees (Lease)',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Lease Option',
    hint: 'License, title transfer fees, etc. paid at close of lease'
  },
  {
    name: 'residualPercent',
    label: 'Residual Value (%)',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Lease Option',
    hint: 'Remaining value after lease term expires. Higher = lower lease payment'
  },
  {
    name: 'securityDeposit',
    label: 'Security Deposit',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Lease Option',
    hint: 'Refundable security deposit required at time of lease'
  },
];

// RESULTS CONFIGURATION
export const results = [
  {
    key: 'betterChoice',
    label: 'Recommendation',
    format: 'text',
    description: 'Which option is more cost-effective'
  },
  {
    key: 'difference',
    label: 'Cost Difference',
    format: 'currency',
    description: 'How much you save with the better option'
  },
  {
    key: 'netCostBuy',
    label: 'Total Cost to Buy',
    format: 'currency',
    description: 'Net cost of buying over the comparison period'
  },
  {
    key: 'netCostLease',
    label: 'Total Cost to Lease',
    format: 'currency',
    description: 'Net cost of leasing over the lease term'
  },
  {
    key: 'buyMonthlyPayment',
    label: 'Buy Monthly Payment',
    format: 'currency',
    description: 'Monthly loan payment for buying'
  },
  {
    key: 'leaseMonthlyPayment',
    label: 'Lease Monthly Payment',
    format: 'currency',
    description: 'Monthly lease payment'
  },
];

// HELPER FUNCTIONS
const round2 = (x) => Math.round(x * 100) / 100;

const pmt = (principal, monthlyRate, n) => {
  if (n <= 0) return 0;
  if (monthlyRate === 0) return principal / n;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
};

const remainingBalance = (principal, monthlyRate, n, k) => {
  if (k >= n) return 0;
  if (monthlyRate === 0) {
    return principal * (1 - k / n);
  }
  const payment = pmt(principal, monthlyRate, n);
  return principal * Math.pow(1 + monthlyRate, k) - payment * ((Math.pow(1 + monthlyRate, k) - 1) / monthlyRate);
};

// CALCULATION FUNCTION
const calculate = (data) => {
  // Extract inputs
  const price = Number(data.purchasePrice) || 0;
  const downPayment = Number(data.downPayment) || 0;
  const salesTaxRate = (Number(data.salesTaxRate) || 0) / 100;
  const investReturnRate = (Number(data.investmentReturnRate) || 0) / 100;

  // Buy option
  const loanTermMonths = Number(data.loanTermMonths) || 60;
  const loanApr = (Number(data.loanInterestRate) || 0) / 100;
  const buyOtherFees = Number(data.buyOtherFees) || 0;
  const depreciationRate = (Number(data.annualDepreciationRate) || 0) / 100;

  // Lease option
  const leaseTermMonths = Number(data.leaseTermMonths) || 36;
  const leaseApr = (Number(data.leaseInterestRate) || 0) / 100;
  const leaseOtherFees = Number(data.leaseOtherFees) || 0;
  const residualPercent = (Number(data.residualPercent) || 0) / 100;
  const securityDeposit = Number(data.securityDeposit) || 0;

  const comparisonMonths = leaseTermMonths;
  const years = comparisonMonths / 12;

  // BUY CALCULATIONS
  // Sales tax is added to the loan amount
  const salesTax = price * salesTaxRate;
  const buyLoanAmount = price + salesTax - downPayment;
  const buyMonthlyRate = loanApr / 12;
  const buyMonthlyPayment = pmt(buyLoanAmount, buyMonthlyRate, loanTermMonths);
  
  // Total payments over comparison period (lease term)
  const totalLoanPayments = buyMonthlyPayment * comparisonMonths;
  
  // Remaining balance after comparison period
  const endingLoanBalance = remainingBalance(buyLoanAmount, buyMonthlyRate, loanTermMonths, comparisonMonths);
  
  // Market value after lease term (depreciation applied to original price)
  const marketValue = price * Math.pow(1 - depreciationRate, years);

  // LEASE CALCULATIONS
  const netCapCost = price - downPayment;
  const residualValue = price * residualPercent;
  const leaseMonthlyRate = leaseApr / 12;

  // Depreciation
  const monthlyDepreciation = (netCapCost - residualValue) / leaseTermMonths;

  // Finance charge (rent charge)
  const avgValue = (netCapCost + residualValue) / 2;
  const monthlyFinanceCharge = avgValue * leaseMonthlyRate;

  // Sales tax applied to entire lease payment
  const leasePaymentBeforeTax = monthlyDepreciation + monthlyFinanceCharge;
  const leaseMonthlyPayment = leasePaymentBeforeTax * (1 + salesTaxRate);

  const totalLeasePayments = leaseMonthlyPayment * leaseTermMonths;

  // OPPORTUNITY COST CALCULATIONS
  const monthlyInvestRate = investReturnRate / 12;

  // BUY OPTION LOST INTEREST
  // Only calculate lost interest on upfront cash (down payment + fees)
  const buyUpfrontCash = downPayment + buyOtherFees;
  let lostInterestBuy = 0;
  if (monthlyInvestRate > 0 && buyUpfrontCash > 0) {
    lostInterestBuy = buyUpfrontCash * (Math.pow(1 + monthlyInvestRate, comparisonMonths) - 1);
  }

  // LEASE OPTION LOST INTEREST
  const leaseUpfrontCash = downPayment + leaseOtherFees + securityDeposit;
  let lostInterestLease = 0;
  if (monthlyInvestRate > 0 && leaseUpfrontCash > 0) {
    lostInterestLease = leaseUpfrontCash * (Math.pow(1 + monthlyInvestRate, comparisonMonths) - 1);
  }

  // NET COSTS
  const netCostBuy = downPayment + buyOtherFees + totalLoanPayments + lostInterestBuy + endingLoanBalance - marketValue;
  const netCostLease = downPayment + leaseOtherFees + totalLeasePayments + lostInterestLease;

  // COMPARISON
  const betterChoice = netCostBuy < netCostLease ? "Buy" : "Lease";
  const difference = Math.abs(netCostBuy - netCostLease);

  // BREAKDOWNS
  const breakdown = [
    { label: "Down payment", value: round2(downPayment) },
    { label: "Other fees", value: round2(buyOtherFees) },
    { label: "Loan payments", value: round2(totalLoanPayments) },
    { label: "Lost interest", value: round2(lostInterestBuy) },
    { label: "Ending loan balance", value: round2(endingLoanBalance) },
    { label: "Market value (credit)", value: round2(-marketValue) },
    { label: "Net cost", value: round2(netCostBuy) },
  ];

  const leaseBreakdown = [
    { label: "Capital reduction", value: round2(downPayment) },
    { label: "Other fees", value: round2(leaseOtherFees) },
    { label: "Lease payments", value: round2(totalLeasePayments) },
    { label: "Lost interest", value: round2(lostInterestLease) },
    { label: "Net cost", value: round2(netCostLease) },
  ];

  return {
    // Monthly payments
    buyMonthlyPayment: round2(buyMonthlyPayment),
    leaseMonthlyPayment: round2(leaseMonthlyPayment),

    // Buy details
    buyLoanAmount: round2(buyLoanAmount),
    salesTax: round2(salesTax),
    totalLoanPayments: round2(totalLoanPayments),
    buyTotalLostInterest: round2(lostInterestBuy),
    endingLoanBalance: round2(endingLoanBalance),
    marketValue: round2(marketValue),

    // Lease details
    totalLeasePayments: round2(totalLeasePayments),
    leaseTotalLostInterest: round2(lostInterestLease),

    // Net costs
    netCostBuy: round2(netCostBuy),
    buyNetCost: round2(netCostBuy),
    netCostLease: round2(netCostLease),
    leaseNetCost: round2(netCostLease),

    // Comparison
    betterChoice,
    difference: round2(difference),

    // Breakdowns
    breakdown,
    leaseBreakdown,
  };
};

// CHART CONFIGURATION
const charts = [
  {
    title: 'Total Net Cost Comparison',
    type: 'bar',
    height: 350,
    xKey: 'option',
    format: 'currency',
    showLegend: false,
    data: (results) => [
      { option: 'Buy', value: results.netCostBuy },
      { option: 'Lease', value: results.netCostLease },
    ],
    bars: [
      { key: 'value', name: 'Net Cost', color: '#3B82F6' }
    ],
    description: 'Total net cost comparison over the lease term'
  },
  {
    title: 'Monthly Payment Comparison',
    type: 'bar',
    height: 300,
    xKey: 'option',
    format: 'currency',
    showLegend: false,
    data: (results) => [
      { option: 'Buy', value: results.buyMonthlyPayment },
      { option: 'Lease', value: results.leaseMonthlyPayment },
    ],
    bars: [
      { key: 'value', name: 'Monthly Payment', color: '#10B981' }
    ],
    description: 'Monthly payment comparison'
  },
  {
    title: 'Cost Breakdown Comparison',
    type: 'bar',
    height: 400,
    xKey: 'category',
    format: 'currency',
    showLegend: true,
    data: (results) => [
      {
        category: 'Upfront Costs',
        'Buy': results.breakdown[0].value + results.breakdown[1].value,
        'Lease': results.leaseBreakdown[0].value + results.leaseBreakdown[1].value
      },
      {
        category: 'Payments',
        'Buy': results.totalLoanPayments,
        'Lease': results.totalLeasePayments
      },
      {
        category: 'Lost Interest',
        'Buy': results.buyTotalLostInterest,
        'Lease': results.leaseTotalLostInterest
      },
    ],
    bars: [
      { key: 'Buy', name: 'Buy', color: '#3B82F6' },
      { key: 'Lease', name: 'Lease', color: '#10B981' }
    ],
    description: 'Detailed cost breakdown by category'
  },
];

// MAIN CONFIG EXPORT
export const config = {
  title: 'Lease vs Buy Calculator',
  description: 'Compare the true costs of leasing versus buying a vehicle to make the best financial decision',
  schema,
  defaultValues: defaults,
  inputs,
  results,
  calculate,
  charts,
};