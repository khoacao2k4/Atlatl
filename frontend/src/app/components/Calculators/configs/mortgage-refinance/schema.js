import { z } from 'zod';

export const schema = z.object({
  balanceAtDistribution: z.number().min(0, 'Must be 0 or greater'),
  costBasis: z.number().min(0, 'Must be 0 or greater'),
  rateOfReturn: z.number().min(-100, 'Must be -100% or greater').max(200, 'Must be 200% or less'),
  holdingPeriodYears: z.number().min(0, 'Must be 0 or greater').max(50, 'Must be 50 years or less'),
  holdingPeriodMonths: z.number().min(0, 'Must be 0 or greater').max(11, 'Must be 11 months or less'),
  capitalGainsRate: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
  marginalTaxRate: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
  inflationRate: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
  currentAge: z.number().min(0, 'Must be 0 or greater').max(120, 'Must be 120 or less'),
  separatedAtAge55: z.boolean(),
  retirementDistributionAfter59Half: z.boolean(),
  iraDistributionAfter59Half: z.boolean(),
});
