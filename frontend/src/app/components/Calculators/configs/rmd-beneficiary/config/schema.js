import { z } from 'zod';

export const schema = z.object({
  yearOfRMD: z.number().min(2020, 'Year must be 2020 or later').max(2100, 'Year too far in future'),
  beneficiaryType: z.enum([
    'longest-timeframe',
    '10-year-rule',
    'surviving-spouse',
    'disabled-chronically-ill',
    'child-under-21'
  ]),
  beneficiaryName: z.string().optional(),
  ownerName: z.string().optional(),
  accountName: z.string().optional(),
  beneficiaryBirthdate: z.string()
    .min(1, 'Beneficiary birthdate is required')
    .refine(val => !isNaN(new Date(val + 'T00:00:00').getTime()), 'Invalid date - use MM/DD/YYYY format'),
  rateOfReturn: z.number().min(-50, 'Rate too low').max(50, 'Rate too high'),
  accountBalance: z.number().min(0, 'Balance must be positive'),
  ownerDeathDate: z.string()
    .min(1, 'Death date is required')
    .refine(val => !isNaN(new Date(val + 'T00:00:00').getTime()), 'Invalid date - use MM/DD/YYYY format'),
  planType: z.enum(['ira', '401k', '403b', 'other']),
  ownerBirthdate: z.string()
    .min(1, 'Owner birthdate is required')
    .refine(val => !isNaN(new Date(val + 'T00:00:00').getTime()), 'Invalid date - use MM/DD/YYYY format'),
});
