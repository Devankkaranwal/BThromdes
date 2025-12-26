import { useEffect, useState } from "react";
import {
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import { default as Text } from '../../components/GlobalText'
import DatePicker from "react-native-date-picker";
import { useTheme } from "../../context/ThemeContext";
import { fetchGetWaterBill, saveWaterMeterReading } from "../../services/apiServices";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import InfoContainer from "../../components/InfoContainer";
import InfoRow from "../../components/InfoRow";
import CustomTextInput from "../../components/TextInput";

const SearchnUpdate = ({ route, navigation }) => {
    const { thromde, title, waterData, getreadingidresponse } = route.params || {};
    console.log('waterData:', waterData)
    console.log('getreadingidresponse:', getreadingidresponse)
    const { theme, hp, RFValue } = useTheme();
    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background, padding: RFValue(10) },
        sectionTitle: { fontSize: RFValue(14), fontWeight: "600", marginBottom: RFValue(10), color: theme.primary },
        input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginTop: 8, fontSize: 16 },
        consumptionText: { marginTop: 8, fontWeight: "bold", fontSize: 16, color: theme.text },
        datePickerButton: { marginTop: hp(1), borderWidth: RFValue(1), borderColor: theme.primary, borderRadius: RFValue(5), padding: RFValue(5), alignItems: "center", backgroundColor: theme.background },
        datePickerText: { fontSize: 16, fontWeight: "600", color: "#333" },
        datePickerSubtext: { fontSize: RFValue(11), color: theme.text, marginTop: hp(1) },
    });


    const readingdata = waterData[0];
    const [details, setDetails] = useState(null);

    useEffect(() => {
        if (readingdata) {
            setDetails({
                billingAddress: readingdata.billingAddress,
                waterAccountNo: readingdata.consumerNo,              // "May,2025"
                waterMeterNo: readingdata.waterMeterNo,             // "01/06/2025"
                previousReading: readingdata.reading,               // "30/06/2025"
                previousReadingDate: readingdata.billingDate.split("T")[0], // "Building/Flat No( 1 ) ..."
                zoneName: readingdata.zoneName,      // "N100024"
                zoneId: getreadingidresponse.waterConnectionTypeID,
                flatNo: readingdata.noOfUnit || "-",        // could be null
                connectionType: readingdata.waterConnectionName,       // "Residential"
                connectionStatus: readingdata.waterConnectionStatusName,
            });
        }
    }, [readingdata]);


    const [reading, setReading] = useState("");
    const [date, setDate] = useState(new Date());
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [pickerMode, setPickerMode] = useState("date"); // "date" or "time"
    const [isLoading, setIsLoading] = useState(false);


    // Show picker
    const openPicker = (mode) => {
        setPickerMode(mode);
        setIsPickerOpen(true);
    };

    const handlePrint = async () => {
        setIsLoading(true);
        const now = new Date();
        let yearid = now.getFullYear();
        let monthid = now.getMonth() + 1;

        if (monthid === 1) {
            monthid = 12;       // December
            yearid = yearid - 1;  // Previous year
        } else {
            monthid = monthid - 1;
        }

        try {
            const response = await fetchGetWaterBill(
                readingdata.consumerNo,
                yearid,
                monthid,
                thromde
            );
            console.log('waterbill data:', response);

            if (!response || response.error) {
                Alert.alert('Error', response?.error || 'No consumer found.');
                return;
            }

            // Don't forget to stop loading
            setIsLoading(false);

            navigation.navigate('PrintBill', {
                waterBillData: response,
                title
            });
        } catch (error) {
            setIsLoading(false); // Important: stop loading on error too
            console.error("Print error:", error);
            Alert.alert("Print Error", "Failed to print");
        }
    };

    const handleSave = async () => {
        if (!reading) return;
        const transactionName = "Water Bill";
        const previousReadingDate = new Date(readingdata.billingDate);
        const previousMonth = previousReadingDate.getMonth() + 1;
        const previousYear = previousReadingDate.getFullYear();

        const currentDate = date;
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        const isNextMonth =
            (currentYear === previousYear && currentMonth === previousMonth + 1) ||
            (previousMonth === 12 && currentMonth === 1 && currentYear === previousYear + 1);

        const nextBillingMonthNumber = previousMonth === 12 ? 1 : previousMonth + 1;
        const nextBillingYear = previousMonth === 12 ? previousYear + 1 : previousYear;

        // Convert month number → month name
        const monthNames = [
            "January", "February", "March", "April",
            "May", "June", "July", "August",
            "September", "October", "November", "December"
        ];

        const nextBillingMonthName = monthNames[nextBillingMonthNumber - 1];

        if (!isNextMonth) {
            Alert.alert(
                "Invalid Billing Month",
                `Please generate the bill for ${nextBillingMonthName} ${nextBillingYear}.`
            );
            return;
        }



        setIsLoading(true);
        try {
            const response = await saveWaterMeterReading(
                getreadingidresponse.waterConnectionDetailsID,
                getreadingidresponse.waterConnectionTypeID,
                Number(reading),
                date.toISOString(),
                getreadingidresponse.readBy,
                getreadingidresponse.readBy,
                thromde,
                transactionName
            );

            setIsLoading(false);

            // FIXED: Check for readingSaved instead of isSaved
            if (response.readingSaved) {
                Alert.alert(
                    "Success",
                    "Water reading saved successfully!",
                    [
                        {
                            text: "Print",
                            onPress: handlePrint
                        },
                        {
                            text: "Cancel",
                            style: "cancel"
                        }
                    ],
                    { cancelable: false }
                );
            } else {
                Alert.alert("Error", response.info || "Failed to save");
            }
        } catch (err) {
            setIsLoading(false);
            console.error(err);
            Alert.alert("Error", "Something went wrong.");
        }
    };


    // Formatters
    const formatDate = (d) =>
        d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    const formatTime = (d) =>
        d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

    return (
        <ScrollView style={styles.container}>
            <InfoContainer >
                <Text style={styles.sectionTitle}>Details</Text>
                {details && Object.entries(details).map(([key, value]) => (
                    <InfoRow
                        key={key}
                        label={key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        value={value.toString()}
                    />
                ))}

            </InfoContainer>

            {/* METER READING SECTION */}
            <InfoContainer>
                <Text style={styles.sectionTitle}>Meter Reading Section</Text>

                <CustomTextInput
                    style={styles.input}
                    placeholder="Enter Water Meter Reading"
                    keyboardType="numeric"
                    value={reading}
                    onChangeText={setReading}
                />

                <Text style={styles.consumptionText}>
                    Consumption: {reading ? reading - details.previousReading : 0}
                </Text>

                {/* Date Picker Button */}
                <TouchableOpacity style={styles.datePickerButton} onPress={() => openPicker("date")}>
                    <Text style={styles.datePickerText}>{formatDate(date)}</Text>
                    <Text style={styles.datePickerSubtext}>Tap to change date</Text>
                </TouchableOpacity>

                {/* Time Picker Button */}
                <TouchableOpacity style={styles.datePickerButton} onPress={() => openPicker("time")}>
                    <Text style={styles.datePickerText}>{formatTime(date)}</Text>
                    <Text style={styles.datePickerSubtext}>Tap to change time</Text>
                </TouchableOpacity>

                {/* SAVE BUTTON */}
                <Button
                    label="SAVE"
                    onPress={handleSave}
                    style={{ marginTop: 20 }}
                    isDisabled={!reading || isLoading}  // disabled if reading is empty
                />
                <Loader visible={isLoading} spinnerSize="large" />

            </InfoContainer>

            {/* Date/Time Picker Modal */}
            <DatePicker
                modal
                open={isPickerOpen}
                date={date}
                mode={pickerMode}
                onConfirm={(selectedDate) => {
                    setIsPickerOpen(false);
                    setDate(selectedDate);
                }}
                onCancel={() => setIsPickerOpen(false)}
            />
        </ScrollView>
    );
};



export default SearchnUpdate;
