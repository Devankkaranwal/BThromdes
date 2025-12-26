import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function BackgroundWithoutScrollView({ children, disablePadding, alignCenter }) {
    const { theme, RFValue } = useTheme();
    const styles = StyleSheet.create({
        background: {
            flex: 1,
            backgroundColor: theme.background,
        },
        containerAlignCenter: {
            justifyContent: 'center',
            alignItems: 'center',
        },

        containerWithPadding: {
            padding: RFValue(8),
        },
    });

    return (
        <View style={[
            styles.background,
            !disablePadding && styles.containerWithPadding,
            alignCenter && styles.containerAlignCenter,
        ]}>
            {children}
        </View>
    );
}


