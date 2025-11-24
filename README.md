# Mezzanine Configurator

A modern, interactive web application for configuring and visualizing industrial mezzanine structures with real-time 3D rendering.

![Mezzanine Configurator](https://via.placeholder.com/800x400?text=Mezzanine+Configurator)

## Features

### 🎨 Interactive 3D Visualization

- Real-time 3D rendering using Three.js and React Three Fiber
- Interactive camera controls (orbit, pan, zoom)
- Realistic visualization of mezzanine structures with columns, platforms, stairs, railings, and gates
- Proper lighting and shadows for depth perception

### ⚙️ Configuration Panel

- **Adjustable Dimensions**: Configure length (2-20m), width (2-20m), and height (2-6m)
- **Load Capacity Options**: Choose between 250, 350, or 500 kg/m²
- **Accessories Management**:
  - Stairs (multiple types: 1m, 1.5m, 2m)
  - Railings (customizable length)
  - Pallet Gates (various widths: 2000mm, 2500mm, 3000mm)
- Add/remove accessories with quantity controls

### 💰 Pricing Calculator

- Dynamic pricing based on dimensions and load capacity
- Detailed breakdown of costs
- Accessories pricing
- Price per square meter calculation
- Leasing options (3-year and 5-year plans)

### 📤 Export Functionality

- Export configurations as CSV
- Export configurations as JSON
- Both formats include full configuration and pricing details

### 📋 Quote Request System

- Comprehensive quote request form
- File upload support (JPG, PNG, PDF)
- Optional installation quote
- Mock API integration with 90% success rate simulation
- Real-time form validation

### 💾 Persistent Storage

- Configuration automatically saved to localStorage
- Cross-tab synchronization
- Settings persist across browser sessions

## Tech Stack

- **React 19+** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Three.js** - 3D graphics
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **Vitest** - Unit testing
- **@testing-library/react** - Component testing

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd mezzanine-configurator
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

### Development

```bash
npm run dev
```

Starts the development server with hot module replacement.

### Build

```bash
npm run build
```

Creates an optimized production build in the `dist/` directory.

### Preview

```bash
npm run preview
```

Previews the production build locally.

### Testing

```bash
npm run test
```

Runs the test suite in watch mode.

```bash
npm run test:ui
```

Opens the Vitest UI for interactive testing.

```bash
npm run test:coverage
```

Generates test coverage report.

## Project Structure

```
mezzanine-configurator/
├── src/
│   ├── components/          # React components
│   │   ├── ConfigurationPanel.tsx
│   │   ├── MezzanineViewer.tsx
│   │   ├── SummaryPanel.tsx
│   │   └── QuoteRequestModal.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useLocalStorage.ts
│   │   └── useLocalStorage.test.ts
│   ├── services/           # API services
│   │   ├── api.ts
│   │   └── api.test.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── pricing.ts
│   │   ├── pricing.test.ts
│   │   ├── export.ts
│   │   └── export.test.ts
│   ├── test/               # Test configuration
│   │   └── setup.ts
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── README.md              # This file
```

## Key Features Explained

### 3D Visualization

The 3D viewer uses React Three Fiber to render:

- **Base Platform**: Light grey platform at ground level (0.1m thick)
- **Support Columns**: Four cylindrical columns at corners (0.1m radius)
- **Floor Platform**: Light yellow platform at configured height (0.05m thick)
- **Stairs**: Rendered with ~15 steps, positioned at front edge
- **Railings**: 1.1m high with top/middle/bottom rails and vertical posts
- **Pallet Gates**: Same structure as railings but gold colored

The visualization intelligently positions accessories to avoid overlaps and provides realistic scale reference with a grid helper.

### Pricing Algorithm

Pricing is calculated using the following formula:

```
subtotal = basePrice + (volume × pricePerCubicMeter)
total = (subtotal × loadCapacityMultiplier) + accessoriesPrice
```

Where:

- Base price: 50,000 NOK
- Price per cubic meter: 2,000 NOK
- Load multipliers: 250kg→1.0x, 350kg→1.2x, 500kg→1.5x
- Accessories: Stairs=15,000, Railings=800/m, Gates=12,000

### State Management

The application uses a custom `useLocalStorage` hook for state persistence:

- Automatically saves configuration changes
- Syncs across browser tabs using Storage events
- Handles errors gracefully
- Supports complex object types

### Testing

Comprehensive test suite covering:

- Custom hooks (useLocalStorage)
- Utility functions (pricing calculations, export functions)
- API service (mock delays and success rates)
- Edge cases and error handling

## Configuration Options

### Dimensions

- **Length**: 2,000 - 20,000 mm (step: 100 mm)
- **Width**: 2,000 - 20,000 mm (step: 100 mm)
- **Height**: 2,000 - 6,000 mm (step: 100 mm)

### Load Capacity

- 250 kg/m² (1.0x multiplier)
- 350 kg/m² (1.2x multiplier)
- 500 kg/m² (1.5x multiplier)

### Accessories

#### Stairs

- Straight 1m
- Straight 1.5m
- Straight 2m
- Price: 15,000 NOK per unit

#### Railings

- Customizable length (1-50 meters)
- 1.1m height with safety rails
- Price: 800 NOK per meter

#### Pallet Gates

- 2000mm width
- 2500mm width
- 3000mm width
- Price: 12,000 NOK per unit

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Performance Considerations

- 3D rendering is optimized for smooth 60 FPS
- Large configurations are handled efficiently
- LocalStorage is used for minimal overhead
- Components are memoized where appropriate

## Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow React best practices
- Write comprehensive comments for complex logic
- Maintain consistent naming conventions

### Testing

- Write tests for all utility functions
- Test error handling and edge cases
- Maintain >80% code coverage
- Use descriptive test names

### Component Design

- Keep components focused and single-purpose
- Use TypeScript interfaces for props
- Implement proper error boundaries
- Handle loading and error states

## Future Enhancements

Potential features for future releases:

- [ ] Save multiple configurations
- [ ] Share configurations via URL
- [ ] Multi-level mezzanines
- [ ] Custom materials and colors
- [ ] AR visualization support
- [ ] Real-time collaboration
- [ ] PDF report generation
- [ ] Integration with actual backend API

## Troubleshooting

### Development Server Issues

If the dev server won't start:

```bash
rm -rf node_modules
npm install
npm run dev
```

### Build Failures

Check that all dependencies are installed:

```bash
npm ci
npm run build
```

### Test Failures

Clear test cache:

```bash
npm run test -- --clearCache
```

## License

This project is proprietary software. All rights reserved.

## Contributing

This is a private project. Please contact the project maintainers for contribution guidelines.

## Support

For support, please contact: support@example.com

---

Built with ❤️ using React, TypeScript, and Three.js
