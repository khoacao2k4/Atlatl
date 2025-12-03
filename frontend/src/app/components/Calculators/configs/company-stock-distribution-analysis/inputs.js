export const inputs = [
  // === Stock & Distribution Details ===
  { 
    name: 'balanceAtDistribution', 
    label: 'Balance at Time of Distribution (FMV)', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Stock Information',
    hint: 'Fair market value of company stock to be distributed' 
  },
  { 
    name: 'costBasis', 
    label: 'Total Stock Purchases (Cost Basis)', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Stock Information',
    hint: 'Total amount paid for the stock (you and/or employer contributions)' 
  },

  // === Investment Assumptions ===
  { 
    name: 'rateOfReturn', 
    label: 'Expected Annual Rate of Return', 
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Investment Assumptions',
    hint: 'Expected annual return on company stock after distribution' 
  },
  { 
    name: 'holdingPeriodYears', 
    label: 'Holding Period (Years)', 
    type: 'number',
    required: true,
    section: 'Investment Assumptions',
    hint: 'Years you expect to hold the stock after distribution' 
  },
  { 
    name: 'holdingPeriodMonths', 
    label: 'Holding Period (Additional Months)', 
    type: 'number',
    section: 'Investment Assumptions',
    hint: 'Additional months beyond full years (0-11)' 
  },
  { 
    name: 'inflationRate', 
    label: 'Expected Inflation Rate', 
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Investment Assumptions',
    hint: 'Long-term average inflation rate for present value calculations' 
  },

  // === Tax Rates ===
  { 
    name: 'marginalTaxRate', 
    label: 'Marginal Income Tax Rate', 
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Tax Information',
    hint: 'Your ordinary income tax rate (federal + state)' 
  },
  { 
    name: 'capitalGainsRate', 
    label: 'Long-Term Capital Gains Tax Rate', 
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Tax Information',
    hint: 'Long-term capital gains tax rate (typically 0%, 15%, or 20% federal)' 
  },

  // === Age & Penalty Information ===
  { 
    name: 'currentAge', 
    label: 'Current Age', 
    type: 'number',
    required: true,
    section: 'Penalty Considerations',
    hint: 'Your current age (used for informational purposes)' 
  },
  { 
    name: 'separatedAtAge55', 
    label: 'Separated from Service at Age 55 or Older?', 
    type: 'select',
    section: 'Penalty Considerations',
    options: [
      { value: false, label: 'No' },
      { value: true, label: 'Yes' }
    ],
    hint: 'If you separated in/after the year you turned 55, no 10% penalty on retirement plan distribution' 
  },
  { 
    name: 'retirementDistributionAfter59Half', 
    label: 'Retirement Plan Distribution at Age 59½+?', 
    type: 'select',
    section: 'Penalty Considerations',
    options: [
      { value: false, label: 'No' },
      { value: true, label: 'Yes' }
    ],
    hint: 'If distribution occurs at/after age 59½, no 10% penalty on cost basis' 
  },
  { 
    name: 'iraDistributionAfter59Half', 
    label: 'IRA Distribution at Age 59½+?', 
    type: 'select',
    section: 'Penalty Considerations',
    options: [
      { value: false, label: 'No' },
      { value: true, label: 'Yes' }
    ],
    hint: 'If IRA distribution occurs at/after age 59½, no 10% penalty on IRA rollover' 
  },
];