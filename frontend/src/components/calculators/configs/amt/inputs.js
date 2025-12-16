export const inputs = [
  // ------------------------------
  // Personal Information
  // ------------------------------
  {
    name: 'filingStatus',
    label: 'Filing Status',
    type: 'select',
    options: [
      { value: 'single', label: 'Single' },
      { value: 'married', label: 'Married Filing Jointly' },
      { value: 'marriedSeparate', label: 'Married Filing Separately' },
      { value: 'headOfHousehold', label: 'Head of Household' }
    ],
    required: true,
    section: 'Personal Information',
    hint: 'Your tax filing status'
  },
  {
    name: 'annualIncome',
    label: 'Annual Income (Wages)',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Personal Information',
    hint: 'Your total wages and salary for the year'
  },

  // ------------------------------
  // ISO Exercise Information
  // ------------------------------
  {
    name: 'sharesExercised',
    label: 'Number of ISO Shares Exercised',
    type: 'number',
    required: true,
    section: 'ISO Exercise Information',
    hint: 'Total ISO shares you exercised and held this year'
  },
  {
    name: 'strikePrice',
    label: 'Strike Price (per share)',
    type: 'number',
    format: 'currency',
    step: 0.01,
    required: true,
    section: 'ISO Exercise Information',
    hint: 'The exercise price you paid per share'
  },
  {
    name: 'fmv409a',
    label: '409A Fair Market Value (per share)',
    type: 'number',
    format: 'currency',
    step: 0.01,
    required: true,
    section: 'ISO Exercise Information',
    hint: 'Fair market value per share on exercise date'
  },

  // ------------------------------
  // Deductions
  // ------------------------------
  {
    name: 'standardDeduction',
    label: 'Use Standard Deduction',
    type: 'select',
    options: [
      { value: true, label: 'Yes - Use Standard Deduction' },
      { value: false, label: 'No - I will itemize deductions' }
    ],
    section: 'Deductions',
    hint: 'Most taxpayers use the standard deduction'
  },
  {
    name: 'itemizedDeductions',
    label: 'Total Itemized Deductions',
    type: 'number',
    format: 'currency',
    section: 'Deductions',
    hint: 'Your total itemized deductions (excluding SALT)',
    disabled: (data) => {
      const useStandard = typeof data.standardDeduction === 'string'
        ? data.standardDeduction === 'true'
        : Boolean(data.standardDeduction);
      return useStandard;
    }
  },
  {
    name: 'saltDeduction',
    label: 'SALT Deduction (State and Local Taxes)',
    type: 'number',
    format: 'currency',
    section: 'Deductions',
    hint: 'State and local tax deduction (capped at $10,000)'
  },

  // ------------------------------
  // Other Income
  // ------------------------------
  {
    name: 'capitalGainsLongTerm',
    label: 'Long-Term Capital Gains',
    type: 'number',
    format: 'currency',
    section: 'Other Income',
    hint: 'Capital gains from assets held over 1 year'
  },
  {
    name: 'capitalGainsShortTerm',
    label: 'Short-Term Capital Gains',
    type: 'number',
    format: 'currency',
    section: 'Other Income',
    hint: 'Capital gains from assets held 1 year or less'
  },
];