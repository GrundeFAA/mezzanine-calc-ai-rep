/**
 * API service for handling quote requests
 * Mock implementation with simulated delays and success/failure scenarios
 */

import { QuoteRequest, ApiResponse } from '../types';

/**
 * Submit a quote request
 * Mock implementation with 90% success rate and 1.5s delay
 */
export async function submitQuoteRequest(
  request: QuoteRequest
): Promise<ApiResponse<{ requestId: string }>> {
  // Simulate network delay
  await delay(1500);

  // Simulate 90% success rate
  const isSuccess = Math.random() < 0.9;

  // Log the request (as specified)
  console.log('Quote Request Submitted:', {
    name: request.name,
    company: request.company,
    email: request.email,
    telephone: request.telephone,
    postalCode: request.postalCode,
    filesCount: request.files.length,
    configuration: request.configuration,
    includeInstallation: request.includeInstallation,
    message: request.message,
  });

  if (isSuccess) {
    return {
      success: true,
      message: 'Quote request submitted successfully! We will contact you within 24 hours.',
      data: {
        requestId: generateRequestId(),
      },
    };
  } else {
    return {
      success: false,
      message: 'Failed to submit quote request. Please try again later.',
    };
  }
}

/**
 * Generate a mock request ID
 */
function generateRequestId(): string {
  return `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

/**
 * Utility function to create a delay
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

