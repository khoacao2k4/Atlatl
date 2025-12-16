import { z } from 'zod';
import { singleLifeTable } from './singleLifeTable';
import { uniformLifeTable } from './uniformLifeTable';
import { parseDate, calculateAge, roundCurrency, createDateValidator } from '../../utils';


// CONSTANTS

const PLAN_TYPE_LABELS = {
  'traditional-ira': 'Traditional IRA',
  'roth-ira': 'Roth IRA',
  'sep-ira': 'SEP IRA',
  'simple-ira': 'SIMPLE IRA',
  '401k': '401(k)',
  'roth-401k': 'Roth 401(k)',
  '403b': '403(b)',
  '457': '457 Plan',
  'profit-sharing': 'Profit Sharing Plan',
  'money-purchase': 'Money Purchase Pension Plan',
  'defined-benefit': 'Defined Benefit Plan',
  'keogh': 'Keogh Plan',
  'tsp': 'Thrift Savings Plan (TSP)',
  'other': 'Other Qualified Plan'
};

const BENEFICIARY_TYPE_OPTIONS = [
  { value: 'longest-timeframe', label: 'Non-spouse choosing longest distribution time-frame' },
  { value: '10-year-rule', label: 'Person choosing 10-year RMD rule (if available)' },
  { value: 'surviving-spouse', label: 'Surviving spouse' },
  { value: 'disabled-chronically-ill', label: 'Disabled or chronically ill person' },
  { value: 'child-under-21', label: "Account owner's child" }
];

const PLAN_TYPE_OPTIONS = Object.entries(PLAN_TYPE_LABELS).map(([value, label]) => ({ value, label }));


// VALIDATION SCHEMA

export const schema = z.object({
  yearOfRMD: z.number().int('Year must be a whole number').min(2020, 'Year must be 2020 or later').max(2100, 'Year too far in future'),
  beneficiaryType: z.enum(['longest-timeframe', '10-year-rule', 'surviving-spouse', 'disabled-chronically-ill', 'child-under-21']),
  beneficiaryName: z.string().optional(),
  ownerName: z.string().optional(),
  accountName: z.string().optional(),
  beneficiaryBirthdate: createDateValidator('Beneficiary birthdate'),
  rateOfReturn: z.number().min(-50, 'Rate too low').max(100, 'Rate too high'),
  accountBalance: z.number().min(0, 'Balance must be positive'),
  ownerDeathDate: createDateValidator('Death date'),
  planType: z.enum(Object.keys(PLAN_TYPE_LABELS)),
  ownerBirthdate: createDateValidator('Owner birthdate'),
});


// DEFAULT VALUES

export const defaults = {
  yearOfRMD: 2025,
  beneficiaryType: 'longest-timeframe',
  beneficiaryName: '',
  ownerName: '',
  accountName: '',
  beneficiaryBirthdate: '1952-11-24',
  rateOfReturn: 4,
  accountBalance: 10000,
  ownerDeathDate: '2024-11-24',
  planType: 'traditional-ira',
  ownerBirthdate: '1952-11-24',
};


// INPUT/OUTPUT CONFIGURATION

export const inputs = [
  { name: 'yearOfRMD', label: 'Year of RMD', type: 'number', required: true, hint: 'The year to calculate the Required Minimum Distribution. This is typically the current year.' },
  { name: 'beneficiaryType', label: 'Beneficiary Type', type: 'select', required: true, options: BENEFICIARY_TYPE_OPTIONS },
  { name: 'beneficiaryName', label: "Beneficiary's Name", type: 'text', hint: 'Enter the beneficiary\'s name if you would like it to appear on the report' },
  { name: 'ownerName', label: "Owner's Name", type: 'text', hint: 'Enter the account owner\'s name if you would like it to appear on the report' },
  { name: 'accountName', label: 'Name of Account', type: 'text', hint: 'Please enter the name of the account for this analysis' },
  { name: 'beneficiaryBirthdate', label: "Beneficiary's Birthdate", type: 'date', required: true, hint: 'Enter the beneficiary\'s birthdate. This is used for calculating life expectancy.' },
  { name: 'rateOfReturn', label: 'Hypothetical Rate of Return', type: 'number', format: 'percentage', step: 0.1, required: true, hint: 'Expected annual growth rate for future projections' },
  { name: 'accountBalance', label: 'Amount Subject to RMD', type: 'number', format: 'currency', required: true, hint: 'Fair market value as of December 31st of the previous year. For example, to determine the RMD for 2020 the account balance on 12/31/2019 would be used.' },
  { name: 'ownerDeathDate', label: "Date of the Original Account Owner's Death", type: 'date', required: true, hint: 'Please enter the date of the original account owner\'s death' },
  { name: 'planType', label: 'Plan Type', type: 'select', required: true, options: PLAN_TYPE_OPTIONS, hint: 'The plan type can affect distributions if the account owner is younger than the beneficiary and RMDs have already begun' },
  { name: 'ownerBirthdate', label: "Original Account Owner's Birthdate", type: 'date', required: true, hint: 'Please enter the original account owner\'s birthdate' }
];

