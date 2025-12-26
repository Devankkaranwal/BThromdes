import React from 'react';
import { LinearGradient } from 'react-native-linear-gradient';
import { StyleSheet } from 'react-native';

const GradientBackground = ({ colors, style, children }) => {
  return (
    <LinearGradient
      colors={colors}
      style={[styles.gradient, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default GradientBackground;