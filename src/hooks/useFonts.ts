import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        // Load existing font files from assets/fonts/
        // Map actual font files to expected font names for the app
        await Font.loadAsync({
          'FranklinGothic-Book': require('../../assets/fonts/FranklinGothic.ttf'),
          'FranklinGothic-Medium': require('../../assets/fonts/FranklinGothic.ttf'),
          'FranklinGothic-Demi': require('../../assets/fonts/FRANKGO.ttf'),
          'FranklinGothic-Heavy': require('../../assets/fonts/FRANKGO.ttf'),
        });

        setFontsLoaded(true);
      } catch (error) {
        console.warn('Custom fonts not found. Using system default fonts.');
        console.warn('Error details:', error);
        setFontError(true);
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  return { fontsLoaded, fontError };
};
