export const inputs = [
  { 
    name: 'balanceAtDistribution', 
    label: 'Balance at Time of Distribution (FMV)', 
    type: 'number',
    format: 'currency',
    required: true, 
    hint: 'Fair market value of company stock to be distributed' 
  },
  { 
    name: 'costBasis', 
    label: 'Total Stock Purchases (Cost Basis)', 
    type: 'number',
    format: 'currency',
    required: true, 
    hint: 'Total amount paid for the stock (you and/or employer contributions)' 
  },
  { 
    name: 'rateOfReturn', 
    label: 'Rate of Return', 
    type: 'number',
    format: 'percentage',
    step: 0.1, 
    hint: 'Expected annual return on company stock' 
  },
  { 
    name: 'holdingPeriodYears', 
    label: 'Holding Period (Years)', 
    type: 'number',
    required: true,
    hint: 'Years you expect to hold the stock after distribution' 
  },
  { 
    name: 'holdingPeriodMonths', 
    label: 'Holding Period (Additional Months)', 
    type: 'number',
    hint: 'Additional months beyond full years (0-11)' 
  },
  { 
    name: 'capitalGainsRate', 
    label: 'Capital Gains Tax Rate', 
    type: 'number',
    format: 'percentage',
    step: 0.1, 
    hint: 'Long-term capital gains tax rate (typically 0%, 15%, or 20%)' 
  },
  { 
    name: 'marginalTaxRate', 
    label: 'Marginal Income Tax Rate', 
    type: 'number',
    format: 'percentage',
    step: 0.1, 
    hint: 'Your ordinary income tax rate' 
  },
  { 
    name: 'inflationRate', 
    label: 'Expected Inflation Rate', 
    type: 'number',
    format: 'percentage',
    step: 0.1,
    hint: 'Long-term average inflation rate for present value calculations' 
  },
  { 
    name: 'currentAge', 
    label: 'Current Age', 
    type: 'number',
    required: true,
    hint: 'Your current age' 
  },
  { 
    name: 'separatedAtAge55', 
    label: 'Separated from Service at Age 55 or Older', 
    type: 'select',
    options: [
      { value: false, label: 'No' },
      { value: true, label: 'Yes' }
    ],
    hint: 'Check if you separated in/after the year you turned 55 (no 10% penalty)' 
  },
  { 
    name: 'retirementDistributionAfter59Half', 
    label: 'Retirement Plan Distribution at Age 59½ or Older', 
    type: 'select',
    options: [
      { value: false, label: 'No' },
      { value: true, label: 'Yes' }
    ],
    hint: 'Check if distribution occurs at/after age 59½ (no 10% penalty)' 
  },
  { 
    name: 'iraDistributionAfter59Half', 
    label: 'IRA Distribution at Age 59½ or Older', 
    type: 'select',
    options: [
      { value: false, label: 'No' },
      { value: true, label: 'Yes' }
    ],
    hint: 'Check if IRA distribution occurs at/after age 59½ (no 10% penalty)' 
  },
];
