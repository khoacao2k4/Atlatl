import { schema } from './schema';
import { defaults } from './defaults';
import { inputs } from './inputs';
import { results } from './results';

export const config = {
  title: 'Company Stock Distribution Analysis Calculator',
  description:
    'Compare NUA (Net Unrealized Appreciation) strategy versus IRA rollover for company stock distributions from your retirement plan',
  schema,
  defaultValues: defaults,
  inputs,
  results,

  calculate: (data) => {
    /*
      Dinkytown-style implementation notes:
       - NUA = FMV at distribution - cost basis
       - At distribution (NUA strategy): pay ordinary income tax on cost basis now (and 10% penalty on cost basis if not qualified)
       - NUA portion is taxed as long-term capital gain when sold (even if sold immediately)
       - Appreciation AFTER distribution: taxed as short-term (ordinary) if sold within 1 year, otherwise long-term capital gain
       - IRA rollover: entire amount taxed as ordinary income when withdrawn (plus 10% penalty if applicable)
       - Present value calculations: discount FUTURE net proceeds/taxes to present using inflationRate
    */

    // Basic inputs
    const balanceAtDistribution = Number(data.balanceAtDistribution) || 0;
    const costBasis = Number(data.costBasis) || 0;
    const marginalTaxRate = Number(data.marginalTaxRate) || 0; // percent
    const capitalGainsRate = Number(data.capitalGainsRate) || 0; // percent
    const rateOfReturn = Number(data.rateOfReturn) || 0; // percent
    const inflationRate = Number(data.inflationRate) || 0; // percent

    // Compute NUA and holding period
    const nua = Math.max(0, balanceAtDistribution - costBasis);

    // Convert holding period to months and years
    const holdingMonths =
      (Number(data.holdingPeriodYears) || 0) * 12 + (Number(data.holdingPeriodMonths) || 0);
    const holdingYears = holdingMonths / 12;

    // Future FMV after holding period (applies equally for both strategies)
    const fmvAtSale = balanceAtDistribution * Math.pow(1 + rateOfReturn / 100, holdingYears);

    // Appreciation that occurs AFTER the distribution event
    const appreciationAfterDistribution = Math.max(0, fmvAtSale - balanceAtDistribution);

    // === Penalty logic ===
    // NUA initial penalty: applies ONLY if NOT separated at 55 AND distribution is BEFORE 59.5
    // i.e., penalty applies when both conditions true: NOT separatedAtAge55 AND NOT retirementDistributionAfter59Half
    const nuaInitialPenaltyApplies = !data.separatedAtAge55 && !data.retirementDistributionAfter59Half;

    // IRA early-withdrawal penalty applies when IRA distribution occurs BEFORE 59.5
    const iraEarlyWithdrawalApplies = !data.iraDistributionAfter59Half;

    // === NUA STRATEGY ===
    // Initial tax at distribution: cost basis taxed at ordinary marginal tax rate now
    const nuaInitialTax = costBasis * (marginalTaxRate / 100);
    const nuaInitialPenalty = nuaInitialPenaltyApplies ? costBasis * 0.10 : 0;
    const nuaTotalInitialTax = nuaInitialTax + nuaInitialPenalty;

    // NUA portion taxed at long-term capital gains rate (per Dinkytown: treated as long-term cap gain even if sold immediately)
    const nuaPortionTaxAtSale = nua * (capitalGainsRate / 100);

    // Determine if appreciation after distribution is long-term (>= 12 months) or short-term (< 12 months)
    const isLongTerm = holdingMonths >= 12;
    const appreciationTaxRate = isLongTerm ? (capitalGainsRate / 100) : (marginalTaxRate / 100);
    const appreciationTaxAtSale = appreciationAfterDistribution * appreciationTaxRate;

    // Total future tax for NUA (taxes paid at sale)
    const nuaTotalFutureTax = nuaPortionTaxAtSale + appreciationTaxAtSale;

    // Total taxes (initial + future)
    const nuaTotalTax = nuaTotalInitialTax + nuaTotalFutureTax;

    // Net proceeds at sale (future value basis): FMV at sale minus ALL taxes that will be paid at sale.
    // Note: initial taxes (paid now) are also subtracted for a "net proceeds" comparison on a future-value basis.
    const nuaNetProceeds = fmvAtSale - nuaTotalFutureTax - nuaTotalInitialTax;

    // Present value calculations:
    // Discount FUTURE net proceeds (i.e., the net proceeds realized at sale) to present using inflationRate.
    // We treat initial tax as 'now' (no discount).
    const discountRate = inflationRate / 100 || 0;
    // PV of NET proceeds realized at sale (NUA)
    const pvNuaNetProceeds = nuaNetProceeds / Math.pow(1 + discountRate, holdingYears);
    // PV of FUTURE tax only (not needed for recommendation but we keep for reporting)
    const pvNuaFutureTax = nuaTotalFutureTax / Math.pow(1 + discountRate, holdingYears);
    const pvNuaTotalTax = nuaTotalInitialTax + pvNuaFutureTax;

    // === IRA ROLLOVER STRATEGY ===
    // If rolled over to IRA, the whole balance grows and when withdrawn later it's taxed as ordinary income (marginal)
    const iraFmvAtSale = fmvAtSale;
    const iraTotalTaxAtSale = iraFmvAtSale * (marginalTaxRate / 100);
    const iraPenaltyAtSale = iraEarlyWithdrawalApplies ? iraFmvAtSale * 0.10 : 0;
    const iraTotalTaxWithPenalty = iraTotalTaxAtSale + iraPenaltyAtSale;

    const iraNetProceeds = iraFmvAtSale - iraTotalTaxWithPenalty;

    // Present value for IRA: discount future net proceeds to present (same approach as NUA)
    const pvIraNetProceeds = iraNetProceeds / Math.pow(1 + discountRate, holdingYears);
    const pvIraTax = iraTotalTaxWithPenalty / Math.pow(1 + discountRate, holdingYears);

    // === Comparison & summary metrics ===
    const advantage = nuaNetProceeds - iraNetProceeds;
    // percentage advantage relative to IRA net proceeds (use absolute denominator to avoid sign weirdness)
    const advantagePercent = iraNetProceeds !== 0 ? (advantage / Math.abs(iraNetProceeds)) * 100 : 0;

    const pvAdvantage = pvNuaNetProceeds - pvIraNetProceeds;
    const pvAdvantagePercent =
      pvIraNetProceeds !== 0 ? (pvAdvantage / Math.abs(pvIraNetProceeds)) * 100 : 0;

    // Recommendation: compare present-value net proceeds (gives 'today' basis)
    const betterStrategy = pvAdvantage > 0 ? 'NUA Strategy' : 'IRA Rollover';

    // Helper for formatting numbers for display in notes (not changing stored numeric values)
    const round2 = (v) => {
      if (!isFinite(v)) return 0;
      return Math.round(v * 100) / 100;
    };

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

      // Notes (human friendly)
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
  ],
};
