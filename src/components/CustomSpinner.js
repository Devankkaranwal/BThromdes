import { Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const CustomSpinner = ({ size, color, strokeWidth }) => {
  const { theme, RFValue, wp } = useTheme();

  const rotateAnim = new Animated.Value(0);

  Animated.loop(
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ).start();

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <AnimatedSvg
      width={size || wp(8)}
      height={size || wp(8)}
      style={{ transform: [{ rotate: spin }] }}
      viewBox="0 0 50 50">
      <Circle
        cx="25"
        cy="25"
        r="20"
        stroke={color || theme.primary}
        strokeWidth={strokeWidth || RFValue(2)}
        fill="none"
        strokeLinecap="round"
        strokeDasharray="31.4, 31.4"
        strokeDashoffset="0"
      />
    </AnimatedSvg>
  );
};

export default CustomSpinner;
