/**
 * Configuration Panel Component
 * Left sidebar for adjusting mezzanine dimensions, load capacity, and accessories
 */

import React from 'react';
import {
  MezzanineConfig,
  LoadCapacity,
  StairType,
  PalletGateWidth,
  AnyAccessory,
  StairsAccessory,
  RailingAccessory,
  PalletGateAccessory,
} from '../types';

interface ConfigurationPanelProps {
  config: MezzanineConfig;
  onChange: (config: MezzanineConfig) => void;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  config,
  onChange,
}) => {
  const updateDimension = (key: 'length' | 'width' | 'height', value: number) => {
    onChange({ ...config, [key]: value });
  };

  const updateLoadCapacity = (capacity: LoadCapacity) => {
    onChange({ ...config, loadCapacity: capacity });
  };

  const addAccessory = (type: 'stairs' | 'railing' | 'pallet_gate') => {
    let newAccessory: AnyAccessory;
    const id = `${type}-${Date.now()}`;

    if (type === 'stairs') {
      newAccessory = {
        id,
        type: 'stairs',
        quantity: 1,
        stairType: 'Straight 1m',
      } as StairsAccessory;
    } else if (type === 'railing') {
      newAccessory = {
        id,
        type: 'railing',
        quantity: 1,
        lengthMeters: 5,
      } as RailingAccessory;
    } else {
      newAccessory = {
        id,
        type: 'pallet_gate',
        quantity: 1,
        width: '2000mm',
      } as PalletGateAccessory;
    }

    onChange({ ...config, accessories: [...config.accessories, newAccessory] });
  };

  const removeAccessory = (id: string) => {
    onChange({
      ...config,
      accessories: config.accessories.filter((a) => a.id !== id),
    });
  };

  const updateAccessory = (id: string, updates: Partial<AnyAccessory>) => {
    onChange({
      ...config,
      accessories: config.accessories.map((a) =>
        a.id === id ? ({ ...a, ...updates } as AnyAccessory) : a
      ),
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-white shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Adjust Dimensions and Load</h2>

      {/* Dimensions */}
      <div className="mb-6">
        <h3 className="font-semibold mb-4">Dimensions</h3>

        {/* Length */}
        <div className="mb-4">
          <label className="block text-sm mb-2">
            Choose length (mm): <span className="font-bold">{config.length}</span>
          </label>
          <input
            type="range"
            min="2000"
            max="20000"
            step="100"
            value={config.length}
            onChange={(e) => updateDimension('length', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>2000</span>
            <span>20000</span>
          </div>
        </div>

        {/* Width */}
        <div className="mb-4">
          <label className="block text-sm mb-2">
            Choose width (mm): <span className="font-bold">{config.width}</span>
          </label>
          <input
            type="range"
            min="2000"
            max="20000"
            step="100"
            value={config.width}
            onChange={(e) => updateDimension('width', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>2000</span>
            <span>20000</span>
          </div>
        </div>

        {/* Height */}
        <div className="mb-4">
          <label className="block text-sm mb-2">
            Choose height (mm): <span className="font-bold">{config.height}</span>
          </label>
          <input
            type="range"
            min="2000"
            max="6000"
            step="100"
            value={config.height}
            onChange={(e) => updateDimension('height', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>2000</span>
            <span>6000</span>
          </div>
        </div>
      </div>

      {/* Load Capacity */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Load Capacity per m²</h3>
        <div className="grid grid-cols-3 gap-2">
          {[250, 350, 500].map((capacity) => (
            <button
              key={capacity}
              onClick={() => updateLoadCapacity(capacity as LoadCapacity)}
              className={`py-2 px-3 rounded font-semibold transition-colors ${
                config.loadCapacity === capacity
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {capacity}KG
            </button>
          ))}
        </div>
      </div>

      {/* Accessories */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Add Accessories</h3>

        {/* Add buttons */}
        <div className="flex flex-col gap-2 mb-4">
          <button
            onClick={() => addAccessory('stairs')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded transition-colors text-left"
          >
            + Add Stairs
          </button>
          <button
            onClick={() => addAccessory('railing')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded transition-colors text-left"
          >
            + Add Railing
          </button>
          <button
            onClick={() => addAccessory('pallet_gate')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded transition-colors text-left"
          >
            + Add Pallet Gate
          </button>
        </div>

        {/* Accessory list */}
        {config.accessories.length > 0 && (
          <div className="space-y-3">
            {config.accessories.map((accessory) => (
              <div
                key={accessory.id}
                className="border border-gray-300 rounded p-3 bg-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold capitalize">
                    {accessory.type.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => removeAccessory(accessory.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>

                {/* Type-specific controls */}
                {accessory.type === 'stairs' && (
                  <div className="mb-2">
                    <label className="block text-xs mb-1">Type:</label>
                    <select
                      value={accessory.stairType}
                      onChange={(e) =>
                        updateAccessory(accessory.id, {
                          stairType: e.target.value as StairType,
                        })
                      }
                      className="w-full p-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="Straight 1m">Straight 1m</option>
                      <option value="Straight 1.5m">Straight 1.5m</option>
                      <option value="Straight 2m">Straight 2m</option>
                    </select>
                  </div>
                )}

                {accessory.type === 'railing' && (
                  <div className="mb-2">
                    <label className="block text-xs mb-1">Length (meters):</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={accessory.lengthMeters}
                      onChange={(e) =>
                        updateAccessory(accessory.id, {
                          lengthMeters: Number(e.target.value),
                        })
                      }
                      className="w-full p-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                )}

                {accessory.type === 'pallet_gate' && (
                  <div className="mb-2">
                    <label className="block text-xs mb-1">Width:</label>
                    <select
                      value={accessory.width}
                      onChange={(e) =>
                        updateAccessory(accessory.id, {
                          width: e.target.value as PalletGateWidth,
                        })
                      }
                      className="w-full p-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="2000mm">2000mm</option>
                      <option value="2500mm">2500mm</option>
                      <option value="3000mm">3000mm</option>
                    </select>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="block text-xs mb-1">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={accessory.quantity}
                    onChange={(e) =>
                      updateAccessory(accessory.id, {
                        quantity: Number(e.target.value),
                      })
                    }
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

