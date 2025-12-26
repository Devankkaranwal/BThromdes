import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { default as Text } from './GlobalText'


const CustomerDetailsHeader = ({ customerData, labels, icons = [] }) => {
    const { theme, wp, hp, RFValue } = useTheme();

    const styles = StyleSheet.create({
        customerDetailsContainer: {
            padding: RFValue(10),
            backgroundColor: theme.container,
            borderWidth: RFValue(1),
            borderColor: theme.grayLight,
            borderRadius: RFValue(5),
            marginVertical: hp(1),
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: hp(1),
        },
        icon: {
            marginRight: wp(2), // Increase this value to add more space
        },
        label: {
            fontSize: RFValue(12),
            color: theme.text,
            fontWeight: '600',
            flex: 1,
        },
        value: {
            fontSize: RFValue(12),
            color: theme.text,
            flex: 1,
        },
    });


    return (
        <View style={styles.customerDetailsContainer}>
            {customerData.map((data, index) => (
                <View key={index} style={styles.row}>
                    {icons[index] && React.createElement(icons[index], { width: wp(6), height: wp(6), style: styles.icon })}

                    <Text style={styles.label}>{labels[index]}</Text>
                    <Text style={styles.value}>{data || '---'}</Text>
                </View>
            ))}
        </View>
    );
};

export default CustomerDetailsHeader;
