import { z } from 'zod';

export const config = {
  title: 'Roth 401(k) vs. Traditional 401(k) Calculator',
  description: 'Compare the tax advantages of Roth 401(k) and Traditional 401(k) retirement accounts',
  schema: z.object({
    currentAge: z.number().min(18).max(100),
    retirementAge: z.number().min(20).max(100),
    annualContribution: z.number().min(0),
    investTaxSavings: z.boolean(),
    maximizeContributions: z.boolean(),
    expectedRateOfReturn: z.number().min(-100).max(100),
    currentTaxRate: z.number().min(0).max(100),
    retirementTaxRate: z.number().min(0).max(100),
  }),
  defaultValues: {
    currentAge: 30,
    retirementAge: 67,
    annualContribution: 10000,
    investTaxSavings: true,
    maximizeContributions: false,
    expectedRateOfReturn: 7,
    currentTaxRate: 24,
    retirementTaxRate: 22,
  },
  inputs: [
    { 
      name: 'currentAge', 
      label: 'Current Age', 
      type: 'number', 
      required: true,
      helpText: 'Your current age'
    },
    { 
      name: 'retirementAge', 
      label: 'Age at Retirement', 
      type: 'number', 
      required: true,
      helpText: 'Age you wish to retire (no contributions made in retirement year)'
    },
    { 
      name: 'annualContribution', 
      label: 'Annual Contribution', 
      type: 'number', 
      required: true,
      helpText: 'Amount contributed to 401(k) each year (made monthly at beginning of each month)'
    },
    { 
      name: 'investTaxSavings', 
      label: 'Invest Traditional Tax Savings', 
      type: 'checkbox',
      helpText: 'Check to invest tax savings from traditional 401(k) contributions in a taxable account'
    },
    { 
      name: 'maximizeContributions', 
      label: 'Maximize Contributions', 
      type: 'checkbox',
      helpText: 'Check to increase contributions to maximum allowed each year (including catch-up contributions)'
    },
    { 
      name: 'expectedRateOfReturn', 
      label: 'Expected Rate of Return (%)', 
      type: 'number', 
      step: 0.1,
      helpText: 'Annual rate of return for your 401(k) account (compounded annually, deposits monthly)'
    },
    { 
      name: 'currentTaxRate', 
      label: 'Current Tax Rate (%)', 
      type: 'number', 
      step: 0.1,
      helpText: 'Current marginal income tax rate on taxable investments'
    },
    { 
      name: 'retirementTaxRate', 
      label: 'Retirement Tax Rate (%)', 
      type: 'number', 
      step: 0.1,
      helpText: 'Expected marginal tax rate in retirement'
    },
  ],
  calculate: (data) => {
    const yearsToRetirement = data.retirementAge - data.currentAge;
    const monthlyRate = data.expectedRateOfReturn / 100 / 12;
    
    // 2024/2025 contribution limits
    const standardLimit = 23000;
    const catchupLimit = 7500;
    const catchupAge = 50;
    
    // Calculate actual contribution amounts
    let actualAnnualContribution = data.annualContribution;
    
    // === ROTH 401(k) CALCULATION ===
    let rothTotal = 0;
    
    for (let year = 0; year < yearsToRetirement; year++) {
      const currentAge = data.currentAge + year;
      
      // Determine contribution limit for this year
      let yearlyLimit = standardLimit;
      if (data.maximizeContributions) {
        actualAnnualContribution = standardLimit;
        if (currentAge >= catchupAge) {
          actualAnnualContribution = standardLimit + catchupLimit;
        }
      }
      
      const monthlyContribution = actualAnnualContribution / 12;
      const monthsRemaining = (yearsToRetirement - year) * 12;
      
      // Future value of contributions made this year
      for (let month = 0; month < 12 && month < monthsRemaining; month++) {
        const monthsToGrow = monthsRemaining - month;
        const futureValue = monthlyContribution * Math.pow(1 + monthlyRate, monthsToGrow);
        rothTotal += futureValue;
      }
    }
    
    // Roth balance at retirement (already tax-free)
    const rothBalanceAtRetirement = rothTotal;
    const rothAfterTaxTotal = rothBalanceAtRetirement;
    
    // === TRADITIONAL 401(k) CALCULATION ===
    let traditionalTotal = 0;
    let taxSavingsInvested = 0;
    
    for (let year = 0; year < yearsToRetirement; year++) {
      const currentAge = data.currentAge + year;
      
      // Determine contribution limit for this year
      let yearlyContribution = data.annualContribution;
      if (data.maximizeContributions) {
        yearlyContribution = standardLimit;
        if (currentAge >= catchupAge) {
          yearlyContribution = standardLimit + catchupLimit;
        }
      }
      
      const monthlyContribution = yearlyContribution / 12;
      const monthsRemaining = (yearsToRetirement - year) * 12;
      
      // Future value of contributions made this year
      for (let month = 0; month < 12 && month < monthsRemaining; month++) {
        const monthsToGrow = monthsRemaining - month;
        const futureValue = monthlyContribution * Math.pow(1 + monthlyRate, monthsToGrow);
        traditionalTotal += futureValue;
      }
      
      // Calculate tax savings if option is selected
      if (data.investTaxSavings) {
        const annualTaxSavings = yearlyContribution * (data.currentTaxRate / 100);
        const monthlyTaxSavings = annualTaxSavings / 12;
        
        // Invest tax savings in taxable account
        for (let month = 0; month < 12 && month < monthsRemaining; month++) {
          const monthsToGrow = monthsRemaining - month;
          const futureValue = monthlyTaxSavings * Math.pow(1 + monthlyRate, monthsToGrow);
          taxSavingsInvested += futureValue;
        }
      }
    }
    
    // Traditional balance at retirement (pre-tax)
    const traditionalBalanceAtRetirement = traditionalTotal;
    
    // Tax on traditional 401(k) withdrawal
    const traditionalTaxOwed = traditionalBalanceAtRetirement * (data.retirementTaxRate / 100);
    const traditionalAfterTax401k = traditionalBalanceAtRetirement - traditionalTaxOwed;
    
    // Tax on taxable account (if tax savings were invested)
    let taxSavingsAfterTax = 0;
    if (data.investTaxSavings) {
      // Calculate capital gains on invested tax savings
      const totalContributed = data.annualContribution * (data.currentTaxRate / 100) * yearsToRetirement;
      const capitalGains = taxSavingsInvested - totalContributed;
      
      // Long-term capital gains tax (assume 15% for simplicity, or use current rate as proxy)
      const capitalGainsTaxRate = Math.min(data.currentTaxRate * 0.6, 20); // Rough approximation
      const taxOnGains = capitalGains * (capitalGainsTaxRate / 100);
      
      taxSavingsAfterTax = taxSavingsInvested - taxOnGains;
    }
    
    const traditionalAfterTaxTotal = traditionalAfterTax401k + taxSavingsAfterTax;
    
    // === COMPARISON ===
    const difference = rothAfterTaxTotal - traditionalAfterTaxTotal;
    const differencePercent = (difference / traditionalAfterTaxTotal) * 100;
    const betterOption = difference > 0 ? 'Roth 401(k)' : 'Traditional 401(k)';
    
    // Annual breakdown data for charts
    const yearlyData = [];
    let rothRunning = 0;
    let tradRunning = 0;
    let taxSavingsRunning = 0;
    
    for (let year = 0; year <= yearsToRetirement; year++) {
      const age = data.currentAge + year;
      const currentAge = data.currentAge + year;
      
      if (year < yearsToRetirement) {
        let yearlyContribution = data.annualContribution;
        if (data.maximizeContributions) {
          yearlyContribution = standardLimit;
          if (currentAge >= catchupAge) {
            yearlyContribution = standardLimit + catchupLimit;
          }
        }
        
        const monthlyContribution = yearlyContribution / 12;
        
        // Add this year's contributions with growth
        for (let month = 0; month < 12; month++) {
          rothRunning = rothRunning * (1 + monthlyRate) + monthlyContribution;
          tradRunning = tradRunning * (1 + monthlyRate) + monthlyContribution;
          
          if (data.investTaxSavings) {
            const monthlyTaxSavings = (yearlyContribution / 12) * (data.currentTaxRate / 100);
            taxSavingsRunning = taxSavingsRunning * (1 + monthlyRate) + monthlyTaxSavings;
          }
        }
      } else {
        // Just apply growth in retirement year
        rothRunning = rothRunning * Math.pow(1 + monthlyRate, 12);
        tradRunning = tradRunning * Math.pow(1 + monthlyRate, 12);
        if (data.investTaxSavings) {
          taxSavingsRunning = taxSavingsRunning * Math.pow(1 + monthlyRate, 12);
        }
      }
      
      if (year % 5 === 0 || year === yearsToRetirement) {
        const tradAfterTax = tradRunning * (1 - data.retirementTaxRate / 100);
        yearlyData.push({
          age: age,
          year: year,
          rothBalance: rothRunning,
          traditionalBalance: tradRunning,
          traditionalAfterTax: tradAfterTax,
          taxSavingsAccount: taxSavingsRunning
        });
      }
    }
    
    return {
      // Input echoes
      yearsToRetirement,
      totalContributions: data.annualContribution * yearsToRetirement,
      
      // Roth results
      rothBalanceAtRetirement,
      rothAfterTaxTotal,
      
      // Traditional results
      traditionalBalanceAtRetirement,
      traditionalTaxOwed,
      traditionalAfterTax401k,
      taxSavingsInvested,
      taxSavingsAfterTax,
      traditionalAfterTaxTotal,
      
      // Comparison
      difference,
      differencePercent,
      betterOption,
      
      // Chart data
      comparisonData: [
        { 
          account: 'Roth 401(k)', 
          balanceAtRetirement: rothBalanceAtRetirement,
          afterTaxValue: rothAfterTaxTotal,
          taxOwed: 0
        },
        { 
          account: 'Traditional 401(k)', 
          balanceAtRetirement: traditionalBalanceAtRetirement,
          afterTaxValue: traditionalAfterTaxTotal,
          taxOwed: traditionalTaxOwed,
          taxSavingsAccount: taxSavingsAfterTax
        }
      ],
      
      yearlyData: yearlyData,
      
      // Breakdown data
      rothBreakdown: [
        { category: 'Total Contributions', amount: data.annualContribution * yearsToRetirement },
        { category: 'Investment Growth', amount: rothBalanceAtRetirement - (data.annualContribution * yearsToRetirement) },
        { category: 'Balance at Retirement', amount: rothBalanceAtRetirement },
        { category: 'Taxes Owed', amount: 0 },
        { category: 'After-Tax Total', amount: rothAfterTaxTotal }
      ],
      
      traditionalBreakdown: [
        { category: 'Total Contributions', amount: data.annualContribution * yearsToRetirement },
        { category: 'Investment Growth', amount: traditionalBalanceAtRetirement - (data.annualContribution * yearsToRetirement) },
        { category: 'Balance at Retirement', amount: traditionalBalanceAtRetirement },
        { category: 'Taxes Owed', amount: -traditionalTaxOwed },
        { category: '401(k) After-Tax', amount: traditionalAfterTax401k },
        { category: 'Tax Savings Account', amount: taxSavingsAfterTax },
        { category: 'After-Tax Total', amount: traditionalAfterTaxTotal }
      ].filter(item => item.amount !== 0)
    };
  },
  results: [
    { key: 'betterOption', label: 'Better Option', format: 'text', section: 'Recommendation' },
    { key: 'difference', label: 'Roth 401(k) Advantage', format: 'currency', section: 'Recommendation' },
    { key: 'differencePercent', label: 'Advantage %', format: 'percent', section: 'Recommendation' },
    { key: 'yearsToRetirement', label: 'Years to Retirement', format: 'number', section: 'Summary' },
    { key: 'totalContributions', label: 'Total Contributions', format: 'currency', section: 'Summary' },
    { key: 'rothBalanceAtRetirement', label: 'Roth 401(k) Balance at Retirement', format: 'currency', section: 'Roth 401(k)' },
    { key: 'rothAfterTaxTotal', label: 'Roth After-Tax Total', format: 'currency', section: 'Roth 401(k)' },
    { key: 'traditionalBalanceAtRetirement', label: 'Traditional 401(k) Balance at Retirement', format: 'currency', section: 'Traditional 401(k)' },
    { key: 'traditionalTaxOwed', label: 'Taxes Owed on Traditional 401(k)', format: 'currency', section: 'Traditional 401(k)' },
    { key: 'traditionalAfterTax401k', label: 'Traditional 401(k) After-Tax', format: 'currency', section: 'Traditional 401(k)' },
    { key: 'taxSavingsAfterTax', label: 'Tax Savings Account After-Tax', format: 'currency', section: 'Traditional 401(k)', condition: (r) => r.taxSavingsAfterTax > 0 },
    { key: 'traditionalAfterTaxTotal', label: 'Traditional Total After-Tax', format: 'currency', section: 'Traditional 401(k)' },
  ],
  charts: [
    { 
      type: 'bar', 
      title: 'After-Tax Total at Retirement', 
      data: (r) => r.comparisonData, 
      xKey: 'account', 
      valueKey: 'afterTaxValue',
      format: 'currency', 
      height: 300,
      color: '#10b981'
    },
    { 
      type: 'bar', 
      title: 'Balance at Retirement (Before Tax)', 
      data: (r) => r.comparisonData, 
      xKey: 'account', 
      valueKey: 'balanceAtRetirement',
      format: 'currency', 
      height: 300,
      color: '#3b82f6'
    },
    { 
      type: 'line', 
      title: 'Account Growth Over Time', 
      data: (r) => r.yearlyData, 
      xKey: 'age',
      lines: [
        { key: 'rothBalance', label: 'Roth 401(k)', color: '#10b981' },
        { key: 'traditionalAfterTax', label: 'Traditional (After-Tax)', color: '#3b82f6' },
        { key: 'taxSavingsAccount', label: 'Tax Savings Account', color: '#f59e0b' }
      ],
      format: 'currency', 
      height: 400
    }
  ]
};