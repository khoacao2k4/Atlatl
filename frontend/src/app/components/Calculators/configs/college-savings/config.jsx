import { schema } from './schema';
import { defaults } from './defaults';
import { inputs } from './inputs';
import { results } from './results';

export const config = {
  title: 'College Savings Calculator',
  description:
    'Plan for your child\'s college education by calculating future costs and determining how much you need to save monthly',
  schema,
  defaultValues: defaults,
  inputs,
  results,

  calculate: (data) => {
    // --- Inputs (coerce to numbers)
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

    // --- Years until college
    const yearsUntilCollege = Math.max(0, ageStartCollege - currentAge);

    // --- Current annual cost
    const currentAnnualCost = annualTuition + roomAndBoard;

    // --- Project future college costs
    let totalCollegeCost = 0;
    const collegeCostsByYear = [];

    for (let year = 0; year < yearsInCollege; year++) {
      const yearsFromNow = yearsUntilCollege + year;
      const futureCost =
        currentAnnualCost *
        Math.pow(1 + educationInflation / 100, yearsFromNow);
      totalCollegeCost += futureCost;
      collegeCostsByYear.push({
        year: year + 1,
        age: ageStartCollege + year,
        cost: futureCost,
      });
    }

    // --- Savings growth BEFORE college (current plan)
    let balance = currentSavings;
    const annualContribution = monthlyContribution * 12;

    for (let y = 0; y < yearsUntilCollege; y++) {
      balance = balance * (1 + annualRate) + annualContribution * contributionFactor;
    }

    const totalSavingsAtCollegeStart = balance;

    // --- Shortfall / Surplus & percentage covered
    const shortfallOrSurplus = totalSavingsAtCollegeStart - totalCollegeCost;
    const percentageCovered =
      totalCollegeCost > 0
        ? (totalSavingsAtCollegeStart / totalCollegeCost) * 100
        : 100;

    // --- Monthly needed to fully fund (with contributions DURING college)
    let monthlyNeededToFullyFund = 0;

    if (yearsUntilCollege > 0 || yearsInCollege > 0) {
      // Binary search for the required annual contribution
      // that results in balance ≥ 0 after all college years
      let low = 0;
      let high = totalCollegeCost * 2; // Upper bound
      let bestAnnual = 0;

      for (let iteration = 0; iteration < 50; iteration++) {
        const testAnnual = (low + high) / 2;
        
        // Simulate accumulation phase
        let testBalance = currentSavings;
        for (let y = 0; y < yearsUntilCollege; y++) {
          testBalance = testBalance * (1 + annualRate) + testAnnual * contributionFactor;
        }
        
        // Simulate college phase (continuing contributions)
        for (let y = 0; y < yearsInCollege; y++) {
          testBalance = testBalance * (1 + annualRate) + 
                       testAnnual * contributionFactor - 
                       collegeCostsByYear[y].cost;
        }
        
        // Check if we meet the goal
        if (Math.abs(testBalance) < 1) {
          bestAnnual = testAnnual;
          break;
        } else if (testBalance < 0) {
          low = testAnnual; // Need more
        } else {
          high = testAnnual; // Can reduce
          bestAnnual = testAnnual;
        }
      }
      
      monthlyNeededToFullyFund = bestAnnual / 12;
    } else {
      monthlyNeededToFullyFund = Math.max(0, totalCollegeCost - currentSavings);
    }

    // --- Year-by-year breakdown during college (with current contributions)
    const yearlyBreakdown = [];
    let remaining = totalSavingsAtCollegeStart;

    for (let year = 0; year < yearsInCollege; year++) {
      const cost = collegeCostsByYear[year].cost;
      const savingsAtStart = remaining;
      // Continue contributing during college
      const grownWithContributions = savingsAtStart * (1 + annualRate) + 
                                     annualContribution * contributionFactor;
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

    // helper
    const round2 = (v) => (isFinite(v) ? Math.round(v * 100) / 100 : 0);

    // --- Return results
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
  },

  charts: [
    {
      title: 'Savings vs. College Costs',
      type: 'bar',
      height: 350,
      xKey: 'category',
      format: 'currency',
      showLegend: false,
      data: (results) => [
        {
          category: 'Projected Savings',
          value: results.totalSavingsAtCollegeStart,
          color: '#10B981',
        },
        {
          category: 'Total College Cost',
          value: results.totalCollegeCost,
          color: '#F59E0B',
        },
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
          savingsStart: year.savingsStart,
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
  ],
};