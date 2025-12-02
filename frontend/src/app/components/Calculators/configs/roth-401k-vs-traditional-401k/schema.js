import { z } from 'zod';

export const schema = z.object({
  currentAge: z.number().min(0, 'Must be 0 or greater').max(120, 'Must be 120 or less'),
  retirementAge: z.number().min(0, 'Must be 0 or greater').max(120, 'Must be 120 or less'),
  annualContribution: z.number().min(0, 'Must be 0 or greater'),
  currentBalance: z.number().min(0, 'Must be 0 or greater'),
  annualRateOfReturn: z.number().min(-100, 'Must be -100% or greater').max(100, 'Must be 100% or less'),
  currentTaxRate: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
  retirementTaxRate: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
  investTaxSavings: z.coerce.boolean(),
  maximizeContributions: z.coerce.boolean(),
});