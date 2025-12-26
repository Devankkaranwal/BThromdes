import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import CustomerDetailsHeader from '../components/CustomerDetailsHeader';
import InfoContainer from '../components/InfoContainer';
import Button from '../components/Button';
import BackgroundWithoutScrollView from '../components/BackgroundWithoutScrollView';
import DownloadIcon from '../assets/images/download.svg';
import { useTheme } from '../context/ThemeContext';
import { default as Text } from '../components/GlobalText';


const PaymentConfirmation = ({ route, navigation }) => {
    // For now, just dummy values (replace with props or navigation params later)
    const {
        bank = 'BoB',
        transactionTime = '2025-10-20 14:25:00',
        transactionId = 'TXN123456',
        orderNo = 'ORD78910',
        message = 'Payment Successful',
        success = true,
        receiptNo = 'RCPT00123',
        bfs_txnAmount = '100.00',
        consumerNo = 'CNS123456',
    } = route.params || {};

    const { theme, RFValue, hp, wp } = useTheme();

    const styles = StyleSheet.create({
        container: {
            borderTopLeftRadius: RFValue(10),
            borderTopRightRadius: RFValue(10),
            justifyContent: 'center',
            alignItems: 'center',
            padding: RFValue(10),
        },
        animation: {
            width: wp(20),
            height: wp(20),
        },
        message: {
            marginTop: hp(0.5),
            fontSize: RFValue(18),
            color: theme.text,
        },
        secondaryMessage: {
            marginTop: hp(0.5),
            fontSize: RFValue(14),
            color: theme.text,
            textAlign: 'center',
        },
        successBackground: {
            backgroundColor: theme.lightGreen,
        },
        failBackground: {
            backgroundColor: theme.danger,
        },
    });

    const getLabelsAndData = () => {
        if (success) {
            if (consumerNo) {
                return {
                    labels: [
                        'Consumer No',
                        'Receipt No:',
                        'Amount:',
                        'Bank:',
                        'Transaction Time:',
                        'Transaction ID:',
                        'Order No.:',
                    ],
                    data: [
                        consumerNo,
                        receiptNo,
                        bfs_txnAmount,
                        bank,
                        transactionTime,
                        transactionId,
                        orderNo,
                    ],
                };
            }
            return {
                labels: [
                    'Receipt No:',
                    'Amount:',
                    'Bank:',
                    'Transaction Time:',
                    'Transaction ID:',
                    'Order No.:',
                ],
                data: [
                    receiptNo,
                    bfs_txnAmount,
                    bank,
                    transactionTime,
                    transactionId,
                    orderNo,
                ],
            };
        }
        return {
            labels: ['Bank:', 'Transaction Time:', 'Transaction ID:', 'Order No.:'],
            data: [bank, transactionTime, transactionId, orderNo],
        };
    };

    const { labels, data } = getLabelsAndData();

    const renderMessages = () => {
        if (success) {
            return (
                <>
                    <Text style={styles.secondaryMessage}>
                        Your payment transaction was successful!
                    </Text>
                    <Text style={styles.secondaryMessage}>
                        Thank you for your payment.
                    </Text>
                </>
            );
        }
        return (
            <Text style={styles.secondaryMessage}>
                Payment failed. Please try again.
            </Text>
        );
    };

    return (
        <BackgroundWithoutScrollView>
            <InfoContainer>
                <View
                    style={[
                        styles.container,
                        success ? styles.successBackground : styles.failBackground,
                    ]}
                >
                    <LottieView
                        source={
                            success
                                ? require('../assets/success.json')
                                : require('../assets/fail.json')
                        }
                        autoPlay
                        loop={false}
                        style={styles.animation}
                    />
                    <Text style={styles.message}>{message}</Text>
                    {renderMessages()}
                </View>

                <CustomerDetailsHeader labels={labels} customerData={data} />

                {success && (
                    <Button
                        onPress={() => console.log('PDF download placeholder')}
                        label="Get PDF Receipt"
                        SvgIcon={DownloadIcon}
                    />
                )}
                <Button onPress={() => navigation.navigate('Home')} label="OK" />
            </InfoContainer>
        </BackgroundWithoutScrollView>
    );
};

export default PaymentConfirmation;
