import { useState, useEffect, useMemo, useRef } from 'react';
import {
    Alert,
    StyleSheet,
    View,
    TouchableOpacity,
    Modal,
    TextInput as RNTextInput,
} from 'react-native';
import { default as Text } from '../components/GlobalText';
import { bankItems, accountValidate } from '../helpers/validation';
import PickerInput from '../components/PickerInput';
import Button from '../components/Button';
import InfoContainer from '../components/InfoContainer';
import Loader from '../components/Loader';
import CustomerDetailsHeader from '../components/CustomerDetailsHeader';
import { useTheme } from '../context/ThemeContext';
import TextInput from '../components/TextInput';
import userIcon from '../assets/images/user.svg';
import idcardIcon from '../assets/images/id-card.svg';
import savemoneyIcon from '../assets/images/save-money.svg';
import BackgroundWithScrollView from '../components/BackgroundWithScrollView';
import { fetchRequestOtp, fetchSecondChecksum, fetchSubmitOtp, fetchThirdChecksum } from '../services/apiServices';

const BankSelection = ({ route, navigation }) => {
    const { postData, consumerDetails } = route.params || {};
    const [selectedBankType, setSelectedBankType] = useState(null);
    const [accountNumber, setAccountNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [otp, setOtp] = useState('');
    const hiddenInputRef = useRef(null);

    const { theme, hp, RFValue } = useTheme();

    // Account length per bank
    const bankAccountLengths = useMemo(
        () => ({
            '1010': 9,
            '1020': 9,
            '1030': 12,
            '1040': 12,
            '1050': 9,
            '1060': 12,
        }),
        []
    );

    // 🔍 Validate form
    useEffect(() => {
        const maxLength = bankAccountLengths[selectedBankType] || 0;
        const isValidLength = accountNumber.length === maxLength;

        const paymentForm = {
            bob: selectedBankType === '1010' ? { value: accountNumber } : {},
            bnb: selectedBankType === '1020' ? { value: accountNumber } : {},
            dpnb: selectedBankType === '1030' ? { value: accountNumber } : {},
            bdbl: selectedBankType === '1040' ? { value: accountNumber } : {},
            tbank: selectedBankType === '1050' ? { value: accountNumber } : {},
            dkb: selectedBankType === '1060' ? { value: accountNumber } : {},
        };

        const { isValid } = accountValidate(paymentForm);
        setIsButtonDisabled(!(isValidLength && isValid && selectedBankType));
    }, [selectedBankType, accountNumber]);

    // Request OTP
    const handleRequestOTP = async () => {
        if (isButtonDisabled || loading) return;

        try {
            setLoading(true);

            const txnId = postData?.bfs_bfsTxnId;
            const bankId = selectedBankType;
            const accountNum = accountNumber;
            const thromde = postData.thromde

            console.log('data second checksum:', txnId, bankId, accountNum, thromde)

            if (!txnId) throw new Error('Missing transaction ID.');
            if (!bankId || !accountNum) throw new Error('Please select a bank and enter your account number.');

            console.log('🔹 Step 1: Fetching second checksum...:', thromde);
            const checksumResponse = await fetchSecondChecksum(accountNum, bankId, txnId, thromde);
            console.log('🔹 Step 1: Fetching second checksum...:', checksumResponse.checksum);


            if (!checksumResponse || checksumResponse?.error) {
                throw new Error(checksumResponse?.error || 'Failed to fetch checksum.');
            }

            const bfsChecksum = checksumResponse?.bfsChecksum || checksumResponse?.checksum;
            if (!bfsChecksum) throw new Error('Checksum missing in response.');
            const checksum = checksumResponse.checksum
            const remitterAccNo = accountNum
            const remitterBankId = bankId

            console.log('✅ Second checksum received:', txnId, remitterAccNo, remitterBankId, checksum, thromde);
            const otpResponse = await fetchRequestOtp(txnId, remitterAccNo, remitterBankId, checksum, thromde);

            if (!otpResponse || otpResponse?.error) {
                throw new Error(otpResponse?.error || 'Failed to request OTP.');
            }

            console.log('✅ OTP requested successfully:', otpResponse);
            setIsModalVisible(true);
        } catch (error) {
            console.error('❌ OTP Request Error:', error);
            Alert.alert('Error', error.message || 'Something went wrong while requesting OTP.');
        } finally {
            setLoading(false);
        }
    };

    // 🔢 OTP input
    const handleOtpChange = (value) => setOtp(value.slice(0, 6));
    const handlePress = () => hiddenInputRef.current?.focus();

    // 🧾 Submit OTP -> get third checksum -> submit final OTP
    const handleSubmitOTP = async () => {
        if (otp.length < 6) {
            Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP.');
            return;
        }

        try {
            setLoading(true);
            setIsModalVisible(false);

            const txnId = postData?.bfs_bfsTxnId;
            const thromde = postData?.thromde;

            if (!txnId || !thromde) {
                throw new Error('Missing transaction ID or thromde.');
            }

            console.log('🔹 Step 1: Fetching third checksum...');
            const thirdChecksumRes = await fetchThirdChecksum(txnId, otp, thromde);

            if (!thirdChecksumRes || thirdChecksumRes?.error) {
                throw new Error(thirdChecksumRes?.error || 'Failed to fetch third checksum.');
            }

            const checksum = thirdChecksumRes?.checksum || thirdChecksumRes?.bfsChecksum;
            if (!checksum) throw new Error('Checksum missing from third checksum response.');

            console.log('✅ Third checksum received:', checksum);

            console.log('🔹 Step 2: Submitting OTP...');
            const submitOtpRes = await fetchSubmitOtp(txnId, otp, checksum, thromde);

            if (!submitOtpRes || submitOtpRes?.error) {
                throw new Error(submitOtpRes?.error || 'Failed to submit OTP.');
            }

            console.log('✅ OTP submitted successfully:', submitOtpRes);

            // ✅ Navigate to confirmation screen
            navigation.navigate('PaymentConfirmation', {
                bank: bankItems.find(b => b.value === selectedBankType)?.label || 'Selected Bank',
                transactionTime: new Date().toLocaleString(),
                transactionId: txnId,
                orderNo: postData?.orderNo || `ORD-${Math.floor(Math.random() * 100000)}`,
                message: 'Payment Successful',
                success: true,
                receiptNo: submitOtpRes?.receiptNo || `RCPT-${Math.floor(Math.random() * 10000)}`,
                bfs_txnAmount: consumerDetails.totalBill.toFixed(2),
                consumerNo: consumerDetails?.accountNo || 'Unknown',
            });

            setOtp('');
        } catch (error) {
            console.error('❌ OTP Submit Error:', error);
            Alert.alert('Error', error.message || 'Something went wrong while submitting OTP.');
        } finally {
            setLoading(false);
        }
    };


    const restImages = useMemo(() => [userIcon, idcardIcon, savemoneyIcon], []);

    // 🎨 Styles
    const styles = StyleSheet.create({
        inputContainer: { marginVertical: hp(1), width: '100%' },
        sectionTitle: {
            fontSize: RFValue(16),
            fontWeight: '800',
            textAlign: 'center',
            color: theme.primary,
            marginBottom: hp(1),
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        modalContainer: {
            width: '98%',
            backgroundColor: theme.white,
            borderRadius: 10,
            padding: 20,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
        },
        modalTitle: {
            fontSize: RFValue(16),
            fontWeight: '800',
            color: theme.primary,
            textAlign: 'center',
            marginBottom: hp(1),
        },
        otpPrompt: {
            color: theme.text,
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: RFValue(14),
            marginVertical: hp(1),
        },
        otpContainer: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginBottom: RFValue(10),
        },
        otpBox: {
            height: RFValue(40),
            width: RFValue(40),
            borderColor: theme.primary,
            borderWidth: RFValue(1.5),
            borderRadius: RFValue(4),
            justifyContent: 'center',
            alignItems: 'center',
        },
        otpText: {
            fontSize: RFValue(24),
            fontWeight: 'bold',
            color: theme.text,
        },
        hiddenInput: {
            position: 'absolute',
            height: 0,
            width: 0,
            opacity: 0,
        },
    });

    return (
        <BackgroundWithScrollView>
            <Loader visible={loading} spinnerSize="small" />
            <InfoContainer>
                <Text style={styles.sectionTitle}>Payment Details</Text>
                <CustomerDetailsHeader
                    labels={['Consumer Name:', 'Consumer No.:', 'Amount:']}
                    customerData={[
                        consumerDetails?.consumerName,
                        consumerDetails?.accountNo,
                        consumerDetails.totalBill.toFixed(2),
                    ]}
                    icons={restImages}
                />
                <View style={styles.inputContainer}>
                    <PickerInput
                        selectedValue={selectedBankType}
                        onValueChange={setSelectedBankType}
                        items={bankItems}
                        placeholder="Select Bank"
                    />
                    <TextInput
                        label="Account Number"
                        value={accountNumber}
                        onChangeText={setAccountNumber}
                        keyboardType="numeric"
                        maxLength={bankAccountLengths[selectedBankType]}
                        placeholder="Account Number"
                    />
                </View>
                <Button
                    mode="contained"
                    onPress={handleRequestOTP}
                    label="Request OTP"
                    isDisabled={isButtonDisabled || loading}
                />
            </InfoContainer>

            {/* OTP Modal */}
            <Modal
                visible={isModalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>OTP Verification</Text>
                        <Text style={styles.otpPrompt}>
                            Enter the 6-digit OTP sent to your registered mobile number.
                        </Text>
                        <TouchableOpacity
                            style={styles.otpContainer}
                            onPress={handlePress}
                            activeOpacity={1}
                        >
                            {[...Array(6)].map((_, index) => (
                                <View key={index} style={styles.otpBox}>
                                    <Text style={styles.otpText}>{otp[index] || ''}</Text>
                                </View>
                            ))}
                        </TouchableOpacity>
                        <RNTextInput
                            ref={hiddenInputRef}
                            style={styles.hiddenInput}
                            value={otp}
                            onChangeText={handleOtpChange}
                            keyboardType="numeric"
                            maxLength={6}
                        />
                        <Button
                            label="Submit OTP"
                            onPress={handleSubmitOTP}
                            isDisabled={otp.length < 6 || loading}
                        />
                    </View>
                </View>
            </Modal>
        </BackgroundWithScrollView>
    );
};

export default BankSelection;
