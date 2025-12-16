import { z } from 'zod';
import {
  roundCurrency,
  calculateMonthlyPayment,
  calculateRemainingBalance,
  annualRateToMonthly
} from '../../utils';


// CALCULATOR-SPECIFIC UTILITIES

const simulateARMMortgage = (params) => {
  const {
    principal,
    totalMonths,
    armInitialRate,
    monthsFixed,
    expectedAdjustment,
    monthsBetweenAdj,
    rateCap
  } = params;

  let balance = principal;
  let totalInterest = 0;
  let currentRate = armInitialRate;
  let monthlyPayment = calculateMonthlyPayment(balance, currentRate, totalMonths);
  const initialPayment = monthlyPayment;
  let monthsUntilAdjustment = monthsFixed;
  let maxPayment = monthlyPayment;
  const monthlySeries = [];

  for (let month = 1; month <= totalMonths && balance > 0.01; month++) {
    // Check if we need to adjust the rate
    if (month > monthsFixed && monthsUntilAdjustment === 0) {
      // Adjust the rate
      const annualAdjustment = expectedAdjustment * (monthsBetweenAdj / 12);
      currentRate = Math.min(currentRate + (annualAdjustment / 12), rateCap);

      // Recalculate payment with new rate for remaining months
      const remainingMonths = totalMonths - month + 1;
      monthlyPayment = calculateMonthlyPayment(balance, currentRate, remainingMonths);
      maxPayment = Math.max(maxPayment, monthlyPayment);

      // Reset counter
      monthsUntilAdjustment = monthsBetweenAdj;
    }

    // Make payment
    const interest = balance * currentRate;
    const principalPaid = Math.min(monthlyPayment - interest, balance);

    totalInterest += interest;
    balance -= principalPaid;
    monthsUntilAdjustment--;

    // Track for chart (every 12 months)
    if (month % 12 === 0) {
      monthlySeries.push({
        year: month / 12,
        armBalance: Math.round(balance),
        armPayment: Math.round(monthlyPayment),
        armRate: currentRate * 12 * 100, // convert to annual %
      });
    }
  }

  return {
    initialPayment,
    totalInterest,
    finalRate: currentRate * 12 * 100, // convert to annual %
    maxPayment,
    monthlySeries
  };
};

const simulateFixedMortgage = (principal, monthlyRate, totalMonths) => {
  const monthlyPayment = calculateMonthlyPayment(principal, monthlyRate, totalMonths);
  const totalInterest = (monthlyPayment * totalMonths) - principal;
  const monthlySeries = [];

  // Generate yearly snapshots for charts
  for (let year = 1; year <= totalMonths / 12; year++) {
    const monthsPaid = year * 12;
    const balance = calculateRemainingBalance(principal, monthlyRate, monthlyPayment, monthsPaid);

    monthlySeries.push({
      year,
      fixedBalance: Math.round(balance),
      fixedPayment: Math.round(monthlyPayment)
    });
  }

  return { monthlyPayment, totalInterest, monthlySeries };
};

const mergeMonthlySeries = (fixedSeries, armSeries) => {
  return fixedSeries.map((fixed, index) => ({
    ...fixed,
    ...(armSeries[index] || {})
  }));
};


// VALIDATION SCHEMA

export const schema = z.object({
  mortgageAmount: z.number().min(0, 'Must be 0 or greater'),
  termInYears: z.number().int('Must be a whole number').min(1, 'Must be at least 1 year').max(50, 'Must be 50 years or less'),
  fixedInterestRate: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
  armInterestRate: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
  monthsRateFixed: z.number().int('Must be a whole number').min(1, 'Must be at least 1 month').max(360, 'Must be 360 months or less'),
  expectedAdjustment: z.number().min(-3, 'Must be -3% or greater').max(3, 'Must be 3% or less'),
  monthsBetweenAdjustments: z.number().int('Must be a whole number').min(1, 'Must be at least 1 month').max(12, 'Must be 12 months or less'),
  interestRateCap: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
});


// DEFAULT VALUES

export const defaults = {
  mortgageAmount: 350000,
  termInYears: 30,
  fixedInterestRate: 7.5,
  armInterestRate: 6.5,
  monthsRateFixed: 12,
  expectedAdjustment: 0.25,
  monthsBetweenAdjustments: 12,
  interestRateCap: 12.0,
};


