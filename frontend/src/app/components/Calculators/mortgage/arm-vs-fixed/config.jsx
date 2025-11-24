import { z } from 'zod';

export const config = {
  title: 'ARM vs. Fixed-Rate Mortgage Calculator',
  description: 'Compare adjustable-rate mortgage (ARM) to fixed-rate mortgage options',
  schema: z.object({
    mortgageAmount: z.number().min(0),
    termInYears: z.number().min(1).max(50),
    fixedInterestRate: z.number().min(0).max(100),
    armInterestRate: z.number().min(0).max(100),
    monthsRateFixed: z.number().min(0).max(360),
    monthsBetweenAdjustments: z.number().min(1).max(12),
    expectedAdjustment: z.number().min(-3).max(3),
    interestRateCap: z.number().min(0).max(100),
  }),
  defaultValues: {
    mortgageAmount: 300000,
    termInYears: 30,
    fixedInterestRate: 6.5,
    armInterestRate: 5.5,
    monthsRateFixed: 60,
    monthsBetweenAdjustments: 12,
    expectedAdjustment: 0.25,
    interestRateCap: 11.5,
  },
  inputs: [
    { 
      name: 'mortgageAmount', 
      label: 'Mortgage Amount', 
      type: 'number', 
      required: true,
      helpText: 'Original or expected balance for your mortgage'
    },
    { 
      name: 'termInYears', 
      label: 'Term in Years', 
      type: 'number', 
      required: true,
      helpText: 'Number of years to repay the loan (commonly 15, 20, or 30 years)'
    },
    { 
      name: 'fixedInterestRate', 
      label: 'Fixed-Rate Interest Rate (%)', 
      type: 'number', 
      step: 0.125,
      required: true,
      helpText: 'Annual interest rate for fixed-rate mortgage'
    },
    { 
      name: 'armInterestRate', 
      label: 'ARM Initial Interest Rate (%)', 
      type: 'number', 
      step: 0.125,
      required: true,
      helpText: 'Initial annual interest rate for ARM (typically lower than fixed rate)'
    },
    { 
      name: 'monthsRateFixed', 
      label: 'Months Rate Fixed (ARM)', 
      type: 'number',
      helpText: 'Number of months the ARM rate is fixed (e.g., 60 for 5/1 ARM, 84 for 7/1 ARM)'
    },
    { 
      name: 'monthsBetweenAdjustments', 
      label: 'Months Between Adjustments', 
      type: 'number',
      helpText: 'Payment periods between rate adjustments (12 months = annual, 6 months = semi-annual)'
    },
    { 
      name: 'expectedAdjustment', 
      label: 'Expected Adjustment per Period (%)', 
      type: 'number', 
      step: 0.125,
      helpText: 'Expected annual adjustment to ARM rate after initial period (-3% to +3%)'
    },
    { 
      name: 'interestRateCap', 
      label: 'Interest Rate Cap (%)', 
      type: 'number', 
      step: 0.125,
      helpText: 'Maximum allowable interest rate for your ARM (rate can never exceed this)'
    },
  ],
  calculate: (data) => {
    const totalMonths = data.termInYears * 12;
    const fixedMonthlyRate = data.fixedInterestRate / 100 / 12;
    
    // === FIXED-RATE MORTGAGE CALCULATION ===
    
    // Monthly payment formula: P * [r(1+r)^n] / [(1+r)^n - 1]
    const fixedPayment = data.mortgageAmount * 
      (fixedMonthlyRate * Math.pow(1 + fixedMonthlyRate, totalMonths)) / 
      (Math.pow(1 + fixedMonthlyRate, totalMonths) - 1);
    
    const fixedTotalPaid = fixedPayment * totalMonths;
    const fixedTotalInterest = fixedTotalPaid - data.mortgageAmount;
    
    // === ARM CALCULATION ===
    
    let armBalance = data.mortgageAmount;
    let armTotalPaid = 0;
    let currentArmRate = data.armInterestRate;
    let armPayment = 0;
    const armPaymentSchedule = [];
    const fixedPaymentSchedule = [];
    
    // Calculate ARM payments month by month
    for (let month = 1; month <= totalMonths; month++) {
      // Check if we need to adjust the rate
      if (month > data.monthsRateFixed && 
          (month - data.monthsRateFixed - 1) % data.monthsBetweenAdjustments === 0) {
        currentArmRate += data.expectedAdjustment;
        // Apply interest rate cap
        if (currentArmRate > data.interestRateCap) {
          currentArmRate = data.interestRateCap;
        }
        // Don't let rate go below 0
        if (currentArmRate < 0) {
          currentArmRate = 0;
        }
      }
      
      const monthlyRate = currentArmRate / 100 / 12;
      const remainingMonths = totalMonths - month + 1;
      
      // Recalculate payment based on remaining balance and term
      if (monthlyRate > 0) {
        armPayment = armBalance * 
          (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / 
          (Math.pow(1 + monthlyRate, remainingMonths) - 1);
      } else {
        armPayment = armBalance / remainingMonths;
      }
      
      // Calculate interest and principal for this month
      const interestPayment = armBalance * monthlyRate;
      const principalPayment = armPayment - interestPayment;
      
      armBalance -= principalPayment;
      armTotalPaid += armPayment;
      
      // Store data for charts (sample every 12 months for performance)
      if (month % 12 === 0 || month === 1 || month === data.monthsRateFixed) {
        armPaymentSchedule.push({
          month: month,
          year: Math.floor(month / 12),
          payment: armPayment,
          rate: currentArmRate,
          balance: Math.max(0, armBalance),
          totalPaid: armTotalPaid
        });
      }
    }
    
    const armTotalInterest = armTotalPaid - data.mortgageAmount;
    const armInitialPayment = armPaymentSchedule[0]?.payment || 0;
    const armFinalPayment = armPaymentSchedule[armPaymentSchedule.length - 1]?.payment || 0;
    
    // Generate fixed payment schedule for comparison
    let fixedBalance = data.mortgageAmount;
    let fixedTotalPaidRunning = 0;
    
    for (let month = 1; month <= totalMonths; month++) {
      const interestPayment = fixedBalance * fixedMonthlyRate;
      const principalPayment = fixedPayment - interestPayment;
      
      fixedBalance -= principalPayment;
      fixedTotalPaidRunning += fixedPayment;
      
      if (month % 12 === 0 || month === 1) {
        fixedPaymentSchedule.push({
          month: month,
          year: Math.floor(month / 12),
          payment: fixedPayment,
          rate: data.fixedInterestRate,
          balance: Math.max(0, fixedBalance),
          totalPaid: fixedTotalPaidRunning
        });
      }
    }
    
    // === COMPARISON ===
    
    const totalInterestSavings = fixedTotalInterest - armTotalInterest;
    const totalSavings = fixedTotalPaid - armTotalPaid;
    const initialPaymentSavings = fixedPayment - armInitialPayment;
    const betterOption = totalSavings > 0 ? 'ARM' : 'Fixed-Rate';
    
    // Determine ARM type
    const yearsFixed = Math.floor(data.monthsRateFixed / 12);
    let armType = '';
    if (data.monthsBetweenAdjustments === 6) {
      armType = `${yearsFixed}/6 month ARM`;
    } else {
      armType = `${yearsFixed}/1 ARM`;
    }
    
    // Combined comparison data
    const combinedSchedule = [];
    for (let i = 0; i < Math.max(armPaymentSchedule.length, fixedPaymentSchedule.length); i++) {
      const armData = armPaymentSchedule[i] || armPaymentSchedule[armPaymentSchedule.length - 1];
      const fixedData = fixedPaymentSchedule[i] || fixedPaymentSchedule[fixedPaymentSchedule.length - 1];
      
      combinedSchedule.push({
        year: fixedData.year,
        armPayment: armData.payment,
        fixedPayment: fixedData.payment,
        armRate: armData.rate,
        fixedRate: fixedData.rate,
        armBalance: armData.balance,
        fixedBalance: fixedData.balance,
        armTotalPaid: armData.totalPaid,
        fixedTotalPaid: fixedData.totalPaid
      });
    }
    
    return {
      // Fixed-rate results
      fixedPayment,
      fixedTotalPaid,
      fixedTotalInterest,
      
      // ARM results
      armInitialPayment,
      armFinalPayment,
      armTotalPaid,
      armTotalInterest,
      armType,
      
      // Comparison
      totalSavings,
      totalInterestSavings,
      initialPaymentSavings,
      betterOption,
      
      // Schedules
      armPaymentSchedule,
      fixedPaymentSchedule,
      combinedSchedule,
      
      // Chart data
      comparisonData: [
        { 
          mortgage: 'Fixed-Rate', 
          monthlyPayment: fixedPayment,
          totalPaid: fixedTotalPaid,
          totalInterest: fixedTotalInterest,
          principal: data.mortgageAmount
        },
        { 
          mortgage: `ARM (${armType})`, 
          monthlyPayment: armInitialPayment,
          totalPaid: armTotalPaid,
          totalInterest: armTotalInterest,
          principal: data.mortgageAmount
        }
      ],
      
      paymentBreakdown: [
        { type: 'Principal', fixed: data.mortgageAmount, arm: data.mortgageAmount },
        { type: 'Total Interest', fixed: fixedTotalInterest, arm: armTotalInterest }
      ]
    };
  },
  results: [
    { key: 'betterOption', label: 'Lower Total Cost', format: 'text', section: 'Recommendation' },
    { key: 'totalSavings', label: 'Total Savings (ARM vs Fixed)', format: 'currency', section: 'Recommendation' },
    { key: 'totalInterestSavings', label: 'Interest Savings', format: 'currency', section: 'Recommendation' },
    { key: 'armType', label: 'ARM Type', format: 'text', section: 'ARM Details' },
    { key: 'armInitialPayment', label: 'ARM Initial Monthly Payment', format: 'currency', section: 'ARM Details' },
    { key: 'armFinalPayment', label: 'ARM Final Monthly Payment', format: 'currency', section: 'ARM Details' },
    { key: 'armTotalPaid', label: 'ARM Total Amount Paid', format: 'currency', section: 'ARM Details' },
    { key: 'armTotalInterest', label: 'ARM Total Interest', format: 'currency', section: 'ARM Details' },
    { key: 'fixedPayment', label: 'Fixed-Rate Monthly Payment', format: 'currency', section: 'Fixed-Rate Details' },
    { key: 'fixedTotalPaid', label: 'Fixed-Rate Total Amount Paid', format: 'currency', section: 'Fixed-Rate Details' },
    { key: 'fixedTotalInterest', label: 'Fixed-Rate Total Interest', format: 'currency', section: 'Fixed-Rate Details' },
    { key: 'initialPaymentSavings', label: 'Initial Monthly Payment Savings (ARM)', format: 'currency', section: 'Comparison' },
  ],
  charts: [
    { 
      type: 'bar', 
      title: 'Total Amount Paid Comparison', 
      data: (r) => r.comparisonData, 
      xKey: 'mortgage', 
      valueKey: 'totalPaid',
      format: 'currency', 
      height: 300,
      color: '#3b82f6'
    },
    { 
      type: 'bar', 
      title: 'Total Interest Paid', 
      data: (r) => r.comparisonData, 
      xKey: 'mortgage', 
      valueKey: 'totalInterest',
      format: 'currency', 
      height: 300,
      color: '#ef4444'
    },
    { 
      type: 'line', 
      title: 'Monthly Payment Over Time', 
      data: (r) => r.combinedSchedule, 
      xKey: 'year',
      lines: [
        { key: 'armPayment', label: 'ARM Payment', color: '#10b981' },
        { key: 'fixedPayment', label: 'Fixed Payment', color: '#3b82f6' }
      ],
      format: 'currency', 
      height: 400
    },
    { 
      type: 'line', 
      title: 'Interest Rate Over Time', 
      data: (r) => r.combinedSchedule, 
      xKey: 'year',
      lines: [
        { key: 'armRate', label: 'ARM Rate', color: '#f59e0b' },
        { key: 'fixedRate', label: 'Fixed Rate', color: '#6366f1' }
      ],
      format: 'percent', 
      height: 400
    },
    { 
      type: 'line', 
      title: 'Remaining Balance Over Time', 
      data: (r) => r.combinedSchedule, 
      xKey: 'year',
      lines: [
        { key: 'armBalance', label: 'ARM Balance', color: '#ec4899' },
        { key: 'fixedBalance', label: 'Fixed Balance', color: '#8b5cf6' }
      ],
      format: 'currency', 
      height: 400
    }
  ]
};