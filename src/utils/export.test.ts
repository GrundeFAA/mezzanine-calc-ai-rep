/**
 * Tests for export utilities
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportToCSV, exportToJSON } from './export';
import { MezzanineConfig, Pricing } from '../types';

describe('exportToCSV', () => {
  let mockConfig: MezzanineConfig;
  let mockPricing: Pricing;
  let mockLink: HTMLAnchorElement;

  beforeEach(() => {
    mockConfig = {
      length: 5000,
      width: 3000,
      height: 3000,
      loadCapacity: 250,
      accessories: [
        { id: '1', type: 'stairs', quantity: 1, stairType: 'Straight 1m' },
        { id: '2', type: 'railing', quantity: 1, lengthMeters: 10 },
      ],
    };

    mockPricing = {
      basePrice: 50000,
      dimensionPrice: 90000,
      loadMultiplier: 1.0,
      accessoriesPrice: 23000,
      totalPrice: 163000,
      pricePerSquareMeter: 10866.67,
      squareMeters: 15,
      leasing: {
        threeYear: 4800,
        fiveYear: 3100,
      },
    };

    // Mock document.createElement and related methods
    mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
    } as unknown as HTMLAnchorElement;

    vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);
  });

  it('should create a CSV file with correct structure', () => {
    exportToCSV(mockConfig, mockPricing);

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockLink.download).toBe('mezzanine-configuration.csv');
    expect(mockLink.click).toHaveBeenCalled();
  });

  it('should include dimensions in CSV', () => {
    exportToCSV(mockConfig, mockPricing);
    
    // The href should contain a blob URL
    expect(mockLink.href).toContain('mock-url');
  });

  it('should trigger download', () => {
    exportToCSV(mockConfig, mockPricing);

    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
    expect(mockLink.click).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
  });
});

describe('exportToJSON', () => {
  let mockConfig: MezzanineConfig;
  let mockPricing: Pricing;
  let mockLink: HTMLAnchorElement;

  beforeEach(() => {
    mockConfig = {
      length: 5000,
      width: 3000,
      height: 3000,
      loadCapacity: 250,
      accessories: [],
    };

    mockPricing = {
      basePrice: 50000,
      dimensionPrice: 90000,
      loadMultiplier: 1.0,
      accessoriesPrice: 0,
      totalPrice: 140000,
      pricePerSquareMeter: 9333.33,
      squareMeters: 15,
      leasing: {
        threeYear: 4100,
        fiveYear: 2650,
      },
    };

    mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
    } as unknown as HTMLAnchorElement;

    vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);
  });

  it('should create a JSON file', () => {
    exportToJSON(mockConfig, mockPricing);

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockLink.download).toBe('mezzanine-configuration.json');
    expect(mockLink.click).toHaveBeenCalled();
  });

  it('should trigger download', () => {
    exportToJSON(mockConfig, mockPricing);

    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
    expect(mockLink.click).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
  });
});