// INPUT CONFIGURATION

export const inputs = [
  {
    name: 'mortgageAmount',
    label: 'Mortgage amount',
    type: 'number',
    format: 'currency',
    required: true,
    hint: 'Original or expected balance for your mortgage'
  },
  {
    name: 'termInYears',
    label: 'Term in years',
    type: 'number',
    required: true,
    hint: 'Number of years to repay the loan (common terms: 15, 20, 30 years)'
  },
  {
    name: 'fixedInterestRate',
    label: 'Fixed-rate interest rate',
    type: 'number',
    format: 'percentage',
    step: 0.01,
    required: true,
    hint: 'Annual interest rate for the fixed-rate mortgage'
  },
  {
    name: 'armInterestRate',
    label: 'ARM initial interest rate',
    type: 'number',
    format: 'percentage',
    step: 0.01,
    required: true,
    hint: 'Initial interest rate for the ARM (typically lower than fixed-rate)'
  },
  {
    name: 'monthsRateFixed',
    label: 'Months rate fixed',
    type: 'number',
    required: true,
    hint: 'Number of months the ARM rate remains fixed before adjusting'
  },
  {
    name: 'expectedAdjustment',
    label: 'Expected adjustment',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    hint: 'Expected annual rate change after fixed period (-3% to +3%)'
  },
  {
    name: 'monthsBetweenAdjustments',
    label: 'Months between adjustments',
    type: 'number',
    required: true,
    hint: 'Number of months between rate adjustments (12 = annual, 6 = semi-annual)'
  },
  {
    name: 'interestRateCap',
    label: 'Interest rate cap',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    hint: 'Maximum allowable interest rate for the ARM'
  },
];


// RESULTS CONFIGURATION

export const results = [
  {
    key: 'fixedMonthlyPayment',
    label: 'Fixed-rate monthly payment',
    format: 'currency',
    description: 'Monthly principal and interest payment (stays the same)'
  },
  {
    key: 'armInitialMonthlyPayment',
    label: 'ARM initial monthly payment',
    format: 'currency',
    description: 'Initial monthly payment before adjustments'
  },
  {
    key: 'initialSavings',
    label: 'Initial monthly savings with ARM',
    format: 'currency',
    description: 'How much you save per month initially with the ARM'
  },
  {
    key: 'fixedTotalInterest',
    label: 'Fixed-rate total interest',
    format: 'currency',
    description: 'Total interest paid over the life of the fixed-rate loan'
  },
  {
    key: 'armTotalInterest',
    label: 'ARM total interest',
    format: 'currency',
    description: 'Estimated total interest with expected adjustments'
  },
  {
    key: 'totalInterestDifference',
    label: 'Interest difference (ARM vs Fixed)',
    format: 'currency',
    description: 'Total interest savings or cost with ARM (negative = ARM costs more)'
  },
  {
    key: 'armFinalRate',
    label: 'ARM final rate estimate',
    format: 'percentage',
    description: 'Estimated final interest rate for ARM (subject to cap)'
  },
  {
    key: 'armMaxMonthlyPayment',
    label: 'ARM maximum monthly payment',
    format: 'currency',
    description: 'Highest possible payment if rate reaches the cap'
  },
  {
    key: 'betterChoice',
    label: 'Better choice',
    format: 'text',
    description: 'Based on total interest paid'
  },
];


// MAIN CALCULATION FUNCTION

