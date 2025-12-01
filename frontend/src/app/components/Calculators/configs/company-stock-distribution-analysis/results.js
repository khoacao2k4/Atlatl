export const results = [
  { 
    key: 'nua', 
    label: 'Net Unrealized Appreciation (NUA)', 
    format: 'currency'
  },
  { 
    key: 'betterStrategy', 
    label: 'Recommended Strategy', 
    format: 'text'
  },
  { 
    key: 'advantage', 
    label: 'NUA Strategy Advantage (Future Value)', 
    format: 'currency',
    description: 'How much more you would have with NUA vs IRA rollover'
  },
  { 
    key: 'advantagePercent', 
    label: 'Advantage %', 
    format: 'percentage'
  },
  { 
    key: 'pvAdvantage', 
    label: 'NUA Strategy Advantage (Present Value)', 
    format: 'currency',
    description: 'Advantage adjusted for inflation'
  },
  { 
    key: 'pvAdvantagePercent', 
    label: 'Advantage % (PV)', 
    format: 'percentage'
  },
];
