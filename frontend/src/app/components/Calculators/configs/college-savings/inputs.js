export const inputs = [
  // === Child's Information ===
  { 
    name: 'currentAge', 
    label: "Child's Current Age", 
    type: 'number',
    required: true,
    section: "Child's Information",
    hint: 'Current age of your child. The difference between their current age and college start age is the number of years you have to save.' 
  },
  { 
    name: 'ageStartCollege', 
    label: 'Age to Start College', 
    type: 'number',
    required: true,
    section: "Child's Information",
    hint: 'The age your child will begin college. Default is 18, but can be any age up to 25.' 
  },
  { 
    name: 'yearsInCollege', 
    label: 'Number of Years in College', 
    type: 'number',
    required: true,
    section: "Child's Information",
    hint: 'Expected number of years your child will attend college (typically 4 years for undergraduate)' 
  },

  // === College Costs ===
  { 
    name: 'annualTuition', 
    label: 'Annual Tuition (Current Cost)', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'College Costs',
    hint: 'Current estimated cost of one year of tuition and books. Average 2024-25: Public in-state $11,610, Public out-of-state $30,780, Private $43,350' 
  },
  { 
    name: 'roomAndBoard', 
    label: 'Annual Room & Board (Current Cost)', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'College Costs',
    hint: 'Current estimated cost of one-year room, board, and other expenses. Average 2024-25: Public $18,300, Private $19,640' 
  },
  { 
    name: 'educationInflation', 
    label: 'Education Cost Inflation Rate', 
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'College Costs',
    hint: 'Expected annual increase in college costs. Historical average: 4.8% over past 30 years, recent: ~3%' 
  },

  // === Savings Plan ===
  { 
    name: 'currentSavings', 
    label: 'Current Amount Saved', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Savings Plan',
    hint: 'Total amount you currently have saved for college education' 
  },
  { 
    name: 'monthlyContribution', 
    label: 'Monthly Contribution', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Savings Plan',
    hint: 'Dollar amount you plan to save per month. All amounts assumed to be added at the beginning of each month.' 
  },
  { 
    name: 'rateOfReturn', 
    label: 'Expected Annual Rate of Return', 
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Savings Plan',
    hint: 'Expected annual return on investments. S&P 500: 11.2% avg 1970-2024, 14.9% avg last 10 years. Savings accounts: much lower but safer.' 
  },
];