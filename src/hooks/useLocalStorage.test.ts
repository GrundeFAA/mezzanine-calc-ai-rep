/**
 * Tests for useLocalStorage hook
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with initial value when key does not exist', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should initialize with stored value when key exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('stored');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });

  it('should work with objects', () => {
    const initialObj = { name: 'test', count: 0 };
    const { result } = renderHook(() => useLocalStorage('test-obj', initialObj));

    expect(result.current[0]).toEqual(initialObj);

    act(() => {
      result.current[1]({ name: 'updated', count: 5 });
    });

    expect(result.current[0]).toEqual({ name: 'updated', count: 5 });
  });

  it('should support functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-count', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(2);
  });

  it('should handle JSON parse errors gracefully', () => {
    localStorage.setItem('test-key', 'invalid-json{');
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });

  it('should handle storage errors gracefully', () => {
    // Mock localStorage.setItem to throw an error
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new Error('Storage full');
    };

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    // Should not throw when trying to set value
    act(() => {
      result.current[1]('new-value');
    });

    // Restore original method
    Storage.prototype.setItem = originalSetItem;
  });

  it('should work with different data types', () => {
    // Number
    const { result: numberResult } = renderHook(() => useLocalStorage('num', 42));
    expect(numberResult.current[0]).toBe(42);

    // Boolean
    const { result: boolResult } = renderHook(() => useLocalStorage('bool', true));
    expect(boolResult.current[0]).toBe(true);

    // Array
    const { result: arrayResult } = renderHook(() =>
      useLocalStorage('arr', [1, 2, 3])
    );
    expect(arrayResult.current[0]).toEqual([1, 2, 3]);
  });
});

