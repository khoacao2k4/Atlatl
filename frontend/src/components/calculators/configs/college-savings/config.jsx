import { z } from 'zod';

// SCHEMA
const schema = z.object({
  currentAge: z.number().int('Must be a whole number').min(0, 'Must be 0 or greater').max(120, 'Must be 120 or less'),
  ageStartCollege: z.number().int('Must be a whole number').min(1, 'Must be 1 or greater').max(120, 'Must be 120 or less'),
  yearsInCollege: z.number().int('Must be a whole number').min(1, 'Must be at least 1 year').max(100, 'Must be 100 years or less'),
  annualTuition: z.number().min(0, 'Must be 0 or greater'),
  roomAndBoard: z.number().min(0, 'Must be 0 or greater'),
  educationInflation: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
  currentSavings: z.number().min(0, 'Must be 0 or greater'),
  monthlyContribution: z.number().min(0, 'Must be 0 or greater'),
  rateOfReturn: z.number().min(-50, 'Must be -50% or greater').max(50, 'Must be 50% or less'),
}).refine((data) => data.ageStartCollege > data.currentAge, {
  message: "College start age must be greater than current age",
  path: ["ageStartCollege"],
});

// DEFAULTS
const defaults = {
  currentAge: 9,
  ageStartCollege: 18,
  yearsInCollege: 4,
  annualTuition: 41540,
  roomAndBoard: 18800,
  educationInflation: 3,
  currentSavings: 0,
  monthlyContribution: 250,
  rateOfReturn: 7,
};

// INPUTS
const inputs = [
  // === Child's Information ===
  {
    name: 'currentAge',
    label: "Child's Current Age",
    type: 'number',
    required: true,
    section: "Child's Information",
    hint: 'Current age of your child. The difference between their current age and college start age is the number of years you have to save.'
  },
  {
    name: 'ageStartCollege',
    label: 'Age to Start College',
    type: 'number',
    required: true,
    section: "Child's Information",
    hint: 'The age your child will begin college. Default is 18, but can be any age up to 25.'
  },
  {
    name: 'yearsInCollege',
    label: 'Number of Years in College',
    type: 'number',
    required: true,
    section: "Child's Information",
    hint: 'Expected number of years your child will attend college (typically 4 years for undergraduate)'
  },

  // === College Costs ===
  {
    name: 'annualTuition',
    label: 'Annual Tuition (Current Cost)',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'College Costs',
    hint: 'Current estimated cost of one year of tuition and books. Average 2024-25: Public in-state $11,610, Public out-of-state $30,780, Private $43,350'
  },
  {
    name: 'roomAndBoard',
    label: 'Annual Room & Board (Current Cost)',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'College Costs',
    hint: 'Current estimated cost of one-year room, board, and other expenses. Average 2024-25: Public $18,300, Private $19,640'
  },
  {
    name: 'educationInflation',
    label: 'Education Cost Inflation Rate',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'College Costs',
    hint: 'Expected annual increase in college costs. Historical average: 4.8% over past 30 years, recent: ~3%'
  },

  // === Savings Plan ===
  {
    name: 'currentSavings',
    label: 'Current Amount Saved',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Savings Plan',
    hint: 'Total amount you currently have saved for college education'
  },
  {
    name: 'monthlyContribution',
    label: 'Monthly Contribution',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Savings Plan',
    hint: 'Dollar amount you plan to save per month. All amounts assumed to be added at the beginning of each month.'
  },
  {
    name: 'rateOfReturn',
    label: 'Expected Annual Rate of Return',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Savings Plan',
    hint: 'Expected annual return on investments. S&P 500: 11.2% avg 1970-2024, 14.9% avg last 10 years. Savings accounts: much lower but safer.'
  },
];

// RESULTS
const results = [
  {
    key: 'yearsUntilCollege',
    label: 'Years Until College Starts',
    format: 'number'
  },
  {
    key: 'totalCollegeCost',
    label: 'Total Future Cost of College',
    format: 'currency',
    description: 'Total cost including inflation over all college years'
  },
  {
    key: 'totalSavingsAtCollegeStart',
    label: 'Total Savings at College Start',
    format: 'currency',
    description: 'Expected savings balance when college begins'
  },
  {
    key: 'shortfallOrSurplus',
    label: 'Shortfall or Surplus',
    format: 'currency',
    description: 'Negative = shortfall (need more), Positive = surplus (more than needed)'
  },
  {
    key: 'percentageCovered',
    label: 'Percentage of Costs Covered',
    format: 'percentage',
    description: 'Percentage of total college costs covered by savings'
  },
  {
    key: 'monthlyNeededToFullyFund',
    label: 'Monthly Savings Needed to Fully Fund',
    format: 'currency',
    description: 'Monthly contribution required to cover 100% of projected costs'
  },
];

