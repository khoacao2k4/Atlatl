import { z } from 'zod';
import { 
  getMonthsBetween, 
  formatCurrency, 
  annualRateToMonthly, 
  calculateMonthlyPayment 
} from '../../utils';

// SCHEMA
const schema = z.object({
  mortgageAmount: z.number().min(0, 'Must be 0 or greater'),
  interestRate: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
  originalTermYears: z.number().int('Must be a whole number').min(1, 'Must be at least 1 year').max(50, 'Must be 50 years or less'),
  firstPaymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date in YYYY-MM-DD format'),
  monthlyEscrow: z.number().min(0, 'Must be 0 or greater'),
  monthlyPrepayment: z.number().min(0, 'Must be 0 or greater'),
});

// DEFAULTS
const defaults = {
  mortgageAmount: 350000,
  interestRate: 7.5,
  originalTermYears: 30,
  firstPaymentDate: '2025-12-02',
  monthlyEscrow: 0,
  monthlyPrepayment: 0,
};

// INPUTS
const inputs = [
  { 
    name: 'mortgageAmount', 
    label: 'Mortgage Amount', 
    type: 'number',
    format: 'currency',
    required: true, 
    hint: 'The total dollar amount for this mortgage' 
  },
  { 
    name: 'interestRate', 
    label: 'Interest Rate', 
    type: 'number',
    format: 'percentage',
    step: 0.01, 
    required: true,
    hint: 'The interest rate on this mortgage' 
  },
  { 
    name: 'originalTermYears', 
    label: 'Original Mortgage Term (Years)', 
    type: 'number',
    required: true,
    hint: 'Number of years over which you would repay this loan with normal monthly payments (typically 15 or 30 years)' 
  },
  { 
    name: 'firstPaymentDate', 
    label: 'First Payment Date', 
    type: 'date',
    required: true,
    hint: 'The date your mortgage started (used to calculate remaining time and balance)' 
  },
  { 
    name: 'monthlyEscrow', 
    label: 'Monthly Escrow Amount (Optional)', 
    type: 'number',
    format: 'currency',
    hint: 'Monthly escrow amount if applicable. With biweekly payments, 1/2 of this amount will be paid every two weeks' 
  },
  { 
    name: 'monthlyPrepayment', 
    label: 'Monthly Prepayment Amount (Optional)', 
    type: 'number',
    format: 'currency',
    hint: 'Additional monthly prepayment amount. With biweekly payments, 1/2 of this amount will be debited every two weeks' 
  },
];

// RESULTS
const results = [
  { 
    key: 'monthlyPayment', 
    label: 'Monthly Principal & Interest Payment', 
    format: 'currency',
    description: 'Your standard monthly mortgage payment (principal and interest only)'
  },
  { 
    key: 'biweeklyPayment', 
    label: 'Biweekly Payment Amount', 
    format: 'currency',
    description: 'Amount paid every two weeks (1/2 of monthly payment)'
  },
  { 
    key: 'currentBalance', 
    label: 'Current Remaining Balance', 
    format: 'currency',
    description: 'Outstanding principal balance as of today'
  },
  { 
    key: 'remainingMonthlyPayments', 
    label: 'Remaining Payments (Monthly)', 
    format: 'number',
    description: 'Number of monthly payments remaining on original schedule'
  },
  { 
    key: 'remainingBiweeklyPayments', 
    label: 'Remaining Payments (Biweekly)', 
    format: 'number',
    description: 'Number of biweekly payments remaining with biweekly plan'
  },
  { 
    key: 'monthlyInterestPaid', 
    label: 'Interest Paid (Monthly Schedule)', 
    format: 'currency',
    description: 'Total interest you will pay if you continue monthly payments'
  },
  { 
    key: 'biweeklyInterestPaid', 
    label: 'Interest Paid (Biweekly Schedule)', 
    format: 'currency',
    description: 'Total interest you will pay with biweekly payments'
  },
  { 
    key: 'interestSavings', 
    label: 'Interest Savings', 
    format: 'currency',
    description: 'Total interest saved by switching to biweekly payments'
  },
  { 
    key: 'timeSavedYears', 
    label: 'Time Saved (Years)', 
    format: 'number',
    description: 'Years saved by paying biweekly instead of monthly'
  },
];

