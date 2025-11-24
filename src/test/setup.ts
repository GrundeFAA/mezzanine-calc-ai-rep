/**
 * Test setup file
 * Configures testing environment with necessary polyfills and matchers
 */

import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock localStorage for tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock URL.createObjectURL for file download tests
Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: () => 'mock-url',
});

Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: () => {},
});

