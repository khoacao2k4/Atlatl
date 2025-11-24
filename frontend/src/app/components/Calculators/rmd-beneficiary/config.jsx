import { z } from 'zod';

const singleLife = {
  0: 95.5, 1:94.6,2:93.7,3:92.8,4:91.9,5:91.0,6:90.1,7:89.2,8:88.3,9:87.4,
  10:86.5,11:85.6,12:84.7,13:83.8,14:82.9,15:82.0,16:81.1,17:80.2,18:79.3,19:78.4,
  20:77.5,21:76.6,22:75.7,23:74.8,24:73.9,25:73.0,26:72.1,27:71.2,28:70.3,29:69.4,
  30:68.5,31:67.6,32:66.7,33:65.8,34:64.9,35:64.0,36:63.1,37:62.2,38:61.3,39:60.4,
  40:59.5,41:58.6,42:57.7,43:56.8,44:55.9,45:55.0,46:54.1,47:53.2,48:52.3,49:51.4,
  50:50.5,51:49.6,52:48.7,53:47.8,54:46.9,55:46.0,56:45.1,57:44.2,58:43.3,59:42.4,
  60:41.5,61:40.6,62:39.7,63:38.8,64:37.9,65:37.0,66:36.1,67:35.2,68:34.3,69:33.4,
  70:32.5,71:31.6,72:30.7,73:29.8,74:28.9,75:28.0,76:27.1,77:26.2,78:25.3,79:24.4,
  80:23.5,81:22.6,82:21.7,83:20.8,84:19.9,85:19.0,86:18.1,87:17.2,88:16.3,89:15.4,
  90:14.5,91:13.6,92:12.7,93:11.8,94:10.9,95:10.0,96:9.1,97:8.2,98:7.3,99:6.4,100:5.5,
  101:5.5,102:5.5,103:5.5,104:5.5,105:5.5,106:5.5,107:5.5,108:5.5,109:5.5,110:5.5,
  111:5.5,112:5.5,113:5.5,114:5.5,115:5.5,116:5.5,117:5.5,118:5.5,119:5.5,120:5.5
};

const uniformLife = {
  0: 85.6,1:84.7,2:83.8,3:82.9,4:82.0,5:81.1,6:80.2,7:79.3,8:78.4,9:77.5,
  10:76.6,11:75.7,12:74.8,13:73.9,14:73.0,15:72.1,16:71.2,17:70.3,18:69.4,19:68.5,
  20:67.6,21:66.7,22:65.8,23:64.9,24:64.0,25:63.1,26:62.2,27:61.3,28:60.4,29:59.5,
  30:58.6,31:57.7,32:56.8,33:55.9,34:55.0,35:54.1,36:53.2,37:52.3,38:51.4,39:50.5,
  40:49.6,41:48.7,42:47.8,43:46.9,44:46.0,45:45.1,46:44.2,47:43.3,48:42.4,49:41.5,
  50:40.6,51:39.7,52:38.8,53:37.9,54:37.0,55:36.1,56:35.2,57:34.3,58:33.4,59:32.5,
  60:31.6,61:30.7,62:29.8,63:28.9,64:28.0,65:27.1,66:26.2,67:25.3,68:24.4,69:23.5,
  70:22.6,71:21.7,72:20.8,73:19.9,74:19.0,75:18.1,76:17.2,77:16.3,78:15.4,79:14.5,
  80:13.6,81:12.7,82:11.8,83:10.9,84:10.0,85:9.1,86:8.2,87:7.3,88:6.4,89:5.5,90:4.6,
  91:4.6,92:4.6,93:4.6,94:4.6,95:4.6,96:4.6,97:4.6,98:4.6,99:4.6,100:4.6,
  101:4.6,102:4.6,103:4.6,104:4.6,105:4.6,106:4.6,107:4.6,108:4.6,109:4.6,110:4.6,
  111:4.6,112:4.6,113:4.6,114:4.6,115:4.6,116:4.6,117:4.6,118:4.6,119:4.6,120:4.6
};

