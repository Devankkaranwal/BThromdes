import { useMemo, useState } from 'react';
import { StyleSheet, Modal, Pressable, ScrollView, Alert } from 'react-native';
import InfoContainer from '../components/InfoContainer';
import Button from '../components/Button';
import Loader from '../components/Loader';
import WaterBillDetails from '../components/WaterBillDetails';
import CustomerDetailsHeader from '../components/CustomerDetailsHeader';
import DemandDetails from '../components/DemandDetails';
import BackgroundWithoutScrollView from '../components/BackgroundWithoutScrollView';
import { useTheme } from '../context/ThemeContext';
import telePhoneIcon from '../assets/images/telephone.svg';
import waterMeterIcon from '../assets/images/water-meter.svg';
import addressIcon from '../assets/images/address.svg';
import { handlePayment } from '../services/paymentService';
import { default as Text } from '../components/GlobalText'


const WaterAndSeawage = ({ navigation, route }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const { thromde, consumerDetails } = route.params || {};
    const outstanding = consumerDetails.outstanding.toFixed(2);
    const penalty = consumerDetails.penalty.toFixed(2);
    const netAmount = consumerDetails.netAmount.toFixed(2);
    const totalBill = consumerDetails.totalBill.toFixed(2);
    // const grandTotal = 0.01;

    const WaterBillData = [
        { taxName: "Water Charges", totalAmount: consumerDetails.waterBill, billFor: consumerDetails.billFor },
        { taxName: "Sewerage Charges", totalAmount: consumerDetails.sewerageCharge, billFor: consumerDetails.billFor },
        { taxName: "Solid Waste Charges", totalAmount: consumerDetails.solidWasteCharge, billFor: consumerDetails.billFor },
        { taxName: "Street Light Charges", totalAmount: consumerDetails.streetLightCharge, billFor: consumerDetails.billFor },
    ]

    const { theme, hp, RFValue } = useTheme();

    const styles = StyleSheet.create({
        container: {
            paddingBottom: hp(2),
        },
        title: {
            textAlign: 'center',
            fontWeight: '600',
            fontSize: RFValue(16),
            color: theme.primary,
            marginVertical: hp(1),
        },
        button: {
            backgroundColor: theme.primary,
            padding: RFValue(10),
            borderRadius: RFValue(5),
            alignItems: 'center',
            marginVertical: hp(1),
        },
        buttonText: {
            color: theme.white,
            fontSize: RFValue(12),
            fontWeight: '600',
        },
    });

    const handlePaymentPress = async () => {
        try {
            setLoading(true);

            await handlePayment({
                thromde,
                consumerDetails,
                navigation,
                setLoading,
                onError: (err) => {
                    Alert.alert('Payment Error', err.message || 'Something went wrong.');
                },
            });

        } catch (error) {
            Alert.alert('Error', error.message || 'Payment process failed.');
        } finally {
            setLoading(false);
        }
    };


    const customerLabels = ['Consumer Number:', 'Meter Number:', 'Address:'];

    const customerIcons = useMemo(
        () => [telePhoneIcon, waterMeterIcon, addressIcon],
        []
    );

    return (
        <BackgroundWithoutScrollView disablePadding>
            <Loader visible={loading} />
            <InfoContainer>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                    <Text style={styles.title}>Consumer Details</Text>
                    <CustomerDetailsHeader
                        labels={customerLabels}
                        customerData={[
                            consumerDetails.accountNo,
                            consumerDetails.meterNo,
                            consumerDetails.billingAddress,
                        ]}
                        icons={customerIcons}
                    />
                    <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
                        <Text style={styles.buttonText}>View Water & Service Details</Text>
                    </Pressable>
                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                        presentationStyle="pageSheet"
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <WaterBillDetails
                            waterBillData={WaterBillData}
                            onClose={() => setModalVisible(false)}
                        />
                    </Modal>
                    <DemandDetails
                        outstanding={outstanding}
                        totalPenalty={penalty}
                        totalAmount={totalBill}
                        grandTotal={netAmount}
                    />
                    <Button onPress={handlePaymentPress} isDisabled={netAmount <= 0} label="Pay Now" />
                </ScrollView>
            </InfoContainer>
        </BackgroundWithoutScrollView>
    );
};

export default WaterAndSeawage;
