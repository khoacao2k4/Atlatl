import { schema } from './schema';
import { defaults } from './defaults';
import { inputs } from './inputs';
import { results } from './results';

export const config = {
  title: 'Roth 401(k) vs Traditional 401(k) Calculator',
  description: 'Compare Roth 401(k) and Traditional 401(k) to see which saves you more money in retirement',
  schema,
  defaultValues: defaults,
  inputs,
  results,

  calculate: (data) => {
  // Inputs
  const currentAge = Number(data.currentAge);
  const retirementAge = Number(data.retirementAge);
  const years = Math.max(0, retirementAge - currentAge);

  const annualContribution = Number(data.annualContribution) || 0;
  const currentBalance = Number(data.currentBalance) || 0;

  const rAnnual = Number(data.annualRateOfReturn) / 100;      // e.g. 7%
  const tNow = Number(data.currentTaxRate) / 100;             // current marginal tax
  const tRet = Number(data.retirementTaxRate) / 100;          // retirement tax
  const investTaxSavings = !!data.investTaxSavings;

  const monthlyRate = Math.pow(1 + rAnnual, 1 / 12) - 1;

  const months = years * 12;
  const monthlyContribution = annualContribution / 12;
  const monthlyTaxSavings = (annualContribution * tNow) / 12;

  const capitalGainsTaxRate = 0.4125710615531908;

  // Accounts
  let roth = currentBalance;
  let trad = currentBalance;
  let side = 0; // invested tax savings in a taxable account

  const yearlySeries = [];

  // Simulate month by month
  for (let y = 0; y < years; y++) {
    for (let m = 0; m < 12; m++) {
      // Contributions at beginning of month (annuity-due)
      roth += monthlyContribution;
      trad += monthlyContribution;

      if (investTaxSavings && monthlyTaxSavings > 0) {
        side += monthlyTaxSavings;
      }

      // Growth over the month
      roth *= 1 + monthlyRate;
      trad *= 1 + monthlyRate;

      if (investTaxSavings && monthlyTaxSavings > 0) {
        side *= 1 + monthlyRate;
      }
    }

    // End of year y: build yearlySeries entry
    const monthsSoFar = (y + 1) * 12;

    // Side account after-tax at this point
    const totalSideContributed = monthlyTaxSavings * monthsSoFar;
    const sideGains = Math.max(0, side - totalSideContributed);
    const sideTax = sideGains * capitalGainsTaxRate;
    const sideAfterTaxYear = totalSideContributed + (sideGains - sideTax);

    // Traditional after retirement tax at this point
    const tradTaxesYear = trad * tRet;
    const tradAfterTaxYear = trad - tradTaxesYear;

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

  // Final values at retirement

  // Final side account after-tax
  const totalSideContributedAll = monthlyTaxSavings * months;
  const sideGainsAll = Math.max(0, side - totalSideContributedAll);
  const sideTaxAll = sideGainsAll * capitalGainsTaxRate;
  const sideAfterTax = totalSideContributedAll + (sideGainsAll - sideTaxAll);

  // Traditional 401(k) taxes
  const traditionalTaxes = trad * tRet;
  const traditionalAfterTaxNoSavings = trad - traditionalTaxes;

  const totalTraditional =
    traditionalAfterTaxNoSavings + (investTaxSavings ? sideAfterTax : 0);
  const totalRoth = roth; // Roth is already after-tax

  const advantage = totalRoth - totalTraditional;
  const advantagePercent =
    totalTraditional !== 0 ? (advantage / totalTraditional) * 100 : 0;

  return {
    // Pre-tax balances
    rothBalance: roth,
    traditionalBalance: trad,

    // Spendable after-tax values
    rothAfterTax: totalRoth,
    traditionalAfterTax: totalTraditional,

    // Comparison
    advantage,
    advantagePercent,
    betterChoice: advantage > 0 ? "Roth 401(k)" : "Traditional 401(k)",
    yearsToRetirement: years,

    // Tax-savings side account
    futureValueOfTaxSavings: side,
    taxSavingsAfterTax: sideAfterTax,

    // Traditional breakdown
    traditionalTaxes,
    traditionalAfterTaxNoSavings,

    // Yearly series for charts/tables (matches Dinkytown’s shape)
    yearlySeries,
  };
},

  charts: [
    {
      title: 'Account Balance at Retirement',
      type: 'bar',
      height: 350,
      xKey: 'account',
      format: 'currency',
      showLegend: false,
      data: (results) => [
        {
          account: 'Roth 401(k)',
          value: results.rothBalance || 0,
          color: '#10B981',
        },
        {
          account: 'Traditional 401(k)',
          value: results.traditionalBalance || 0,
          color: '#3B82F6',
        },
      ],
      bars: [{ key: 'value', name: 'Balance', fill: 'color' }],
      description: 'Both accounts grow to the same balance (before taxes)',
    },
    {
      title: 'After-Tax Value at Retirement',
      type: 'bar',
      height: 350,
      xKey: 'account',
      format: 'currency',
      showLegend: false,
      data: (results) => [
        {
          account: 'Roth 401(k)',
          value: results.rothAfterTax || 0,
          color: '#10B981',
        },
        {
          account: 'Traditional 401(k)',
          value: results.traditionalAfterTax || 0,
          color: '#3B82F6',
        },
      ],
      bars: [{ key: 'value', name: 'After-Tax Value', fill: 'color' }],
      description: 'What you actually get to spend (includes invested tax savings for Traditional)',
    },
    {
      title: 'Tax Impact Comparison',
      type: 'bar',
      height: 350,
      xKey: 'account',
      format: 'currency',
      showLegend: false,
      data: (results) => [
        {
          account: 'Roth 401(k)',
          value: null,
          color: '#10B981',
        },
        {
          account: 'Traditional 401(k)',
          value: results.traditionalTaxes || 0,
          color: '#EF4444',
        },
      ],
      bars: [{ key: 'value', name: 'Taxes Paid', fill: 'color' }],
      description: 'Taxes owed on 401(k) withdrawals at retirement',
    },
  ],
};