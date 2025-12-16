import { z } from 'zod';


const roundCurrency = (amount) => {
  return Math.round(amount * 100) / 100;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const calculateMonthlyPayment = (principal, monthlyRate, totalMonths) => {
  if (totalMonths <= 0) return 0;
  if (monthlyRate === 0) return principal / totalMonths;
  
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
};

const calculateRemainingBalance = (originalPrincipal, monthlyRate, totalMonths, monthsPaid) => {
  if (monthsPaid >= totalMonths) return 0;
  if (monthsPaid <= 0) return originalPrincipal;
  if (monthlyRate === 0) {
    return originalPrincipal * (1 - monthsPaid / totalMonths);
  }
  
  const payment = calculateMonthlyPayment(originalPrincipal, monthlyRate, totalMonths);
  const remainingMonths = totalMonths - monthsPaid;
  
  return payment * 
    (Math.pow(1 + monthlyRate, remainingMonths) - 1) /
    (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths));
};

// ===========================
// VALIDATION SCHEMA
// ===========================

export const schema = z.object({
  originalMortgageAmount: z.number()
    .min(0, 'Must be 0 or greater')
    .max(100000000, 'Amount seems unreasonably high'),
  originalAppraisedValue: z.number()
    .min(0, 'Must be 0 or greater')
    .max(100000000, 'Value seems unreasonably high'),
  currentInterestRate: z.number()
    .min(0, 'Must be 0 or greater')
    .max(100, 'Must be 100% or less'),
  currentTermYears: z.number()
    .int('Must be a whole number')
    .min(1, 'Must be at least 1 year')
    .max(50, 'Must be 50 years or less'),
  yearsRemaining: z.number()
    .int('Must be a whole number')
    .min(0, 'Must be 0 or greater')
    .max(50, 'Must be 50 years or less'),
  incomeTaxRate: z.number()
    .min(0, 'Must be 0 or greater')
    .max(100, 'Must be 100% or less'),
  calculateBalance: z.union([z.boolean(), z.string()])
    .transform(val => val === 'true' || val === true),
  currentAppraisedValue: z.number()
    .min(0, 'Must be 0 or greater')
    .max(100000000, 'Value seems unreasonably high'),
  loanBalance: z.number()
    .min(0, 'Must be 0 or greater')
    .max(100000000, 'Amount seems unreasonably high'),
  newInterestRate: z.number()
    .min(0, 'Must be 0 or greater')
    .max(100, 'Must be 100% or less'),
  newTermYears: z.number()
    .int('Must be a whole number')
    .min(1, 'Must be at least 1 year')
    .max(50, 'Must be 50 years or less'),
  loanOriginationRate: z.number()
    .min(0, 'Must be 0 or greater')
    .max(100, 'Must be 100% or less'),
  pointsPaid: z.number()
    .min(0, 'Must be 0 or greater')
    .max(10, 'Must be 10 or less'),
  otherClosingCosts: z.number()
    .min(0, 'Must be 0 or greater')
    .max(1000000, 'Amount seems unreasonably high'),
  includePMI: z.union([z.boolean(), z.string()])
    .transform(val => val === 'true' || val === true),
}).refine((data) => {
  return data.yearsRemaining <= data.currentTermYears;
}, {
  message: "Years remaining cannot exceed current term",
  path: ["yearsRemaining"],
}).refine((data) => {
  return data.loanBalance <= data.currentAppraisedValue;
}, {
  message: "Loan balance cannot exceed home value",
  path: ["loanBalance"],
});

// ===========================
// DEFAULT VALUES
// ===========================

export const defaults = {
  originalMortgageAmount: 350000,
  originalAppraisedValue: 400000,
  currentInterestRate: 7.5,
  currentTermYears: 30,
  yearsRemaining: 15,
  incomeTaxRate: 24,
  calculateBalance: 'true',
  currentAppraisedValue: 400000,
  loanBalance: 263994,
  newInterestRate: 6.5,
  newTermYears: 30,
  loanOriginationRate: 1,
  pointsPaid: 1,
  otherClosingCosts: 2000,
  includePMI: 'false',
};

