import { schema } from './schema';
import { defaults } from './defaults';
import { inputs } from './inputs';
import { results } from './results';

export const config = {
  title: 'Mortgage Refinance Calculator',
  description: 'Determine if refinancing your mortgage makes financial sense by comparing break-even points and savings',
  schema,
  defaultValues: defaults,
  inputs,
  results,

  calculate: (data) => {
    const currentRate = data.currentInterestRate / 100;
    const currentMonthlyRate = currentRate / 12;
    const newRate = data.newInterestRate / 100;
    const newMonthlyRate = newRate / 12;
    const taxRate = data.incomeTaxRate / 100;

    // Parse boolean values
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
      const remainingMonths = data.yearsRemaining * 12;
      
      if (remainingMonths > 0 && remainingMonths <= totalMonths) {
        const monthlyPayment = data.originalMortgageAmount * 
          (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, totalMonths)) / 
          (Math.pow(1 + currentMonthlyRate, totalMonths) - 1);
        
        loanBalance = monthlyPayment * 
          (Math.pow(1 + currentMonthlyRate, remainingMonths) - 1) /
          (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, remainingMonths));
      } else if (remainingMonths <= 0) {
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
      currentPIPayment = loanBalance * 
        (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, currentRemainingMonths)) / 
        (Math.pow(1 + currentMonthlyRate, currentRemainingMonths) - 1);
    }

    // PMI Logic: includePMI = true means "Include PMI", false means "Do NOT include PMI"
    const currentEquityPercent = ((data.currentAppraisedValue - loanBalance) / data.currentAppraisedValue) * 100;
    const shouldCalculatePMI = includePMI;
    
    const currentPMI = (shouldCalculatePMI && currentEquityPercent < 20) 
      ? (loanBalance * 0.005) / 12 
      : 0;
    
    const currentPayment = currentPIPayment + currentPMI;

    // New mortgage calculations
    const newTermMonths = data.newTermYears * 12;
    const newPIPayment = loanBalance * 
      (newMonthlyRate * Math.pow(1 + newMonthlyRate, newTermMonths)) / 
      (Math.pow(1 + newMonthlyRate, newTermMonths) - 1);

    const newEquityPercent = currentEquityPercent;
    const newPMI = (shouldCalculatePMI && newEquityPercent < 20) 
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
        if (shouldCalculatePMI && equity < 20) {
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
        if (shouldCalculatePMI && equity < 20) {
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
      loanBalance,
      currentEquityPercent,
      newEquityPercent,
      
      // Current loan
      currentPIPayment,
      currentPMI,
      currentPayment,
      
      // New loan
      newPIPayment,
      newPMI,
      newPayment,
      
      // Savings
      monthlyPaymentSavings,
      
      // Closing costs
      originationFee,
      pointsCost,
      totalClosingCosts,
      
      // Break-even analysis
      breakEvenMonthlyPayment: formatBreakEven(breakEvenMonthlyPayment),
      breakEvenInterestPMI: formatBreakEven(breakEvenInterestPMI),
      breakEvenAfterTax: formatBreakEven(breakEvenAfterTax),
      breakEvenVsPrepayment: formatBreakEven(breakEvenVsPrepayment),
      
      // Chart data
      balanceOverTime,
      totalCurrentPayments,
      totalNewPayments,
      
      // Recommendation
      recommendation: breakEvenVsPrepayment !== null && breakEvenVsPrepayment < 60 
        ? 'Refinancing appears beneficial' 
        : breakEvenVsPrepayment !== null && breakEvenVsPrepayment < 120 
          ? 'Refinancing may be beneficial if you plan to stay long-term'
          : 'Refinancing may not be worthwhile',

      // Detailed breakdowns
      breakdown: [
        { label: 'Loan Balance', value: loanBalance, format: 'currency' },
        { label: 'Current Home Value', value: data.currentAppraisedValue, format: 'currency' },
        { label: 'Current Equity', value: currentEquityPercent, format: 'percentage' },
        { label: 'Total Closing Costs', value: totalClosingCosts, format: 'currency' },
      ],

      currentLoanBreakdown: [
        { label: 'Monthly P&I Payment', value: currentPIPayment, format: 'currency' },
        { label: 'Monthly PMI', value: currentPMI, format: 'currency' },
        { label: 'Total Monthly Payment', value: currentPayment, format: 'currency' },
        { label: 'Years Remaining', value: data.yearsRemaining, format: 'number' },
      ],

      newLoanBreakdown: [
        { label: 'Monthly P&I Payment', value: newPIPayment, format: 'currency' },
        { label: 'Monthly PMI', value: newPMI, format: 'currency' },
        { label: 'Total Monthly Payment', value: newPayment, format: 'currency' },
        { label: 'New Loan Term', value: data.newTermYears, format: 'number' },
      ],

      closingCostsBreakdown: [
        { label: 'Loan Origination Fee', value: originationFee, format: 'currency' },
        { label: 'Points Cost', value: pointsCost, format: 'currency' },
        { label: 'Other Closing Costs', value: data.otherClosingCosts, format: 'currency' },
        { label: 'Total Closing Costs', value: totalClosingCosts, format: 'currency' },
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
        shouldCalculatePMI ? `PMI included in calculations (${currentEquityPercent.toFixed(1)}% equity)` : 'PMI excluded from calculations',
        typeof breakEvenVsPrepayment === 'number' 
          ? `Most conservative break-even: ${breakEvenVsPrepayment} months`
          : 'Refinancing never breaks even under conservative analysis',
      ],
    };
  },

  charts: [
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
  ]
};

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}