import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { default as Text } from './GlobalText'

const Button = ({
  label,
  onPress,
  isDisabled = false,
  style = {},
  children,
  SvgIcon = null,
  ...props
}) => {
  const { theme, hp, wp, RFValue } = useTheme();

  const styles = StyleSheet.create({
    button: {
      width: '100%',
      height: hp(6),
      marginTop: hp(2),
      marginBottom: hp(4),
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
      borderRadius: RFValue(5),
      backgroundColor: theme.primary,
    },
    disabledButton: {
      backgroundColor: theme.primary,
      opacity: 0.6,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      fontWeight: 'bold',
      fontSize: RFValue(12),
      color: theme.text,
      letterSpacing: 1,
    },
    disabledText: {
      color: theme.grayLight,
    },
    svgContainer: {
      marginRight: wp(2),
    },
  });

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isDisabled && styles.disabledButton,
        style,
      ]}
      activeOpacity={isDisabled ? 1 : 0.8}
      disabled={isDisabled}
      onPress={onPress}
      {...props}
    >
      <View style={styles.content}>
        {SvgIcon && (
          <View style={styles.svgContainer}>
            <SvgIcon width={RFValue(15)} height={RFValue(15)} />
          </View>
        )}
        <Text style={[styles.text, isDisabled && styles.disabledText]}>
          {label || children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
