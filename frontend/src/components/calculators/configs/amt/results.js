export const results = [
  {
    key: 'regularTax',
    label: 'Regular Federal Income Tax',
    format: 'currency',
    description: 'Your federal income tax under the regular tax system'
  },
  {
    key: 'amtTax',
    label: 'Alternative Minimum Tax (AMT)',
    format: 'currency',
    description: 'Your tax under the AMT system'
  },
  {
    key: 'additionalTaxOwed',
    label: 'Additional Tax You May Owe',
    format: 'currency',
    description: 'Additional tax from AMT (if AMT > Regular Tax)'
  },
  {
    key: 'totalTaxOwed',
    label: 'Total Federal Tax Owed',
    format: 'currency',
    description: 'The higher of Regular Tax or AMT'
  },
  {
    key: 'isoSpread',
    label: 'Total ISO Spread',
    format: 'currency',
    description: 'Bargain element from your ISO exercise'
  },
  {
    key: 'effectiveTaxRate',
    label: 'Effective Tax Rate',
    format: 'percentage',
    description: 'Total tax as percentage of income'
  },
];