// ===========================
// INPUT CONFIGURATION
// ===========================

export const inputs = [
  // Current Mortgage Information
  { 
    name: 'originalMortgageAmount', 
    label: 'Original Mortgage Amount', 
    type: 'number',
    format: 'currency',
    required: true, 
    section: 'Current Mortgage Information',
    hint: 'Original amount of your mortgage' 
  },
  { 
    name: 'originalAppraisedValue', 
    label: 'Original Appraised Value', 
    type: 'number',
    format: 'currency',
    required: true, 
    section: 'Current Mortgage Information',
    hint: 'The appraised value of your home when purchased' 
  },
  { 
    name: 'currentInterestRate', 
    label: 'Current Interest Rate', 
    type: 'number',
    format: 'percentage',
    step: 0.01, 
    required: true,
    section: 'Current Mortgage Information',
    hint: 'Annual interest rate for the original loan' 
  },
  { 
    name: 'currentTermYears', 
    label: 'Current Term (Years)', 
    type: 'number',
    required: true,
    section: 'Current Mortgage Information',
    hint: 'Total length of your current mortgage in years' 
  },
  { 
    name: 'yearsRemaining', 
    label: 'Years Remaining', 
    type: 'number',
    required: true,
    section: 'Current Mortgage Information',
    hint: 'Years remaining on your current mortgage' 
  },
  { 
    name: 'incomeTaxRate', 
    label: 'Income Tax Rate', 
    type: 'number',
    format: 'percentage',
    step: 0.1, 
    required: true,
    section: 'Current Mortgage Information',
    hint: 'Your current income tax rate' 
  },
  { 
    name: 'calculateBalance', 
    label: 'Calculate Balance from Loan Info', 
    type: 'select',
    options: [
      { value: 'true', label: 'Yes - Calculate from loan info' },
      { value: 'false', label: 'No - I will enter my own balance' }
    ],
    section: 'Current Mortgage Information',
    hint: 'Check to let calculator determine remaining balance',
    onChangeTrigger: (formData, setValue, newValue) => {
      const shouldAutoCalc = newValue === 'true';
      
      if (shouldAutoCalc) {
        const currentRate = (formData.currentInterestRate || 0) / 100;
        const currentMonthlyRate = currentRate / 12;
        const totalMonths = (formData.currentTermYears || 0) * 12;
        const monthsPaid = totalMonths - (formData.yearsRemaining || 0) * 12;
        
        if (monthsPaid >= 0 && monthsPaid <= totalMonths && formData.originalMortgageAmount) {
          const loanBalance = calculateRemainingBalance(
            formData.originalMortgageAmount,
            currentMonthlyRate,
            totalMonths,
            monthsPaid
          );
          
          setValue('loanBalance', Math.round(loanBalance));
        } else if (monthsPaid > totalMonths) {
          setValue('loanBalance', 0);
        } else if (formData.originalMortgageAmount) {
          setValue('loanBalance', formData.originalMortgageAmount);
        }
      }
    }
  },

  // New Mortgage Information
  { 
    name: 'currentAppraisedValue', 
    label: 'Current Appraised Value', 
    type: 'number',
    format: 'currency',
    required: true, 
    section: 'New Mortgage Information',
    hint: 'The current appraised value of your home' 
  },
  { 
    name: 'loanBalance', 
    label: 'Loan Balance', 
    type: 'number',
    format: 'currency',
    required: false,
    section: 'New Mortgage Information',
    hint: 'Balance of your mortgage to refinance (auto-calculated when "Calculate Balance" is Yes)',
    disabled: (data) => {
      const calc = typeof data.calculateBalance === 'string' 
        ? data.calculateBalance === 'true' 
        : Boolean(data.calculateBalance);
      return calc;
    }
  },
  { 
    name: 'newInterestRate', 
    label: 'New Interest Rate', 
    type: 'number',
    format: 'percentage',
    step: 0.01, 
    required: true,
    section: 'New Mortgage Information',
    hint: 'Annual interest rate for the new loan' 
  },
  { 
    name: 'newTermYears', 
    label: 'New Term (Years)', 
    type: 'number',
    required: true,
    section: 'New Mortgage Information',
    hint: 'Number of years for your new loan' 
  },

  // Closing Costs
  { 
    name: 'loanOriginationRate', 
    label: 'Loan Origination Fee (%)', 
    type: 'number',
    format: 'percentage',
    step: 0.1, 
    section: 'Closing Costs',
    hint: 'Typical origination fee is around 1%' 
  },
  { 
    name: 'pointsPaid', 
    label: 'Points Paid', 
    type: 'number',
    step: 0.125,
    section: 'Closing Costs',
    hint: 'Each point = 1% of loan' 
  },
  { 
    name: 'otherClosingCosts', 
    label: 'Other Closing Costs', 
    type: 'number',
    format: 'currency',
    section: 'Closing Costs',
    hint: 'Filing fees, appraisal, misc costs' 
  },

  // PMI Options
  { 
    name: 'includePMI', 
    label: 'PMI Settings', 
    type: 'select',
    options: [
      { value: 'true', label: 'Include PMI if less than 20% equity (default)' },
      { value: 'false', label: 'Do NOT include PMI (Freddie/Fannie refinance exception)' }
    ],
    section: 'PMI Options',
    hint: 'PMI (0.5% annually) is normally required if less than 20% equity. Select "Do NOT include" only if refinancing a Freddie Mac/Fannie Mae loan that doesn\'t currently require PMI.' 
  },
];

