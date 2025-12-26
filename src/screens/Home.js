// import { TouchableOpacity, StyleSheet, View, Image, StatusBar } from 'react-native';
// import { thromdesList } from '../helpers/validation';
// import { useTheme } from '../context/ThemeContext';
// import BackgroundWithoutScrollView from '../components/BackgroundWithoutScrollView';
// import { default as Text } from '../components/GlobalText';
// import { SafeAreaView } from 'react-native-safe-area-context';


// const HomeScreen = ({ navigation }) => {
//     const { theme, wp, hp, RFValue } = useTheme();

//     const styles = StyleSheet.create({
//         container: {
//             flex: 1,
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: theme.background,
//         },

//         card: {
//             width: '90%',
//             padding: RFValue(8),
//             marginVertical: hp(1.5),
//             backgroundColor: theme.primary,
//             borderRadius: 10,
//             shadowColor: theme.shadowColor,
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.3,
//             shadowRadius: 3,
//         },
//         cardContent: {
//             flexDirection: 'row',
//             alignItems: 'center',
//         },
//         cardText: {
//             fontSize: RFValue(15),
//             color: theme.white,
//             fontWeight: '600',
//         },
//         cardImage: {
//             width: wp(10),
//             height: wp(10),
//             marginRight: 12,
//         },

//         logoContainer: {
//             alignItems: 'center',
//             marginVertical: hp(3),
//         },
//         slogan: {
//             fontSize: RFValue(16),
//             fontWeight: '600',
//             textAlign: 'center',
//             letterSpacing: 1.2,
//             textShadowOffset: { width: 0.5, height: 0.5 },
//             textShadowRadius: 1,
//         },
//     });

//     return (
//         <>
//             <StatusBar
//                 barStyle={theme.isDark ? 'light-content' : 'dark-content'}
//                 backgroundColor={theme.background}
//             />
//             <BackgroundWithoutScrollView>
//                 <SafeAreaView style={styles.container}>
//                     <View style={styles.logoContainer}>
//                         <Text style={[styles.slogan, { color: theme.text }]}>
//                             Easy Bill Payments Anytime.
//                         </Text>
//                         <Text style={[styles.slogan, { color: theme.text }]} allowFontScaling={false}
//                             maxFontSizeMultiplier={1}>
//                             Making Services Simple.
//                         </Text>
//                     </View>
//                     {thromdesList.map((item, index) => (
//                         <TouchableOpacity
//                             key={index}
//                             style={styles.card}
//                             onPress={() =>
//                                 navigation.navigate('ThomeDrawer', {
//                                     screen: 'Thome',
//                                     params: { title: item.name, thromde: item.thromde },
//                                 })
//                             }
//                         >
//                             <View style={styles.cardContent}>
//                                 <Image
//                                     source={item.icon}
//                                     style={styles.cardImage}
//                                     resizeMode="contain"
//                                 />
//                                 <Text style={styles.cardText}>{item.name}</Text>
//                             </View>
//                         </TouchableOpacity>
//                     ))}
//                 </SafeAreaView>
//             </BackgroundWithoutScrollView>
//         </>
//     );
// };

// export default HomeScreen;



import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  StatusBar,
  Animated,
} from 'react-native';

import { thromdesList } from '../helpers/validation';
import { useTheme } from '../context/ThemeContext';
import BackgroundWithoutScrollView from '../components/BackgroundWithoutScrollView';
import { default as Text } from '../components/GlobalText';
import { SafeAreaView } from 'react-native-safe-area-context';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const HomeScreen = ({ navigation }) => {
  const { theme, wp, hp, RFValue } = useTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderCard = (item, index) => {
    const translateY = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        delay: index * 120,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <AnimatedTouchable
        key={index}
        activeOpacity={0.85}
        onPressIn={() =>
          Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
          }).start()
        }
        onPressOut={() =>
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          }).start()
        }
        onPress={() =>
          navigation.navigate('ThomeDrawer', {
            screen: 'Thome',
            params: { title: item.name, thromde: item.thromde },
          })
        }
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ translateY }, { scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.cardContent}>
          {/* ICON */}
          <View style={styles.iconBox}>
            <Image source={item.icon} style={styles.cardImage} />
          </View>

          {/* TEXT */}
          <View style={styles.textContainer}>
            <Text
              style={styles.cardText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.name}
            </Text>

            <Text style={styles.subText} numberOfLines={1}>
              Tap to explore service
            </Text>
          </View>
        </View>
      </AnimatedTouchable>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      paddingTop: hp(3),
      backgroundColor: theme.background,
    },

    logoContainer: {
      marginBottom: hp(3),
      alignItems: 'center',
      paddingHorizontal: wp(5),
    },

    slogan: {
      fontSize: RFValue(18),
      fontWeight: '800',
      textAlign: 'center',
      color: theme.text,
      letterSpacing: 0.6,
      marginBottom: 4,
    },

    card: {
      width: '92%',
      paddingVertical: hp(2),
      paddingHorizontal: wp(4),
      marginVertical: hp(1),
      backgroundColor: theme.primary,
      borderRadius: 18,

      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 8,
    },

    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    iconBox: {
      width: wp(13),
      height: wp(13),
      borderRadius: wp(6.5),
      backgroundColor: 'rgba(255,255,255,0.18)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: wp(4),
    },

    cardImage: {
      width: wp(7),
      height: wp(7),
      resizeMode: 'contain',
    },

    textContainer: {
      flex: 1,
    },

    cardText: {
      fontSize: RFValue(15),
      color: theme.white,
      fontWeight: '700',
      lineHeight: RFValue(20),
    },

    subText: {
      fontSize: RFValue(11),
      color: theme.white,
      opacity: 0.75,
      marginTop: 4,
    },
  });

  return (
    <>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <BackgroundWithoutScrollView>
        <SafeAreaView style={styles.container}>
          <View style={styles.logoContainer}>
            <Text style={styles.slogan}>Easy Bill Payments Anytime</Text>
            <Text style={styles.slogan}>Making Services Simple</Text>
          </View>

          {thromdesList.map(renderCard)}
        </SafeAreaView>
      </BackgroundWithoutScrollView>
    </>
  );
};

export default HomeScreen;
