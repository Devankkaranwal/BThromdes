import { View, Text, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import InfoContainer from './InfoContainer';
import { useTheme } from '../ThemeContext';
import CloseIcon from '../assets/images/close.svg';
import BackgroundWithoutScrollView from './BackgroundWithoutScrollView';

const LandTaxDetails = ({ landTaxData, onClose }) => {
    const { theme, RFValue, hp } = useTheme();
    const styles = StyleSheet.create({

        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: hp(2),
            borderBottomWidth: 1,
            borderBottomColor: theme.grayLight,
        },
        headerRow: {
            backgroundColor: theme.primary,
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
            paddingVertical: hp(0.1),
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

        sectionTitle: {
            fontSize: RFValue(18),
            fontWeight: 'bold',
            color: theme.primary,
            textAlign: 'center',
            marginBottom: hp(2),
        }
    });
    const landTaxDetailsData = landTaxData.filter(item => item.landTaxAmount > 0);

    const buildingDetailsData = landTaxData.filter(item => item.udTaxApplicable === 'Yes' || item.udTaxApplicable === '-' || item.pType === 2);

    const renderHeader = () => (
        <View style={[styles.headerRow, styles.row]}>
            <Text style={styles.headerText}>Plot No</Text>
            <Text style={styles.headerText}>Land Tax Amount</Text>
            <Text style={styles.headerText}>Tax Year</Text>
        </View>
    );

    const renderHeaderBuilding = () => (
        <View style={[styles.headerRow, styles.row]}>
            <Text style={styles.headerText}>Plot No</Text>
            <Text style={styles.headerText}>Flat No</Text>
            <Text style={styles.headerText}>No of Units</Text>
            <Text style={styles.headerText}>Garbage Fees</Text>
            <Text style={styles.headerText}>Street Light</Text>
            <Text style={styles.headerText}>Year</Text>
        </View>
    );

    const renderContent = () => {
        return (
            <SectionList
                sections={[
                    {
                        title: 'Land Tax Details',
                        data: landTaxDetailsData,
                        renderItem: ({ item }) => (
                            <View style={styles.row}>
                                <Text style={styles.text}>{item.plotNo}</Text>
                                <Text style={styles.text}>{item.landTaxAmount}</Text>
                                <Text style={styles.text}>{item.calendarYear}</Text>
                            </View>
                        ),
                        keyExtractor: (item, index) => `land-tax-${index}`
                    },
                    {
                        title: 'Building Details',
                        data: buildingDetailsData,
                        renderItem: ({ item }) => (
                            <View style={styles.row}>
                                <Text style={styles.text}>{item.plotNo}</Text>
                                <Text style={styles.text}>{item.flatNo}</Text>
                                <Text style={styles.text}>{item.noOfUnit}</Text>
                                <Text style={styles.text}>{item.garbageTax}</Text>
                                <Text style={styles.text}>{item.streetLightTax}</Text>
                                <Text style={styles.text}>{item.calendarYear}</Text>
                            </View>
                        ),
                        keyExtractor: (item, index) => `building-${index}`
                    }
                ]}
                renderSectionHeader={({ section: { title, data } }) => {
                    if (data.length === 0) return null;
                    return (
                        <>
                            <Text style={styles.sectionTitle}>{title}</Text>
                            {title === 'Land Tax Details' ? renderHeader() : renderHeaderBuilding()}
                        </>
                    );
                }}
                showsVerticalScrollIndicator={false}
            />
        );
    };

    return (
        <BackgroundWithoutScrollView alignCenter>
            <InfoContainer>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <CloseIcon width={RFValue(15)} height={RFValue(15)} />
                </TouchableOpacity>
                {renderContent()}
            </InfoContainer>
        </BackgroundWithoutScrollView>
    );
};



export default LandTaxDetails;
