import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function BackgroundWithScrollView({ children, disablePadding, alignCenter }) {
    const { theme, RFValue } = useTheme();
    const styles = StyleSheet.create({
        background: {
            flexGrow: 1,
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
        <ScrollView
            contentContainerStyle={[
                styles.background,
                !disablePadding && styles.containerWithPadding,
                alignCenter && styles.containerAlignCenter,
            ]}
            style={{ flex: 1, backgroundColor: theme.background }}
        >
            {children}
        </ScrollView>
    );
}

