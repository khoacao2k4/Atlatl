export const results = [
  { 
    key: 'yearsUntilCollege', 
    label: 'Years Until College Starts', 
    format: 'number'
  },
  { 
    key: 'totalCollegeCost', 
    label: 'Total Future Cost of College', 
    format: 'currency',
    description: 'Total cost including inflation over all college years'
  },
  { 
    key: 'totalSavingsAtCollegeStart', 
    label: 'Total Savings at College Start', 
    format: 'currency',
    description: 'Expected savings balance when college begins'
  },
  { 
    key: 'shortfallOrSurplus', 
    label: 'Shortfall or Surplus', 
    format: 'currency',
    description: 'Negative = shortfall (need more), Positive = surplus (more than needed)'
  },
  { 
    key: 'percentageCovered', 
    label: 'Percentage of Costs Covered', 
    format: 'percentage',
    description: 'Percentage of total college costs covered by savings'
  },
  { 
    key: 'monthlyNeededToFullyFund', 
    label: 'Monthly Savings Needed to Fully Fund', 
    format: 'currency',
    description: 'Monthly contribution required to cover 100% of projected costs'
  },
];