import { Platform } from 'react-native';
import { COLORS } from './colors';

// Font family with system fallbacks
// Will use Franklin Gothic if loaded, otherwise falls back to system fonts
export const FONTS = {
  regular: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'sans-serif-medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'System',
  }),
  heavy: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'System',
  }),
} as const;

// Custom font names (when Franklin Gothic fonts are added)
export const CUSTOM_FONTS = {
  regular: 'FranklinGothic-Book',
  medium: 'FranklinGothic-Medium',
  bold: 'FranklinGothic-Demi',
  heavy: 'FranklinGothic-Heavy',
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 36,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
} as const;

export const THEME = {
  colors: COLORS,
  fonts: FONTS,
  fontSizes: FONT_SIZES,
  spacing: SPACING,
  borderRadius: {
    sm: 4,
    base: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
} as const;
