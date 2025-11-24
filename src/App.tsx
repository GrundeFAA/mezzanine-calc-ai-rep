/**
 * Main Application Component
 * Orchestrates the entire mezzanine configurator application
 */

import React, { useState, useMemo } from 'react';
import { MezzanineConfig } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculatePricing } from './utils/pricing';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { MezzanineViewer } from './components/MezzanineViewer';
import { SummaryPanel } from './components/SummaryPanel';
import { QuoteRequestModal } from './components/QuoteRequestModal';

/**
 * Default mezzanine configuration
 */
const DEFAULT_CONFIG: MezzanineConfig = {
  length: 9000, // 9m
  width: 3000, // 3m
  height: 3000, // 3m
  loadCapacity: 250,
  accessories: [
    {
      id: 'default-railing-1',
      type: 'railing',
      quantity: 1,
      lengthMeters: 10,
    },
  ],
};

const App: React.FC = () => {
  // Persist configuration in localStorage with cross-tab sync
  const [config, setConfig] = useLocalStorage<MezzanineConfig>(
    'mezzanine-config',
    DEFAULT_CONFIG
  );

  // Quote modal state
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Calculate pricing based on current configuration
  const pricing = useMemo(() => calculatePricing(config), [config]);

  // Reset to default configuration
  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Mezzanine Configurator
        </h1>
        <button
          onClick={handleReset}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold transition-colors"
        >
          Reset to Default
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[350px_1fr_350px] gap-0 overflow-hidden">
        {/* Left Panel - Configuration */}
        <div className="hidden lg:block">
          <ConfigurationPanel config={config} onChange={setConfig} />
        </div>

        {/* Center Panel - 3D Viewer */}
        <div className="h-full">
          <MezzanineViewer config={config} />
        </div>

        {/* Right Panel - Summary */}
        <div className="hidden lg:block">
          <SummaryPanel
            config={config}
            pricing={pricing}
            onRequestQuote={() => setIsQuoteModalOpen(true)}
          />
        </div>
      </main>

      {/* Mobile panels - Stacked layout for smaller screens */}
      <div className="lg:hidden overflow-y-auto">
        <ConfigurationPanel config={config} onChange={setConfig} />
        <SummaryPanel
          config={config}
          pricing={pricing}
          onRequestQuote={() => setIsQuoteModalOpen(true)}
        />
      </div>

      {/* Quote Request Modal */}
      <QuoteRequestModal
        config={config}
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </div>
  );
};

export default App;

