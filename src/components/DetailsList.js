import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { convertToFullYear, getMonthName } from '../helpers/validation';
import { default as Text } from '../components/GlobalText'
const styles = (theme, RFValue, hp, wp) =>
    StyleSheet.create({
        container: {
            borderRadius: RFValue(5),
            borderColor: theme.grayLight,
            marginVertical: hp(1)
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: hp(2),
            borderBottomWidth: 1,
            borderBottomColor: theme.grayLight,
            paddingHorizontal: wp(4),
            backgroundColor: theme.container,
        },
        valueContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
        },
        valueText: {
            textAlign: 'center',
            fontSize: RFValue(11),
            color: theme.text,
        },
        actionPressable: {
            textAlign: 'center',
            fontSize: RFValue(11),
            color: theme.primary,
            paddingHorizontal: wp(2),
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.primary,
            borderTopLeftRadius: RFValue(5),
            borderTopRightRadius: RFValue(5),
            borderBottomWidth: 1,
            borderBottomColor: theme.grayLight,
            paddingVertical: hp(2),
            paddingHorizontal: wp(4),
        },
        headerContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
        },
        headerText: {
            textAlign: 'center',
            color: theme.text,
            fontWeight: 'bold',
            fontSize: RFValue(12),
        },
    });

const headerMappings = {
    StallRent: [
        { label: 'Stall Type', key: 'stallType', flex: 2 },
        { label: 'Rental Amount', key: 'rentalAmount', flex: 2 },
        { label: 'Billing Schedule', key: 'billingScheduleName', flex: 2 },
        { label: 'Action', key: 'action', flex: 2 },
    ],
    HouseRent: [
        { label: 'Rental Amount', key: 'rentalAmount', flex: 2 },
        { label: 'Billing Schedule', key: 'billingSchedule', flex: 2 },
        { label: 'Action', key: 'action', flex: 2 },
    ],
    GarbageDetails: [
        { label: 'Year', key: 'calendarYearId', flex: 2, transform: convertToFullYear },
        { label: 'Month', key: 'calendarMonth', flex: 2, transform: getMonthName },
        { label: 'Action', key: 'action', flex: 2 },
    ],
    PropertyDetails: [
        { label: 'Receipt No', key: 'receiptNo', flex: 2 },
        { label: 'Fees', key: 'taxName', flex: 2 },
        { label: 'Action', key: 'action', flex: 2 },
    ],
};

const DetailsList = ({ data, type, onPressItem }) => {
    const { theme, RFValue, hp, wp } = useTheme();
    const currentStyles = styles(theme, RFValue, hp, wp);
    const headers = headerMappings[type] || [];

    return (
        <View style={currentStyles.container}>
            <View style={currentStyles.headerRow}>
                {headers.map((header, index) => (
                    <View key={index} style={[currentStyles.headerContainer, { flex: header.flex }]}>
                        <Text style={currentStyles.headerText}>{header.label}</Text>
                    </View>
                ))}
            </View>

            {data.map((item, index) => (
                <View key={index} style={currentStyles.row}>
                    {headers.map((header, idx) => {
                        const value = header.transform
                            ? header.transform(item[header.key])
                            : item[header.key] || header.default;
                        return header.key === 'action' ? (
                            <View key={idx} style={[currentStyles.valueContainer, { flex: header.flex }]}>
                                <Pressable onPress={() => onPressItem && onPressItem(item)}>
                                    <Text style={currentStyles.actionPressable}>{type === 'PropertyDetails' ? 'View' : 'Generate'}</Text>
                                </Pressable>
                            </View>
                        ) : (
                            <View key={idx} style={[currentStyles.valueContainer, { flex: header.flex }]}>
                                <Text style={currentStyles.valueText}>{value}</Text>
                            </View>
                        );
                    })}
                </View>
            ))}
        </View>
    );
};

export default DetailsList;