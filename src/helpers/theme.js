import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const wp = (percentage) => Math.round(width * percentage) / 100;
const hp = (percentage) => Math.round(height * percentage) / 100;
const RFValue = (fontSize, standardScreenHeight = 680) => {
  const heightPercent = (fontSize * height) / standardScreenHeight;
  return Math.round(heightPercent);
};



const lightColors = {
  background: '#ffffff',
  text: '#0a0a0a',
  danger: '#ff0000',
  white: '#ffffff',
  disabled: 'rgba(0, 0, 0, 0.1)',
  primary: '#00A5BF',
  prevapp: '#4DB6AC',
  warning: '#f0d500',
  grayLight: '#d3d3d3',
  transparent: 'rgba(0, 0, 0, 0.45)',
  disabledText: '#a9a9a9',
  container: '#f0f0f0',
  lightGreen: '#1fd655',
  shadowColor: '#000',
  cyen: '#4DB6AC',
};

const darkColors = {
  background: '#121212',
  text: '#ffffff',
  danger: '#ff0000',
  white: '#ffffff',
  disabled: 'rgba(255, 255, 255, 0.1)',
  primary: '#00A5BE',
  warning: '#ffcb45',
  grayLight: '#444444',
  transparent: 'rgba(255, 255, 255, 0.1)',
  disabledText: '#555555',
  container: '#1e1e1e',
  lightGreen: '#32ff7e',
  shadowColor: '#fff',
  cyen: '#4DB6AC',
};

export const theme = {
  colors: {
    light: lightColors,
    dark: darkColors,
  },
  wp,
  hp,
  RFValue,
};
