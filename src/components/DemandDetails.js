import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { default as Text } from './GlobalText'


const DemandDetails = ({ totalAmount, totalPenalty, grandTotal, type, outstanding }) => {
    const { theme, hp, RFValue } = useTheme();

    const styles = StyleSheet.create({
        container: {
            padding: RFValue(15),
            backgroundColor: theme.container,
            borderRadius: RFValue(5),
            marginVertical: hp(1),
            borderWidth: RFValue(1),
            borderColor: theme.grayLight,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: hp(1),
        },
        label: {
            fontSize: RFValue(12),
            color: theme.text,
            fontWeight: '600',
        },
        value: {
            fontSize: RFValue(12),
            color: theme.text,
            textAlign: 'right',
        },
        separator: {
            height: 1,
            backgroundColor: theme.grayLight,
            marginVertical: hp(1),
        },
    });
    const DetailRow = ({ label, value }) => (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <DetailRow label="Outstanding:" value={outstanding} />
            <DetailRow label="Total Penalty:" value={totalPenalty} />
            <DetailRow label="Total Amount:" value={totalAmount} />
            <View style={styles.separator} />
            <DetailRow label="Grand Total:" value={grandTotal} />
        </View>
    );
};

export default DemandDetails;
