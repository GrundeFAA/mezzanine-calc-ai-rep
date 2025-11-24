/**
 * Tests for pricing utilities
 */

import { describe, it, expect } from 'vitest';
import { calculatePricing, formatPrice, formatNumber } from './pricing';
import { MezzanineConfig } from '../types';

describe('calculatePricing', () => {
  it('should calculate base price correctly', () => {
    const config: MezzanineConfig = {
      length: 5000,
      width: 3000,
      height: 3000,
      loadCapacity: 250,
      accessories: [],
    };

    const pricing = calculatePricing(config);
    expect(pricing.basePrice).toBe(50000);
  });

  it('should calculate dimension-based pricing correctly', () => {
    const config: MezzanineConfig = {
      length: 5000, // 5m
      width: 3000, // 3m
      height: 3000, // 3m
      loadCapacity: 250,
      accessories: [],
    };

    const pricing = calculatePricing(config);
    // Volume = 5 * 3 * 3 = 45 m³
    // Dimension price = 45 * 2000 = 90000
    expect(pricing.dimensionPrice).toBe(90000);
  });

  it('should apply load capacity multipliers correctly', () => {
    const baseConfig: MezzanineConfig = {
      length: 5000,
      width: 3000,
      height: 3000,
      loadCapacity: 250,
      accessories: [],
    };

    // Test 250 kg/m² (1.0x multiplier)
    const pricing250 = calculatePricing(baseConfig);
    expect(pricing250.loadMultiplier).toBe(1.0);

    // Test 350 kg/m² (1.2x multiplier)
    const config350 = { ...baseConfig, loadCapacity: 350 as const };
    const pricing350 = calculatePricing(config350);
    expect(pricing350.loadMultiplier).toBe(1.2);

    // Test 500 kg/m² (1.5x multiplier)
    const config500 = { ...baseConfig, loadCapacity: 500 as const };
    const pricing500 = calculatePricing(config500);
    expect(pricing500.loadMultiplier).toBe(1.5);
  });

  it('should calculate stairs accessory price correctly', () => {
    const config: MezzanineConfig = {
      length: 5000,
      width: 3000,
      height: 3000,
      loadCapacity: 250,
      accessories: [
        {
          id: '1',
          type: 'stairs',
          quantity: 2,
          stairType: 'Straight 1m',
        },
      ],
    };

    const pricing = calculatePricing(config);
    // Stairs price = 15000 * 2 = 30000
    expect(pricing.accessoriesPrice).toBe(30000);
  });

  it('should calculate railing accessory price correctly', () => {
    const config: MezzanineConfig = {
      length: 5000,
      width: 3000,
      height: 3000,
      loadCapacity: 250,
      accessories: [
        {
          id: '1',
          type: 'railing',
          quantity: 1,
          lengthMeters: 10,
        },
      ],
    };

    const pricing = calculatePricing(config);
    // Railing price = 800 * 10 * 1 = 8000
    expect(pricing.accessoriesPrice).toBe(8000);
  });

  it('should calculate pallet gate accessory price correctly', () => {
    const config: MezzanineConfig = {
      length: 5000,
      width: 3000,
      height: 3000,
      loadCapacity: 250,
      accessories: [
        {
          id: '1',
          type: 'pallet_gate',
          quantity: 1,
          width: '2000mm',
        },
      ],
    };

    const pricing = calculatePricing(config);
    // Pallet gate price = 12000 * 1 = 12000
    expect(pricing.accessoriesPrice).toBe(12000);
  });

  it('should calculate total price with multiple accessories', () => {
    const config: MezzanineConfig = {
      length: 5000,
      width: 3000,
      height: 3000,
      loadCapacity: 350, // 1.2x multiplier
      accessories: [
        { id: '1', type: 'stairs', quantity: 1, stairType: 'Straight 1m' },
        { id: '2', type: 'railing', quantity: 2, lengthMeters: 5 },
        { id: '3', type: 'pallet_gate', quantity: 1, width: '2000mm' },
      ],
    };

    const pricing = calculatePricing(config);
    // Base + dimension = 50000 + 90000 = 140000
    // With 1.2x multiplier = 168000
    // Accessories = 15000 + (800*5*2) + 12000 = 35000
    // Total = 168000 + 35000 = 203000
    expect(pricing.totalPrice).toBe(203000);
  });

  it('should calculate square meters correctly', () => {
    const config: MezzanineConfig = {
      length: 5000, // 5m
      width: 3000, // 3m
      height: 3000,
      loadCapacity: 250,
      accessories: [],
    };

    const pricing = calculatePricing(config);
    expect(pricing.squareMeters).toBe(15);
  });

  it('should calculate price per square meter', () => {
    const config: MezzanineConfig = {
      length: 5000,
      width: 3000,
      height: 3000,
      loadCapacity: 250,
      accessories: [],
    };

    const pricing = calculatePricing(config);
    // Total = (50000 + 90000) * 1.0 = 140000
    // Square meters = 15
    // Price per m² = 140000 / 15 = 9333.33...
    expect(pricing.pricePerSquareMeter).toBeCloseTo(9333.33, 2);
  });

  it('should calculate leasing options', () => {
    const config: MezzanineConfig = {
      length: 5000,
      width: 3000,
      height: 3000,
      loadCapacity: 250,
      accessories: [],
    };

    const pricing = calculatePricing(config);
    
    expect(pricing.leasing.threeYear).toBeGreaterThan(0);
    expect(pricing.leasing.fiveYear).toBeGreaterThan(0);
    // 5 year should be less per month than 3 year
    expect(pricing.leasing.fiveYear).toBeLessThan(pricing.leasing.threeYear);
  });
});

describe('formatPrice', () => {
  it('should format prices correctly', () => {
    expect(formatPrice(1234)).toBe('1 234');
    expect(formatPrice(123456)).toBe('123 456');
    expect(formatPrice(1234567)).toBe('1 234 567');
  });

  it('should round to nearest integer', () => {
    expect(formatPrice(1234.56)).toBe('1 235');
    expect(formatPrice(1234.44)).toBe('1 234');
  });
});

describe('formatNumber', () => {
  it('should format numbers with specified decimals', () => {
    expect(formatNumber(1234.5678, 2)).toBe('1 234,57');
    expect(formatNumber(1234.5678, 0)).toBe('1 235');
    expect(formatNumber(1234.5678, 3)).toBe('1 234,568');
  });

  it('should use Norwegian number formatting', () => {
    expect(formatNumber(1234.5, 1)).toBe('1 234,5');
  });
});