export const config = {
  title: 'Beneficiary Required Minimum Distributions (RMD) - Advanced',
  description: 'Calculates beneficiary RMDs using SECURE Act rules and life expectancy tables',
  schema: z.object({
    amountSubjectToRmd: z.number().min(0),
    ownerBirthdate: z.string(),
    ownerDeathDate: z.string(),
    beneficiaryBirthdate: z.string(),
    beneficiaryName: z.string().optional(),
    ownerName: z.string().optional(),
    accountName: z.string().optional(),
    beneficiaryType: z.enum(['non-spouse-longest','10-year-rule','surviving-spouse','eligible-designated','child-under-21']),
    planType: z.enum(['ira','qualified-plan']),
    hypotheticalReturn: z.number().min(-100).max(200),
    yearToCalculate: z.number().min(1900).max(2100),
    projectYears: z.number().min(1).max(50),
  }),
  defaultValues: {
    amountSubjectToRmd: 500000,
    ownerBirthdate: '1950-06-15',
    ownerDeathDate: '2024-03-20',
    beneficiaryBirthdate: '1985-09-10',
    beneficiaryName: '',
    ownerName: '',
    accountName: '',
    beneficiaryType: 'eligible-designated',
    planType: 'ira',
    hypotheticalReturn: 6,
    yearToCalculate: new Date().getFullYear(),
    projectYears: 25
  },
  inputs: [
    { name: 'amountSubjectToRmd', label: 'Amount Subject to RMD', type: 'number', required: true, helpText: 'Balance as of December 31st of the previous year' },
    { name: 'ownerBirthdate', label: "Original Owner's Birthdate", type: 'date', required: true },
    { name: 'ownerDeathDate', label: "Date of Owner's Death", type: 'date', required: true },
    { name: 'beneficiaryBirthdate', label: "Beneficiary's Birthdate", type: 'date', required: true },
    { name: 'beneficiaryName', label: "Beneficiary's Name (optional)", type: 'text' },
    { name: 'ownerName', label: "Owner's Name (optional)", type: 'text' },
    { name: 'accountName', label: 'Account Name (optional)', type: 'text' },
    { name: 'beneficiaryType', label: 'Beneficiary Type', type: 'select', options: [
      { value: 'non-spouse-longest', label: 'Non-spouse choosing longest distribution time-frame' },
      { value: '10-year-rule', label: 'Person choosing 10-year RMD rule (if available)' },
      { value: 'surviving-spouse', label: 'Surviving spouse' },
      { value: 'eligible-designated', label: 'Disabled or chronically ill person' },
      { value: 'child-under-21', label: "Account owner's child (under 21)" }
    ]},
    { name: 'planType', label: 'Plan Type', type: 'select', options: [
      { value: 'ira', label: 'IRA' }, 
      { value: 'qualified-plan', label: 'Qualified Plan (401k, 403b, etc.)' }
    ]},
    { name: 'hypotheticalReturn', label: 'Hypothetical Rate of Return (%)', type: 'number', step: 0.1, helpText: 'Annual growth rate assumption' },
    { name: 'yearToCalculate', label: 'Year of RMD', type: 'number', helpText: 'Typically the current year' },
    { name: 'projectYears', label: 'Years to Project', type: 'number', helpText: 'Number of years to calculate' }
  ],
  calculate: (data) => {
    const parseYMD = (s) => {
      const d = new Date(s);
      return { year: d.getFullYear(), month: d.getMonth()+1, day: d.getDate() };
    };

    // Helper to determine owner's RMD required begin age based on birthdate
    const getOwnerRmdAge = (birthYear, birthMonth, birthDay) => {
      if (birthYear < 1949 || (birthYear === 1949 && birthMonth < 7)) {
        return 70.5; // Born before 7/1/1949
      } else if (birthYear < 1951 || (birthYear === 1949 && birthMonth >= 7) || (birthYear === 1950)) {
        return 72; // Born 7/1/1949 to 12/31/1950
      } else if (birthYear >= 1951 && birthYear <= 1959) {
        return 73; // Born 1/1/1951 to 12/31/1959
      } else {
        return 75; // Born 1/1/1960 or later
      }
    };

    const ownerDeath = parseYMD(data.ownerDeathDate);
    const ownerBirth = parseYMD(data.ownerBirthdate);
    const beneficiary = parseYMD(data.beneficiaryBirthdate);
    
    // Determine if death was pre or post SECURE Act
    const isPreSecure = ownerDeath.year <= 2019;
    
    // Calculate owner's age at death
    const ownerAgeAtDeath = ownerDeath.year - ownerBirth.year - 
      (ownerDeath.month < ownerBirth.month || 
       (ownerDeath.month === ownerBirth.month && ownerDeath.day < ownerBirth.day) ? 1 : 0);
    
    // Determine if owner had reached RMD required begin date
    const ownerRmdAge = getOwnerRmdAge(ownerBirth.year, ownerBirth.month, ownerBirth.day);
    const ownerHadStartedRmds = ownerAgeAtDeath >= ownerRmdAge;
    
    // Calculate beneficiary age at year following death
    const beneficiaryAgeAtDec31Next = (ownerDeath.year + 1) - beneficiary.year;
    
    // Calculate age difference
    const ageDifference = beneficiary.year - ownerBirth.year;
    const isWithin10Years = Math.abs(ageDifference) <= 10;
    
    const projectYears = data.projectYears;
    const rate = data.hypotheticalReturn / 100;
    let balance = data.amountSubjectToRmd;
    const rows = [];
    
    let calculationMethod = '';
    let notes = [];

    // Determine which calculation method to use based on beneficiary type and death date
    if (data.beneficiaryType === 'surviving-spouse') {
      calculationMethod = 'Surviving Spouse - Uniform Life Table';
      notes.push('Surviving spouse treats inherited account as their own');
      notes.push('Uses IRS Uniform Life Expectancy table, recalculated annually');
      
      // Calculate spouse's RMD age
      const spouseRmdAge = getOwnerRmdAge(beneficiary.year, beneficiary.month, beneficiary.day);
      
      for (let i = 0; i < projectYears; i++) {
        const age = beneficiaryAgeAtDec31Next + i;
        
        // Check if spouse has reached their RMD age
        if (age < spouseRmdAge) {
          balance = Math.round(balance * (1 + rate));
          rows.push({ 
            year: i + 1, 
            age, 
            divisor: 'N/A', 
            rmd: 0, 
            balance,
            note: 'Below RMD age' 
          });
        } else {
          const divisor = uniformLife[Math.max(0, Math.min(120, age))] || 4.6;
          const rmd = Math.round(balance / divisor);
          balance = Math.round((balance - rmd) * (1 + rate));
          rows.push({ year: i + 1, age, divisor: divisor.toFixed(1), rmd, balance });
        }
      }
    } else if (data.beneficiaryType === '10-year-rule') {
      if (isPreSecure) {
        calculationMethod = 'Pre-SECURE Act Rules (Non-spouse Life Expectancy)';
        notes.push('Death occurred before 1/1/2020 - using pre-SECURE Act rules');
        notes.push('Uses Single Life Expectancy table with reduction method');
        
        for (let i = 0; i < projectYears; i++) {
          const age = beneficiaryAgeAtDec31Next + i;
          const baseDivisor = singleLife[Math.max(0, Math.min(120, age))] || 5.5;
          const divisor = Math.max(1, baseDivisor - i);
          const rmd = Math.round(balance / divisor);
          balance = Math.round((balance - rmd) * (1 + rate));
          rows.push({ year: i + 1, age, divisor: divisor.toFixed(1), rmd, balance });
        }
      } else {
        calculationMethod = '10-Year Rule (SECURE Act)';
        
        if (ownerHadStartedRmds) {
          notes.push('Owner had begun RMDs - annual RMDs required for years 1-9');
          notes.push('All remaining funds must be withdrawn by end of year 10');
          
          // Calculate RMDs for years 1-9, then full withdrawal in year 10
          for (let i = 0; i < Math.min(projectYears, 10); i++) {
            const age = beneficiaryAgeAtDec31Next + i;
            
            if (i < 9) {
              // Years 1-9: Calculate RMD using life expectancy
              const baseDivisor = singleLife[Math.max(0, Math.min(120, age))] || 5.5;
              const divisor = Math.max(1, baseDivisor - i);
              const rmd = Math.round(balance / divisor);
              balance = Math.round((balance - rmd) * (1 + rate));
              rows.push({ year: i + 1, age, divisor: divisor.toFixed(1), rmd, balance });
            } else {
              // Year 10: Full withdrawal
              const rmd = balance;
              balance = 0;
              rows.push({ 
                year: i + 1, 
                age, 
                divisor: 'N/A', 
                rmd, 
                balance,
                note: 'Final withdrawal - 10 year rule' 
              });
            }
          }
        } else {
          notes.push('Owner had NOT begun RMDs - no annual RMDs required');
          notes.push('All funds must be withdrawn by end of year 10');
          
          // No annual RMDs, just account growth until year 10
          for (let i = 0; i < Math.min(projectYears, 10); i++) {
            const age = beneficiaryAgeAtDec31Next + i;
            
            if (i < 9) {
              // Years 1-9: No RMD required, just growth
              balance = Math.round(balance * (1 + rate));
              rows.push({ 
                year: i + 1, 
                age, 
                divisor: 'N/A', 
                rmd: 0, 
                balance,
                note: 'No RMD required' 
              });
            } else {
              // Year 10: Full withdrawal
              const rmd = balance;
              balance = 0;
              rows.push({ 
                year: i + 1, 
                age, 
                divisor: 'N/A', 
                rmd, 
                balance,
                note: 'Final withdrawal - 10 year rule' 
              });
            }
          }
        }
      }
    } else if (data.beneficiaryType === 'child-under-21') {
      calculationMethod = 'Child Under 21 (Eligible Designated Beneficiary)';
      notes.push('Life expectancy method until child reaches age 21');
      notes.push('10-year rule begins the year after child turns 21');
      
      const childTurns21Year = 21 - beneficiaryAgeAtDec31Next + 1;
      
      for (let i = 0; i < projectYears; i++) {
        const age = beneficiaryAgeAtDec31Next + i;
        
        if (i < childTurns21Year) {
          // Use life expectancy method while under 21
          const baseDivisor = singleLife[Math.max(0, Math.min(120, age))] || 5.5;
          const divisor = Math.max(1, baseDivisor - i);
          const rmd = Math.round(balance / divisor);
          balance = Math.round((balance - rmd) * (1 + rate));
          rows.push({ 
            year: i + 1, 
            age, 
            divisor: divisor.toFixed(1), 
            rmd, 
            balance,
            note: age < 21 ? 'Under age 21' : 'Turns 21 this year' 
          });
        } else {
          // After turning 21, 10-year rule applies
          const yearsInto10YearRule = i - childTurns21Year;
          
          if (yearsInto10YearRule < 10) {
            if (ownerHadStartedRmds && yearsInto10YearRule < 9) {
              // Calculate RMD for years 1-9 of 10-year rule
              const baseDivisor = singleLife[Math.max(0, Math.min(120, age))] || 5.5;
              const divisor = Math.max(1, baseDivisor - i);
              const rmd = Math.round(balance / divisor);
              balance = Math.round((balance - rmd) * (1 + rate));
              rows.push({ 
                year: i + 1, 
                age, 
                divisor: divisor.toFixed(1), 
                rmd, 
                balance,
                note: '10-year rule (year ' + (yearsInto10YearRule + 1) + ')' 
              });
            } else if (yearsInto10YearRule === 9) {
              // Year 10 of 10-year rule: full withdrawal
              const rmd = balance;
              balance = 0;
              rows.push({ 
                year: i + 1, 
                age, 
                divisor: 'N/A', 
                rmd, 
                balance,
                note: 'Final withdrawal - 10 year rule' 
              });
            } else {
              // No RMD required in years 1-9 if owner hadn't started RMDs
              balance = Math.round(balance * (1 + rate));
              rows.push({ 
                year: i + 1, 
                age, 
                divisor: 'N/A', 
                rmd: 0, 
                balance,
                note: '10-year rule (year ' + (yearsInto10YearRule + 1) + ') - No RMD' 
              });
            }
          }
        }
      }
    } else if (data.beneficiaryType === 'non-spouse-longest' || data.beneficiaryType === 'eligible-designated') {
      // Check if beneficiary qualifies for life expectancy method
      const qualifiesForLifeExpectancy = isPreSecure || isWithin10Years || 
                                         data.beneficiaryType === 'eligible-designated';
      
      if (qualifiesForLifeExpectancy) {
        if (data.beneficiaryType === 'eligible-designated') {
          calculationMethod = 'Eligible Designated Beneficiary (Life Expectancy Method)';
          notes.push('Disabled/chronically ill - uses life expectancy method');
        } else {
          calculationMethod = 'Non-Spouse Life Expectancy Method';
          if (isWithin10Years) {
            notes.push('Beneficiary within 10 years of owner age - qualifies for life expectancy method');
          }
          if (isPreSecure) {
            notes.push('Death occurred before 1/1/2020 - using pre-SECURE Act rules');
          }
        }
        notes.push('Uses Single Life Expectancy table with reduction method');
        
        // Check if owner was younger and had started RMDs
        const useOwnerAge = beneficiary.year < ownerBirth.year && ownerHadStartedRmds;
        
        if (useOwnerAge) {
          notes.push('Using owner age for calculation (owner was younger and had begun RMDs)');
          const ownerAgeAtDec31Next = (ownerDeath.year + 1) - ownerBirth.year;
          
          for (let i = 0; i < projectYears; i++) {
            const age = ownerAgeAtDec31Next + i;
            const baseDivisor = singleLife[Math.max(0, Math.min(120, age))] || 5.5;
            const divisor = Math.max(1, baseDivisor - i);
            const rmd = Math.round(balance / divisor);
            balance = Math.round((balance - rmd) * (1 + rate));
            rows.push({ 
              year: i + 1, 
              age: beneficiaryAgeAtDec31Next + i, 
              divisor: divisor.toFixed(1), 
              rmd, 
              balance,
              note: 'Using owner age ' + age 
            });
          }
        } else {
          for (let i = 0; i < projectYears; i++) {
            const age = beneficiaryAgeAtDec31Next + i;
            const baseDivisor = singleLife[Math.max(0, Math.min(120, age))] || 5.5;
            const divisor = Math.max(1, baseDivisor - i);
            const rmd = Math.round(balance / divisor);
            balance = Math.round((balance - rmd) * (1 + rate));
            rows.push({ year: i + 1, age, divisor: divisor.toFixed(1), rmd, balance });
          }
        }
      } else {
        // Falls under 10-year rule
        calculationMethod = '10-Year Rule (SECURE Act)';
        notes.push('Non-eligible designated beneficiary - 10-year rule applies');
        
        if (ownerHadStartedRmds) {
          notes.push('Owner had begun RMDs - annual RMDs required for years 1-9');
          
          for (let i = 0; i < Math.min(projectYears, 10); i++) {
            const age = beneficiaryAgeAtDec31Next + i;
            
            if (i < 9) {
              const baseDivisor = singleLife[Math.max(0, Math.min(120, age))] || 5.5;
              const divisor = Math.max(1, baseDivisor - i);
              const rmd = Math.round(balance / divisor);
              balance = Math.round((balance - rmd) * (1 + rate));
              rows.push({ year: i + 1, age, divisor: divisor.toFixed(1), rmd, balance });
            } else {
              const rmd = balance;
              balance = 0;
              rows.push({ 
                year: i + 1, 
                age, 
                divisor: 'N/A', 
                rmd, 
                balance,
                note: 'Final withdrawal' 
              });
            }
          }
        } else {
          notes.push('Owner had NOT begun RMDs - no annual RMDs required');
          
          for (let i = 0; i < Math.min(projectYears, 10); i++) {
            const age = beneficiaryAgeAtDec31Next + i;
            
            if (i < 9) {
              balance = Math.round(balance * (1 + rate));
              rows.push({ 
                year: i + 1, 
                age, 
                divisor: 'N/A', 
                rmd: 0, 
                balance,
                note: 'No RMD required' 
              });
            } else {
              const rmd = balance;
              balance = 0;
              rows.push({ 
                year: i + 1, 
                age, 
                divisor: 'N/A', 
                rmd, 
                balance,
                note: 'Final withdrawal' 
              });
            }
          }
        }
      }
    }
    
    return { 
      finalBalance: Math.round(balance), 
      yearlyData: rows,
      calculationMethod,
      notes,
      ownerAgeAtDeath,
      ownerHadStartedRmds,
      isPreSecure,
      beneficiaryAgeAtDec31Next
    };
  },
  results: [
    { key: 'calculationMethod', label: 'Calculation Method', format: 'text' },
    { key: 'finalBalance', label: 'Projected Ending Balance', format: 'currency' },
    { key: 'ownerAgeAtDeath', label: 'Owner Age at Death', format: 'number' },
    { key: 'beneficiaryAgeAtDec31Next', label: 'Beneficiary Age (Dec 31 following death)', format: 'number' }
  ],
  charts: [
    { 
      type: 'line', 
      title: 'Account Balance Projection', 
      data: (r) => r.yearlyData, 
      xKey: 'year', 
      lines: [{ key: 'balance', name: 'Balance', color: '#3b82f6' }], 
      height: 350 
    },
    { 
      type: 'bar', 
      title: 'Annual Required Minimum Distributions', 
      data: (r) => r.yearlyData, 
      xKey: 'year', 
      valueKey: 'rmd', 
      format: 'currency', 
      height: 350,
      color: '#10b981'
    }
  ]
};