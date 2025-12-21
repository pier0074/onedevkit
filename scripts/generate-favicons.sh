#!/bin/bash
# OneDevKit - Favicon Generator Script
# Requires: Inkscape OR rsvg-convert OR ImageMagick with SVG support
#
# Usage: ./scripts/generate-favicons.sh
#
# This script generates all required favicon sizes from the SVG source.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
IMAGES_DIR="$PROJECT_DIR/images"
SVG_SOURCE="$IMAGES_DIR/favicon.svg"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🎨 OneDevKit Favicon Generator"
echo "================================"

# Check if SVG exists
if [ ! -f "$SVG_SOURCE" ]; then
    echo -e "${RED}Error: SVG source not found at $SVG_SOURCE${NC}"
    exit 1
fi

# Detect available tool
CONVERTER=""
if command -v rsvg-convert &> /dev/null; then
    CONVERTER="rsvg"
    echo -e "${GREEN}✓ Using rsvg-convert${NC}"
elif command -v inkscape &> /dev/null; then
    CONVERTER="inkscape"
    echo -e "${GREEN}✓ Using Inkscape${NC}"
elif command -v magick &> /dev/null; then
    CONVERTER="magick"
    echo -e "${GREEN}✓ Using ImageMagick${NC}"
elif command -v convert &> /dev/null; then
    CONVERTER="convert"
    echo -e "${GREEN}✓ Using ImageMagick (convert)${NC}"
else
    echo -e "${RED}Error: No SVG converter found.${NC}"
    echo ""
    echo "Please install one of the following:"
    echo "  macOS:   brew install librsvg"
    echo "  Ubuntu:  sudo apt install librsvg2-bin"
    echo "  Or:      brew install imagemagick"
    echo ""
    exit 1
fi

# Function to convert SVG to PNG
convert_svg() {
    local size=$1
    local output=$2

    case $CONVERTER in
        rsvg)
            rsvg-convert -w "$size" -h "$size" "$SVG_SOURCE" -o "$output"
            ;;
        inkscape)
            inkscape "$SVG_SOURCE" -w "$size" -h "$size" -o "$output" 2>/dev/null
            ;;
        magick)
            magick -background none -density 300 "$SVG_SOURCE" -resize "${size}x${size}" "$output"
            ;;
        convert)
            convert -background none -density 300 "$SVG_SOURCE" -resize "${size}x${size}" "$output"
            ;;
    esac
}

echo ""
echo "Generating favicons..."

# Generate standard favicon sizes
convert_svg 16 "$IMAGES_DIR/favicon-16x16.png"
echo -e "  ${GREEN}✓${NC} favicon-16x16.png"

convert_svg 32 "$IMAGES_DIR/favicon-32x32.png"
echo -e "  ${GREEN}✓${NC} favicon-32x32.png"

convert_svg 180 "$IMAGES_DIR/apple-touch-icon.png"
echo -e "  ${GREEN}✓${NC} apple-touch-icon.png (180x180)"

convert_svg 192 "$IMAGES_DIR/icon-192.png"
echo -e "  ${GREEN}✓${NC} icon-192.png (PWA)"

convert_svg 512 "$IMAGES_DIR/icon-512.png"
echo -e "  ${GREEN}✓${NC} icon-512.png (PWA)"

# Generate ICO file (requires ImageMagick)
if command -v magick &> /dev/null || command -v convert &> /dev/null; then
    # Create temp PNGs for ICO
    convert_svg 16 "/tmp/icon-16.png"
    convert_svg 32 "/tmp/icon-32.png"
    convert_svg 48 "/tmp/icon-48.png"

    if command -v magick &> /dev/null; then
        magick /tmp/icon-16.png /tmp/icon-32.png /tmp/icon-48.png "$IMAGES_DIR/favicon.ico"
    else
        convert /tmp/icon-16.png /tmp/icon-32.png /tmp/icon-48.png "$IMAGES_DIR/favicon.ico"
    fi
    echo -e "  ${GREEN}✓${NC} favicon.ico (multi-size)"

    # Cleanup
    rm -f /tmp/icon-16.png /tmp/icon-32.png /tmp/icon-48.png
else
    echo -e "  ${YELLOW}⚠${NC} favicon.ico skipped (needs ImageMagick)"
fi

echo ""
echo -e "${GREEN}✅ All favicons generated successfully!${NC}"
echo ""
echo "Files created in: $IMAGES_DIR"
ls -la "$IMAGES_DIR"/*.png "$IMAGES_DIR"/*.ico 2>/dev/null | awk '{print "  " $NF " (" $5 " bytes)"}'
