import { z } from 'zod';

export const schema = z.object({
  currentAge: z.number().min(0, 'Must be 0 or greater').max(25, 'Must be 25 or less'),
  ageStartCollege: z.number().min(1, 'Must be 1 or greater').max(25, 'Must be 25 or less'),
  yearsInCollege: z.number().min(1, 'Must be at least 1 year').max(10, 'Must be 10 years or less'),
  annualTuition: z.number().min(0, 'Must be 0 or greater'),
  roomAndBoard: z.number().min(0, 'Must be 0 or greater'),
  educationInflation: z.number().min(0, 'Must be 0 or greater').max(20, 'Must be 20% or less'),
  currentSavings: z.number().min(0, 'Must be 0 or greater'),
  monthlyContribution: z.number().min(0, 'Must be 0 or greater'),
  rateOfReturn: z.number().min(-50, 'Must be -50% or greater').max(50, 'Must be 50% or less'),
});