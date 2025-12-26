import { View, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { default as Text } from './GlobalText'

const InfoRow = ({ label, value, link }) => {
    const { theme, RFValue } = useTheme(); // ✅ MUST be inside component

    const styles = getStyles(theme, RFValue); // generate styles dynamically

    return (
        <View style={styles.infoRow}>
            <Text style={styles.label}>{label}</Text>
            <Text
                style={[styles.value, link && styles.link]}
                numberOfLines={4}
            >
                {value}
            </Text>
        </View>
    );
};

// ✅ Only InfoRow styles kept
const getStyles = (theme, hp) =>
    StyleSheet.create({
        infoRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: hp(1),
        },
        label: {
            fontWeight: "600",
            color: theme.text,
            flex: 1,
        },
        value: {
            color: theme.text,
            flex: 1,
            textAlign: "right",
        },
    });

export default InfoRow;
