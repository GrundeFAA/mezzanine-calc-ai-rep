/**
 * Tests for API service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitQuoteRequest } from './api';
import { QuoteRequest } from '../types';

describe('submitQuoteRequest', () => {
  let mockRequest: QuoteRequest;

  beforeEach(() => {
    mockRequest = {
      name: 'John Doe',
      company: 'Test Company',
      email: 'john@example.com',
      telephone: '+47 12345678',
      postalCode: '0150',
      files: [],
      configuration: {
        length: 5000,
        width: 3000,
        height: 3000,
        loadCapacity: 250,
        accessories: [],
      },
      includeInstallation: true,
      message: 'Test message',
    };

    // Spy on console.log
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should delay for approximately 1.5 seconds', async () => {
    const startTime = Date.now();
    await submitQuoteRequest(mockRequest);
    const endTime = Date.now();
    const elapsed = endTime - startTime;

    // Allow some margin for test execution
    expect(elapsed).toBeGreaterThanOrEqual(1400);
    expect(elapsed).toBeLessThan(2000);
  });

  it('should log the request to console', async () => {
    await submitQuoteRequest(mockRequest);

    expect(console.log).toHaveBeenCalledWith(
      'Quote Request Submitted:',
      expect.objectContaining({
        name: 'John Doe',
        company: 'Test Company',
        email: 'john@example.com',
        telephone: '+47 12345678',
        postalCode: '0150',
        includeInstallation: true,
        message: 'Test message',
      })
    );
  });

  it('should return success response with request ID', async () => {
    // Mock Math.random to always return high value for success
    vi.spyOn(Math, 'random').mockReturnValue(0.95);

    const response = await submitQuoteRequest(mockRequest);

    expect(response.success).toBe(true);
    expect(response.message).toContain('successfully');
    expect(response.data?.requestId).toBeDefined();
    expect(response.data?.requestId).toMatch(/^REQ-/);
  });

  it('should return error response when random is low', async () => {
    // Mock Math.random to return low value for failure (< 0.9)
    vi.spyOn(Math, 'random').mockReturnValue(0.05);

    const response = await submitQuoteRequest(mockRequest);

    expect(response.success).toBe(false);
    expect(response.message).toContain('Failed');
  });

  it('should generate unique request IDs', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.95);

    const response1 = await submitQuoteRequest(mockRequest);
    const response2 = await submitQuoteRequest(mockRequest);

    expect(response1.data?.requestId).not.toBe(response2.data?.requestId);
  });

  it('should handle file uploads in the request', async () => {
    const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    mockRequest.files = [mockFile];

    await submitQuoteRequest(mockRequest);

    expect(console.log).toHaveBeenCalledWith(
      'Quote Request Submitted:',
      expect.objectContaining({
        filesCount: 1,
      })
    );
  });

  it('should succeed approximately 90% of the time over multiple calls', async () => {
    // Run 100 requests and check success rate
    const results = await Promise.all(
      Array.from({ length: 100 }, () => submitQuoteRequest(mockRequest))
    );

    const successCount = results.filter((r) => r.success).length;
    
    // Allow some variance (between 80% and 100% due to randomness)
    expect(successCount).toBeGreaterThan(80);
    expect(successCount).toBeLessThanOrEqual(100);
  });
});

