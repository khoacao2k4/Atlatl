import { z } from 'zod';

export const schema = z.object({
  amountToConvert: z.number().min(0, 'Must be 0 or greater'),
  nonDeductibleContributions: z.number().min(0, 'Must be 0 or greater'),
  currentAge: z.number().min(0, 'Must be 0 or greater').max(71, 'Must be 120 or less'),
  retirementAge: z.number().min(0, 'Must be 0 or greater').max(120, 'Must be 120 or less'),
  rateOfReturn: z.number().min(-100, 'Must be -100% or greater').max(100, 'Must be 100% or less'),
  currentTaxRate: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
  retirementTaxRate: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
  investmentTaxRate: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
});