// ===========================
// RESULTS CONFIGURATION
// ===========================

export const results = [
  { 
    key: 'currentPayment', 
    label: 'Current Monthly Payment (P&I + PMI)', 
    format: 'currency',
    description: 'Current principal, interest, and PMI payment'
  },
  { 
    key: 'newPayment', 
    label: 'New Monthly Payment (P&I + PMI)', 
    format: 'currency',
    description: 'New principal, interest, and PMI payment after refinancing'
  },
  { 
    key: 'monthlyPaymentSavings', 
    label: 'Monthly Payment Savings', 
    format: 'currency',
    description: 'How much less (or more) you pay each month'
  },
  { 
    key: 'totalClosingCosts', 
    label: 'Total Closing Costs', 
    format: 'currency',
    description: 'All upfront costs to refinance'
  },
  { 
    key: 'breakEvenMonthlyPayment', 
    label: 'Break Even - Monthly Payment Savings', 
    format: 'text',
    description: 'Months until monthly payment reduction exceeds closing costs'
  },
  { 
    key: 'breakEvenInterestPMI', 
    label: 'Break Even - Interest & PMI Savings', 
    format: 'text',
    description: 'Months until interest and PMI savings exceed closing costs'
  },
  { 
    key: 'breakEvenAfterTax', 
    label: 'Break Even - After-Tax Total Savings', 
    format: 'text',
    description: 'Months until after-tax savings exceed closing costs'
  },
  { 
    key: 'breakEvenVsPrepayment', 
    label: 'Break Even - Savings vs. Prepayment', 
    format: 'text',
    description: 'Most conservative: months until savings exceed costs and prepayment opportunity cost'
  },
];

// ===========================
// CALCULATION FUNCTION
// ===========================

