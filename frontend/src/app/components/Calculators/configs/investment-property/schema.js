import { z } from 'zod';

export const schema = z.object({
  // Property Information
  propertyAddress: z.string().optional(),
  purchasePrice: z.number().min(0).max(100000000, 'Must be between $0 and $100,000,000'),
  cashInvested: z.number().min(0).max(100000000, 'Must be between $0 and $100,000,000'),
  landValue: z.number().min(0).max(100000000, 'Must be between $0 and $100,000,000'),
  personalProperty: z.number().min(0).max(100000000, 'Must be between $0 and $100,000,000'),
  annualRent: z.number().min(0).max(100000000, 'Must be between $0 and $100,000,000'),
  vacancy: z.number().min(0).max(100000000, 'Must be between $0 and $100,000,000'),
  personalPropertyDepRate: z.number().min(0).max(100, 'Must be between 0% and 100%'),
  buildingDepRate: z.number().min(0).max(100, 'Must be between 0% and 100%'),
  
  // Financing - Loan 1
  loan1Amount: z.number().min(0).max(100000000, 'Must be between $0 and $100,000,000'),
  interestRate1: z.number().min(0).max(100, 'Must be between 0% and 100%'),
  termInMonths1: z.number().int().min(0).max(360, 'Must be between 0 and 360'),
  interestOnly1: z.string().transform(val => val === 'true').optional(),
  
  // Financing - Loan 2
  loan2Amount: z.number().min(0).max(100000000, 'Must be between $0 and $100,000,000'),
  interestRate2: z.number().min(0).max(100, 'Must be between 0% and 100%'),
  termInMonths2: z.number().int().min(0).max(360, 'Must be between 0 and 360'),
  interestOnly2: z.string().transform(val => val === 'true').optional(),
  
  // Annual Expenses
  realEstateTaxes: z.number().min(0).max(1000000, 'Must be between $0 and $1,000,000'),
  utilities: z.number().min(0).max(10000000, 'Must be between $0 and $10,000,000'),
  insurance: z.number().min(0).max(10000000, 'Must be between $0 and $10,000,000'),
  maintenanceRepairs: z.number().min(0).max(10000000, 'Must be between $0 and $10,000,000'),
  advertising: z.number().min(0).max(10000000, 'Must be between $0 and $10,000,000'),
  adminLegal: z.number().min(0).max(10000000, 'Must be between $0 and $10,000,000'),
  supplies: z.number().min(0).max(10000000, 'Must be between $0 and $10,000,000'),
  propertyMgmtExpense: z.number().min(0).max(100, 'Must be between 0% and 100%'),
  miscellaneous: z.number().min(0).max(10000000, 'Must be between $0 and $10,000,000'),
  
  // Analysis
  taxBracket: z.number().min(0).max(100, 'Must be between 0% and 100%'),
  appreciationRate: z.number().min(0).max(100, 'Must be between 0% and 100%'),
  costOfCapital: z.number().min(0).max(100, 'Must be between 0% and 100%'),
});