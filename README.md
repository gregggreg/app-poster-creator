# App Store Poster Creator

Create beautiful, print-ready promotional posters for iOS apps with customizable iPhone frames, QR codes, and professional layouts.

![App Store Poster Creator Preview](https://via.placeholder.com/800x400)

## Features

- 🎨 **Professional Design** - Generate 8.5x11" print-ready posters
- 📱 **Device Support** - iPhone and iPad with automatic portrait/landscape orientation detection
- 🖼️ **Flexible Frame Options** - No frame, device frame, classic notch, or Dynamic Island
- 🔄 **Screenshot Navigation** - Browse through all available app screenshots
- 🎯 **Smart Layout** - Automatic frame sizing based on screenshot aspect ratio
- 🏢 **Company Branding** - Add your company logo with persistent storage
- ✏️ **Customizable Content** - Edit app tagline directly in the poster
- 🔗 **QR Code Generation** - Include scannable QR codes with App Store badge
- 🖨️ **Print Optimized** - Clean PDF output across different browsers

## Demo

Try it live at [https://app-poster.com](https://app-poster.com)

## Quick Start

### Prerequisites

- Node.js 16.0 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/app-poster-creator.git

# Navigate to the project directory
cd app-poster-creator

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

1. **Enter App Store URL**: Paste any Apple App Store URL (e.g., `https://apps.apple.com/app/id123456789`)

2. **Customize Your Poster**:
   - **Device Type**: Choose between iPhone or iPad
   - **Frame Style**: 
     - No Frame (screenshot only)
     - Device Frame
     - Device Frame with Notch (iPhone only)
     - Device Frame with Dynamic Island (iPhone only)
   - **Content Padding**: Minimal (12px), Normal (16px), or Comfortable (20px)
   - **Screen Corners**: Square, Slight (8px), Rounded (16px), or Match Frame
   - **Screenshot**: Navigate through available screenshots or provide custom URL
   - **Tagline**: Edit the app description shown on the poster
   - **Company Logo**: Add your company logo URL (saved for future use)

3. **Print or Save**: Click "Print Poster" to generate a PDF

## API Integration

The app uses the iTunes Search API to fetch app metadata:

```javascript
https://itunes.apple.com/lookup?id={appId}
```

No API key is required for basic usage.

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

### Printing Tips

- **Chrome**: Use File → Print → Save as PDF
- **Safari**: Use File → Print → PDF button (bottom-left)
- **Firefox**: Best consistency for PDF rendering

## Development

### Project Structure

```
app-poster-creator/
├── src/
│   ├── App.jsx          # Main app component and routing
│   ├── Poster.jsx       # Poster generation component
│   ├── App.css          # Home page styles
│   ├── Poster.css       # Poster and print styles
│   └── index.css        # Global styles
├── public/
└── package.json
```

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Configuration

### Environment Variables

Create a `.env` file for custom configuration:

```env
VITE_APP_TITLE=App Store Poster Creator
VITE_DEFAULT_PADDING=normal
VITE_DEFAULT_CORNER_STYLE=rounded
```

### Customization

You can customize the poster layout by modifying:

- Frame dimensions in `Poster.css`
- Default options in `Poster.jsx`
- Print margins and layout in the `@media print` section

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- App data provided by [Apple iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/)
- QR codes generated with [qrcode](https://www.npmjs.com/package/qrcode)
- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)

## Support

If you encounter any issues or have suggestions:

- Open an issue on [GitHub](https://github.com/gregggreg/app-poster-creator/issues)
- Contact: greg <at> cromulentlabs.com

---

Made with ❤️ for iOS developers and marketers
