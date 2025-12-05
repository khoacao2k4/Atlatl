import { schema } from './schema';
import { defaults } from './defaults';
import { inputs } from './inputs';
import { results } from './results';

export const config = {
  title: 'Biweekly Mortgage Payment Calculator for an Existing Mortgage',
  description: 'Calculate savings by making biweekly payments instead of monthly payments on your existing mortgage',
  schema,
  defaultValues: defaults,
  inputs,
  results,

  calculate: (data) => {
    /*
    Biweekly Payment Strategy:
    - Pay 1/2 of monthly payment every 2 weeks (26 payments per year = 13 monthly payments)
    - This results in one extra monthly payment per year going directly to principal
    - Interest still accrues monthly based on the outstanding balance
    */

    const principal = data.mortgageAmount;
    const annualRate = data.interestRate / 100;
    const monthlyRate = annualRate / 12;
    const totalMonths = data.originalTermYears * 12;

    // Calculate standard monthly payment (P&I only)
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    // Calculate months elapsed since first payment
    const startDate = new Date(data.firstPaymentDate);
    const today = new Date();
    const monthsElapsed = Math.max(0, 
      (today.getFullYear() - startDate.getFullYear()) * 12 + 
      (today.getMonth() - startDate.getMonth())
    );

    // Calculate current balance using amortization formula
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

    // Biweekly calculation - simulate 26 payments per year
    const biweeklyPayment = monthlyPayment / 2;
    const biweeklyEscrow = data.monthlyEscrow / 2;
    const biweeklyPrepayment = data.monthlyPrepayment / 2;
    
    // Simulate month-by-month with biweekly payments
    // Each month gets 2 biweekly payments, plus every 6th month gets an extra payment (26 total/year)
    let biweeklyBalance = currentBalance;
    let biweeklyInterestPaid = 0;
    let biweeklyPaymentCount = 0;
    let monthCount = 0;

    while (biweeklyBalance > 0.01 && monthCount < 500) {
      monthCount++;
      
      // Calculate monthly interest
      const monthlyInterest = biweeklyBalance * monthlyRate;
      biweeklyInterestPaid += monthlyInterest;
      
      // Determine number of payments this month (2 or 3)
      // Every 6th month gets 3 payments to reach 26 payments per year
      const paymentsThisMonth = (monthCount % 6 === 0) ? 3 : 2;
      biweeklyPaymentCount += paymentsThisMonth;
      
      // Total principal paid this month
      const totalPrincipalThisMonth = (paymentsThisMonth * (biweeklyPayment + biweeklyPrepayment)) - monthlyInterest;
      
      biweeklyBalance -= totalPrincipalThisMonth;
      
      if (biweeklyBalance < 0) {
        biweeklyBalance = 0;
      }
    }

    // Calculate savings
    const interestSavings = monthlyInterestPaid - biweeklyInterestPaid;
    const timeSavedMonths = remainingMonthsOriginal - (biweeklyPaymentCount / 2);
    const timeSavedYears = timeSavedMonths / 12;

    return {
      // Basic metrics
      monthlyPayment,
      biweeklyPayment,
      totalBiweeklyPayment: biweeklyPayment + biweeklyEscrow + biweeklyPrepayment,
      currentBalance,
      remainingMonthlyPayments: remainingMonthsOriginal,
      remainingBiweeklyPayments: biweeklyPaymentCount,

      // Interest comparison
      monthlyInterestPaid,
      biweeklyInterestPaid,
      interestSavings,

      // Time saved
      timeSavedMonths,
      timeSavedYears,

      // Summary
      summary: interestSavings > 0 
        ? `By switching to biweekly payments, you'll save ${formatCurrency(interestSavings)} in interest and pay off your mortgage ${timeSavedYears.toFixed(1)} years earlier.`
        : 'Continue with your current payment schedule.',

      // Detailed breakdown
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
  },

  charts: [
    {
      title: 'Total Interest Paid Comparison',
      type: 'bar',
      height: 350,
      xKey: 'schedule',
      format: 'currency',
      showLegend: false,
      data: (results) => [
        { 
          schedule: 'Monthly Schedule', 
          value: results.monthlyInterestPaid,
          color: '#DC2626'
        },
        { 
          schedule: 'Biweekly Schedule', 
          value: results.biweeklyInterestPaid,
          color: '#16A34A'
        },
      ],
      bars: [
        { key: 'value', name: 'Total Interest', color: '#DC2626' }
      ],
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
        { 
          schedule: 'Monthly', 
          value: results.remainingMonthlyPayments,
          color: '#3B82F6'
        },
        { 
          schedule: 'Biweekly', 
          value: results.remainingBiweeklyPayments,
          color: '#8B5CF6'
        },
      ],
      bars: [
        { key: 'value', name: 'Number of Payments', color: '#3B82F6' }
      ],
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
        { 
          metric: 'Interest Savings', 
          value: results.interestSavings,
          color: '#16A34A'
        },
      ],
      bars: [
        { key: 'value', name: 'Savings', color: '#16A34A' }
      ],
      description: 'Total savings from switching to biweekly payments'
    },
  ]
};

// Helper function for formatting (used in notes)
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}