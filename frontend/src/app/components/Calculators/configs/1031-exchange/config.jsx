import { z } from 'zod';
import { roundCurrency, roundToDecimals, getDaysBetween } from '../../utils';


// CONSTANTS

const EXCHANGE_MAX_DAYS = 180;


// CALCULATOR-SPECIFIC UTILITIES

const calculateNetSale = (salesPrice, salesCosts) => {
  return salesPrice - salesCosts;
};

const calculateNetCash = (netAmount, liabilities) => {
  return netAmount - liabilities;
};

const calculateBoot = (netSale, netCostPurchased, netCashReceived, netCashReinvested) => {
  const tradingDown = Math.max(0, netSale - netCostPurchased);
  const cashBoot = Math.max(0, netCashReceived - netCashReinvested);
  return { tradingDown, cashBoot, boot: Math.max(tradingDown, cashBoot) };
};

const determineExchangeStatus = (daysToComplete, boot) => {
  if (daysToComplete === null) return 'Not Determined';

  const withinTimeframe = daysToComplete >= 0 && daysToComplete <= EXCHANGE_MAX_DAYS;

  if (withinTimeframe && boot === 0) {
    return 'Qualifies for Full Deferral';
  } else if (withinTimeframe && boot > 0) {
    return 'Partial Deferral (Boot Recognized)';
  } else {
    return `Does Not Qualify (Exceeds ${EXCHANGE_MAX_DAYS} Days)`;
  }
};

const generateNotes = (results) => {
  const { daysToComplete, exchangeQualifies, boot, tradingDown, cashBoot, netSale, netCashReceived, newBasis } = results;

  const notes = [
    daysToComplete !== null
      ? `Exchange timeframe: ${daysToComplete} days (must be ≤${EXCHANGE_MAX_DAYS} days)`
      : `Enter sale and purchase dates to validate exchange timeframe`,
    exchangeQualifies,
    boot === 0
      ? 'No boot - all proceeds reinvested for full tax deferral'
      : `Boot recognized: $${boot.toLocaleString()} (taxable)`,
    tradingDown > 0
      ? `Trading down: $${tradingDown.toLocaleString()} (purchased less than sold)`
      : '',
    cashBoot > 0
      ? `Cash boot: $${cashBoot.toLocaleString()} (cash not reinvested)`
      : '',
    `To avoid all taxes: Purchase ≥ $${netSale.toLocaleString()} AND reinvest all $${netCashReceived.toLocaleString()}`,
    `New basis in replacement property: $${newBasis.toLocaleString()}`,
  ];

  return notes.filter(note => note !== '');
};


// VALIDATION SCHEMA

export const schema = z.object({
  dateOfSale: z.string().optional(),
  dateOfPurchase: z.string().optional(),
  description: z.string().optional(),
  adjustedBasis: z.number().min(0, 'Must be a positive number'),
  salesPrice: z.number().min(0, 'Must be a positive number'),
  salesCosts: z.number().min(0, 'Must be a positive number'),
  liabilitiesSold: z.number().min(0, 'Must be a positive number'),
  purchasePrice: z.number().min(0, 'Must be a positive number'),
  purchaseCosts: z.number().min(0, 'Must be a positive number'),
  liabilitiesPurchased: z.number().min(0, 'Must be a positive number'),
});


// DEFAULT VALUES

export const defaults = {
  dateOfSale: '',
  dateOfPurchase: '',
  description: '',
  adjustedBasis: 250000,
  salesPrice: 500000,
  salesCosts: 40000,
  liabilitiesSold: 150000,
  purchasePrice: 600000,
  purchaseCosts: 15000,
  liabilitiesPurchased: 200000,
};


// INPUT CONFIGURATION

