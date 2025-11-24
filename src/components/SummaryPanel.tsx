/**
 * Summary Panel Component
 * Right sidebar displaying configuration summary, pricing, and export options
 */

import React from 'react';
import { MezzanineConfig, Pricing } from '../types';
import { formatPrice, formatNumber } from '../utils/pricing';
import { exportToCSV, exportToJSON } from '../utils/export';

interface SummaryPanelProps {
  config: MezzanineConfig;
  pricing: Pricing;
  onRequestQuote: () => void;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({
  config,
  pricing,
  onRequestQuote,
}) => {
  const handleExportCSV = () => {
    exportToCSV(config, pricing);
  };

  const handleExportJSON = () => {
    exportToJSON(config, pricing);
  };

  return (
    <div className="h-full overflow-y-auto bg-white shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Dimensions</h2>

      {/* Dimensions Summary */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-700">Length</span>
          <span className="font-semibold">{formatNumber(config.length / 1000, 3)} m</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-700">Width</span>
          <span className="font-semibold">{formatNumber(config.width / 1000, 3)} m</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-700">Height (ceiling clearance)</span>
          <span className="font-semibold">{formatNumber(config.height / 1000, 3)} m</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-700">Load Capacity</span>
          <span className="font-semibold">{config.loadCapacity} kg/m²</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-700">Square Meters</span>
          <span className="font-semibold">{formatNumber(pricing.squareMeters)} m²</span>
        </div>
      </div>

      {/* Accessories Summary */}
      {config.accessories.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Accessories</h3>
          <div className="space-y-2">
            {config.accessories.map((accessory) => {
              let details = '';
              if (accessory.type === 'stairs') {
                details = accessory.stairType;
              } else if (accessory.type === 'railing') {
                details = `${accessory.lengthMeters}m`;
              } else if (accessory.type === 'pallet_gate') {
                details = accessory.width;
              }

              return (
                <div key={accessory.id} className="flex justify-between text-sm">
                  <span className="text-gray-700 capitalize">
                    {accessory.type.replace('_', ' ')} - {details}
                  </span>
                  <span className="font-semibold">×{accessory.quantity}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pricing */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Pricing</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Base price</span>
            <span>{formatPrice(pricing.basePrice)} NOK</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Dimension-based</span>
            <span>{formatPrice(pricing.dimensionPrice)} NOK</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Load multiplier</span>
            <span>×{pricing.loadMultiplier}</span>
          </div>
          {pricing.accessoriesPrice > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Accessories</span>
              <span>{formatPrice(pricing.accessoriesPrice)} NOK</span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Total (excl. VAT)</span>
            <span className="text-red-600">{formatPrice(pricing.totalPrice)} NOK</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Price per m²</span>
            <span>{formatPrice(pricing.pricePerSquareMeter)} NOK</span>
          </div>
        </div>
      </div>

      {/* Leasing Options */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Leasing Options</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">3 years (2.9% APR)</span>
            <span className="font-semibold">
              {formatPrice(pricing.leasing.threeYear)} NOK/mo
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">5 years (3.5% APR)</span>
            <span className="font-semibold">
              {formatPrice(pricing.leasing.fiveYear)} NOK/mo
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Prices are estimates and may vary. Request a quote for exact pricing.
        </p>
      </div>

      {/* Export Buttons */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Export Configuration</h3>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors font-semibold"
          >
            CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors font-semibold"
          >
            JSON
          </button>
        </div>
      </div>

      {/* Request Quote Button */}
      <button
        onClick={onRequestQuote}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-colors font-bold text-lg shadow-lg"
      >
        REQUEST A QUOTE
      </button>
    </div>
  );
};

