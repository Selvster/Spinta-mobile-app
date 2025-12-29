# Fonts Directory

## Franklin Gothic Font Setup

This app uses **Franklin Gothic** as the primary font family. Since Franklin Gothic is a commercial font, you'll need to obtain the font files legally and add them to this directory.

### Required Font Files

Place the following font files in this directory:

1. **FranklinGothic-Book.ttf** (Regular weight)
2. **FranklinGothic-Medium.ttf** (Medium weight)
3. **FranklinGothic-Demi.ttf** (Bold weight)
4. **FranklinGothic-Heavy.ttf** (Heavy weight)

### Where to Get Franklin Gothic

You can obtain Franklin Gothic from:
- Adobe Fonts (included with Adobe Creative Cloud subscription)
- MyFonts.com
- Fonts.com
- Your organization's licensed font library

### Alternative (Free) Fonts

If you don't have access to Franklin Gothic, you can use these free alternatives that have a similar geometric sans-serif style:

1. **Libre Franklin** (very similar, free on Google Fonts)
   - Download from: https://fonts.google.com/specimen/Libre+Franklin

2. **Work Sans** (similar geometric feel)
   - Download from: https://fonts.google.com/specimen/Work+Sans

### How to Add Fonts

1. Download the `.ttf` or `.otf` font files
2. Place them in this `assets/fonts/` directory
3. Ensure the filenames match what's defined in `src/constants/theme.ts`
4. Restart the Expo development server

### Using Libre Franklin (Free Alternative)

If using Libre Franklin instead:

1. Download from Google Fonts
2. Rename the files to match:
   - `LibreFranklin-Regular.ttf` → `FranklinGothic-Book.ttf`
   - `LibreFranklin-Medium.ttf` → `FranklinGothic-Medium.ttf`
   - `LibreFranklin-Bold.ttf` → `FranklinGothic-Demi.ttf`
   - `LibreFranklin-ExtraBold.ttf` → `FranklinGothic-Heavy.ttf`

### Current Status

The app is configured to use system default fonts until Franklin Gothic files are added. Once you add the font files, restart the app to see the changes.
