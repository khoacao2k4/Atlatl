export const inputs = [
  { name: 'yearOfRMD', label: 'Year of RMD', type: 'number', required: true, hint: 'The year to calculate the Required Minimum Distribution. This is typically the current year.' },
  { name: 'beneficiaryType', label: 'Beneficiary Type', type: 'select', required: true, options: [
      { value: 'longest-timeframe', label: 'Non-spouse choosing longest distribution time-frame' },
      { value: '10-year-rule', label: 'Person choosing 10-year RMD rule (if available)' },
      { value: 'surviving-spouse', label: 'Surviving spouse' },
      { value: 'disabled-chronically-ill', label: 'Disabled or chronically ill person' },
      { value: 'child-under-21', label: "Account owner's child" }
    ] 
  },
  { name: 'beneficiaryName', label: "Beneficiary's Name", type: 'text', hint: 'Enter the beneficiary\'s name if you would like it to appear on the report' },
  { name: 'ownerName', label: "Owner's Name", type: 'text', hint: 'Enter the account owner\'s name if you would like it to appear on the report' },
  { name: 'accountName', label: 'Name of Account', type: 'text', hint: 'Please enter the name of the account for this analysis' },
  { name: 'beneficiaryBirthdate', label: "Beneficiary's Birthdate", type: 'date', required: true, hint: 'Enter the beneficiary\'s birthdate. This is used for calculating life expectancy.' },
  { name: 'rateOfReturn', label: 'Hypothetical Rate of Return', type: 'number', format: 'percentage', step: 0.1, required: true, hint: 'Expected annual growth rate for future projections' },
  { name: 'accountBalance', label: 'Amount Subject to RMD', type: 'number', format: 'currency', required: true, hint: 'Fair market value as of December 31st of the previous year. For example, to determine the RMD for 2020 the account balance on 12/31/2019 would be used.' },
  { name: 'ownerDeathDate', label: "Date of the Original Account Owner's Death", type: 'date', required: true, hint: 'Please enter the date of the original account owner\'s death' },
  { name: 'planType', label: 'Plan Type', type: 'select', required: true, options: [
      { value: 'ira', label: 'IRA' },
      { value: '401k', label: '401(k)' },
      { value: '403b', label: '403(b)' },
      { value: 'other', label: 'Other Qualified Plan' }
    ], hint: 'The plan type can affect distributions if the account owner is younger than the beneficiary and RMDs have already begun' 
  },
  { name: 'ownerBirthdate', label: "Original Account Owner's Birthdate", type: 'date', required: true, hint: 'Please enter the original account owner\'s birthdate' }
];