export const results = [
  { key: 'yearOfRMD', label: 'Year of RMD', format: 'text' },
  { key: 'calculationMethod', label: 'Calculation Method', format: 'text' },
  { key: 'beneficiaryName', label: 'Beneficiary Name', format: 'text' },
  { key: 'ownerName', label: 'Owner Name', format: 'text' },
  { key: 'accountName', label: 'Account Name', format: 'text' },
  { key: 'planType', label: 'Plan Type', format: 'text' },
  { key: 'accountBalance', label: 'Account Balance (Dec 31 Prior Year)', format: 'currency' },
  { key: 'beneficiaryAge', label: 'Beneficiary Age (Dec 31 of RMD Year)', format: 'number' },
  { key: 'lifeExpectancyDivisor', label: 'Life Expectancy Divisor', format: 'text' },
  { key: 'requiredMinimumDistribution', label: 'Required Minimum Distribution', format: 'currency' },
  { key: 'ownerAgeAtDeath', label: 'Owner Age at Death', format: 'number' },
  { key: 'beneficiaryAgeAtDec31Next', label: 'Beneficiary Age (Dec 31 following death)', format: 'number' },
  { key: 'ownerHadStartedRMDs', label: 'Owner Had Started RMDs', format: 'text' }
];


// UTILS

export const getRBDAge = (year, month) => {
  if (year < 1949 || (year === 1949 && month < 7)) return 70.5;
  if (year < 1951) return 72;
  if (year >= 1951 && year <= 1959) return 73;
  return 75;
};

export const getLifeExpectancyDivisor = (initialAge, yearsPassed) => {
  const { singleLifeTable } = require('./singleLifeTable');
  const initialDivisor = singleLifeTable[Math.min(120, initialAge)] || 1;
  return Math.max(1, initialDivisor - yearsPassed);
};


// RMD CALCULATION STRATEGIES

class RMDCalculator {
  constructor(data, context) {
    this.data = data;
    this.context = context;
  }

  calculateSurvivingSpouse() {
    const { beneficiaryAge, benefBirth } = this.context;
    const method = 'Surviving Spouse - Treats Account as Own';
    const notes = ['RMDs calculated using Uniform Lifetime Table', 'Recalculates life expectancy each year'];

    const spouseRBDAge = getRBDAge(benefBirth.year, benefBirth.month);

    if (beneficiaryAge < spouseRBDAge) {
      return { method, notes: [...notes, `No RMD required until age ${spouseRBDAge}`], divisor: 'N/A', rmd: 0 };
    }

    const divisor = uniformLifeTable[Math.min(120, beneficiaryAge)] || 0;
    const rmd = divisor > 0 ? this.data.accountBalance / divisor : this.data.accountBalance;

    return { method, notes, divisor, rmd };
  }

