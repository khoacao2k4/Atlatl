export const inputs = [
  // ------------------------------
  // Current Mortgage Information
  // ------------------------------
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
    // Generic trigger function that runs when this field changes
    onChangeTrigger: (formData, setValue, newValue) => {
      const shouldAutoCalc = newValue === 'true';
      
      if (shouldAutoCalc) {
        // Calculate loan balance
        const currentRate = (formData.currentInterestRate || 0) / 100;
        const currentMonthlyRate = currentRate / 12;
        const totalMonths = (formData.currentTermYears || 0) * 12;
        const remainingMonths = (formData.yearsRemaining || 0) * 12;
        
        if (remainingMonths > 0 && remainingMonths <= totalMonths && formData.originalMortgageAmount) {
          const monthlyPayment = formData.originalMortgageAmount * 
            (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, totalMonths)) / 
            (Math.pow(1 + currentMonthlyRate, totalMonths) - 1);
          
          const loanBalance = monthlyPayment * 
            (Math.pow(1 + currentMonthlyRate, remainingMonths) - 1) /
            (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, remainingMonths));
          
          setValue('loanBalance', Math.round(loanBalance));
        } else if (remainingMonths <= 0) {
          setValue('loanBalance', 0);
        } else if (formData.originalMortgageAmount) {
          setValue('loanBalance', formData.originalMortgageAmount);
        }
      }
    }
  },

  // ------------------------------
  // New Mortgage Information
  // ------------------------------
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
    // Disable when calculateBalance is 'true'
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

  // ------------------------------
  // Closing Costs
  // ------------------------------
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

  // ------------------------------
  // PMI Options
  // ------------------------------
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