const calculate = (data) => {
  // Convert inputs
  const principal = Number(data.mortgageAmount) || 0;
  const termYears = Number(data.termInYears) || 30;
  const totalMonths = termYears * 12;

  const fixedRate = annualRateToMonthly(Number(data.fixedInterestRate));
  const armInitialRate = annualRateToMonthly(Number(data.armInterestRate));
  const monthsFixed = Number(data.monthsRateFixed) || 60;
  const expectedAdjustment = Number(data.expectedAdjustment) / 100;
  const monthsBetweenAdj = Number(data.monthsBetweenAdjustments) || 12;
  const rateCap = annualRateToMonthly(Number(data.interestRateCap));

  // Calculate Fixed-Rate Mortgage
  const fixed = simulateFixedMortgage(principal, fixedRate, totalMonths);

  // Calculate ARM Mortgage
  const arm = simulateARMMortgage({
    principal,
    totalMonths,
    armInitialRate,
    monthsFixed,
    expectedAdjustment,
    monthsBetweenAdj,
    rateCap
  });

  // Calculate ARM at rate cap for max payment
  const armMaxMonthlyPayment = calculateMonthlyPayment(principal, rateCap, totalMonths);

  // Comparison calculations
  const initialSavings = fixed.monthlyPayment - arm.initialPayment;
  const totalInterestDifference = arm.totalInterest - fixed.totalInterest;
  const betterChoice = totalInterestDifference < 0 ? "ARM" : "Fixed-Rate";

  // Merge monthly series for charts
  const monthlySeries = mergeMonthlySeries(fixed.monthlySeries, arm.monthlySeries);

  return {
    fixedMonthlyPayment: roundCurrency(fixed.monthlyPayment),
    armInitialMonthlyPayment: roundCurrency(arm.initialPayment),
    initialSavings: roundCurrency(initialSavings),
    fixedTotalInterest: roundCurrency(fixed.totalInterest),
    armTotalInterest: roundCurrency(arm.totalInterest),
    totalInterestDifference: roundCurrency(totalInterestDifference),
    armFinalRate: arm.finalRate,
    armMaxMonthlyPayment: roundCurrency(armMaxMonthlyPayment),
    betterChoice,
    monthlySeries,
  };
};


// CHART CONFIGURATION

const charts = [
  {
    title: 'Monthly Payment Comparison',
    type: 'bar',
    height: 350,
    xKey: 'type',
    format: 'currency',
    showLegend: false,
    data: (results) => [
      {
        type: 'Fixed-Rate (constant)',
        value: results.fixedMonthlyPayment || 0,
        color: '#3B82F6',
      },
      {
        type: 'ARM (initial)',
        value: results.armInitialMonthlyPayment || 0,
        color: '#10B981',
      },
      {
        type: 'ARM (max possible)',
        value: results.armMaxMonthlyPayment || 0,
        color: '#EF4444',
      },
    ],
    bars: [{ key: 'value', name: 'Monthly Payment', fill: 'color' }],
    description: 'Compare initial and potential maximum monthly payments',
  },
  {
    title: 'Total Interest Paid',
    type: 'bar',
    height: 350,
    xKey: 'type',
    format: 'currency',
    showLegend: false,
    data: (results) => [
      {
        type: 'Fixed-Rate',
        value: results.fixedTotalInterest || 0,
        color: '#3B82F6',
      },
      {
        type: 'ARM',
        value: results.armTotalInterest || 0,
        color: '#10B981',
      },
    ],
    bars: [{ key: 'value', name: 'Total Interest', fill: 'color' }],
    description: 'Total interest paid over the life of each loan',
  },
  {
    title: 'Loan Balance Over Time',
    type: 'line',
    height: 400,
    xKey: 'year',
    format: 'currency',
    showLegend: true,
    data: (results) => results.monthlySeries || [],
    lines: [
      { key: 'fixedBalance', name: 'Fixed-Rate Balance', stroke: '#3B82F6' },
      { key: 'armBalance', name: 'ARM Balance', stroke: '#10B981' },
    ],
    description: 'How the remaining balance decreases over time',
  },
  {
    title: 'Monthly Payment Over Time',
    type: 'line',
    height: 400,
    xKey: 'year',
    format: 'currency',
    showLegend: true,
    data: (results) => results.monthlySeries || [],
    lines: [
      { key: 'fixedPayment', name: 'Fixed-Rate Payment', stroke: '#3B82F6' },
      { key: 'armPayment', name: 'ARM Payment', stroke: '#10B981' },
    ],
    description: 'How monthly payments change over the loan term',
  },
];


// MAIN CONFIG EXPORT

export const config = {
  title: 'ARM vs Fixed-Rate Mortgage Calculator',
  description: 'Compare an adjustable-rate mortgage (ARM) to a fixed-rate mortgage',
  schema,
  defaultValues: defaults,
  inputs,
  results,
  calculate,
  charts
};