const calculate = (data) => {
  const currentRate = data.currentInterestRate / 100;
  const currentMonthlyRate = currentRate / 12;
  const newRate = data.newInterestRate / 100;
  const newMonthlyRate = newRate / 12;
  const taxRate = data.incomeTaxRate / 100;

  const calculateBalance = typeof data.calculateBalance === 'string' 
    ? data.calculateBalance === 'true' 
    : Boolean(data.calculateBalance);
  
  const includePMI = typeof data.includePMI === 'string' 
    ? data.includePMI === 'true' 
    : Boolean(data.includePMI);

  // Calculate loan balance
  let loanBalance;
  if (calculateBalance) {
    const totalMonths = data.currentTermYears * 12;
    const monthsPaid = totalMonths - (data.yearsRemaining * 12);
    
    if (monthsPaid >= 0 && monthsPaid <= totalMonths) {
      loanBalance = calculateRemainingBalance(
        data.originalMortgageAmount,
        currentMonthlyRate,
        totalMonths,
        monthsPaid
      );
    } else if (monthsPaid > totalMonths) {
      loanBalance = 0;
    } else {
      loanBalance = data.originalMortgageAmount;
    }
  } else {
    loanBalance = data.loanBalance;
  }

  // Calculate closing costs
  const originationFee = loanBalance * (data.loanOriginationRate / 100);
  const pointsCost = loanBalance * (data.pointsPaid / 100);
  const totalClosingCosts = originationFee + pointsCost + data.otherClosingCosts;

  // Current mortgage calculations
  const currentRemainingMonths = data.yearsRemaining * 12;
  let currentPIPayment = 0;
  if (currentRemainingMonths > 0 && loanBalance > 0) {
    currentPIPayment = calculateMonthlyPayment(loanBalance, currentMonthlyRate, currentRemainingMonths);
  }

  const currentEquityPercent = ((data.currentAppraisedValue - loanBalance) / data.currentAppraisedValue) * 100;
  const currentPMI = (includePMI && currentEquityPercent < 20) 
    ? (loanBalance * 0.005) / 12 
    : 0;
  
  const currentPayment = currentPIPayment + currentPMI;

  // New mortgage calculations
  const newTermMonths = data.newTermYears * 12;
  const newPIPayment = calculateMonthlyPayment(loanBalance, newMonthlyRate, newTermMonths);

  const newEquityPercent = currentEquityPercent;
  const newPMI = (includePMI && newEquityPercent < 20) 
    ? (loanBalance * 0.005) / 12 
    : 0;
  
  const newPayment = newPIPayment + newPMI;
  const monthlyPaymentSavings = currentPayment - newPayment;

  // Amortization simulation for break-even calculations
  let currentBalance = loanBalance;
  let newBalance = loanBalance;
  let prepayBalance = Math.max(0, loanBalance - totalClosingCosts);
  
  let totalCurrentInterest = 0;
  let totalCurrentPMI = 0;
  let totalNewInterest = 0;
  let totalNewPMI = 0;
  let totalPrepayInterest = 0;
  let cumulativePaymentSavings = 0;
  
  let breakEvenMonthlyPayment = null;
  let breakEvenInterestPMI = null;
  let breakEvenAfterTax = null;
  let breakEvenVsPrepayment = null;

  const maxMonths = Math.max(currentRemainingMonths, newTermMonths, 600);

  for (let month = 1; month <= maxMonths; month++) {
    // Simulate current loan
    if (month <= currentRemainingMonths && currentBalance > 0.01) {
      const interest = currentBalance * currentMonthlyRate;
      totalCurrentInterest += interest;
      
      const equity = ((data.currentAppraisedValue - currentBalance) / data.currentAppraisedValue) * 100;
      if (includePMI && equity < 20) {
        totalCurrentPMI += (currentBalance * 0.005) / 12;
      }
      
      const principal = currentPIPayment - interest;
      currentBalance = Math.max(0, currentBalance - principal);
    }

    // Simulate new loan
    if (month <= newTermMonths && newBalance > 0.01) {
      const interest = newBalance * newMonthlyRate;
      totalNewInterest += interest;
      
      const equity = ((data.currentAppraisedValue - newBalance) / data.currentAppraisedValue) * 100;
      if (includePMI && equity < 20) {
        totalNewPMI += (newBalance * 0.005) / 12;
      }
      
      const principal = newPIPayment - interest;
      newBalance = Math.max(0, newBalance - principal);
    }

    // Simulate prepayment alternative
    if (month <= currentRemainingMonths && prepayBalance > 0.01) {
      const interest = prepayBalance * currentMonthlyRate;
      totalPrepayInterest += interest;
      const principal = currentPIPayment - interest;
      prepayBalance = Math.max(0, prepayBalance - principal);
    }

    // Calculate cumulative savings
    cumulativePaymentSavings += monthlyPaymentSavings;

    // Break-even #1: Monthly payment savings
    if (breakEvenMonthlyPayment === null && cumulativePaymentSavings >= totalClosingCosts) {
      breakEvenMonthlyPayment = month;
    }

    // Break-even #2: Interest + PMI savings
    const interestPMISavings = (totalCurrentInterest + totalCurrentPMI) - 
                                (totalNewInterest + totalNewPMI);
    if (breakEvenInterestPMI === null && interestPMISavings >= totalClosingCosts) {
      breakEvenInterestPMI = month;
    }

    // Break-even #3: After-tax savings
    const currentAfterTaxCost = totalCurrentInterest * (1 - taxRate) + totalCurrentPMI;
    const newAfterTaxCost = totalNewInterest * (1 - taxRate) + totalNewPMI;
    const afterTaxSavings = currentAfterTaxCost - newAfterTaxCost;
    
    if (breakEvenAfterTax === null && afterTaxSavings >= totalClosingCosts) {
      breakEvenAfterTax = month;
    }

    // Break-even #4: Most conservative - vs prepayment
    const prepayAfterTaxCost = totalPrepayInterest * (1 - taxRate);
    const interestSavedByPrepaying = currentAfterTaxCost - prepayAfterTaxCost;
    const netAdvantage = afterTaxSavings - interestSavedByPrepaying;
    
    if (breakEvenVsPrepayment === null && netAdvantage >= 0) {
      breakEvenVsPrepayment = month;
    }
  }

  // Format break-even results
  const formatBreakEven = (months) => {
    if (months === null) return 'Never';
    return months;
  };

  // Generate balance over time data for chart
  const balanceOverTime = [];
  let chartCurrentBalance = loanBalance;
  let chartNewBalance = loanBalance;
  let totalCurrentPayments = 0;
  let totalNewPayments = 0;
  
  const maxYears = Math.max(
    Math.ceil(currentRemainingMonths / 12),
    Math.ceil(newTermMonths / 12)
  );
  
  for (let year = 0; year <= maxYears; year++) {
    const dataPoint = { year };
    
    if (year === 0) {
      dataPoint.currentBalance = loanBalance;
      dataPoint.newBalance = loanBalance;
    } else {
      const monthsIntoLoan = year * 12;
      
      // Calculate current loan balance
      if (monthsIntoLoan <= currentRemainingMonths && chartCurrentBalance > 0.01) {
        for (let m = 0; m < 12 && monthsIntoLoan - 12 + m + 1 <= currentRemainingMonths; m++) {
          const interest = chartCurrentBalance * currentMonthlyRate;
          const principal = currentPIPayment - interest;
          chartCurrentBalance = Math.max(0, chartCurrentBalance - principal);
          totalCurrentPayments += currentPayment;
        }
        dataPoint.currentBalance = chartCurrentBalance;
      } else {
        dataPoint.currentBalance = 0;
      }
      
      // Calculate new loan balance
      if (monthsIntoLoan <= newTermMonths && chartNewBalance > 0.01) {
        for (let m = 0; m < 12 && monthsIntoLoan - 12 + m + 1 <= newTermMonths; m++) {
          const interest = chartNewBalance * newMonthlyRate;
          const principal = newPIPayment - interest;
          chartNewBalance = Math.max(0, chartNewBalance - principal);
          totalNewPayments += newPayment;
        }
        dataPoint.newBalance = chartNewBalance;
      } else {
        dataPoint.newBalance = 0;
      }
    }
    
    balanceOverTime.push(dataPoint);
  }

  return {
    // Basic metrics
    loanBalance: roundCurrency(loanBalance),
    currentEquityPercent: roundCurrency(currentEquityPercent),
    newEquityPercent: roundCurrency(newEquityPercent),
    
    // Current loan
    currentPIPayment: roundCurrency(currentPIPayment),
    currentPMI: roundCurrency(currentPMI),
    currentPayment: roundCurrency(currentPayment),
    
    // New loan
    newPIPayment: roundCurrency(newPIPayment),
    newPMI: roundCurrency(newPMI),
    newPayment: roundCurrency(newPayment),
    
    // Savings
    monthlyPaymentSavings: roundCurrency(monthlyPaymentSavings),
    
    // Closing costs
    originationFee: roundCurrency(originationFee),
    pointsCost: roundCurrency(pointsCost),
    totalClosingCosts: roundCurrency(totalClosingCosts),
    
    // Break-even analysis
    breakEvenMonthlyPayment: formatBreakEven(breakEvenMonthlyPayment),
    breakEvenInterestPMI: formatBreakEven(breakEvenInterestPMI),
    breakEvenAfterTax: formatBreakEven(breakEvenAfterTax),
    breakEvenVsPrepayment: formatBreakEven(breakEvenVsPrepayment),
    
    // Chart data
    balanceOverTime,
    totalCurrentPayments: roundCurrency(totalCurrentPayments),
    totalNewPayments: roundCurrency(totalNewPayments),
    
    // Recommendation
    recommendation: breakEvenVsPrepayment !== null && breakEvenVsPrepayment < 60 
      ? 'Refinancing appears beneficial' 
      : breakEvenVsPrepayment !== null && breakEvenVsPrepayment < 120 
        ? 'Refinancing may be beneficial if you plan to stay long-term'
        : 'Refinancing may not be worthwhile',

    // Detailed breakdowns
    breakdown: [
      { label: 'Loan Balance', value: roundCurrency(loanBalance), format: 'currency' },
      { label: 'Current Home Value', value: data.currentAppraisedValue, format: 'currency' },
      { label: 'Current Equity', value: roundCurrency(currentEquityPercent), format: 'percentage' },
      { label: 'Total Closing Costs', value: roundCurrency(totalClosingCosts), format: 'currency' },
    ],

    currentLoanBreakdown: [
      { label: 'Monthly P&I Payment', value: roundCurrency(currentPIPayment), format: 'currency' },
      { label: 'Monthly PMI', value: roundCurrency(currentPMI), format: 'currency' },
      { label: 'Total Monthly Payment', value: roundCurrency(currentPayment), format: 'currency' },
      { label: 'Years Remaining', value: data.yearsRemaining, format: 'number' },
    ],

    newLoanBreakdown: [
      { label: 'Monthly P&I Payment', value: roundCurrency(newPIPayment), format: 'currency' },
      { label: 'Monthly PMI', value: roundCurrency(newPMI), format: 'currency' },
      { label: 'Total Monthly Payment', value: roundCurrency(newPayment), format: 'currency' },
      { label: 'New Loan Term', value: data.newTermYears, format: 'number' },
    ],

    closingCostsBreakdown: [
      { label: 'Loan Origination Fee', value: roundCurrency(originationFee), format: 'currency' },
      { label: 'Points Cost', value: roundCurrency(pointsCost), format: 'currency' },
      { label: 'Other Closing Costs', value: data.otherClosingCosts, format: 'currency' },
      { label: 'Total Closing Costs', value: roundCurrency(totalClosingCosts), format: 'currency' },
    ],

    breakEvenBreakdown: [
      { 
        label: 'Monthly Payment Savings', 
        value: typeof breakEvenMonthlyPayment === 'number' ? `${breakEvenMonthlyPayment} months` : breakEvenMonthlyPayment, 
        format: 'text' 
      },
      { 
        label: 'Interest & PMI Savings', 
        value: typeof breakEvenInterestPMI === 'number' ? `${breakEvenInterestPMI} months` : breakEvenInterestPMI, 
        format: 'text' 
      },
      { 
        label: 'After-Tax Total Savings', 
        value: typeof breakEvenAfterTax === 'number' ? `${breakEvenAfterTax} months` : breakEvenAfterTax, 
        format: 'text' 
      },
      { 
        label: 'Savings vs. Prepayment', 
        value: typeof breakEvenVsPrepayment === 'number' ? `${breakEvenVsPrepayment} months` : breakEvenVsPrepayment, 
        format: 'text' 
      },
    ],

    notes: [
      `Monthly payment will ${monthlyPaymentSavings >= 0 ? 'decrease' : 'increase'} by ${formatCurrency(Math.abs(monthlyPaymentSavings))}`,
      `Loan balance: ${formatCurrency(loanBalance)} (${currentEquityPercent.toFixed(1)}% equity)`,
      `Current: ${data.yearsRemaining} years at ${data.currentInterestRate}%`,
      `New: ${data.newTermYears} years at ${data.newInterestRate}%`,
      includePMI ? `PMI included in calculations (${currentEquityPercent.toFixed(1)}% equity)` : 'PMI excluded from calculations',
      typeof breakEvenVsPrepayment === 'number' 
        ? `Most conservative break-even: ${breakEvenVsPrepayment} months`
        : 'Refinancing never breaks even under conservative analysis',
    ],
  };
};

