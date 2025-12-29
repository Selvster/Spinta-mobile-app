import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        // Attempt to load Franklin Gothic fonts
        // If font files are not present, this will fail gracefully
        // and the app will use system fonts (defined in src/constants/theme.ts)

        // Uncomment when you add font files to assets/fonts/
        /*
        await Font.loadAsync({
          'FranklinGothic-Book': require('../../assets/fonts/FranklinGothic-Book.ttf'),
          'FranklinGothic-Medium': require('../../assets/fonts/FranklinGothic-Medium.ttf'),
          'FranklinGothic-Demi': require('../../assets/fonts/FranklinGothic-Demi.ttf'),
          'FranklinGothic-Heavy': require('../../assets/fonts/FranklinGothic-Heavy.ttf'),
        });
        */

        // For now, just mark fonts as loaded (will use system fonts)
        setFontsLoaded(true);
      } catch (error) {
        console.warn('Custom fonts not found. Using system default fonts.');
        console.warn('See assets/fonts/README.md for font setup instructions.');
        setFontError(true);
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  return { fontsLoaded, fontError };
};