// CALCULATION FUNCTION
const calculate = (data) => {
  const currentAge = Number(data.currentAge) || 0;
  const ageStartCollege = Number(data.ageStartCollege) || 18;
  const yearsInCollege = Number(data.yearsInCollege) || 4;
  const annualTuition = Number(data.annualTuition) || 0;
  const roomAndBoard = Number(data.roomAndBoard) || 0;
  const educationInflation = Number(data.educationInflation) || 0;
  const currentSavings = Number(data.currentSavings) || 0;
  const monthlyContribution = Number(data.monthlyContribution) || 0;
  const rateOfReturn = Number(data.rateOfReturn) || 0;

  const annualRate = rateOfReturn / 100;
  const K = 0.5444409899; // Dinkytown's timing factor
  const contributionFactor = 1 + (Math.pow(1 + annualRate, K) - 1);

  const yearsUntilCollege = Math.max(0, ageStartCollege - currentAge);
  const currentAnnualCost = annualTuition + roomAndBoard;

  // Project future college costs
  let totalCollegeCost = 0;
  const collegeCostsByYear = [];

  for (let year = 0; year < yearsInCollege; year++) {
    const yearsFromNow = yearsUntilCollege + year;
    const futureCost = currentAnnualCost * Math.pow(1 + educationInflation / 100, yearsFromNow);
    totalCollegeCost += futureCost;
    collegeCostsByYear.push({
      year: year + 1,
      age: ageStartCollege + year,
      cost: futureCost,
    });
  }

  // Savings growth BEFORE college
  let balance = currentSavings;
  const annualContribution = monthlyContribution * 12;

  for (let y = 0; y < yearsUntilCollege; y++) {
    balance = balance * (1 + annualRate) + annualContribution * contributionFactor;
  }

  const totalSavingsAtCollegeStart = balance;
  const shortfallOrSurplus = totalSavingsAtCollegeStart - totalCollegeCost;
  const percentageCovered = totalCollegeCost > 0 ? (totalSavingsAtCollegeStart / totalCollegeCost) * 100 : 100;

  // Calculate monthly needed to fully fund
  let monthlyNeededToFullyFund = 0;

  if (yearsUntilCollege > 0 || yearsInCollege > 0) {
    let low = 0;
    let high = totalCollegeCost * 2;
    let bestAnnual = 0;

    for (let iteration = 0; iteration < 50; iteration++) {
      const testAnnual = (low + high) / 2;

      let testBalance = currentSavings;
      for (let y = 0; y < yearsUntilCollege; y++) {
        testBalance = testBalance * (1 + annualRate) + testAnnual * contributionFactor;
      }

      for (let y = 0; y < yearsInCollege; y++) {
        testBalance = testBalance * (1 + annualRate) +
          testAnnual * contributionFactor -
          collegeCostsByYear[y].cost;
      }

      if (Math.abs(testBalance) < 1) {
        bestAnnual = testAnnual;
        break;
      } else if (testBalance < 0) {
        low = testAnnual;
      } else {
        high = testAnnual;
        bestAnnual = testAnnual;
      }
    }

    monthlyNeededToFullyFund = bestAnnual / 12;
  } else {
    monthlyNeededToFullyFund = Math.max(0, totalCollegeCost - currentSavings);
  }

  // Year-by-year breakdown during college
  const yearlyBreakdown = [];
  let remaining = totalSavingsAtCollegeStart;

  for (let year = 0; year < yearsInCollege; year++) {
    const cost = collegeCostsByYear[year].cost;
    const savingsAtStart = remaining;
    const grownWithContributions = savingsAtStart * (1 + annualRate) + annualContribution * contributionFactor;
    const savingsAfterCost = grownWithContributions - cost;

    yearlyBreakdown.push({
      year: year + 1,
      age: ageStartCollege + year,
      savingsAtStart,
      cost,
      savingsAfterCost,
    });

    remaining = savingsAfterCost;
  }

  const round2 = (v) => (isFinite(v) ? Math.round(v * 100) / 100 : 0);

  return {
    yearsUntilCollege,
    totalCollegeCost,
    totalSavingsAtCollegeStart,
    shortfallOrSurplus,
    percentageCovered,
    monthlyNeededToFullyFund,
    collegeCostsByYear,
    yearlyBreakdown,

    breakdown: [
      { label: 'Years Until College', value: yearsUntilCollege, format: 'number' },
      { label: 'Current Annual Cost', value: currentAnnualCost, format: 'currency' },
      { label: 'Total Future Cost', value: round2(totalCollegeCost), format: 'currency' },
      { label: 'Current Savings', value: currentSavings, format: 'currency' },
      { label: 'Monthly Contribution', value: monthlyContribution, format: 'currency' },
      { label: 'Projected Savings at College Start', value: round2(totalSavingsAtCollegeStart), format: 'currency' },
      { label: 'Shortfall/Surplus', value: round2(shortfallOrSurplus), format: 'currency' },
      { label: 'Percentage Covered', value: round2(percentageCovered), format: 'percentage' },
    ],

    notes: [
      `Your child will start college in ${yearsUntilCollege} year${yearsUntilCollege !== 1 ? 's' : ''} at age ${ageStartCollege}.`,
      `Total projected cost for ${yearsInCollege} years of college: $${round2(totalCollegeCost).toLocaleString()}.`,
      `With current savings plan, you will have $${round2(totalSavingsAtCollegeStart).toLocaleString()} when college starts.`,
      shortfallOrSurplus >= 0
        ? `Great news! You have a surplus of $${round2(shortfallOrSurplus).toLocaleString()}, covering ${round2(percentageCovered)}% of costs.`
        : `That covers ${round2(percentageCovered)}% of costs — you'd need an additional $${round2(Math.abs(shortfallOrSurplus)).toLocaleString()} to break even.`,
      monthlyNeededToFullyFund > monthlyContribution
        ? `To fully fund college costs, increase monthly savings to $${round2(monthlyNeededToFullyFund).toLocaleString()} (assumes you continue saving during college years).`
        : monthlyNeededToFullyFund > 0
          ? `Your current monthly contribution is sufficient to fully fund costs.`
          : `Your current savings cover all projected costs.`,
      `College costs grow at ${educationInflation}% annually; investments grow at ${rateOfReturn}% annually.`,
    ],
  };
};

