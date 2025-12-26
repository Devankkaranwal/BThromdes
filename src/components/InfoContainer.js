import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const InfoContainer = ({ children }) => {
  const { theme, RFValue, hp } = useTheme();
  const styles = StyleSheet.create({
    infoContainer: {
      width: '100%',
      justifyContent: 'center',
      alignSelf: 'center',
      padding: RFValue(8),
      marginBottom: hp(1),
      borderRadius: RFValue(5),
      backgroundColor: theme.background,
      ...Platform.select({
        ios: {
          shadowColor: theme.shadowColor,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
        android: {
          shadowColor: theme.shadowColor,
          shadowColor: theme.shadowColor,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
      }),
    },

  });

  return (
    <View style={styles.infoContainer}>
      {children}
    </View>
  );
};


export default InfoContainer;