export const inputs = [
  {
    name: 'dateOfSale',
    label: 'Date of Sale',
    type: 'date',
    section: 'Exchange Timeline',
    hint: 'Date the investment real estate will be sold'
  },
  {
    name: 'dateOfPurchase',
    label: 'Date of Purchase',
    type: 'date',
    section: 'Exchange Timeline',
    hint: 'Exchange must be completed within 180 days from date of sale'
  },
  {
    name: 'description',
    label: 'Description of Property (Optional)',
    type: 'text',
    section: 'Exchange Timeline',
    hint: 'Brief description of the property involved in this exchange'
  },
  {
    name: 'adjustedBasis',
    label: 'Adjusted Cost Basis',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Property Being Sold',
    hint: 'The adjusted basis of investment real estate being sold'
  },
  {
    name: 'salesPrice',
    label: 'Sales Price',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Property Being Sold',
    hint: 'Contracted sales price of the investment property sold'
  },
  {
    name: 'salesCosts',
    label: 'Sales Cost, Commissions and Exchange Fee',
    type: 'number',
    format: 'currency',
    section: 'Property Being Sold',
    hint: 'Commissions, title insurance, closing costs, exchange fee, etc.'
  },
  {
    name: 'liabilitiesSold',
    label: 'Less Liabilities/Mortgages',
    type: 'number',
    format: 'currency',
    section: 'Property Being Sold',
    hint: 'Any liabilities or mortgages on the property being sold'
  },
  {
    name: 'purchasePrice',
    label: 'Purchase Price',
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Replacement Property Being Purchased',
    hint: 'Contracted purchase price of the replacement investment real estate'
  },
  {
    name: 'purchaseCosts',
    label: 'Purchase Costs and Commissions',
    type: 'number',
    format: 'currency',
    section: 'Replacement Property Being Purchased',
    hint: 'Commissions, title insurance, closing costs, etc.'
  },
  {
    name: 'liabilitiesPurchased',
    label: 'Plus Liabilities/Mortgages',
    type: 'number',
    format: 'currency',
    section: 'Replacement Property Being Purchased',
    hint: 'Any liabilities or mortgages on the replacement property'
  },
];


// RESULTS CONFIGURATION

export const results = [
  {
    key: 'exchangeQualifies',
    label: 'Exchange Status',
    format: 'text',
    description: 'Whether the exchange qualifies for full tax deferral'
  },
  {
    key: 'daysToComplete',
    label: 'Days Between Sale and Purchase',
    format: 'number',
    description: 'Must be ≤180 days to qualify'
  },
  {
    key: 'netSale',
    label: 'Net Sale for Property Sold',
    format: 'currency',
    description: 'Sales price minus sales costs and fees'
  },
  {
    key: 'netCashReceived',
    label: 'Net Cash Received',
    format: 'currency',
    description: 'Cash available for reinvestment (must all be reinvested to avoid tax)'
  },
  {
    key: 'netCostPurchased',
    label: 'Net Cost for Property Purchased',
    format: 'currency',
    description: 'Purchase price plus purchase costs'
  },
  {
    key: 'netCashReinvested',
    label: 'Net Cash Reinvested',
    format: 'currency',
    description: 'Cash reinvested in replacement property'
  },
  {
    key: 'totalGain',
    label: 'Total Gain on Sale',
    format: 'currency',
    description: 'Total gain if no 1031 exchange (Net Sale - Adjusted Basis)'
  },
  {
    key: 'recognizedGain',
    label: 'Recognized Gain (Boot)',
    format: 'currency',
    description: 'Taxable gain due to trading down or taking cash out'
  },
  {
    key: 'deferredGain',
    label: 'Deferred Gain',
    format: 'currency',
    description: 'Capital gains deferred through the 1031 exchange'
  },
  {
    key: 'newBasis',
    label: 'Basis of Replacement Property',
    format: 'currency',
    description: 'New adjusted basis for replacement property'
  },
];


// MAIN CALCULATION FUNCTION