// CHARTS
const charts = [
  {
    title: 'Savings vs. College Costs',
    type: 'bar',
    height: 350,
    xKey: 'category',
    format: 'currency',
    showLegend: false,
    data: (results) => [
      { category: 'Projected Savings', value: results.totalSavingsAtCollegeStart, color: '#10B981' },
      { category: 'Total College Cost', value: results.totalCollegeCost, color: '#F59E0B' },
    ],
    bars: [{ key: 'value', name: 'Amount', color: '#10B981' }],
    description: 'Comparison of projected savings vs. total college costs',
  },
  {
    title: 'College Costs by Year',
    type: 'bar',
    height: 350,
    xKey: 'label',
    format: 'currency',
    showLegend: false,
    data: (results) =>
      results.collegeCostsByYear.map((year) => ({
        label: `Year ${year.year} (Age ${year.age})`,
        value: year.cost,
        color: '#3B82F6',
      })),
    bars: [{ key: 'value', name: 'Annual Cost', color: '#3B82F6' }],
    description: 'Projected annual college costs including inflation',
  },
  {
    title: 'Savings Balance During College',
    type: 'bar',
    height: 350,
    xKey: 'label',
    format: 'currency',
    showLegend: true,
    data: (results) =>
      results.yearlyBreakdown.map((year) => ({
        label: `Year ${year.year}`,
        savingsStart: year.savingsAtStart,
        cost: year.cost,
        savingsEnd: Math.max(0, year.savingsAfterCost),
        color: year.savingsAfterCost >= 0 ? '#10B981' : '#EF4444',
      })),
    bars: [
      { key: 'savingsStart', name: 'Savings at Start', color: '#10B981' },
      { key: 'cost', name: 'Annual Cost', color: '#F59E0B' },
      { key: 'savingsEnd', name: 'Savings After Cost', color: '#3B82F6' },
    ],
    description: 'How your savings balance changes during college years (includes continued contributions)',
  },
];

// CONFIG EXPORT
export const config = {
  title: 'College Savings Calculator',
  description: 'Plan for your child\'s college education by calculating future costs and determining how much you need to save monthly',
  schema,
  defaultValues: defaults,
  inputs,
  results,
  calculate,
  charts,
};