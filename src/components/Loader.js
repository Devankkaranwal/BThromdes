import React from 'react';
import { View, Modal } from 'react-native';
import CustomSpinner from './CustomSpinner';
import { useTheme } from '../context/ThemeContext';

const Loader = ({ visible, backgroundColor }) => {
  const { theme, wp, RFValue } = useTheme();
  const styles = {
    overlay: (backgroundColor) => ({
      flex: 1,
      backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
    }),
    spinnerContainer: (RFValue) => ({
      backgroundColor: theme.white,
      borderRadius: RFValue(10),
      padding: RFValue(16),
    }),
  };
  if (!visible) return null;

  const size = wp(10);

  return (
    <Modal transparent visible={visible} statusBarTranslucent>
      <View style={styles.overlay(backgroundColor || theme.transparent)}>
        <View style={styles.spinnerContainer(RFValue)}>
          <CustomSpinner size={size} color={theme.primary} />
        </View>
      </View>
    </Modal>
  );
};



export default React.memo(Loader);
