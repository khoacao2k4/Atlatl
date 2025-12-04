import { z } from 'zod';


// DATE UTILITIES

export const parseDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
};

export const calculateAge = (birthDate, referenceDate) => {
  let age = referenceDate.year - birthDate.year;
  if (referenceDate.month < birthDate.month ||
    (referenceDate.month === birthDate.month && referenceDate.day < birthDate.day)) {
    age--;
  }
  return age;
};


// FINANCIAL UTILITIES

export const roundCurrency = (amount) => {
  return Math.round(amount * 100) / 100;
};


// VALIDATION UTILITIES (Zod Schemas)

export const createDateValidator = (fieldName) => {
  return z.string()
    .min(1, `${fieldName} is required`)
    .refine(
      val => !isNaN(new Date(val + 'T00:00:00').getTime()),
      'Invalid date - use MM/DD/YYYY format'
    );
};


// DATE DIFFERENCE UTILITIES

export const getDaysBetween = (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr || startDateStr === '' || endDateStr === '') {
    return null;
  }
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
};


// NUMBER UTILITIES

export const roundToDecimals = (value, decimals = 2) => {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
};