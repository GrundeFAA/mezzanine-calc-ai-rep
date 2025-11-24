/**
 * Pricing calculation utilities for mezzanine configurations
 */

import { MezzanineConfig, Pricing, LoadCapacity, AnyAccessory } from '../types';

/** Base price for any mezzanine */
const BASE_PRICE = 50000;

/** Price per cubic meter for dimension-based pricing */
const PRICE_PER_CUBIC_METER = 2000;

/** Load capacity multipliers */
const LOAD_MULTIPLIERS: Record<LoadCapacity, number> = {
  250: 1.0,
  350: 1.2,
  500: 1.5,
};

/** Accessory prices */
const ACCESSORY_PRICES = {
  stairs: 15000,
  railing: 800, // per meter
  pallet_gate: 12000,
};

/**
 * Calculate the total price and breakdown for a mezzanine configuration
 */
export function calculatePricing(config: MezzanineConfig): Pricing {
  // Convert dimensions from mm to meters
  const lengthM = config.length / 1000;
  const widthM = config.width / 1000;
  const heightM = config.height / 1000;

  // Calculate volume and square meters
  const volume = lengthM * widthM * heightM;
  const squareMeters = lengthM * widthM;

  // Base price
  const basePrice = BASE_PRICE;

  // Dimension-based pricing
  const dimensionPrice = volume * PRICE_PER_CUBIC_METER;

  // Load capacity multiplier
  const loadMultiplier = LOAD_MULTIPLIERS[config.loadCapacity];

  // Calculate accessories price
  const accessoriesPrice = config.accessories.reduce((total, accessory) => {
    return total + calculateAccessoryPrice(accessory);
  }, 0);

  // Calculate total price
  const subtotal = basePrice + dimensionPrice;
  const totalPrice = subtotal * loadMultiplier + accessoriesPrice;

  // Price per square meter
  const pricePerSquareMeter = totalPrice / squareMeters;

  // Calculate leasing options
  // 3 year at 2.9% APR, 5 year at 3.5% APR
  // Using simple monthly payment formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const threeYearMonthly = calculateMonthlyPayment(totalPrice, 2.9, 36);
  const fiveYearMonthly = calculateMonthlyPayment(totalPrice, 3.5, 60);

  return {
    basePrice,
    dimensionPrice,
    loadMultiplier,
    accessoriesPrice,
    totalPrice,
    pricePerSquareMeter,
    squareMeters,
    leasing: {
      threeYear: threeYearMonthly,
      fiveYear: fiveYearMonthly,
    },
  };
}

/**
 * Calculate the price for a single accessory
 */
function calculateAccessoryPrice(accessory: AnyAccessory): number {
  switch (accessory.type) {
    case 'stairs':
      return ACCESSORY_PRICES.stairs * accessory.quantity;
    case 'railing':
      return ACCESSORY_PRICES.railing * accessory.lengthMeters * accessory.quantity;
    case 'pallet_gate':
      return ACCESSORY_PRICES.pallet_gate * accessory.quantity;
    default:
      return 0;
  }
}

/**
 * Calculate monthly payment for leasing
 * @param principal - Total amount to finance
 * @param annualRate - Annual interest rate (percentage)
 * @param months - Number of months
 */
function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  months: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  
  return payment;
}

/**
 * Format a price in NOK currency
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('nb-NO', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(price));
}

/**
 * Format a number with decimals
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('nb-NO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

