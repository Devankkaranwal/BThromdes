import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive functions
const wp = (widthPercent) => {
  const elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * elemWidth) / 100);
};

const hp = (heightPercent) => {
  const elemHeight = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * elemHeight) / 100);
};

// Font scaling
const RFValue = (fontSize, standardScreenHeight = 812) => {
  const heightPercent = (fontSize * SCREEN_HEIGHT) / standardScreenHeight;
  return PixelRatio.roundToNearestPixel(heightPercent);
};

// Modern color palettes
const lightTheme = {
  colors: {
    primary: '#6366F1', // Modern indigo
    primaryDark: '#4F46E5',
    primaryLight: '#818CF8',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    card: '#FFFFFF',
    text: '#1E293B',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    accent: '#F59E0B', // Amber
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    shadowColor: '#1E293B',
    overlay: 'rgba(15, 23, 42, 0.5)',
    gradientStart: '#6366F1',
    gradientEnd: '#8B5CF6',
  },
};

const darkTheme = {
  colors: {
    primary: '#818CF8',
    primaryDark: '#6366F1',
    primaryLight: '#A5B4FC',
    background: '#0F172A',
    surface: '#1E293B',
    card: 'red',
    text: '#F1F5F9',
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',
    border: '#334155',
    borderLight: '#1E293B',
    accent: '#FBBF24',
    success: '#34D399',
    error: '#F87171',
    warning: '#FBBF24',
    info: '#60A5FA',
    shadowColor: '#000000',
    overlay: 'rgba(0, 0, 0, 0.7)',
    gradientStart: '#818CF8',
    gradientEnd: '#A78BFA',
  },
};

export const theme = {
  wp,
  hp,
  RFValue,
  colors: {
    light: lightTheme.colors,
    dark: darkTheme.colors,
  },
};

export { lightTheme, darkTheme };