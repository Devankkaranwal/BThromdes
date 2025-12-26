import { useState, useRef, useMemo } from 'react';
import { TextInput, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function CustomTextInput({ placeholder, ...props }) {
  const [isFocused, setIsFocused] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const { theme, hp, wp, RFValue } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      width: '100%',
      marginVertical: hp(1),
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: hp(0.25) },
      shadowOpacity: 0.1,
      shadowRadius: wp(2),
      borderRadius: wp(2),
      backgroundColor: theme.background,
    },
    input: {
      backgroundColor: theme.container,
      fontSize: RFValue(14),
      height: hp(6),
      paddingHorizontal: wp(6),
      borderRadius: wp(2),
      borderWidth: 1,
      borderColor: isFocused ? theme.primary : theme.primary, // Consider distinguishing styles for focus vs. blur
      color: theme.text,
    },
  }), [theme, isFocused, hp, wp, RFValue]);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(scaleValue, {
      toValue: 1.01,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
      <TextInput
        {...props}
        placeholder={placeholder}
        style={styles.input}
        placeholderTextColor={theme.text}
        onFocus={handleFocus}
        onBlur={handleBlur}
        allowFontScaling={false}
      />
    </Animated.View>
  );
}
