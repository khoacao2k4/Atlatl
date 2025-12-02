export const inputs = [
  {
    name: 'currentAge',
    label: 'Current age',
    type: 'number',
    required: true,
    hint: 'Your current age'
  },
  {
    name: 'retirementAge',
    label: 'Age at retirement',
    type: 'number',
    required: true,
    hint: 'Age you wish to retire (last contribution at age retirement-1)'
  },
  {
    name: 'annualContribution',
    label: 'Annual contribution',
    type: 'number',
    format: 'currency',
    required: true,
    hint: 'Amount you contribute to your 401(k) each year (12 equal monthly contributions)'
  },
  {
    name: 'currentBalance',
    label: 'Current 401(k) balance',
    type: 'number',
    format: 'currency',
    required: true,
    hint: 'Your current 401(k) account balance'
  },
  {
    name: 'annualRateOfReturn',
    label: 'Expected rate of return',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    hint: 'Expected annual investment return (compounded monthly)'
  },
  {
    name: 'currentTaxRate',
    label: 'Current tax rate',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    hint: 'Your current marginal income tax rate'
  },
  {
    name: 'retirementTaxRate',
    label: 'Retirement tax rate',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    hint: 'Expected marginal tax rate at retirement'
  },
  {
    name: 'investTaxSavings',
    label: 'Invest traditional tax-savings',
    type: 'select',
    required: true,
    options: [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ],
    hint: 'Invest tax savings from Traditional contributions in a taxable account'
  },
  {
    name: 'maximizeContributions',
    label: 'Maximize contributions',
    type: 'select',
    required: true,
    options: [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ],
    hint: 'Increase contributions to maximum allowed ($23,500 base, $31,000 with catch-up at age 50+)'
  },
];