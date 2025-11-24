# Quick Start Guide

Get the Mezzanine Configurator up and running in under 5 minutes!

## 🚀 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:5173`

## 🎯 Quick Tour

### 1. Configure Your Mezzanine
**Left Panel** - Adjust dimensions using sliders:
- Length: 2m - 20m
- Width: 2m - 20m  
- Height: 2m - 6m

Select load capacity: 250, 350, or 500 kg/m²

### 2. Add Accessories
Click to add:
- **Stairs**: Choose from 1m, 1.5m, or 2m depths
- **Railings**: Specify length in meters
- **Pallet Gates**: Select width (2000mm, 2500mm, or 3000mm)

Adjust quantities and remove as needed.

### 3. View in 3D
**Center Panel** - Interactive 3D visualization:
- **Rotate**: Left-click and drag
- **Pan**: Right-click and drag (or Ctrl+Left-click)
- **Zoom**: Mouse wheel

### 4. Review Pricing
**Right Panel** - See detailed breakdown:
- Total cost
- Cost per m²
- Leasing options

### 5. Export or Request Quote
- Export as CSV or JSON
- Click "REQUEST A QUOTE" to submit inquiry

## 🧪 Run Tests

```bash
# Run all tests
npm run test

# Watch mode (recommended during development)
npm run test -- --watch

# With UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 🏗️ Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

Preview the build:
```bash
npm run preview
```

## 📝 Common Tasks

### Reset Configuration
Click **"Reset to Default"** button in the header.

### Change Load Capacity
Click one of the three buttons: 250KG, 350KG, or 500KG

### Remove All Accessories
Click "Remove" on each accessory card.

### Cross-Tab Sync
Open the app in multiple tabs - changes sync automatically via localStorage!

## 🔧 Development Tips

### File Structure
```
src/
├── components/     # React components
├── hooks/          # Custom hooks
├── services/       # API services
├── types/          # TypeScript types
├── utils/          # Utility functions
└── test/           # Test setup
```

### Key Files
- `App.tsx` - Main application
- `types/index.ts` - All TypeScript interfaces
- `utils/pricing.ts` - Pricing calculations
- `components/MezzanineViewer.tsx` - 3D visualization

### Hot Module Replacement
Changes to any `.tsx` or `.ts` file will automatically reload in the browser.

### TypeScript Checking
TypeScript is checked during:
- Development (in your editor)
- Build time (`npm run build`)
- The build will fail if there are type errors

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is busy:
```bash
npm run dev -- --port 3000
```

### Clear Cache
```bash
rm -rf node_modules
npm install
```

### 3D Scene Not Rendering
- Check browser console for WebGL errors
- Ensure your GPU supports WebGL 2.0
- Try a different browser (Chrome/Firefox recommended)

### Tests Failing
Clear test cache:
```bash
npm run test -- --clearCache
```

## 📚 Learn More

- See [README.md](./README.md) for comprehensive documentation
- See [RAILINGS_DETAILED_EXPLANATION.md](./RAILINGS_DETAILED_EXPLANATION.md) for 3D rendering details

## 💡 Pro Tips

1. **Keyboard Navigation**: Use arrow keys + Shift to fine-tune camera position
2. **Performance**: Close other tabs for smoother 3D rendering
3. **Precision**: Hold Shift while dragging sliders for finer control
4. **Mobile**: The app is responsive - try it on your phone!
5. **Persistence**: Your configuration is automatically saved and restored

## 🎉 You're Ready!

Start configuring your mezzanine structure. Have fun! 🏗️

