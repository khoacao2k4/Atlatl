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