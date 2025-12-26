// import React, { useCallback } from 'react';
// import { View, StyleSheet, Pressable } from 'react-native';
// import { useTheme } from '../context/ThemeContext';
// import { default as Text } from './GlobalText';


// const HomeContainer = ({ icon, name, onPress }) => {
//   const { theme, wp, hp, RFValue } = useTheme();

//   const styles = StyleSheet.create({
//     container: {
//       width: wp(26),
//       height: wp(26),
//       borderRadius: wp(3),
//       backgroundColor: theme.background,
//       marginVertical: hp(1.5),
//       borderColor: theme.primary,
//       borderWidth: wp(0.2),
//       shadowColor: theme.shadowColor,
//       shadowOffset: { width: 0, height: 3 },
//       shadowOpacity: 0.2,
//       shadowRadius: 4,
//     },
//     content: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     name: {
//       color: theme.text,
//       textAlign: 'center',
//       marginTop: hp(1),
//       fontSize: RFValue(10),
//       padding: wp(0.5),
//       paddingHorizontal: wp(2)
//     },
//   });

//   const handlePress = useCallback(() => {
//     onPress();
//   }, [onPress]);

//   return (
//     <Pressable
//       onPress={handlePress}
//       style={({ pressed }) => [
//         styles.container,
//         { opacity: pressed ? 0.9 : 1 },
//       ]}
//     >
//       <View style={styles.content}>
//         {icon}
//         <Text style={styles.name}>{name}</Text>
//       </View>
//     </Pressable>
//   );
// };

// export default React.memo(HomeContainer);

import React, { useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, Pressable, Animated, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { default as Text } from './GlobalText';

const HomeContainer = ({ icon, name, onPress, pulse = false }) => {
  const { theme, wp, hp, RFValue } = useTheme();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // 🔁 Idle pulse animation (optional)
  useEffect(() => {
    if (pulse) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [pulse]);

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = useCallback(() => {
    onPress && onPress();
  }, [onPress]);

  const styles = StyleSheet.create({
    container: {
      width: wp(26),
      height: wp(26),
      borderRadius: wp(4),
      backgroundColor: theme.card || theme.background,
      marginVertical: hp(1.5),
      borderColor: theme.primary + '55',
      borderWidth: wp(0.25),
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: theme.shadowColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.18,
          shadowRadius: 6,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    content: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconWrapper: {
      marginBottom: hp(1),
      transform: [{ scale: pulseAnim }],
    },
    name: {
      color: theme.text,
      textAlign: 'center',
      marginTop: hp(0.5),
      fontSize: RFValue(11),
      fontWeight: '600',
      paddingHorizontal: wp(2),
    },
  });

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <Animated.View style={styles.iconWrapper}>
              {icon}
            </Animated.View>
            <Text style={styles.name}>{name}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default React.memo(HomeContainer);