// CALCULATION FUNCTION
const calculate = (data) => {
  const principal = data.mortgageAmount;
  const monthlyRate = annualRateToMonthly(data.interestRate);
  const totalMonths = data.originalTermYears * 12;

  // Calculate standard monthly payment
  const monthlyPayment = calculateMonthlyPayment(principal, monthlyRate, totalMonths);

  // Calculate months elapsed and current balance
  const monthsElapsed = getMonthsBetween(data.firstPaymentDate, new Date().toISOString().split('T')[0]);
  
  let currentBalance = principal;
  if (monthsElapsed > 0 && monthsElapsed < totalMonths) {
    currentBalance = principal * 
      (Math.pow(1 + monthlyRate, totalMonths) - Math.pow(1 + monthlyRate, monthsElapsed)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  } else if (monthsElapsed >= totalMonths) {
    currentBalance = 0;
  }

  const remainingMonthsOriginal = Math.max(0, totalMonths - monthsElapsed);

  // Calculate remaining interest on monthly schedule
  let monthlyInterestPaid = 0;
  let balance = currentBalance;
  for (let i = 0; i < remainingMonthsOriginal; i++) {
    const interest = balance * monthlyRate;
    monthlyInterestPaid += interest;
    balance -= (monthlyPayment - interest);
    if (balance <= 0) break;
  }

  // Biweekly calculation
  const biweeklyPayment = monthlyPayment / 2;
  const biweeklyEscrow = data.monthlyEscrow / 2;
  const biweeklyPrepayment = data.monthlyPrepayment / 2;
  
  let biweeklyBalance = currentBalance;
  let biweeklyInterestPaid = 0;
  let biweeklyPaymentCount = 0;
  let monthCount = 0;

  while (biweeklyBalance > 0.01 && monthCount < 500) {
    monthCount++;
    
    const monthlyInterest = biweeklyBalance * monthlyRate;
    biweeklyInterestPaid += monthlyInterest;
    
    // Every 6th month gets 3 payments to reach 26 payments per year
    const paymentsThisMonth = (monthCount % 6 === 0) ? 3 : 2;
    biweeklyPaymentCount += paymentsThisMonth;
    
    const totalPrincipalThisMonth = (paymentsThisMonth * (biweeklyPayment + biweeklyPrepayment)) - monthlyInterest;
    biweeklyBalance = Math.max(0, biweeklyBalance - totalPrincipalThisMonth);
  }

  // Calculate savings
  const interestSavings = monthlyInterestPaid - biweeklyInterestPaid;
  const timeSavedMonths = remainingMonthsOriginal - (biweeklyPaymentCount / 2);
  const timeSavedYears = timeSavedMonths / 12;

  return {
    monthlyPayment,
    biweeklyPayment,
    totalBiweeklyPayment: biweeklyPayment + biweeklyEscrow + biweeklyPrepayment,
    currentBalance,
    remainingMonthlyPayments: remainingMonthsOriginal,
    remainingBiweeklyPayments: biweeklyPaymentCount,
    monthlyInterestPaid,
    biweeklyInterestPaid,
    interestSavings,
    timeSavedMonths,
    timeSavedYears,
    summary: interestSavings > 0 
      ? `By switching to biweekly payments, you'll save ${formatCurrency(interestSavings)} in interest and pay off your mortgage ${timeSavedYears.toFixed(1)} years earlier.`
      : 'Continue with your current payment schedule.',
    breakdown: [
      { label: 'Original Loan Amount', value: principal, format: 'currency' },
      { label: 'Current Balance', value: currentBalance, format: 'currency' },
      { label: 'Monthly Payment (P&I)', value: monthlyPayment, format: 'currency' },
      { label: 'Biweekly Payment', value: biweeklyPayment, format: 'currency' },
      { label: 'Total Biweekly Payment', value: biweeklyPayment + biweeklyEscrow + biweeklyPrepayment, format: 'currency' },
    ],
    monthlySchedule: [
      { label: 'Remaining Payments', value: remainingMonthsOriginal, format: 'number' },
      { label: 'Total Interest to be Paid', value: monthlyInterestPaid, format: 'currency' },
      { label: 'Payoff Time', value: `${Math.floor(remainingMonthsOriginal / 12)} years ${remainingMonthsOriginal % 12} months`, format: 'text' },
    ],
    biweeklySchedule: [
      { label: 'Remaining Payments', value: biweeklyPaymentCount, format: 'number' },
      { label: 'Total Interest to be Paid', value: biweeklyInterestPaid, format: 'currency' },
      { label: 'Payoff Time', value: `${(biweeklyPaymentCount / 26).toFixed(1)} years`, format: 'text' },
    ],
    savingsBreakdown: [
      { label: 'Interest Savings', value: interestSavings, format: 'currency' },
      { label: 'Time Saved', value: `${Math.floor(timeSavedYears)} years ${Math.round((timeSavedYears % 1) * 12)} months`, format: 'text' },
    ],
    notes: [
      'Biweekly payments are achieved by paying half your monthly payment every two weeks.',
      'This results in 26 payments per year (equivalent to 13 full monthly payments).',
      'The extra annual payment goes directly toward principal, reducing interest and loan term.',
      `Current monthly payment: ${formatCurrency(monthlyPayment)} (principal & interest only)`,
      data.monthlyEscrow > 0 ? `Monthly escrow: ${formatCurrency(data.monthlyEscrow)} (${formatCurrency(biweeklyEscrow)} biweekly)` : null,
      data.monthlyPrepayment > 0 ? `Monthly prepayment: ${formatCurrency(data.monthlyPrepayment)} (${formatCurrency(biweeklyPrepayment)} biweekly)` : null,
    ].filter(Boolean),
  };
};

// CHARTS
const charts = [
  {
    title: 'Total Interest Paid Comparison',
    type: 'bar',
    height: 350,
    xKey: 'schedule',
    format: 'currency',
    showLegend: false,
    data: (results) => [
      { schedule: 'Monthly Schedule', value: results.monthlyInterestPaid, color: '#DC2626' },
      { schedule: 'Biweekly Schedule', value: results.biweeklyInterestPaid, color: '#16A34A' },
    ],
    bars: [{ key: 'value', name: 'Total Interest', color: '#DC2626' }],
    description: 'Total interest paid over the life of the loan'
  },
  {
    title: 'Remaining Payments',
    type: 'bar',
    height: 350,
    xKey: 'schedule',
    format: 'number',
    showLegend: false,
    data: (results) => [
      { schedule: 'Monthly', value: results.remainingMonthlyPayments, color: '#3B82F6' },
      { schedule: 'Biweekly', value: results.remainingBiweeklyPayments, color: '#8B5CF6' },
    ],
    bars: [{ key: 'value', name: 'Number of Payments', color: '#3B82F6' }],
    description: 'Number of remaining payments for each schedule'
  },
  {
    title: 'Your Savings with Biweekly Payments',
    type: 'bar',
    height: 350,
    xKey: 'metric',
    format: 'currency',
    showLegend: false,
    data: (results) => [
      { metric: 'Interest Savings', value: results.interestSavings, color: '#16A34A' },
    ],
    bars: [{ key: 'value', name: 'Savings', color: '#16A34A' }],
    description: 'Total savings from switching to biweekly payments'
  },
];

// CONFIG EXPORT
export const config = {
  title: 'Biweekly Mortgage Payment Calculator for an Existing Mortgage',
  description: 'Calculate savings by making biweekly payments instead of monthly payments on your existing mortgage',
  schema,
  defaultValues: defaults,
  inputs,
  results,
  calculate,
  charts,
};