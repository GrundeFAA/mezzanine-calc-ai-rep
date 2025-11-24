/**
 * Type definitions for the Mezzanine Configurator application
 */

/** Load capacity options in kg/m² */
export type LoadCapacity = 250 | 350 | 500;

/** Stair type options */
export type StairType = 'Straight 1m' | 'Straight 1.5m' | 'Straight 2m';

/** Pallet gate width options in mm */
export type PalletGateWidth = '2000mm' | '2500mm' | '3000mm';

/** Base accessory interface */
export interface Accessory {
  id: string;
  type: 'stairs' | 'railing' | 'pallet_gate';
  quantity: number;
}

/** Stairs accessory */
export interface StairsAccessory extends Accessory {
  type: 'stairs';
  stairType: StairType;
}

/** Railing accessory */
export interface RailingAccessory extends Accessory {
  type: 'railing';
  lengthMeters: number;
}

/** Pallet gate accessory */
export interface PalletGateAccessory extends Accessory {
  type: 'pallet_gate';
  width: PalletGateWidth;
}

/** Union type for all accessories */
export type AnyAccessory = StairsAccessory | RailingAccessory | PalletGateAccessory;

/** Main mezzanine configuration */
export interface MezzanineConfig {
  /** Length in millimeters */
  length: number;
  /** Width in millimeters */
  width: number;
  /** Height in millimeters */
  height: number;
  /** Load capacity in kg/m² */
  loadCapacity: LoadCapacity;
  /** List of accessories */
  accessories: AnyAccessory[];
}

/** Pricing breakdown */
export interface Pricing {
  /** Base price */
  basePrice: number;
  /** Dimension-based price */
  dimensionPrice: number;
  /** Load capacity multiplier */
  loadMultiplier: number;
  /** Total accessories price */
  accessoriesPrice: number;
  /** Total price */
  totalPrice: number;
  /** Price per square meter */
  pricePerSquareMeter: number;
  /** Square meters */
  squareMeters: number;
  /** Leasing options */
  leasing: {
    threeYear: number;
    fiveYear: number;
  };
}

/** Quote request form data */
export interface QuoteRequest {
  name: string;
  company: string;
  email: string;
  telephone: string;
  postalCode: string;
  files: File[];
  configuration: MezzanineConfig;
  includeInstallation: boolean;
  message: string;
}

/** API response */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