const calculate = (data) => {
  // Convert to numbers
  const salesPrice = Number(data.salesPrice) || 0;
  const salesCosts = Number(data.salesCosts) || 0;
  const liabilitiesSold = Number(data.liabilitiesSold) || 0;
  const adjustedBasis = Number(data.adjustedBasis) || 0;
  const purchasePrice = Number(data.purchasePrice) || 0;
  const purchaseCosts = Number(data.purchaseCosts) || 0;
  const liabilitiesPurchased = Number(data.liabilitiesPurchased) || 0;

  // Sale calculations
  const netSale = calculateNetSale(salesPrice, salesCosts);
  const netCashReceived = calculateNetCash(netSale, liabilitiesSold);

  // Purchase calculations
  const netCostPurchased = purchasePrice + purchaseCosts;
  const netCashReinvested = calculateNetCash(netCostPurchased, liabilitiesPurchased);

  // Boot and gain calculations
  const { tradingDown, cashBoot, boot } = calculateBoot(
    netSale,
    netCostPurchased,
    netCashReceived,
    netCashReinvested
  );

  const totalGain = netSale - adjustedBasis;
  const recognizedGain = Math.min(boot, Math.max(0, totalGain));
  const deferredGain = Math.max(0, totalGain - recognizedGain);

  // New basis calculation
  const newBasis = adjustedBasis + (netCostPurchased - netSale);

  // Exchange qualification
  const daysToComplete = getDaysBetween(data.dateOfSale, data.dateOfPurchase);
  const withinTimeframe = daysToComplete !== null && daysToComplete >= 0 && daysToComplete <= EXCHANGE_MAX_DAYS;
  const exchangeQualifies = determineExchangeStatus(daysToComplete, boot);

  const results = {
    // Sale calculations
    netSale: roundCurrency(netSale),
    netCashReceived: roundCurrency(netCashReceived),

    // Purchase calculations
    netCostPurchased: roundCurrency(netCostPurchased),
    netCashReinvested: roundCurrency(netCashReinvested),

    // Boot/gain calculations
    tradingDown: roundCurrency(tradingDown),
    cashBoot: roundCurrency(cashBoot),
    boot: roundCurrency(boot),
    totalGain: roundCurrency(totalGain),
    recognizedGain: roundCurrency(recognizedGain),
    deferredGain: roundCurrency(deferredGain),

    // Basis
    newBasis: roundCurrency(newBasis),

    // Exchange qualification
    exchangeQualifies,
    daysToComplete,
    withinTimeframe,

    // Breakdowns for display
    saleBreakdown: [
      { label: 'Sales Price', value: roundCurrency(salesPrice) },
      { label: 'Less: Sales Costs, Commissions and Exchange Fee', value: roundCurrency(-salesCosts) },
      { label: 'Net Sale for Property Sold', value: roundCurrency(netSale) },
      { label: 'Less: Liabilities/Mortgages', value: roundCurrency(-liabilitiesSold) },
      { label: 'Net Cash Received', value: roundCurrency(netCashReceived) },
    ],

    purchaseBreakdown: [
      { label: 'Purchase Price', value: roundCurrency(purchasePrice) },
      { label: 'Plus: Purchase Costs and Commissions', value: roundCurrency(purchaseCosts) },
      { label: 'Net Cost for Property Purchased', value: roundCurrency(netCostPurchased) },
      { label: 'Less: Liabilities/Mortgages', value: roundCurrency(-liabilitiesPurchased) },
      { label: 'Net Cash Reinvested', value: roundCurrency(netCashReinvested) },
    ],

    gainBreakdown: [
      { label: 'Net Sale', value: roundCurrency(netSale) },
      { label: 'Less: Adjusted Cost Basis', value: roundCurrency(-adjustedBasis) },
      { label: 'Total Gain on Sale', value: roundCurrency(totalGain) },
      { label: 'Recognized Gain (Boot)', value: roundCurrency(recognizedGain) },
      { label: 'Deferred Gain', value: roundCurrency(deferredGain) },
    ],
  };

  results.notes = generateNotes(results);

  return results;
};


// CHART CONFIGURATION

const charts = [
  {
    title: 'Gain Disposition',
    type: 'bar',
    height: 350,
    xKey: 'type',
    format: 'currency',
    showLegend: false,
    data: (results) => [
      {
        type: 'Deferred Gain',
        value: results.deferredGain,
        color: '#10B981'
      },
      {
        type: 'Recognized Gain (Boot)',
        value: results.recognizedGain,
        color: '#F59E0B'
      },
    ],
    bars: [
      { key: 'value', name: 'Gain Amount', color: '#10B981' }
    ],
    description: 'Breakdown of total gain: deferred vs. recognized (taxable)'
  },
  {
    title: 'Cash Flow Analysis',
    type: 'bar',
    height: 350,
    xKey: 'item',
    format: 'currency',
    showLegend: false,
    data: (results) => [
      {
        item: 'Cash Received from Sale',
        value: results.netCashReceived,
        color: '#3B82F6'
      },
      {
        item: 'Cash Reinvested in Purchase',
        value: results.netCashReinvested,
        color: '#10B981'
      },
      {
        item: 'Boot (Not Reinvested)',
        value: results.boot,
        color: '#F59E0B'
      },
    ],
    bars: [
      { key: 'value', name: 'Amount', color: '#3B82F6' }
    ],
    description: 'Cash flow from sale and reinvestment in replacement property'
  },
  {
    title: 'Property Value Comparison',
    type: 'bar',
    height: 350,
    xKey: 'property',
    format: 'currency',
    showLegend: false,
    data: (results) => [
      {
        property: 'Property Sold (Net)',
        value: results.netSale,
        color: '#EF4444'
      },
      {
        property: 'Property Purchased (Net)',
        value: results.netCostPurchased,
        color: '#10B981'
      },
    ],
    bars: [
      { key: 'value', name: 'Net Value', color: '#3B82F6' }
    ],
    description: 'Comparison of net sale vs. net purchase value'
  },
];


// MAIN CONFIG EXPORT

export const config = {
  title: '1031 Exchange Calculator',
  description: 'Calculate tax deferral benefits and reinvestment requirements for like-kind property exchanges',
  schema,
  defaultValues: defaults,
  inputs,
  results,
  calculate,
  charts
};