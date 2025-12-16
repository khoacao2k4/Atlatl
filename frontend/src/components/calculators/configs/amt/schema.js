import { z } from 'zod';

export const schema = z.object({
  // Personal Information
  filingStatus: z.enum(['single', 'married', 'marriedSeparate', 'headOfHousehold']),
  annualIncome: z.number().min(0, 'Must be 0 or greater'),
  
  // ISO Exercise Information
  sharesExercised: z.number().int('Must be a whole number').min(0, 'Must be 0 or greater'),
  strikePrice: z.number().min(0, 'Must be 0 or greater'),
  fmv409a: z.number().min(0, 'Must be 0 or greater'),
  
  // Deductions
  standardDeduction: z.boolean(),
  itemizedDeductions: z.number().min(0, 'Must be 0 or greater'),
  saltDeduction: z.number().min(0, 'Must be 0 or greater'),
  
  // Other Income
  capitalGainsLongTerm: z.number().min(0, 'Must be 0 or greater'),
  capitalGainsShortTerm: z.number().min(0, 'Must be 0 or greater'),
}).refine((data) => {
  if (data.fmv409a > 0 && data.strikePrice > data.fmv409a) {
    return false;
  }
  return true;
}, {
  message: "Strike price cannot exceed Fair Market Value",
  path: ["strikePrice"],
});