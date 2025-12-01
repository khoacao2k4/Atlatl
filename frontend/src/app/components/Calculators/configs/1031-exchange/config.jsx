import { schema } from './schema';
import { defaults } from './defaults';
import { inputs } from './inputs';
import { results } from './results';

export const config = {
  title: 'Company Stock Distribution Analysis Calculator',
  description: 'Compare NUA (Net Unrealized Appreciation) strategy versus IRA rollover for company stock distributions from your retirement plan',
  schema,
  defaultValues: defaults,
  inputs,
  results,

  calculate: (data) => {
    /*
    Dinkytown-style implementation:
     - NUA = FMV at distribution - cost basis
     - At distribution (NUA strategy): pay ordinary income tax on cost basis now (and 10% penalty on cost basis if not qualified)
     - NUA portion is taxed as long-term capital gain when sold (even if sold immediately)
     - Appreciation AFTER distribution: taxed as short-term (ordinary) if sold within 1 year, otherwise long-term capital gain
     - IRA rollover: entire amount taxed as ordinary income when withdrawn (plus 10% penalty if applicable)
     - Present value calculations: discount FUTURE taxes to present using inflationRate
    */

    const nua = data.balanceAtDistribution - data.costBasis;

    // Convert holding period to decimal years
    const holdingYears = data.holdingPeriodYears + (data.holdingPeriodMonths || 0) / 12;

    // Future FMV after holding period (applies equally for both strategies)
    const fmvAtSale = data.balanceAtDistribution * Math.pow(1 + data.rateOfReturn / 100, holdingYears);

    // Appreciation that occurs AFTER the distribution event
    const appreciationAfterDistribution = fmvAtSale - data.balanceAtDistribution;

    // Penalty conditions:
    // For cost-basis taxation at distribution (NUA initial tax), penalty applies unless separatedAtAge55 OR distribution is at/after 59.5
    const penaltyOnRetirementDist = !(data.separatedAtAge55 || data.retirementDistributionAfter59Half);
    // For IRA distributions (rolled-over funds), penalty applies if IRA distribution occurs before 59.5
    const penaltyOnIraDist = !data.iraDistributionAfter59Half;

    // ===== NUA STRATEGY =====
    // Initial tax at distribution: cost basis taxed at ordinary marginal tax rate now
    const nuaInitialTax = data.costBasis * (data.marginalTaxRate / 100);
    const nuaInitialPenalty = penaltyOnRetirementDist ? data.costBasis * 0.10 : 0;
    const nuaTotalInitialTax = nuaInitialTax + nuaInitialPenalty;

    // Future taxes when stock is sold:
    // - NUA portion taxed at long-term capital gains rate (per Dinkytown: treated as long-term cap gain even if sold immediately)
    const nuaPortionTaxAtSale = Math.max(0, nua) * (data.capitalGainsRate / 100);

    // - Appreciation after distribution taxed as:
    //     * ordinary income (marginal tax rate) if holding < 1 year
    //     * long-term capital gains if holding >= 1 year
    const appreciationTaxRate = holdingYears >= 1 ? (data.capitalGainsRate / 100) : (data.marginalTaxRate / 100);
    const appreciationTaxAtSale = Math.max(0, appreciationAfterDistribution) * appreciationTaxRate;

    const nuaTotalFutureTax = nuaPortionTaxAtSale + appreciationTaxAtSale;

    // Total taxes (initial + future)
    const nuaTotalTax = nuaTotalInitialTax + nuaTotalFutureTax;

    // Net proceeds at sale (future value basis): FMV at sale minus ALL taxes paid (initial taxes were paid now, but for "future value" comparison we subtract all taxes)
    const nuaNetProceeds = fmvAtSale - nuaTotalFutureTax - nuaTotalInitialTax; // taxes already removed

    // Present value calculations:
    // Discount only FUTURE taxes to present using inflationRate (per Dinkytown: discount future tax distributions).
    const discountRate = data.inflationRate / 100;
    const pvNuaFutureTax = nuaTotalFutureTax / Math.pow(1 + discountRate, holdingYears);
    const pvNuaTotalTax = nuaTotalInitialTax + pvNuaFutureTax; // initial tax is "now" (no discount)
    const pvNuaNetProceeds = data.balanceAtDistribution - pvNuaTotalTax;

    // ===== IRA ROLLOVER STRATEGY =====
    // If rolled over to IRA, the whole balance grows and when withdrawn later it's taxed as ordinary income (marginal)
    const iraFmvAtSale = fmvAtSale;
    const iraTotalTaxAtSale = iraFmvAtSale * (data.marginalTaxRate / 100);
    const iraPenaltyAtSale = penaltyOnIraDist ? iraFmvAtSale * 0.10 : 0;
    const iraTotalTaxWithPenalty = iraTotalTaxAtSale + iraPenaltyAtSale;

    const iraNetProceeds = iraFmvAtSale - iraTotalTaxWithPenalty;

    // Present value for IRA: discount future tax (all taxed at withdrawal) to present
    const pvIraTax = iraTotalTaxWithPenalty / Math.pow(1 + discountRate, holdingYears);
    const pvIraNetProceeds = data.balanceAtDistribution - pvIraTax;

    // ===== Comparison & summary metrics =====
    const advantage = nuaNetProceeds - iraNetProceeds;
    const advantagePercent = iraNetProceeds !== 0 ? (advantage / Math.abs(iraNetProceeds)) * 100 : 0;

    const pvAdvantage = pvNuaNetProceeds - pvIraNetProceeds;
    const pvAdvantagePercent = pvIraNetProceeds !== 0 ? (pvAdvantage / Math.abs(pvIraNetProceeds)) * 100 : 0;

    // Recommendation: compare present-value advantage (gives 'today' basis)
    const betterStrategy = pvAdvantage > 0 ? 'NUA Strategy' : 'IRA Rollover';

    return {
      // Basic metrics
      nua,
      fmvAtSale,
      appreciationAfterDistribution,

      // NUA Strategy breakdown
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

      // IRA Rollover breakdown
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

      // Detailed breakdown for display
      breakdown: [
        { label: 'NUA Amount', value: nua, format: 'currency' },
        { label: 'Cost Basis', value: data.costBasis, format: 'currency' },
        { label: 'Initial Distribution FMV', value: data.balanceAtDistribution, format: 'currency' },
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
      ],

      iraBreakdown: [
        { label: 'Tax on Full Amount (Ordinary Income)', value: iraTotalTaxAtSale, format: 'currency' },
        { label: 'Early Withdrawal Penalty (if applicable)', value: iraPenaltyAtSale, format: 'currency' },
        { label: 'Total Tax', value: iraTotalTaxWithPenalty, format: 'currency' },
        { label: 'Net Proceeds (Future Value)', value: iraNetProceeds, format: 'currency' },
      ],

      // Notes (human friendly)
      notes: [
        `Holding period: ${data.holdingPeriodYears} years and ${data.holdingPeriodMonths} months`,
        penaltyOnRetirementDist ? 'Early withdrawal penalty (10%) applied to NUA initial distribution (cost basis)' : 'No early withdrawal penalty on NUA initial distribution',
        penaltyOnIraDist ? 'Early withdrawal penalty (10%) will apply to IRA distribution' : 'No early withdrawal penalty on IRA distribution',
        `NUA portion is treated as long-term capital gain (taxed at ${data.capitalGainsRate}%).`,
        holdingYears < 1
          ? 'Appreciation after distribution will be taxed as ordinary income (short-term) because holding period is under 1 year.'
          : 'Appreciation after distribution will be taxed as long-term capital gain because holding period is at least 1 year.',
        `The ${betterStrategy} provides ${Math.abs(pvAdvantagePercent).toFixed(2)}% ${pvAdvantage > 0 ? 'more' : 'less'} net proceeds on a present-value basis.`,
      ],
    };
  },

  charts: [
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
          value: results.nuaNetProceeds,
          color: '#378CE7'
        },
        { 
          strategy: 'IRA Rollover', 
          value: results.iraNetProceeds,
          color: '#245383'
        },
      ],
      bars: [
        { key: 'value', name: 'Net Proceeds', color: '#378CE7' }
      ],
      description: 'Future value comparison of net proceeds after all taxes'
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
          value: results.nuaTotalTax,
          color: '#F87171'
        },
        { 
          strategy: 'IRA Rollover', 
          value: results.iraTotalTaxWithPenalty,
          color: '#DC2626'
        },
      ],
      bars: [
        { key: 'value', name: 'Total Tax', color: '#F87171' }
      ],
      description: 'Total tax liability for each strategy'
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
          color: '#378CE7'
        },
        { 
          strategy: 'IRA Rollover', 
          value: results.pvIraNetProceeds,
          color: '#245383'
        },
      ],
      bars: [
        { key: 'value', name: 'Present Value Net Proceeds', color: '#378CE7' }
      ],
      description: `Net proceeds adjusted for ${defaults.inflationRate}% inflation rate`
    },
  ]
};
