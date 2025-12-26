// SearchReceipt.js
import { useMemo, useReducer, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Modal,
    ScrollView,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { default as Text } from '../components/GlobalText';
import InfoContainer from '../components/InfoContainer';
import PickerInput from '../components/PickerInput';
import Button from '../components/Button';
import MessageContainer from '../components/MessageContainer';
import CustomerDetailsHeader from '../components/CustomerDetailsHeader';
import Loader from '../components/Loader';
import BackgroundWithoutScrollView from '../components/BackgroundWithoutScrollView';
import DetailsList, { renderPropertyDetails } from '../components/DetailsList';
import CloseIcon from '../assets/images/close.svg';
import DownloadIcon from '../assets/images/download.svg';
import userIcon from '../assets/images/user.svg';
import idcardIcon from '../assets/images/id-card.svg';
import cardIcon from '../assets/images/card.svg';
import telePhoneIcon from '../assets/images/telephone.svg';
import addressIcon from '../assets/images/address.svg';
import { useTheme } from '../context/ThemeContext';
import PDF from 'react-native-pdf';
import RNFS from 'react-native-fs';
import notifee from '@notifee/react-native';
import { displayImportantNotification } from '../helpers/notificationHelper';
import { pdfGenerate } from '../helpers/pdfUtils';
import { fetchGetPaymentMode, fetchGetRecepit, fetchGetRecepitDetails } from '../services/apiServices';

const initialState = {
    selectedYear: null,
    receiptData: [],
    pdfModalVisible: false,
    pdfFilePath: null,
    error: null,
    loading: false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'SET_RECEIPT_DATA':
            return { ...state, receiptData: action.payload, error: null };
        case 'SET_SELECTED_YEAR':
            return { ...state, selectedYear: action.payload };
        case 'SET_PDF_MODAL':
            return { ...state, pdfModalVisible: action.payload };
        case 'SET_PDF_FILE':
            return { ...state, pdfFilePath: action.payload };
        default:
            return state;
    }
};

