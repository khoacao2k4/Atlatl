import { z } from 'zod';

export const schema = z.object({
  purchasePrice: z.number()
    .min(0, 'Purchase price must be 0 or greater')
    .max(10000000, 'Purchase price seems unreasonably high'),
  
  downPayment: z.number()
    .min(0, 'Down payment cannot be negative')
    .max(10000000, 'Down payment seems unreasonably high'),
  
  salesTaxRate: z.number()
    .min(0, 'Sales tax rate cannot be negative')
    .max(20, 'Sales tax rate seems unreasonably high'),
  
  investmentReturnRate: z.number()
    .min(0, 'Investment return rate cannot be negative')
    .max(100, 'Investment return rate seems unreasonably high'),
  
  // Buy option fields
  loanTermMonths: z.number()
    .int('Must be a whole number')
    .min(12, 'Loan term must be at least 12 months')
    .max(96, 'Loan term cannot exceed 96 months'),
  
  loanInterestRate: z.number()
    .min(0, 'Interest rate cannot be negative')
    .max(100, 'Interest rate seems unreasonably high'),
  
  buyOtherFees: z.number()
    .min(0, 'Fees cannot be negative')
    .max(1000000, 'Fees seem unreasonably high'),
  
  annualDepreciationRate: z.number()
    .min(0, 'Depreciation rate cannot be negative')
    .max(100, 'Depreciation rate seems unreasonably high'),
  
  // Lease option fields
  leaseTermMonths: z.number()
    .int('Must be a whole number')
    .min(12, 'Lease term must be at least 12 months')
    .max(60, 'Lease term cannot exceed 60 months'),
  
  leaseInterestRate: z.number()
    .min(0, 'Interest rate cannot be negative')
    .max(100, 'Interest rate seems unreasonably high'),
  
  leaseOtherFees: z.number()
    .min(0, 'Fees cannot be negative')
    .max(1000000, 'Fees seem unreasonably high'),
  
  residualPercent: z.number()
    .min(0, 'Residual percent cannot be negative')
    .max(100, 'Residual percent cannot exceed 100%'),
  
  securityDeposit: z.number()
    .min(0, 'Security deposit cannot be negative')
    .max(1000000, 'Security deposit seems unreasonably high'),
})
.refine(
  (data) => data.downPayment <= data.purchasePrice,
  {
    message: 'Down payment cannot exceed purchase price',
    path: ['downPayment'],
  }
);