  calculateChildUnder21() {
    const { beneficiaryAge, benefAgeAtDec31YearAfterDeath, yearsSinceDeath, ownerStartedRMDs, benefBirth } = this.context;

    if (beneficiaryAge <= 21) {
      const method = "Account Owner's Child - Life Expectancy Method (Until Age 21)";
      const notes = [
        'Uses Single Life Expectancy Table',
        'Life expectancy looked up once in year following death, then reduced by 1 each year',
        '10-year rule will apply starting the year after turning 21'
      ];

      const divisor = getLifeExpectancyDivisor(benefAgeAtDec31YearAfterDeath, yearsSinceDeath);
      const rmd = this.data.accountBalance / divisor;

      return { method, notes, divisor, rmd };
    }

    // After age 21, transition to 10-year rule
    const yearTurned21 = benefBirth.year + 21;
    const yearsSinceTurning21 = this.data.yearOfRMD - (yearTurned21 + 1);

    const method = "Account Owner's Child - 10-Year Rule (After Age 21)";
    const notes = ['Child reached age 21 - 10-year distribution rule now applies'];

    return this.calculate10YearRule(yearsSinceTurning21, ownerStartedRMDs, 22, method, notes);
  }

  calculateLifeExpectancy(customMethod = null) {
    const { benefAgeAtDec31YearAfterDeath, yearsSinceDeath, ownerStartedRMDs, isBenefOlderThanOwner, ownerAgeAtDec31YearAfterDeath, isPreSecure, data } = this.context;

    const method = customMethod || (
      data.beneficiaryType === 'disabled-chronically-ill'
        ? 'Disabled or Chronically Ill - Life Expectancy Method'
        : isPreSecure
          ? 'Pre-SECURE Act - Life Expectancy Method'
          : 'Life Expectancy Method - Not More Than 10 Years Younger'
    );

    const notes = [
      'Uses Single Life Expectancy Table',
      'Life expectancy looked up once in year following death, then reduced by 1 each year'
    ];

    let ageForInitialLookup = benefAgeAtDec31YearAfterDeath;

    if (isBenefOlderThanOwner && ownerStartedRMDs && ownerAgeAtDec31YearAfterDeath < benefAgeAtDec31YearAfterDeath) {
      ageForInitialLookup = ownerAgeAtDec31YearAfterDeath;
      notes.push(`Using owner's life expectancy (age ${ageForInitialLookup} in first RMD year) for lower RMD`);
    }

    const divisor = getLifeExpectancyDivisor(ageForInitialLookup, yearsSinceDeath);
    const rmd = this.data.accountBalance / divisor;

    return { method, notes, divisor, rmd };
  }

  calculate10YearRule(yearsSinceDeath = null, ownerStartedRMDs = null, initialAge = null, customMethod = null, customNotes = []) {
    yearsSinceDeath = yearsSinceDeath ?? this.context.yearsSinceDeath;
    ownerStartedRMDs = ownerStartedRMDs ?? this.context.ownerStartedRMDs;
    initialAge = initialAge ?? this.context.benefAgeAtDec31YearAfterDeath;

    const method = customMethod || '10-Year Rule (SECURE Act)';
    const notes = [...customNotes, 'Account must be fully distributed by end of 10th year after death'];

    if (yearsSinceDeath >= 10) {
      return { method, notes: [...notes, '10-year distribution period has ended'], divisor: 'N/A', rmd: 0 };
    }

    if (yearsSinceDeath === 9) {
      return { method, notes: [...notes, 'Final year - entire balance must be withdrawn'], divisor: 'N/A', rmd: this.data.accountBalance };
    }

    if (ownerStartedRMDs) {
      const divisor = getLifeExpectancyDivisor(initialAge, yearsSinceDeath);
      const rmd = this.data.accountBalance / divisor;
      return { method, notes: [...notes, 'Annual RMDs required (years 1-9) since owner had started RMDs'], divisor, rmd };
    }

    return { method, notes: [...notes, 'No annual RMD required (owner had not started RMDs)'], divisor: 'N/A', rmd: 0 };
  }

  calculate() {
    const { beneficiaryType } = this.data;
    const { isPreSecure, isNotMoreThan10YearsYounger } = this.context;

    if (beneficiaryType === 'surviving-spouse') {
      return this.calculateSurvivingSpouse();
    }

    if (beneficiaryType === 'child-under-21') {
      return this.calculateChildUnder21();
    }

    if (beneficiaryType === 'disabled-chronically-ill' ||
      (beneficiaryType === 'longest-timeframe' && (isPreSecure || isNotMoreThan10YearsYounger))) {
      return this.calculateLifeExpectancy();
    }

    return this.calculate10YearRule();
  }
}


