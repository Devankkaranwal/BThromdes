import { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import * as Keychain from "react-native-keychain";
import { NativeModules } from "react-native";
import { PermissionsAndroid, Platform } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Loader from "../../components/Loader";
import Button from "../../components/Button";
import { default as Text } from '../../components/GlobalText'
import InfoContainer from "../../components/InfoContainer";
import InfoRow from "../../components/InfoRow";


const { ZebraPrinter } = NativeModules;

const PrintBill = ({ route }) => {
    const { title, waterBillData } = route.params || {};
    const { theme, hp, RFValue } = useTheme();
    const styles = StyleSheet.create({
        container: { padding: RFValue(10), backgroundColor: theme.background },
        sectionTitle: { fontSize: RFValue(14), fontWeight: "600", marginBottom: RFValue(10), color: theme.primary },
        printerList: { marginVertical: RFValue(5) },
        printerItem: { backgroundColor: theme.text, padding: RFValue(5), borderRadius: RFValue(5), marginBottom: hp(1), borderWidth: 1, borderColor: theme.text },
        connectedPrinter: { borderColor: theme.lightGreen, backgroundColor: theme.background },
        printerText: { fontWeight: "600", color: theme.text },
        printerMac: { fontSize: RFValue(12), color: theme.text },
    });

    const requestBluetoothPermissions = async () => {
        if (Platform.OS === "android") {
            if (Platform.Version >= 31) { // Android 12+
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ]);
                return Object.values(granted).every(status => status === PermissionsAndroid.RESULTS.GRANTED);
            } else {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            }
        }
        return true;
    };

    const [details, setDetails] = useState(null);

    useEffect(() => {
        if (waterBillData) {
            setDetails({
                billNo: waterBillData.billNo,
                billMonth: waterBillData.billFor,              // "May,2025"
                billDate: waterBillData.billDate,             // "01/06/2025"
                dueDate: waterBillData.dueDate,               // "30/06/2025"
                billingAddress: waterBillData.billingAddress, // "Building/Flat No( 1 ) ..."
                waterAccountNo: waterBillData.accountNo,      // "N100024"
                meterNo: waterBillData.meterNo || "-",        // could be null
                connectionType: waterBillData.category,       // "Residential"
                previousMeterReading: waterBillData.previousReading,
                previousDate: waterBillData.previousReadingDate,
                recentMeterReading: waterBillData.currentReading,
                recentDate: waterBillData.currentReadingDate,
                consumption: waterBillData.consumption,
                waterCharge: waterBillData.waterBill,
                sewerageCharge: waterBillData.sewerageCharge,
                solidWaste: waterBillData.solidWasteCharge,
                amenitiesFee: waterBillData.streetLightCharge,
                serviceCharge: waterBillData.meterRent,
                chargeAmount: waterBillData.totalBill,
                outstandingCharge: waterBillData.outstanding,
                penaltyCharge: waterBillData.penalty,
                amount: waterBillData.netAmount,
                consumerName: waterBillData.consumerName,
                zoneName: waterBillData.zoneName,
                thromdeName: waterBillData.thromdeName,
                paymentStatus: waterBillData.paymentStatus,
                meterStatus: waterBillData.meterStatus,
                noOfUnits: waterBillData.noOfUnits,
                printDate: new Date().toLocaleDateString(),
            });
        }
    }, [waterBillData]);

    const [printers, setPrinters] = useState([]);
    const [connectedPrinter, setConnectedPrinter] = useState(null);
    const [loading, setLoading] = useState(false);

    // Auto-load saved printer
    useEffect(() => {
        const loadSavedPrinter = async () => {
            try {
                const creds = await Keychain.getGenericPassword();
                if (creds) {
                    setConnectedPrinter({
                        deviceName: creds.username,
                        macAddress: creds.password,
                    });
                }
            } catch (e) {
                console.log("No saved printer:", e.message);
            }
        };
        loadSavedPrinter();
    }, []);


    const handleSearchPrinters = async () => {
        const hasPermission = await requestBluetoothPermissions();
        if (!hasPermission) {
            return Alert.alert("Permission required", "Enable Bluetooth permissions");
        }

        try {
            setLoading(true);
            const list = await ZebraPrinter.discoverPrinters();
            const parsedList = JSON.parse(list || "[]");

            if (!parsedList.length) {
                Alert.alert("No Printers Found", "Turn on Bluetooth and make printer discoverable.");
            } else {
                setPrinters(parsedList.map(addr => ({ deviceName: addr, macAddress: addr })));
            }
        } catch (e) {
            Alert.alert("Error", e.message || "Failed to discover printers.");
        } finally {
            setLoading(false);
        }
    };
    // Select and save printer
    const handleSelectPrinter = async (printer) => {
        try {
            await Keychain.setGenericPassword(printer.deviceName, printer.macAddress);
            setConnectedPrinter(printer);
            Alert.alert("Printer Saved", `Printer ${printer.deviceName} selected.`);
        } catch (e) {
            Alert.alert("Error", e.message);
        }
    };

    const handlePrint = async () => {
        if (!connectedPrinter) return Alert.alert("Error", "Select a printer first.");
        const wrapText = (prefix, text, startY, maxChars = 30, lineHeight = 40) => {
            let lines = [];
            let y = startY;
            const words = text.split(" ");
            let currentLine = "";

            for (let word of words) {
                if ((currentLine + " " + word).trim().length > maxChars) {
                    lines.push(`TEXT 7 0 30 ${y} ${prefix}${currentLine}`);
                    y += lineHeight;
                    prefix = ""; // only for first line
                    currentLine = word;
                } else {
                    currentLine = (currentLine + " " + word).trim();
                }
            }

            if (currentLine) {
                lines.push(`TEXT 7 0 30 ${y} ${prefix}${currentLine}`);
                y += lineHeight;
            }

            return { block: lines.join("\r\n"), nextY: y };
        };
        let y = 310; // starting Y for location
        const { block: locationBlock, nextY: afterLocationY } = wrapText("Location: ", details.billingAddress, y);
        const addSection = (startY, lines, lineHeight = 40) => {
            let y = startY;
            const block = lines.map(item => {
                const line = typeof item === "string" ? item : item.text;
                const font = typeof item === "object" && item.font ? item.font : 7;

                const txt = `TEXT ${font} 0 30 ${y} ${line}`;
                y += lineHeight;
                return txt;
            });
            return { block: block.join("\r\n"), nextY: y };
        };
        const waterSection = [
            { text: `Water AccNo: ${details.waterAccountNo}`, font: 5 },
            `Meter No: ${details.meterNo}`,
            `Connection Type: ${details.connectionType}`,
        ];

        const { block: waterBlock, nextY: afterWaterY } = addSection(afterLocationY + 20, waterSection);

        const prevMeterSection = [
            "PREVIOUS METER READING",
            `Meter Reading: ${details.previousMeterReading}`,
            `Date: ${details.previousDate}`,
        ];
        const { block: prevMeterBlock, nextY: afterPrevY } = addSection(afterWaterY + 20, prevMeterSection);

        const currMeterSection = [
            "CURRENT METER READING",
            `Meter Reading: ${details.recentMeterReading}`,
            `Date: ${details.recentDate}`,
        ];
        const { block: currMeterBlock, nextY: afterCurrY } = addSection(afterPrevY + 20, currMeterSection);

        const chargesSection = [
            `Unit Consumed: ${details.consumption}`,
            `Water Charge: ${details.waterCharge}`,
            `Sewerage Charge: ${details.sewerageCharge}`,
            `Solid Waste Collection Charge: ${details.solidWaste}`,
            `Amenities Fee: ${details.amenitiesFee}`,
            { text: `Charge Amount: ${details.chargeAmount}`, font: 5 },
            `Outstanding Charge: ${details.outstandingCharge}`,
            `Penalty Charge: ${details.penaltyCharge}`,
            { text: `Total Amount Payable: ${details.amount}`, font: 5 },
        ];
        const { block: chargesBlock, nextY: afterChargesY } = addSection(afterCurrY + 20, chargesSection);

        // Build final CPCL payload
        const cpclPayload = `
! 0 200 200 1500 1
CENTER
TEXT 7 0 0 40 ${title}
CENTER
TEXT 7 0 0 80 Water & Service Charges
LEFT
TEXT 5 0 30 120 ------------------------------------------------
TEXT 5 0 30 160 Bill No: ${details.billNo}
TEXT 7 0 30 200 Bill for the Month: ${details.billMonth}
TEXT 7 0 30 240 Bill Date: ${details.billDate}
TEXT 7 0 30 280 Last Due Date: ${details.dueDate}
${locationBlock}
${waterBlock}
${prevMeterBlock}
${currMeterBlock}
${chargesBlock}
TEXT 5 0 30 ${afterChargesY + 20} ------------------------------------------------
TEXT 7 0 30 ${afterChargesY + 60} Pay your bill before the due date to  
TEXT 7 0 30 ${afterChargesY + 100} avoid 2% penalty.
TEXT 7 0 30 ${afterChargesY + 140} Contact the billing section for any issues.
TEXT 7 0 30 ${afterChargesY + 180} Pay before 3 months to avoid disconnection.
TEXT 7 0 30 ${afterChargesY + 220} You can also pay online via the ThromPay app.
PRINT
`;

        try {
            setLoading(true);
            const result = await ZebraPrinter.printBluetooth(
                connectedPrinter.macAddress,
                cpclPayload
            );
            Alert.alert("Success", result);
        } catch (e) {
            Alert.alert("Print Error", "Could not connect to device.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <InfoContainer>
                <Text style={styles.sectionTitle}>Bill Details</Text>
                {details && Object.entries(details).slice(0, 7).map(([key, value]) => (
                    <InfoRow
                        key={key}
                        label={key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        value={value.toString()}
                    />
                ))}
            </InfoContainer>

            <InfoContainer>
                <Button
                    label="Search Printer"
                    onPress={handleSearchPrinters}
                    isDisabled={loading}
                    isLoading={loading}
                    style={{ marginVertical: hp(1) }} // optional extra styling
                />
                {printers.length > 0 && (
                    <View style={styles.printerList}>
                        <Text style={styles.sectionTitle}>Available Printers</Text>
                        {printers.map((printer) => (
                            <TouchableOpacity
                                key={printer.macAddress}
                                style={[
                                    styles.printerItem,
                                    connectedPrinter?.macAddress === printer.macAddress &&
                                    styles.connectedPrinter,
                                ]}
                                onPress={() => handleSelectPrinter(printer)}
                            >
                                <Text style={styles.printerText}>{printer.deviceName}</Text>
                                <Text style={styles.printerMac}>{printer.macAddress}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <Button
                    label="Print Bill"
                    onPress={handlePrint}
                    isDisabled={!connectedPrinter?.macAddress || loading}
                    isLoading={loading}
                    style={{ marginVertical: hp(1) }}
                />
            </InfoContainer>
            <Loader visible={loading} spinnerSize="large" />
        </ScrollView>
    );
};



export default PrintBill;