const SearchReceipt = ({ route }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { selectedYear, pdfModalVisible, pdfFilePath, error, loading, receiptData } = state;

    const { theme, RFValue, hp, wp } = useTheme();
    const { thromde, receiptData: initialReceiptData, title } = route.params || {};

    // Extract customer details safely
    const customerDetails = useMemo(() => {
        if (!initialReceiptData || initialReceiptData.length === 0) {
            return {
                name: 'N/A',
                cid: 'N/A',
                ttin: 'N/A',
                mobileNo: 'N/A',
                cAddress: 'N/A',
                taxPayerId: null,
            };
        }
        const first = initialReceiptData[0];
        return {
            name: first.name || 'N/A',
            ttin: first.ttin || 'N/A',
            cAddress: first.cAddress || 'N/A',
            taxPayerId: first.taxPayerId || null,
        };
    }, [initialReceiptData]);

    // Fetch receipt list by year
    const handleYearChange = async (year) => {
        if (!customerDetails.taxPayerId) {
            dispatch({ type: 'SET_ERROR', payload: 'Customer information not available.' });
            return;
        }

        dispatch({ type: 'SET_SELECTED_YEAR', payload: year });
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await fetchGetRecepit(customerDetails.taxPayerId, year, thromde);
            console.log('response from fetchGetRecepit:', response);
            if (response?.error) {
                dispatch({ type: 'SET_ERROR', payload: response.error });
            } else if (Array.isArray(response) && response.length > 0) {
                dispatch({ type: 'SET_RECEIPT_DATA', payload: response });
            } else {
                dispatch({ type: 'SET_ERROR', payload: 'No receipts found for selected year.' });
            }
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch receipts. Please try again.' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    // Fetch and show PDF
    const handleReceiptPress = useCallback(async (receipt) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            const response = await fetchGetRecepitDetails(receipt.receiptId, thromde);
            const paymentModes = await fetchGetPaymentMode(receipt.receiptId, thromde);

            if (!response || !Array.isArray(response) || response.length === 0) {
                throw new Error('No receipt data found');
            }
            if (!paymentModes || !Array.isArray(paymentModes) || paymentModes.length === 0) {
                throw new Error('No payment mode data found');
            }

            console.log('Generating PDF with data:', { response, paymentModes });

            const pdfPath = await pdfGenerate(response, paymentModes, theme, title);

            console.log('PDF generated at:', pdfPath);

            // Check if file exists
            const fileExists = await RNFS.exists(pdfPath);
            if (!fileExists) {
                throw new Error('PDF file was not created');
            }

            dispatch({ type: 'SET_PDF_FILE', payload: pdfPath });
            dispatch({ type: 'SET_PDF_MODAL', payload: true });

        } catch (err) {
            console.error('handleReceiptPress Error:', err);
            Alert.alert('Error', `Failed to load PDF: ${err.message}`);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [thromde, theme]);

    // Unique file naming for downloads
    const getUniqueFilePath = async (filePath) => {
        let newFilePath = filePath;
        let counter = 1;
        while (await RNFS.exists(newFilePath)) {
            newFilePath = `${RNFS.DownloadDirectoryPath}/PaymentReceipt(${counter}).pdf`;
            counter += 1;
        }
        return newFilePath;
    };

    // Download PDF
    const handleDownloadPress = async () => {
        if (!pdfFilePath) return;

        try {
            // Request permission if not already granted
            const settings = await notifee.getNotificationSettings();
            if (settings.authorizationStatus < 1) {
                const granted = await notifee.requestPermission();
                if (!granted) {
                    Alert.alert('Enable Notifications', 'Please enable notifications to download.');
                    return;
                }
            }

            const destPath = await getUniqueFilePath(`${RNFS.DownloadDirectoryPath}/PaymentReceipt.pdf`);
            await RNFS.copyFile(pdfFilePath, destPath);
            await displayImportantNotification(
                'Download Complete'
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to download PDF.');
            console.error('Download PDF Error:', error);
        }
    };


    const transformedReceiptData = useMemo(() => {
        if (!receiptData || receiptData.length === 0) return [];
        return receiptData.map((r) => ({
            receiptNo: r.receiptNo,
            taxName: r.taxName,
            paymentDate: r.paymentDate || new Date().toLocaleDateString('en-GB'),
            totalAmount: r.totalAmount || 0,
            ...r,
        }));
    }, [receiptData, selectedYear]);

    const yearItems = [
        { label: '2023', value: 24 },
        { label: '2024', value: 25 },
        { label: '2025', value: 26 },
    ];

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: { paddingBottom: hp(2), flexGrow: 1 },
                sectionTitle: {
                    color: theme.primary,
                    textAlign: 'center',
                    fontSize: RFValue(16),
                    fontWeight: '800',
                    marginBottom: hp(1),
                },
                pdfContainer: { flex: 1 },
                pdf: { flex: 1, backgroundColor: theme.background },
                closeButton: {
                    alignItems: 'flex-end',
                    padding: wp(4),
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    zIndex: 10,
                },
                noDataText: {
                    textAlign: 'center',
                    color: theme.text,
                    fontSize: RFValue(14),
                    marginTop: hp(2),
                    fontStyle: 'italic',
                },
                customerDataContainer: { marginBottom: hp(2) },
            }),
        [theme, hp, wp, RFValue]
    );

    const icons = useMemo(() => [userIcon, cardIcon, addressIcon], []);

    return (
        <BackgroundWithoutScrollView>
            <InfoContainer>
                <Loader visible={loading} />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                    <Text style={styles.sectionTitle}>Customer Details</Text>

                    <View style={styles.customerDataContainer}>
                        <CustomerDetailsHeader
                            labels={['Name:', 'TTIN:', 'Address:']}
                            customerData={[
                                customerDetails.name,
                                customerDetails.ttin,
                                customerDetails.cAddress,
                            ]}
                            icons={icons}
                        />
                    </View>

                    <PickerInput
                        label="Select Year to Check Payment Details"
                        selectedValue={selectedYear}
                        onValueChange={handleYearChange}
                        items={yearItems}
                        placeholder="Select Year"
                    />

                    {transformedReceiptData.length > 0 ? (
                        <DetailsList
                            data={transformedReceiptData}
                            renderHeader={renderPropertyDetails}
                            onPressItem={handleReceiptPress}
                            type="PropertyDetails"
                        />
                    ) : (
                        <View>
                            {error ? (
                                <MessageContainer message={error} />
                            ) : (
                                <Text style={styles.noDataText}>
                                    {selectedYear
                                        ? 'No receipts found for selected year.'
                                        : 'Please select a year to view receipts.'}
                                </Text>
                            )}
                        </View>
                    )}
                </ScrollView>

                {/* PDF Modal */}
                <Modal visible={pdfModalVisible} animationType="slide" presentationStyle="pageSheet">
                    <BackgroundWithoutScrollView disablePadding>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => dispatch({ type: 'SET_PDF_MODAL', payload: false })}
                        >
                            <CloseIcon width={20} height={20} fill={theme.text} />
                        </TouchableOpacity>

                        <View style={styles.pdfContainer}>
                            {pdfFilePath ? (
                                <PDF
                                    source={{ uri: `file://${pdfFilePath}` }}
                                    style={styles.pdf}
                                    onError={(error) => Alert.alert('PDF Error', error.message)}
                                />
                            ) : (
                                <Loader visible />
                            )}
                        </View>

                        <View
                            style={{
                                backgroundColor: theme.background,
                                padding: RFValue(20),
                                borderTopWidth: 1,
                                borderTopColor: theme.border,
                            }}
                        >
                            <Button onPress={handleDownloadPress} label="Download PDF" SvgIcon={DownloadIcon} />
                        </View>
                    </BackgroundWithoutScrollView>
                </Modal>
            </InfoContainer>
        </BackgroundWithoutScrollView>
    );
};

export default SearchReceipt;
