import { z } from 'zod';

export const schema = z.object({
  originalMortgageAmount: z.number().min(0, 'Must be 0 or greater'),
  originalAppraisedValue: z.number().min(0, 'Must be 0 or greater'),
  currentInterestRate: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
  currentTermYears: z.number().min(1, 'Must be at least 1 year').max(50, 'Must be 50 years or less'),
  yearsRemaining: z.number().min(0, 'Must be 0 or greater').max(50, 'Must be 50 years or less'),
  incomeTaxRate: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
  calculateBalance: z.union([z.boolean(), z.string()]),
  currentAppraisedValue: z.number().min(0, 'Must be 0 or greater'),
  loanBalance: z.number().min(0, 'Must be 0 or greater'),
  newInterestRate: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
  newTermYears: z.number().min(1, 'Must be at least 1 year').max(50, 'Must be 50 years or less'),
  loanOriginationRate: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
  pointsPaid: z.number().min(0, 'Must be 0 or greater').max(10, 'Must be 10 or less'),
  otherClosingCosts: z.number().min(0, 'Must be 0 or greater'),
  includePMI: z.union([z.boolean(), z.string()]),
}).refine((data) => {
  const yearsRemaining = data.yearsRemaining;
  const currentTermYears = data.currentTermYears;
  return yearsRemaining <= currentTermYears;
}, {
  message: "Years remaining cannot exceed current term",
  path: ["yearsRemaining"],
});