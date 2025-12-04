import { schema } from './schema';
import { defaults } from './defaults';
import { inputs } from './inputs';
import { results } from './results';
import { singleLifeTable } from './singleLifeTable';
import { uniformLifeTable } from './uniformLifeTable';

export const config = {
  title: 'Beneficiary Required Minimum Distributions (RMD)',
  description: 'Calculate beneficiary RMDs using SECURE Act rules and IRS life expectancy tables',

  schema,
  defaultValues: defaults,
  inputs,
  results,

  calculate: (data) => {
    const parseDate = (dateStr) => {
      const d = new Date(dateStr + 'T00:00:00');
      return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
    };

    const ownerBirth = parseDate(data.ownerBirthdate);
    const ownerDeath = parseDate(data.ownerDeathDate);
    const benefBirth = parseDate(data.beneficiaryBirthdate);

    // Calculate owner's age at death
    let ownerAgeAtDeath = ownerDeath.year - ownerBirth.year;
    if (ownerDeath.month < ownerBirth.month ||
      (ownerDeath.month === ownerBirth.month && ownerDeath.day < ownerBirth.day)) {
      ownerAgeAtDeath--;
    }

    // Calculate beneficiary's age on Dec 31 of year following death
    // This is used for initial life expectancy lookup
    let benefAgeAtDec31YearAfterDeath = (ownerDeath.year + 1) - benefBirth.year;

    const getRBDAge = (year, month, day) => {
      // Born before July 1, 1949: RBD age is 70.5
      if (year < 1949 || (year === 1949 && month < 7)) return 70.5;
      // Born July 1, 1949 through Dec 31, 1950: RBD age is 72
      if (year < 1951) return 72;
      // Born Jan 1, 1951 through Dec 31, 1959: RBD age is 73
      if (year >= 1951 && year <= 1959) return 73;
      // Born Jan 1, 1960 or later: RBD age is 75
      return 75;
    };

    const ownerRBDAge = getRBDAge(ownerBirth.year, ownerBirth.month, ownerBirth.day);
    const ownerStartedRMDs = ownerAgeAtDeath >= ownerRBDAge;

    const isPreSecure = ownerDeath.year <= 2019;
    const benefYoungerByYears = ownerBirth.year - benefBirth.year;
    const isNotMoreThan10YearsYounger = benefYoungerByYears <= 10 && benefBirth.year <= ownerBirth.year;
    const isBenefOlderThanOwner = benefBirth.year < ownerBirth.year;

    const rate = data.rateOfReturn / 100;
    const yearsSinceDeath = data.yearOfRMD - (ownerDeath.year + 1);

    if (yearsSinceDeath < 0) {
      return {
        error: true,
        message: `RMD calculations begin in ${ownerDeath.year + 1}. Cannot calculate for ${data.yearOfRMD}.`
      };
    }

    let method = '';
    const notes = [];
    let divisor = 'N/A';
    let rmd = 0;

    // Current beneficiary age for the year being calculated
    let beneficiaryAge = benefAgeAtDec31YearAfterDeath + yearsSinceDeath;

    if (data.beneficiaryType === 'surviving-spouse') {
      method = 'Surviving Spouse - Treats Account as Own';
      notes.push('RMDs calculated using Uniform Lifetime Table');
      notes.push('Recalculates life expectancy each year');
      const spouseRBDAge = getRBDAge(benefBirth.year, benefBirth.month, benefBirth.day);
      if (beneficiaryAge < spouseRBDAge) {
        rmd = 0;
        divisor = 'N/A';
        notes.push(`No RMD required until age ${spouseRBDAge}`);
      } else {
        divisor = uniformLifeTable[Math.min(120, beneficiaryAge)] || 0;
        rmd = divisor > 0 ? data.accountBalance / divisor : data.accountBalance;
      }
    } else if (data.beneficiaryType === 'disabled-chronically-ill' ||
      (data.beneficiaryType === 'longest-timeframe' && (isPreSecure || isNotMoreThan10YearsYounger))) {

      method = data.beneficiaryType === 'disabled-chronically-ill'
        ? 'Disabled or Chronically Ill - Life Expectancy Method'
        : isPreSecure
          ? 'Pre-SECURE Act - Life Expectancy Method'
          : 'Life Expectancy Method - Not More Than 10 Years Younger';

      notes.push('Uses Single Life Expectancy Table');
      notes.push('Life expectancy looked up once in year following death, then reduced by 1 each year');

      // Always use age in the FIRST RMD year (year after death) for initial lookup
      let ageForInitialLookup = benefAgeAtDec31YearAfterDeath;

      // Special case: beneficiary older than owner AND owner had started RMDs
      // In this case, can use owner's age for the calculation
      if (isBenefOlderThanOwner && ownerStartedRMDs) {
        let ownerAgeAtDec31YearAfterDeath = (ownerDeath.year + 1) - ownerBirth.year;

        if (ownerAgeAtDec31YearAfterDeath < benefAgeAtDec31YearAfterDeath) {
          ageForInitialLookup = ownerAgeAtDec31YearAfterDeath;
          notes.push(`Using owner's life expectancy (age ${ageForInitialLookup} in first RMD year) for lower RMD`);
        }
      }

      // Look up the initial life expectancy value
      const initialDivisor = singleLifeTable[Math.min(120, ageForInitialLookup)] || 1;
      // Subtract 1 for each year that has passed since the first RMD year
      divisor = Math.max(1, initialDivisor - yearsSinceDeath);
      rmd = data.accountBalance / divisor;
    } else {
      // 10-Year Rule (SECURE Act)
      method = '10-Year Rule (SECURE Act)';
      notes.push('Account must be fully distributed by end of 10th year after death');

      if (yearsSinceDeath >= 10) {
        rmd = 0;
        divisor = 'N/A';
        notes.push('10-year distribution period has ended');
      } else if (yearsSinceDeath === 9) {
        // Year 10: Must withdraw entire balance
        rmd = data.accountBalance;
        divisor = 'N/A';
        notes.push('Final year - entire balance must be withdrawn');
      } else if (ownerStartedRMDs) {
        // Years 1-9: Annual RMDs required if owner had started RMDs
        const initialDivisor = singleLifeTable[Math.min(120, benefAgeAtDec31YearAfterDeath)] || 1;
        divisor = Math.max(1, initialDivisor - yearsSinceDeath);
        rmd = data.accountBalance / divisor;
        notes.push('Annual RMDs required (years 1-9) since owner had started RMDs');
      } else {
        // Years 1-9: No annual RMDs required if owner had not started RMDs
        rmd = 0;
        divisor = 'N/A';
        notes.push('No annual RMD required (owner had not started RMDs)');
      }
    }

    // Generate projection data for charts
    const projections = generateProjections(data, {
      ownerBirth,
      ownerDeath,
      benefBirth,
      ownerAgeAtDeath,
      benefAgeAtDec31YearAfterDeath,
      ownerStartedRMDs,
      isPreSecure,
      isNotMoreThan10YearsYounger,
      isBenefOlderThanOwner,
      getRBDAge
    });

    return {
      calculationMethod: method,
      yearOfRMD: data.yearOfRMD,
      beneficiaryName: data.beneficiaryName || 'N/A',
      ownerName: data.ownerName || 'N/A',
      accountName: data.accountName || 'N/A',
      beneficiaryAge,
      ownerAgeAtDeath,
      beneficiaryAgeAtDec31Next: benefAgeAtDec31YearAfterDeath,
      ownerHadStartedRMDs: ownerStartedRMDs ? 'Yes' : 'No',
      accountBalance: data.accountBalance,
      lifeExpectancyDivisor: typeof divisor === 'number' ? divisor.toFixed(1) : divisor,
      requiredMinimumDistribution: Math.round(rmd * 100) / 100,  // Round to 2 decimal places
      planType: data.planType.toUpperCase(),
      notes,
      projections
    };
  },

  charts: [
    {
      type: 'area',
      title: 'Account Balance Projection',
      xKey: 'year',
      format: 'currency',
      height: 350,
      areas: [
        { key: 'endingBalance', name: 'Account Balance', color: '#378CE7', opacity: 0.6 }
      ],
      data: (results) => results.projections || [],
      description: 'Projected account balance over time after RMDs and growth'
    },
    {
      type: 'bar',
      title: 'Annual Required Minimum Distributions',
      xKey: 'year',
      format: 'currency',
      height: 350,
      bars: [
        { key: 'rmd', name: 'RMD Amount', color: '#10b981' }
      ],
      data: (results) => results.projections || [],
      description: 'Required minimum distributions by year'
    },
    {
      type: 'line',
      title: 'Cumulative Distributions Over Time',
      xKey: 'year',
      format: 'currency',
      height: 350,
      lines: [
        { key: 'cumulativeRMD', name: 'Total Distributions', color: '#8b5cf6', width: 3 }
      ],
      data: (results) => results.projections || [],
      description: 'Running total of all distributions taken'
    },
    {
      type: 'line',
      title: 'Balance vs Annual RMDs',
      xKey: 'year',
      format: 'currency',
      height: 350,
      lines: [
        { key: 'endingBalance', name: 'Account Balance', color: '#378CE7', width: 2 },
        { key: 'rmd', name: 'Annual RMD', color: '#f59e0b', width: 2, dashed: true }
      ],
      data: (results) => results.projections || [],
      description: 'Comparison of account balance and required distributions'
    }
  ]
};

