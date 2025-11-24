/**
 * Quote Request Modal Component
 * Form for requesting a quote with current configuration
 */

import React, { useState } from 'react';
import { MezzanineConfig, QuoteRequest } from '../types';
import { submitQuoteRequest } from '../services/api';
import { formatNumber } from '../utils/pricing';

interface QuoteRequestModalProps {
  config: MezzanineConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({
  config,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    telephone: '',
    postalCode: '',
    includeInstallation: false,
    message: '',
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter((file) => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        return ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'pdf';
      });
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    const quoteRequest: QuoteRequest = {
      ...formData,
      files,
      configuration: config,
    };

    try {
      const response = await submitQuoteRequest(quoteRequest);

      if (response.success) {
        setSubmitMessage({ type: 'success', text: response.message });
        // Auto-close after 3 seconds on success
        setTimeout(() => {
          onClose();
          resetForm();
        }, 3000);
      } else {
        setSubmitMessage({ type: 'error', text: response.message });
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      company: '',
      email: '',
      telephone: '',
      postalCode: '',
      includeInstallation: false,
      message: '',
    });
    setFiles([]);
    setSubmitMessage(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-red-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Request a Quote</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
              disabled={isSubmitting}
            >
              ×
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Configuration Summary (Read-only) */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Current Configuration</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Length:</span>{' '}
                <span className="font-semibold">{formatNumber(config.length / 1000, 1)} m</span>
              </div>
              <div>
                <span className="text-gray-600">Width:</span>{' '}
                <span className="font-semibold">{formatNumber(config.width / 1000, 1)} m</span>
              </div>
              <div>
                <span className="text-gray-600">Height:</span>{' '}
                <span className="font-semibold">{formatNumber(config.height / 1000, 1)} m</span>
              </div>
              <div>
                <span className="text-gray-600">Load:</span>{' '}
                <span className="font-semibold">{config.loadCapacity} kg/m²</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Accessories:</span>{' '}
                <span className="font-semibold">{config.accessories.length} items</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Telephone <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {/* File Upload */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Upload Pictures/Drawings (JPG, PNG, PDF)
            </label>
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 px-3 py-1 rounded text-sm"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Installation Quote */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="includeInstallation"
                checked={formData.includeInstallation}
                onChange={handleInputChange}
                className="mr-2 w-4 h-4 accent-red-600"
              />
              <span className="text-sm font-semibold">
                Include installation quote
              </span>
            </label>
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1">
              Additional Notes/Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
              placeholder="Any special requirements or questions..."
            />
          </div>

          {/* Submit Message */}
          {submitMessage && (
            <div
              className={`mb-4 p-3 rounded ${
                submitMessage.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {submitMessage.text}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

