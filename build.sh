#!/bin/bash
# Build script for Cloudflare Pages
# Copies only production files to dist folder

# Clean and create dist folder
rm -rf dist
mkdir -p dist

# Copy production files
cp -r index.html dist/
cp -r 404.html dist/
cp -r manifest.json dist/
cp -r robots.txt dist/
cp -r sitemap.xml dist/
cp -r css dist/
cp -r js dist/
cp -r images dist/
cp -r tools dist/
cp -r about dist/
cp -r contact dist/
cp -r faq dist/
cp -r privacy dist/
cp -r terms dist/

echo "Build complete! Files copied to dist/"