// Helper function to generate projection data
function generateProjections(data, context) {
  const {
    ownerBirth,
    ownerDeath,
    benefBirth,
    ownerAgeAtDeath,
    benefAgeAtDec31YearAfterDeath,
    ownerStartedRMDs,
    isPreSecure,
    isNotMoreThan10YearsYounger,
    isBenefOlderThanOwner,
    getRBDAge
  } = context;

  const rate = data.rateOfReturn / 100;
  const firstRMDYear = ownerDeath.year + 1;

  // Determine calculation method and max years
  let usesLifeExpectancy = false;
  let uses10YearRule = false;
  let usesSurvivingSpouse = false;
  let maxYears = 30;

  if (data.beneficiaryType === 'surviving-spouse') {
    usesSurvivingSpouse = true;
  } else if (data.beneficiaryType === 'disabled-chronically-ill' ||
    (data.beneficiaryType === 'longest-timeframe' && (isPreSecure || isNotMoreThan10YearsYounger))) {
    usesLifeExpectancy = true;
    // Project longer for life expectancy method
    maxYears = Math.min(50, singleLifeTable[benefAgeAtDec31YearAfterDeath] || 30);
  } else {
    uses10YearRule = true;
    maxYears = 10;
  }

  const projections = [];
  let balance = data.accountBalance;
  let cumulativeRMD = 0;

  for (let i = 0; i < maxYears; i++) {
    const year = firstRMDYear + i;
    const benefAge = benefAgeAtDec31YearAfterDeath + i;
    let rmd = 0;
    let divisor = 0;

    if (usesSurvivingSpouse) {
      const spouseRBDAge = getRBDAge(benefBirth.year, benefBirth.month, benefBirth.day);
      if (benefAge >= spouseRBDAge) {
        divisor = uniformLifeTable[Math.min(120, benefAge)] || 0;
        rmd = divisor > 0 ? balance / divisor : balance;
      }
    } else if (usesLifeExpectancy) {
      // Always use age in first RMD year for initial lookup
      let ageForInitialLookup = benefAgeAtDec31YearAfterDeath;

      if (isBenefOlderThanOwner && ownerStartedRMDs) {
        let ownerAgeAtDec31YearAfterDeath = (ownerDeath.year + 1) - ownerBirth.year;
        if (ownerAgeAtDec31YearAfterDeath < benefAgeAtDec31YearAfterDeath) {
          ageForInitialLookup = ownerAgeAtDec31YearAfterDeath;
        }
      }

      const initialDivisor = singleLifeTable[Math.min(120, ageForInitialLookup)] || 1;
      divisor = Math.max(1, initialDivisor - i);
      rmd = balance / divisor;
    } else if (uses10YearRule) {
      if (i === 9) {
        // Year 10: withdraw everything
        rmd = balance;
      } else if (ownerStartedRMDs) {
        // Years 1-9: annual RMDs required
        const initialDivisor = singleLifeTable[Math.min(120, benefAgeAtDec31YearAfterDeath)] || 1;
        divisor = Math.max(1, initialDivisor - i);
        rmd = balance / divisor;
      } else {
        // Years 1-9: no RMDs required
        rmd = 0;
      }
    }

    const startBalance = balance;

    // RMD is withdrawn first, then remaining balance grows
    balance -= rmd;
    if (balance < 0) balance = 0;

    // Growth occurs on post-RMD balance
    balance *= (1 + rate);

    cumulativeRMD += rmd;

    if (balance < 0.01) balance = 0;  // Handle rounding

    projections.push({
      year,
      age: benefAge,
      startingBalance: Math.round(startBalance * 100) / 100,
      rmd: Math.round(rmd * 100) / 100,
      endingBalance: Math.round(balance * 100) / 100,
      cumulativeRMD: Math.round(cumulativeRMD * 100) / 100,
      divisor: divisor > 0 ? divisor.toFixed(1) : 'N/A'
    });

    if (balance === 0) break;
  }

  return projections;
}