// PROJECTION GENERATOR

function generateProjections(data, context) {
  const { ownerDeath, benefAgeAtDec31YearAfterDeath, ownerStartedRMDs, benefBirth } = context;
  const rate = data.rateOfReturn / 100;
  const firstRMDYear = ownerDeath.year + 1;

  const config = getProjectionConfig(data, context);
  const projections = [];
  let balance = data.accountBalance;
  let cumulativeRMD = 0;

  for (let i = 0; i < config.maxYears; i++) {
    const year = firstRMDYear + i;
    const benefAge = benefAgeAtDec31YearAfterDeath + i;

    const { rmd, divisor } = calculateYearRMD(i, benefAge, balance, config, context);

    const startBalance = balance;
    balance = Math.max(0, (balance - rmd) * (1 + rate));
    cumulativeRMD += rmd;

    projections.push({
      year,
      age: benefAge,
      startingBalance: roundCurrency(startBalance),
      rmd: roundCurrency(rmd),
      endingBalance: roundCurrency(balance),
      cumulativeRMD: roundCurrency(cumulativeRMD),
      divisor: divisor > 0 ? divisor.toFixed(1) : 'N/A'
    });

    if (balance < 0.01) break;
  }

  return projections;
}

function getProjectionConfig(data, context) {
  const { benefAgeAtDec31YearAfterDeath, isPreSecure, isNotMoreThan10YearsYounger } = context;

  if (data.beneficiaryType === 'surviving-spouse') {
    return { type: 'spouse', maxYears: 30 };
  }

  if (data.beneficiaryType === 'child-under-21') {
    return { type: 'child', maxYears: 50 };
  }

  if (data.beneficiaryType === 'disabled-chronically-ill' ||
    (data.beneficiaryType === 'longest-timeframe' && (isPreSecure || isNotMoreThan10YearsYounger))) {
    return {
      type: 'lifeExpectancy',
      maxYears: Math.min(50, singleLifeTable[benefAgeAtDec31YearAfterDeath] || 30)
    };
  }

  return { type: '10year', maxYears: 10 };
}

function calculateYearRMD(yearIndex, benefAge, balance, config, context) {
  const { benefAgeAtDec31YearAfterDeath, ownerStartedRMDs, benefBirth, isBenefOlderThanOwner, ownerAgeAtDec31YearAfterDeath } = context;

  if (config.type === 'spouse') {
    const spouseRBDAge = getRBDAge(benefBirth.year, benefBirth.month);
    if (benefAge < spouseRBDAge) return { rmd: 0, divisor: 0 };
    const divisor = uniformLifeTable[Math.min(120, benefAge)] || 0;
    return { rmd: divisor > 0 ? balance / divisor : balance, divisor };
  }

  if (config.type === 'child') {
    if (benefAge <= 21) {
      const divisor = getLifeExpectancyDivisor(benefAgeAtDec31YearAfterDeath, yearIndex);
      return { rmd: balance / divisor, divisor };
    }
    // Transition to 10-year rule
    const yearTurned21 = benefBirth.year + 21;
    const currentYear = context.ownerDeath.year + 1 + yearIndex;
    const yearsSinceTurning21 = currentYear - (yearTurned21 + 1);
    return calculate10YearRMD(yearsSinceTurning21, balance, ownerStartedRMDs, 22);
  }

  if (config.type === 'lifeExpectancy') {
    let ageForLookup = benefAgeAtDec31YearAfterDeath;
    if (isBenefOlderThanOwner && ownerStartedRMDs && ownerAgeAtDec31YearAfterDeath < benefAgeAtDec31YearAfterDeath) {
      ageForLookup = ownerAgeAtDec31YearAfterDeath;
    }
    const divisor = getLifeExpectancyDivisor(ageForLookup, yearIndex);
    return { rmd: balance / divisor, divisor };
  }

  // 10-year rule
  return calculate10YearRMD(yearIndex, balance, ownerStartedRMDs, benefAgeAtDec31YearAfterDeath);
}

