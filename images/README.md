# Image Assets

## Required Favicon Files

Generate these from the `favicon.svg` source file:

1. `favicon.ico` - Multi-size ICO (16x16, 32x32, 48x48)
2. `favicon-16x16.png` - 16x16 PNG
3. `favicon-32x32.png` - 32x32 PNG  
4. `apple-touch-icon.png` - 180x180 PNG
5. `icon-192.png` - 192x192 PNG (PWA)
6. `icon-512.png` - 512x512 PNG (PWA)

## OG Images (1200x630)

- `og-default.png` - Default social share image
- `og-json-formatter.png` - JSON Formatter tool
- `og-password-generator.png` - Password Generator tool
- `og-uuid-generator.png` - UUID Generator tool
- `og-lorem-ipsum.png` - Lorem Ipsum Generator tool
- `og-qr-code-generator.png` - QR Code Generator tool

## How to Generate

Use https://realfavicongenerator.net/ with the favicon.svg file,
or use ImageMagick:

```bash
# From SVG to PNG (requires inkscape or rsvg-convert)
rsvg-convert -w 192 -h 192 favicon.svg > icon-192.png
rsvg-convert -w 512 -h 512 favicon.svg > icon-512.png
rsvg-convert -w 180 -h 180 favicon.svg > apple-touch-icon.png
rsvg-convert -w 32 -h 32 favicon.svg > favicon-32x32.png
rsvg-convert -w 16 -h 16 favicon.svg > favicon-16x16.png
```
