/**
 * Export utilities for mezzanine configuration data
 */

import { MezzanineConfig, Pricing } from '../types';

/**
 * Export configuration and pricing data as CSV
 */
export function exportToCSV(config: MezzanineConfig, pricing: Pricing): void {
  const lines: string[] = [];
  
  // Header
  lines.push('Mezzanine Configuration Export');
  lines.push('');
  
  // Dimensions
  lines.push('Dimensions');
  lines.push(`Length (mm),${config.length}`);
  lines.push(`Width (mm),${config.width}`);
  lines.push(`Height (mm),${config.height}`);
  lines.push(`Square meters,${pricing.squareMeters.toFixed(2)}`);
  lines.push('');
  
  // Load capacity
  lines.push('Load Capacity');
  lines.push(`kg/m²,${config.loadCapacity}`);
  lines.push('');
  
  // Accessories
  lines.push('Accessories');
  lines.push('Type,Details,Quantity');
  config.accessories.forEach((accessory) => {
    let details = '';
    if (accessory.type === 'stairs') {
      details = accessory.stairType;
    } else if (accessory.type === 'railing') {
      details = `${accessory.lengthMeters}m`;
    } else if (accessory.type === 'pallet_gate') {
      details = accessory.width;
    }
    lines.push(`${accessory.type},${details},${accessory.quantity}`);
  });
  lines.push('');
  
  // Pricing
  lines.push('Pricing');
  lines.push(`Base price,${pricing.basePrice}`);
  lines.push(`Dimension price,${pricing.dimensionPrice.toFixed(2)}`);
  lines.push(`Load multiplier,${pricing.loadMultiplier}`);
  lines.push(`Accessories price,${pricing.accessoriesPrice}`);
  lines.push(`Total price,${pricing.totalPrice.toFixed(2)}`);
  lines.push(`Price per m²,${pricing.pricePerSquareMeter.toFixed(2)}`);
  lines.push('');
  
  // Leasing
  lines.push('Leasing Options (Monthly)');
  lines.push(`3 years (2.9%),${pricing.leasing.threeYear.toFixed(2)}`);
  lines.push(`5 years (3.5%),${pricing.leasing.fiveYear.toFixed(2)}`);
  
  const csvContent = lines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, 'mezzanine-configuration.csv');
}

/**
 * Export configuration and pricing data as JSON
 */
export function exportToJSON(config: MezzanineConfig, pricing: Pricing): void {
  const data = {
    configuration: config,
    pricing: pricing,
    exportDate: new Date().toISOString(),
  };
  
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  downloadFile(blob, 'mezzanine-configuration.json');
}

/**
 * Trigger a file download in the browser
 */
function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