function calculate10YearRMD(yearsSince, balance, ownerStartedRMDs, initialAge) {
  if (yearsSince >= 10) return { rmd: 0, divisor: 0 };
  if (yearsSince === 9) return { rmd: balance, divisor: 0 };
  if (ownerStartedRMDs) {
    const divisor = getLifeExpectancyDivisor(initialAge, yearsSince);
    return { rmd: balance / divisor, divisor };
  }
  return { rmd: 0, divisor: 0 };
}


// MAIN CALCULATION FUNCTION

const calculate = (data) => {
  const ownerBirth = parseDate(data.ownerBirthdate);
  const ownerDeath = parseDate(data.ownerDeathDate);
  const benefBirth = parseDate(data.beneficiaryBirthdate);

  const ownerAgeAtDeath = calculateAge(ownerBirth, ownerDeath);
  const benefAgeAtDec31YearAfterDeath = (ownerDeath.year + 1) - benefBirth.year;
  const yearsSinceDeath = data.yearOfRMD - (ownerDeath.year + 1);

  if (yearsSinceDeath < 0) {
    return {
      error: true,
      message: `RMD calculations begin in ${ownerDeath.year + 1}. Cannot calculate for ${data.yearOfRMD}.`
    };
  }

  const ownerRBDAge = getRBDAge(ownerBirth.year, ownerBirth.month);
  const ownerStartedRMDs = ownerAgeAtDeath >= ownerRBDAge;
  const isPreSecure = ownerDeath.year <= 2019;
  const benefYoungerByYears = ownerBirth.year - benefBirth.year;
  const isNotMoreThan10YearsYounger = benefYoungerByYears <= 10 && benefBirth.year <= ownerBirth.year;
  const isBenefOlderThanOwner = benefBirth.year < ownerBirth.year;
  const ownerAgeAtDec31YearAfterDeath = (ownerDeath.year + 1) - ownerBirth.year;
  const beneficiaryAge = benefAgeAtDec31YearAfterDeath + yearsSinceDeath;

  const context = {
    ownerBirth, ownerDeath, benefBirth, ownerAgeAtDeath, benefAgeAtDec31YearAfterDeath,
    ownerStartedRMDs, isPreSecure, isNotMoreThan10YearsYounger, isBenefOlderThanOwner,
    ownerAgeAtDec31YearAfterDeath, beneficiaryAge, yearsSinceDeath, data
  };

  const calculator = new RMDCalculator(data, context);
  const { method, notes, divisor, rmd } = calculator.calculate();

  const projections = generateProjections(data, context);

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
    requiredMinimumDistribution: roundCurrency(rmd),
    planType: PLAN_TYPE_LABELS[data.planType] || data.planType.toUpperCase(),
    notes,
    projections
  };
};


// CHART CONFIGURATION

const charts = [
  {
    type: 'area',
    title: 'Account Balance Projection',
    xKey: 'year',
    format: 'currency',
    height: 350,
    areas: [{ key: 'endingBalance', name: 'Account Balance', color: '#378CE7', opacity: 0.6 }],
    data: (results) => results.projections || [],
    description: 'Projected account balance over time after RMDs and growth'
  },
  {
    type: 'bar',
    title: 'Annual Required Minimum Distributions',
    xKey: 'year',
    format: 'currency',
    height: 350,
    bars: [{ key: 'rmd', name: 'RMD Amount', color: '#10b981' }],
    data: (results) => results.projections || [],
    description: 'Required minimum distributions by year'
  },
  {
    type: 'line',
    title: 'Cumulative Distributions Over Time',
    xKey: 'year',
    format: 'currency',
    height: 350,
    lines: [{ key: 'cumulativeRMD', name: 'Total Distributions', color: '#8b5cf6', width: 3 }],
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
];


// MAIN CONFIG EXPORT

export const config = {
  title: 'Beneficiary Required Minimum Distributions (RMD)',
  description: 'Calculate beneficiary RMDs using SECURE Act rules and IRS life expectancy tables',
  schema,
  defaultValues: defaults,
  inputs,
  results,
  calculate,
  charts
};