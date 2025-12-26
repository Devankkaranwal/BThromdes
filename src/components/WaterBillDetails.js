import { View, StyleSheet, SectionList, Pressable } from 'react-native';
import InfoContainer from './InfoContainer';
import { useTheme } from '../context/ThemeContext';
import BackgroundWithoutScrollView from './BackgroundWithoutScrollView';
import CloseIcon from '../assets/images/close.svg';
import { default as Text } from './GlobalText'


const WaterBillDetails = ({ waterBillData = [], onClose }) => {
    const { theme, RFValue, hp, wp } = useTheme();
    const styles = StyleSheet.create({
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: hp(1.5),
            borderBottomWidth: 1,
            borderBottomColor: theme.grayLight,
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.primary,
            paddingVertical: hp(1.2),
            borderBottomWidth: RFValue(1),
            borderBottomColor: theme.grayLight,
            borderTopLeftRadius: RFValue(5),
            borderTopRightRadius: RFValue(5),
        },
        headerText: {
            flex: 1,
            textAlign: 'center',
            color: theme.text,
            fontWeight: 'bold',
            fontSize: RFValue(11),
        },
        text: {
            flex: 1,
            textAlign: 'center',
            color: theme.text,
            fontSize: RFValue(10),
        },
        closeButton: {
            alignSelf: 'flex-end',
            padding: RFValue(5),
            marginTop: hp(1)
        },
        title: {
            fontSize: RFValue(18),
            fontWeight: '800',
            textAlign: 'center',
            color: theme.primary,
            marginBottom: hp(1.5),
        },
    });

    const renderHeader = () => (
        <View style={styles.headerRow}>
            <Text style={styles.headerText}>Payment Type</Text>
            <Text style={styles.headerText}>Amount</Text>
            <Text style={styles.headerText}>Month</Text>
        </View>
    );
    const renderRow = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.text}>{item.taxName}</Text>
            <Text style={styles.text}>{parseFloat(item.totalAmount).toFixed(2)}</Text>
            <Text style={styles.text}>{item.billFor}</Text>
        </View>
    );

    return (
        <BackgroundWithoutScrollView alignCenter>
            <InfoContainer>
                <Pressable style={styles.closeButton} onPress={onClose}>
                    <CloseIcon width={RFValue(15)} height={RFValue(15)} />
                </Pressable>

                <Text style={styles.title}>Water Bill Details</Text>

                <SectionList
                    sections={[
                        {
                            data: waterBillData,
                        },
                    ]}
                    renderItem={renderRow}
                    renderSectionHeader={renderHeader}
                    keyExtractor={(item, index) => `water-bill-${index}`}
                    showsVerticalScrollIndicator={false}
                />
            </InfoContainer>
        </BackgroundWithoutScrollView>
    );
};

export default WaterBillDetails;
