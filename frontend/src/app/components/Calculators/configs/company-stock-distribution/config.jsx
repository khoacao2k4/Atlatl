import { z } from 'zod';

export const config = {
  title: 'Company Stock Distribution Analysis Calculator',
  description: 'Compare NUA strategy vs IRA rollover for company stock distributions',
  schema: z.object({
    balanceAtDistribution: z.number().min(0),
    costBasis: z.number().min(0),
    rateOfReturn: z.number().min(-100).max(200),
    holdingPeriodYears: z.number().min(0).max(50),
    holdingPeriodMonths: z.number().min(0).max(11),
    capitalGainsRate: z.number().min(0).max(100),
    marginalTaxRate: z.number().min(0).max(100),
    inflationRate: z.number().min(0).max(100),
    separatedAtAge55: z.boolean(),
    retirementDistributionAfter59Half: z.boolean(),
    iraDistributionAfter59Half: z.boolean(),
    currentAge: z.number().min(0).max(120),
  }),
  defaultValues: {
    balanceAtDistribution: 500000,
    costBasis: 100000,
    rateOfReturn: 7,
    holdingPeriodYears: 10,
    holdingPeriodMonths: 0,
    capitalGainsRate: 15,
    marginalTaxRate: 24,
    inflationRate: 3,
    separatedAtAge55: false,
    retirementDistributionAfter59Half: true,
    iraDistributionAfter59Half: true,
    currentAge: 60,
  },
  inputs: [
    { 
      name: 'balanceAtDistribution', 
      label: 'Balance at Time of Distribution (FMV)', 
      type: 'number', 
      required: true,
      helpText: 'Fair market value of company stock to be distributed'
    },
    { 
      name: 'costBasis', 
      label: 'Total Stock Purchases (Cost Basis)', 
      type: 'number', 
      required: true,
      helpText: 'Total amount paid for the stock (you and/or employer contributions)'
    },
    { 
      name: 'rateOfReturn', 
      label: 'Rate of Return (%)', 
      type: 'number', 
      step: 0.1,
      helpText: 'Expected annual return on company stock'
    },
    { 
      name: 'holdingPeriodYears', 
      label: 'Holding Period (Years)', 
      type: 'number',
      helpText: 'Years you expect to hold the stock after distribution'
    },
    { 
      name: 'holdingPeriodMonths', 
      label: 'Holding Period (Additional Months)', 
      type: 'number',
      helpText: 'Additional months beyond full years'
    },
    { 
      name: 'capitalGainsRate', 
      label: 'Capital Gains Tax Rate (%)', 
      type: 'number', 
      step: 0.1,
      helpText: 'Long-term capital gains tax rate (typically 0%, 15%, or 20%)'
    },
    { 
      name: 'marginalTaxRate', 
      label: 'Marginal Income Tax Rate (%)', 
      type: 'number', 
      step: 0.1,
      helpText: 'Your ordinary income tax rate'
    },
    { 
      name: 'inflationRate', 
      label: 'Expected Inflation Rate (%)', 
      type: 'number', 
      step: 0.1,
      helpText: 'Long-term average inflation rate for present value calculations'
    },
    { 
      name: 'currentAge', 
      label: 'Current Age', 
      type: 'number',
      helpText: 'Your current age'
    },
    { 
      name: 'separatedAtAge55', 
      label: 'Separated from Service at Age 55 or Older', 
      type: 'checkbox',
      helpText: 'Check if you separated in/after the year you turned 55 (no 10% penalty)'
    },
    { 
      name: 'retirementDistributionAfter59Half', 
      label: 'Retirement Plan Distribution at Age 59½ or Older', 
      type: 'checkbox',
      helpText: 'Check if distribution occurs at/after age 59½ (no 10% penalty)'
    },
    { 
      name: 'iraDistributionAfter59Half', 
      label: 'IRA Distribution at Age 59½ or Older', 
      type: 'checkbox',
      helpText: 'Check if IRA distribution occurs at/after age 59½ (no 10% penalty)'
    },
  ],
  calculate: (data) => {
    // Calculate NUA (Net Unrealized Appreciation)
    const nua = data.balanceAtDistribution - data.costBasis;
    
    // Convert holding period to years
    const holdingPeriodYears = data.holdingPeriodYears + (data.holdingPeriodMonths / 12);
    
    // Calculate future value of stock
    const fmvAtSale = data.balanceAtDistribution * Math.pow(1 + data.rateOfReturn / 100, holdingPeriodYears);
    
    // Calculate appreciation after distribution
    const appreciationAfterDistribution = fmvAtSale - data.balanceAtDistribution;
    
    // Determine if 10% penalty applies
    const penaltyOnRetirementDist = !data.separatedAtAge55 && !data.retirementDistributionAfter59Half;
    const penaltyOnIraDist = !data.iraDistributionAfter59Half;
    
    // === NUA STRATEGY CALCULATION ===
    
    // Initial tax on cost basis at distribution (ordinary income)
    const nuaInitialTax = data.costBasis * (data.marginalTaxRate / 100);
    const nuaInitialPenalty = penaltyOnRetirementDist ? data.costBasis * 0.10 : 0;
    const nuaTotalInitialTax = nuaInitialTax + nuaInitialPenalty;
    
    // Tax on NUA when sold (long-term capital gains)
    const nuaNuaTax = nua * (data.capitalGainsRate / 100);
    
    // Tax on appreciation after distribution (long-term capital gains if held > 1 year)
    const nuaAppreciationTax = appreciationAfterDistribution * (data.capitalGainsRate / 100);
    
    // Total future taxes for NUA strategy
    const nuaTotalFutureTax = nuaNuaTax + nuaAppreciationTax;
    
    // Net proceeds from NUA strategy
    const nuaNetProceeds = fmvAtSale - nuaTotalInitialTax - nuaTotalFutureTax;
    
    // Present value of NUA strategy (discount future taxes)
    const discountRate = data.inflationRate / 100;
    const pvNuaFutureTax = nuaTotalFutureTax / Math.pow(1 + discountRate, holdingPeriodYears);
    const pvNuaTotalTax = nuaTotalInitialTax + pvNuaFutureTax;
    const pvNuaNetProceeds = data.balanceAtDistribution - pvNuaTotalTax;
    
    // === IRA ROLLOVER CALCULATION ===
    
    // No immediate tax on rollover
    const iraInitialTax = 0;
    
    // Future value in IRA grows tax-deferred
    const iraFmvAtSale = data.balanceAtDistribution * Math.pow(1 + data.rateOfReturn / 100, holdingPeriodYears);
    
    // Tax on entire distribution from IRA (ordinary income)
    const iraTotalTax = iraFmvAtSale * (data.marginalTaxRate / 100);
    const iraPenalty = penaltyOnIraDist ? iraFmvAtSale * 0.10 : 0;
    const iraTotalTaxWithPenalty = iraTotalTax + iraPenalty;
    
    // Net proceeds from IRA strategy
    const iraNetProceeds = iraFmvAtSale - iraTotalTaxWithPenalty;
    
    // Present value of IRA strategy
    const pvIraTax = iraTotalTaxWithPenalty / Math.pow(1 + discountRate, holdingPeriodYears);
    const pvIraNetProceeds = data.balanceAtDistribution - pvIraTax;
    
    // === COMPARISON ===
    
    const advantage = nuaNetProceeds - iraNetProceeds;
    const advantagePercent = (advantage / iraNetProceeds) * 100;
    const pvAdvantage = pvNuaNetProceeds - pvIraNetProceeds;
    const pvAdvantagePercent = (pvAdvantage / pvIraNetProceeds) * 100;
    
    const betterStrategy = advantage > 0 ? 'NUA Strategy' : 'IRA Rollover';
    
    return {
      // NUA Strategy Results
      nua,
      nuaInitialTax,
      nuaInitialPenalty,
      nuaTotalInitialTax,
      nuaNuaTax,
      nuaAppreciationTax,
      nuaTotalFutureTax,
      nuaTotalTax: nuaTotalInitialTax + nuaTotalFutureTax,
      nuaNetProceeds,
      pvNuaFutureTax,
      pvNuaTotalTax,
      pvNuaNetProceeds,
      
      // IRA Rollover Results
      iraInitialTax,
      iraFmvAtSale,
      iraTotalTax,
      iraPenalty,
      iraTotalTaxWithPenalty,
      iraNetProceeds,
      pvIraTax,
      pvIraNetProceeds,
      
      // Comparison
      fmvAtSale,
      appreciationAfterDistribution,
      advantage,
      advantagePercent,
      pvAdvantage,
      pvAdvantagePercent,
      betterStrategy,
      
      // For charts
      comparisonData: [
        { 
          strategy: 'NUA Strategy', 
          initialTax: nuaTotalInitialTax,
          futureTax: nuaTotalFutureTax,
          totalTax: nuaTotalInitialTax + nuaTotalFutureTax,
          netProceeds: nuaNetProceeds,
          pvTotalTax: pvNuaTotalTax,
          pvNetProceeds: pvNuaNetProceeds
        },
        { 
          strategy: 'IRA Rollover', 
          initialTax: iraInitialTax,
          futureTax: iraTotalTaxWithPenalty,
          totalTax: iraTotalTaxWithPenalty,
          netProceeds: iraNetProceeds,
          pvTotalTax: pvIraTax,
          pvNetProceeds: pvIraNetProceeds
        }
      ],
      
      // Tax breakdown for NUA
      nuaTaxBreakdown: [
        { category: 'Initial Tax (Cost Basis)', amount: nuaInitialTax },
        { category: 'Initial Penalty (10%)', amount: nuaInitialPenalty },
        { category: 'Tax on NUA (at sale)', amount: nuaNuaTax },
        { category: 'Tax on Post-Dist Appreciation', amount: nuaAppreciationTax }
      ].filter(item => item.amount > 0),
      
      // Tax breakdown for IRA
      iraTaxBreakdown: [
        { category: 'Tax on Distribution', amount: iraTotalTax },
        { category: 'Penalty (10%)', amount: iraPenalty }
      ].filter(item => item.amount > 0)
    };
  },
  results: [
    { key: 'nua', label: 'Net Unrealized Appreciation (NUA)', format: 'currency', section: 'NUA Details' },
    { key: 'betterStrategy', label: 'Recommended Strategy', format: 'text', section: 'Comparison' },
    { key: 'advantage', label: 'NUA Strategy Advantage (Future Value)', format: 'currency', section: 'Comparison' },
    { key: 'advantagePercent', label: 'Advantage %', format: 'percent', section: 'Comparison' },
    { key: 'pvAdvantage', label: 'NUA Strategy Advantage (Present Value)', format: 'currency', section: 'Comparison' },
    { key: 'pvAdvantagePercent', label: 'Advantage % (PV)', format: 'percent', section: 'Comparison' },
    { key: 'nuaTotalInitialTax', label: 'Initial Tax Due (at distribution)', format: 'currency', section: 'NUA Strategy' },
    { key: 'nuaTotalFutureTax', label: 'Future Tax Due (at sale)', format: 'currency', section: 'NUA Strategy' },
    { key: 'nuaTotalTax', label: 'Total Tax (NUA)', format: 'currency', section: 'NUA Strategy' },
    { key: 'nuaNetProceeds', label: 'Net Proceeds (NUA)', format: 'currency', section: 'NUA Strategy' },
    { key: 'pvNuaNetProceeds', label: 'Net Proceeds PV (NUA)', format: 'currency', section: 'NUA Strategy' },
    { key: 'iraTotalTaxWithPenalty', label: 'Total Tax (IRA Rollover)', format: 'currency', section: 'IRA Rollover' },
    { key: 'iraNetProceeds', label: 'Net Proceeds (IRA)', format: 'currency', section: 'IRA Rollover' },
    { key: 'pvIraNetProceeds', label: 'Net Proceeds PV (IRA)', format: 'currency', section: 'IRA Rollover' },
    { key: 'fmvAtSale', label: 'Projected FMV at Sale', format: 'currency', section: 'Projections' },
    { key: 'appreciationAfterDistribution', label: 'Appreciation After Distribution', format: 'currency', section: 'Projections' },
  ],
  charts: [
    { 
      type: 'bar', 
      title: 'Net Proceeds Comparison', 
      data: (r) => r.comparisonData, 
      xKey: 'strategy', 
      valueKey: 'netProceeds',
      format: 'currency', 
      height: 300,
      color: '#10b981'
    },
    { 
      type: 'bar', 
      title: 'Total Tax Comparison', 
      data: (r) => r.comparisonData, 
      xKey: 'strategy', 
      valueKey: 'totalTax',
      format: 'currency', 
      height: 300,
      color: '#ef4444'
    },
    { 
      type: 'bar', 
      title: 'Present Value Net Proceeds', 
      data: (r) => r.comparisonData, 
      xKey: 'strategy', 
      valueKey: 'pvNetProceeds',
      format: 'currency', 
      height: 300,
      color: '#3b82f6'
    }
  ]
};