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

    let ownerAgeAtDeath = ownerDeath.year - ownerBirth.year;
    if (ownerDeath.month < ownerBirth.month || 
        (ownerDeath.month === ownerBirth.month && ownerDeath.day < ownerBirth.day)) {
      ownerAgeAtDeath--;
    }

    let benefAgeAtDec31YearAfterDeath = (ownerDeath.year + 1) - benefBirth.year;

    const getRBDAge = (year, month) => {
      if (year < 1949 || (year === 1949 && month < 7)) return 70.5;
      if (year === 1949 || year === 1950) return 72;
      if (year >= 1951 && year <= 1959) return 73;
      return 75;
    };

    const ownerRBDAge = getRBDAge(ownerBirth.year, ownerBirth.month);
    const ownerStartedRMDs = ownerAgeAtDeath >= ownerRBDAge;

    const isPreSecure = ownerDeath.year < 2020;
    const benefYoungerByYears = ownerBirth.year - benefBirth.year;
    const isNotMoreThan10YearsYounger = benefYoungerByYears <= 10;
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
    let beneficiaryAge = benefAgeAtDec31YearAfterDeath + yearsSinceDeath;

    if (data.beneficiaryType === 'surviving-spouse') {
      method = 'Surviving Spouse - Treats Account as Own';
      notes.push('RMDs calculated using Uniform Lifetime Table');
      const spouseRBDAge = getRBDAge(benefBirth.year, benefBirth.month);
      if (beneficiaryAge < spouseRBDAge) {
        rmd = 0;
        divisor = 'N/A';
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
      let ageForCalculation = benefAgeAtDec31YearAfterDeath;
      if (isBenefOlderThanOwner && ownerStartedRMDs) {
        const ownerAgeAtDec31 = (ownerDeath.year + 1) - ownerBirth.year;
        if (ownerAgeAtDec31 < benefAgeAtDec31YearAfterDeath) {
          ageForCalculation = ownerAgeAtDec31;
          notes.push('Using owner\'s age for RMD calculation');
        }
      }
      const initialDivisor = singleLifeTable[Math.min(120, ageForCalculation)] || 1;
      divisor = Math.max(1, initialDivisor - yearsSinceDeath);
      rmd = data.accountBalance / divisor;
    } else {
      method = '10-Year Rule (SECURE Act)';
      notes.push('Non-eligible designated beneficiary or explicitly chosen 10-year rule');

      if (yearsSinceDeath < 10) {
        if (ownerStartedRMDs && yearsSinceDeath < 9) {
          const initialDivisor = singleLifeTable[Math.min(120, benefAgeAtDec31YearAfterDeath)] || 1;
          divisor = Math.max(1, initialDivisor - yearsSinceDeath);
          rmd = data.accountBalance / divisor;
        } else if (!ownerStartedRMDs && yearsSinceDeath < 9) {
          rmd = 0;
          divisor = 'N/A';
        } else if (yearsSinceDeath === 9) {
          rmd = data.accountBalance;
          divisor = 'N/A';
        }
      } else {
        rmd = 0;
        divisor = 'N/A';
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
      requiredMinimumDistribution: Math.round(rmd),
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
      const spouseRBDAge = getRBDAge(benefBirth.year, benefBirth.month);
      if (benefAge >= spouseRBDAge) {
        divisor = uniformLifeTable[Math.min(120, benefAge)] || 0;
        rmd = divisor > 0 ? balance / divisor : balance;
      }
    } else if (usesLifeExpectancy) {
      let ageForCalculation = benefAgeAtDec31YearAfterDeath;
      if (isBenefOlderThanOwner && ownerStartedRMDs) {
        const ownerAgeAtDec31 = (ownerDeath.year + 1) - ownerBirth.year;
        if (ownerAgeAtDec31 < benefAgeAtDec31YearAfterDeath) {
          ageForCalculation = ownerAgeAtDec31;
        }
      }
      const initialDivisor = singleLifeTable[Math.min(120, ageForCalculation)] || 1;
      divisor = Math.max(1, initialDivisor - i);
      rmd = balance / divisor;
    } else if (uses10YearRule) {
      if (i < 10) {
        if (ownerStartedRMDs && i < 9) {
          const initialDivisor = singleLifeTable[Math.min(120, benefAgeAtDec31YearAfterDeath)] || 1;
          divisor = Math.max(1, initialDivisor - i);
          rmd = balance / divisor;
        } else if (!ownerStartedRMDs && i < 9) {
          rmd = 0;
        } else if (i === 9) {
          rmd = balance;
        }
      }
    }

    const startBalance = balance;
    balance -= rmd;
    balance *= (1 + rate);
    cumulativeRMD += rmd;

    if (balance < 0) balance = 0;

    projections.push({
      year,
      age: benefAge,
      startingBalance: Math.round(startBalance),
      rmd: Math.round(rmd),
      endingBalance: Math.round(balance),
      cumulativeRMD: Math.round(cumulativeRMD),
      divisor: divisor > 0 ? divisor.toFixed(1) : 'N/A'
    });

    if (balance === 0) break;
  }

  return projections;
}