// ===========================
// CHART CONFIGURATION
// ===========================

const charts = [
  {
    title: 'Remaining Balance Over Time',
    type: 'line',
    height: 400,
    xKey: 'year',
    format: 'currency',
    showLegend: true,
    data: (results) => results.balanceOverTime || [],
    lines: [
      { key: 'currentBalance', name: 'Current', color: '#1E40AF' },
      { key: 'newBalance', name: 'New', color: '#16A34A' }
    ],
    description: (results) => `Total Remaining Payments: Current ${formatCurrency(results.totalCurrentPayments || 0)}, New ${formatCurrency(results.totalNewPayments || 0)}`
  },
  {
    title: 'Monthly Payment Comparison',
    type: 'bar',
    height: 350,
    xKey: 'loan',
    format: 'currency',
    showLegend: true,
    data: (results) => [
      { 
        loan: 'Current', 
        'P&I': results.currentPIPayment,
        'PMI': results.currentPMI,
      },
      { 
        loan: 'New', 
        'P&I': results.newPIPayment,
        'PMI': results.newPMI,
      },
    ],
    bars: [
      { key: 'P&I', name: 'Principal & Interest', color: '#3B82F6' },
      { key: 'PMI', name: 'PMI', color: '#F59E0B' }
    ],
    description: 'Comparison of monthly payments'
  },
  {
    title: 'Break-Even Analysis (Months)',
    type: 'bar',
    height: 350,
    xKey: 'scenario',
    format: 'number',
    showLegend: false,
    data: (results) => {
      const getValue = (val) => {
        if (val === 'Never' || val === null) return 0;
        if (typeof val === 'string' && val.includes('months')) {
          return parseInt(val);
        }
        return val;
      };
      
      return [
        { 
          scenario: 'Payment Savings', 
          value: getValue(results.breakEvenMonthlyPayment),
        },
        { 
          scenario: 'Interest & PMI', 
          value: getValue(results.breakEvenInterestPMI),
        },
        { 
          scenario: 'After-Tax', 
          value: getValue(results.breakEvenAfterTax),
        },
        { 
          scenario: 'vs. Prepayment', 
          value: getValue(results.breakEvenVsPrepayment),
        },
      ];
    },
    bars: [
      { key: 'value', name: 'Months to Break Even', color: '#3B82F6' }
    ],
    description: 'Time to recover closing costs under different scenarios'
  },
  {
    title: 'Total Closing Costs',
    type: 'bar',
    height: 350,
    xKey: 'cost',
    format: 'currency',
    showLegend: false,
    data: (results) => [
      { 
        cost: 'Origination Fee', 
        value: results.originationFee,
      },
      { 
        cost: 'Points', 
        value: results.pointsCost,
      },
      { 
        cost: 'Other Costs', 
        value: results.closingCostsBreakdown[2].value,
      },
    ],
    bars: [
      { key: 'value', name: 'Amount', color: '#3B82F6' }
    ],
    description: 'Breakdown of closing costs'
  },
];

// ===========================
// MAIN CONFIG EXPORT
// ===========================

export const config = {
  title: 'Mortgage Refinance Calculator',
  description: 'Determine if refinancing your mortgage makes financial sense by comparing break-even points and savings',
  schema,
  defaultValues: defaults,
  inputs,
  results,
  calculate,
  charts,
};