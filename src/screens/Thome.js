// import { useMemo, useState } from "react";
// import {
//     StyleSheet,
//     View,
//     Alert,
// } from "react-native";
// import { useTheme } from "../context/ThemeContext";
// import BackgroundWithoutScrollView from "../components/BackgroundWithoutScrollView";
// import HomeContainer from "../components/HomeContainer";
// import SearchIcon from "../assets/images/search.svg";
// import ReceiptIcon from "../assets/images/search-receipt.svg";
// import WaterIcon from "../assets/images/water.svg";
// import InputModal from "../components/InputModal";
// import { fetchSearchReceipt, fetchGetWaterBill } from "../services/apiServices";
// import Loader from "../components/Loader";
// import ImageCarousel from "../components/ImageCarousel";
// import { default as Text } from '../components/GlobalText';

// const now = new Date();
// let month = now.getMonth();
// let year = now.getFullYear();

// // Move to previous month
// if (month === 0) {
//     month = 12;
//     year -= 1;
// }

// const PREV_MONTH = month;
// const PREV_YEAR = year;

// const Thome = ({ route, navigation }) => {
//     const { title, thromde } = route.params || {};
//     const { theme, wp, hp, RFValue } = useTheme();
//     const [modal, setModal] = useState({ visible: false, name: "", label: "", action: null });
//     const [ids, setIds] = useState("");
//     const [loading, setLoading] = useState(false);
//     const styles = useMemo(() => createStyles(theme, wp, hp, RFValue), [theme, wp, hp, RFValue]);
//     const modalStyles = useMemo(() => stylesModal(theme, wp, hp, RFValue), [theme, wp, hp, RFValue]);

//     const handleInputChange = (value) => {
//         const name = modal.name.toLowerCase();

//         // 🔹 Search Receipt → allow full alphanumeric input
//         if (name.includes("search receipt")) {
//             setIds(value);
//             return;
//         }

//         // 🔹 Water & Service Charge → allow full text
//         if (name.includes("water") || name.includes("service")) {
//             setIds(value);
//             return;
//         }

//         // 🔹 Taxpayer Code → alphanumeric
//         if (name.includes("lease land")) {
//             setIds(value);
//             return;
//         }

//         // 🔹 Otherwise → numeric only (CID, Account No, etc.)
//         const cleaned = value.replace(/\D/g, "").slice(0, 11);
//         setIds(cleaned);
//     };


//     const getKeyboardType = () => {
//         const name = modal.name.toLowerCase();

//         if (name.includes("search receipt")) return "default";     // 🔥 Your requirement
//         if (name.includes("water")) return "default";
//         if (name.includes("service")) return "default";
//         if (name.includes("lease land")) return "default";

//         if (name.includes("search taxpayer")) return "numeric";
//         if (name.includes("rental deposit")) return "numeric";

//         return "numeric";  // fallback
//     };


//     const isPhuentsholing = useMemo(() => {
//         return thromde?.toLowerCase().includes('phuentsholing') ||
//             title?.toLowerCase().includes('phuentsholing');
//     }, [thromde, title]);




//     // 🆕 Integrated API call for water bill payment
//     const handleWaterBillSearch = async () => {
//         // Basic validation
//         if (!ids.trim()) {
//             Alert.alert("Error", "Please enter a Water Account Number");
//             return;
//         }

//         setLoading(true);

//         try {
//             // Fetch Water Bill
//             const billData = await fetchGetWaterBill(ids, PREV_YEAR, PREV_MONTH, thromde);

//             if (!billData) {
//                 Alert.alert("Error", "Error Occured. Please Try again!");
//                 return;
//             }

//             if (billData.error) {
//                 Alert.alert("Error", billData.error || "Bill not found.");
//                 return;
//             }

//             // Successfully fetched → close modal & navigate
//             setModal(prev => ({ ...prev, visible: false }));

//             navigation.navigate("WaterAndSeawage", {
//                 title,
//                 thromde,
//                 headertitle: "Water & Sewage Bill",
//                 consumerDetails: billData,  // or billData.consumer if structured
//             });

//         } catch (error) {
//             console.log("🚨 Error in water bill search:", error);
//             Alert.alert("Error", "Failed to fetch water bill details. Please try again.");
//         } finally {
//             setLoading(false);
//             setIds("");
//         }
//     };


//     const handleSearchReceipt = async () => {
//         if (!ids.trim()) {
//             Alert.alert("Error", "Please enter a Transaction ID");
//             return;
//         }

//         // 🟢 Hide modal before starting API call
//         setModal(prev => ({ ...prev, visible: false }));
//         setLoading(true);

//         try {
//             const receiptData = await fetchSearchReceipt(ids, thromde);
//             console.log('receiptData:', receiptData);

//             if (receiptData.error) {
//                 Alert.alert("Error", receiptData.error || "Receipt not found");
//                 return;
//             }

//             if (receiptData.info) {
//                 Alert.alert("Info", receiptData.info || "Receipt not found");
//                 return;
//             }

//             // Navigate to Search Receipt screen with receipt data
//             navigation.navigate("SearchRecipt", {
//                 title,
//                 headertitle: "Search Receipt",
//                 thromde: thromde,
//                 receiptData: receiptData,
//             });

//         } catch (error) {
//             console.log("🚨 Error in receipt search:", error);
//             Alert.alert("Error", "Failed to fetch receipt details. Please try again.");
//         } finally {
//             setLoading(false);
//             setIds("");
//         }
//     };


//     const handleSearch = async () => {
//         // Water & Service Charge path
//         if (
//             modal.name.toLowerCase().includes("water") ||
//             modal.name.toLowerCase().includes("service")
//         ) {
//             await handleWaterBillSearch();
//             return;
//         }

//         // Search receipt path
//         if (modal.name.toLowerCase().includes("search receipt")) {
//             await handleSearchReceipt();
//             return;
//         }

//         // Other inputs → numeric validation
//         if (!(ids.length === 7 || ids.length === 11)) {
//             Alert.alert("Invalid Input", "Please enter a valid 7 or 11 digit number.");
//             return;
//         }

//         setLoading(true);
//         try {
//             await new Promise((resolve) => setTimeout(resolve, 1000));
//             setModal((prev) => ({ ...prev, visible: false }));
//             modal.action?.();
//         } catch (error) {
//             Alert.alert("Error", "Something went wrong. Please try again.");
//         } finally {
//             setModal(prev => ({ ...prev, visible: false }));
//             setLoading(false);
//             setIds("");
//         }
//     };

//     const openModal = (action, name, label) =>
//         setModal({ visible: true, name, label, action });

//     const containerConfig = {
//         phuentsholing: [
//             {
//                 icon: SearchIcon,
//                 name: "Search TaxPayerCode",
//                 label: "Enter CID Number",
//                 alert: true,
//                 headertitle: "Search Tax Payer",
//             },
//             {
//                 icon: WaterIcon,
//                 name: "Water & Service Charge",
//                 label: "Enter Water Account Number",
//                 route: "WaterAndSeawage",
//                 headertitle: "Water & Sewage Bill",
//             },
//             {
//                 icon: ReceiptIcon,
//                 name: "Search Receipt",
//                 label: "Enter CID Number",
//                 route: "SearchRecipt",
//                 headertitle: "Search Receipt",
//             },
//         ],

//         gelephu: [
//             {
//                 icon: SearchIcon,
//                 name: "Search TaxPayerCode",
//                 label: "Enter CID Number",
//                 alert: true,
//                 headertitle: "Search Tax Payer",
//             },
//             {
//                 icon: WaterIcon,
//                 name: "Water & Service Charge",
//                 label: "Enter Water Account Number",
//                 route: "WaterAndSeawage",
//                 headertitle: "Water & Sewage Bill",
//             },
//             {
//                 icon: ReceiptIcon,
//                 name: "Search Receipt",
//                 label: "Enter CID Number",
//                 route: "SearchRecipt",
//                 headertitle: "Search Receipt",
//             },
//         ],

//         samdrup: [
//             {
//                 icon: SearchIcon,
//                 name: "Search TaxPayerCode",
//                 label: "Enter CID Number",
//                 alert: true,
//                 headertitle: "Search Tax Payer",
//             },
//             {
//                 icon: WaterIcon,
//                 name: "Water & Service Charge",
//                 label: "Enter Water Account Number",
//                 route: "WaterAndSeawage",
//                 headertitle: "Water & Sewage Bill",
//             },
//             {
//                 icon: ReceiptIcon,
//                 name: "Search Receipt",
//                 label: "Enter CID Number",
//                 route: "SearchRecipt",
//                 headertitle: "Search Receipt",
//             },
//         ],
//     };


//     const normalizedTitle = title?.toLowerCase() || "";
//     const locationKey =
//         Object.keys(containerConfig).find((key) => normalizedTitle.includes(key)) || "phuentsholing";

//     const containers = useMemo(
//         () =>
//             containerConfig[locationKey].map((item) => ({
//                 icon: <item.icon width={wp(10)} height={wp(10)} />,
//                 name: item.name,
//                 onPress: () => {
//                     // For other items, use existing logic
//                     openModal(
//                         item.alert
//                             ? () => Alert.alert("Payload", JSON.stringify({ title }))
//                             : () => navigation.navigate(item.route, { title, headertitle: item.headertitle, thromde }),
//                         item.name,
//                         item.label
//                     );
//                 }
//             })),
//         [locationKey, navigation, title, wp]
//     );

//     return (
//         <BackgroundWithoutScrollView>
//             <View style={[isPhuentsholing ? styles.pcontainer : styles.container]}>
//                 {isPhuentsholing && (
//                     <View style={styles.carouselContainer}>
//                         <ImageCarousel />
//                     </View>
//                 )}
//                 <View style={[isPhuentsholing ? styles.plogoContainer : styles.logoContainer]}>
//                     <Text style={[styles.slogan, { color: theme.text }]}>Easy Payments, Anytime.</Text>
//                     <Text style={[styles.slogan, { color: theme.text }]}>Your Services, Made Easy.</Text>
//                 </View>


//                 <View style={styles.containerRow}>
//                     {containers.map((c, i) => (
//                         <HomeContainer
//                             key={i}
//                             icon={c.icon}
//                             name={c.name}
//                             onPress={c.onPress}
//                             accessibilityLabel={`Navigate to ${c.name}`}
//                         />
//                     ))}
//                 </View>

//                 <InputModal
//                     visible={modal.visible}
//                     onClose={() => {
//                         setModal((prev) => ({ ...prev, visible: false }));
//                         setIds("");
//                         setLoading(false);
//                     }}
//                     title={modal.name}
//                     label={modal.label}
//                     value={ids}
//                     onChange={handleInputChange}
//                     onSearch={handleSearch}
//                     loading={loading}
//                     theme={theme}
//                     styles={modalStyles}
//                     keyboardType={getKeyboardType()} // Add this prop
//                 />
//                 <Loader visible={loading} backgroundColor="rgba(0,0,0,0.4)" />
//             </View>
//         </BackgroundWithoutScrollView>
//     );
// };

// const createStyles = (theme, wp, hp, RFValue) =>
//     StyleSheet.create({
//         container: {
//             flexGrow: 1,
//             justifyContent: "center",
//             padding: RFValue(8),
//             backgroundColor: theme.background,
//         },
//         logoContainer: {
//             alignItems: "center",
//             marginBottom: hp(8),
//         },
//         pcontainer: {
//             flexGrow: 1,
//             marginVertical: hp(5),
//             backgroundColor: theme.background,
//         },
//         plogoContainer: {
//             alignItems: "center",
//             marginVertical: hp(5),
//         },
//         slogan: {
//             fontSize: RFValue(16),
//             fontWeight: '600',
//             textAlign: 'center',
//             letterSpacing: 1.2,
//             textShadowOffset: { width: 0.5, height: 0.5 },
//             textShadowRadius: 1,
//         },
//         containerWrapper: {
//             justifyContent: "center",
//         },
//         containerRow: {
//             flexDirection: "row",
//             flexWrap: "wrap",
//             justifyContent: "space-evenly",
//             alignItems: "center",
//         },

//     });

// const stylesModal = (theme, wp, hp, RFValue) =>
//     StyleSheet.create({
//         wrapper: {
//             flex: 1,
//             backgroundColor: theme.transparent,
//             justifyContent: "center",
//             alignItems: "center",
//             padding: wp(2),
//         },
//         content: {
//             width: wp(90),
//             borderRadius: RFValue(8),
//             alignItems: "center",
//             padding: RFValue(20),
//             backgroundColor: theme.background,
//         },
//         header: {
//             fontSize: RFValue(16),
//             fontWeight: "600",
//             marginVertical: hp(1.5),
//             color: theme.text,
//             borderBottomWidth: 1,
//             borderBottomColor: theme.text,
//         },
//         body: {
//             width: "100%",
//             marginVertical: hp(2),
//             justifyContent: "center",
//             alignItems: "center",
//         },
//         closeButton: {
//             position: "absolute",
//             top: hp(1.5),
//             right: wp(3),
//             padding: RFValue(8),
//             zIndex: 10,
//         },
//     });

// export default Thome;









import { useMemo, useState, useEffect, useRef } from "react";
import {
    StyleSheet,
    View,
    Alert,
    Animated,
    Easing,
    Dimensions,
    Platform,
    TouchableOpacity,
    Image
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import BackgroundWithoutScrollView from "../components/BackgroundWithoutScrollView";
import HomeContainer from "../components/HomeContainer";
import SearchIcon from "../assets/images/search.svg";
import ReceiptIcon from "../assets/images/search-receipt.svg";
import WaterIcon from "../assets/images/water.svg";
import InputModal from "../components/InputModal";
import { fetchSearchReceipt, fetchGetWaterBill } from "../services/apiServices";
import Loader from "../components/Loader";
import ImageCarousel from "../components/ImageCarousel";
import { default as Text } from '../components/GlobalText';
import { ScrollView } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const now = new Date();
let month = now.getMonth();
let year = now.getFullYear();

// Move to previous month
if (month === 0) {
    month = 12;
    year -= 1;
}

const PREV_MONTH = month;
const PREV_YEAR = year;

const Thome = ({ route, navigation }) => {
    const { title, thromde } = route.params || {};
    const { theme, wp, hp, RFValue } = useTheme();
    const [modal, setModal] = useState({ visible: false, name: "", label: "", action: null });
    const [ids, setIds] = useState("");
    const [loading, setLoading] = useState(false);
    
    // Animation values
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(50));
    const [scaleAnim] = useState(new Animated.Value(0.9));
    const [pulseAnim] = useState(new Animated.Value(1));
    const [cardScaleAnims] = useState([0, 1, 2].map(() => new Animated.Value(0.8)));
    const [rotateAnim] = useState(new Animated.Value(0));

    const styles = useMemo(() => createStyles(theme, wp, hp, RFValue), [theme, wp, hp, RFValue]);
    const modalStyles = useMemo(() => stylesModal(theme, wp, hp, RFValue), [theme, wp, hp, RFValue]);

    useEffect(() => {
        // Entrance animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
                easing: Easing.out(Easing.cubic),
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
                easing: Easing.out(Easing.back(1)),
            }),
        ]).start();

        // Pulse animation for header
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 1500,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease),
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease),
                }),
            ])
        ).start();

        // Continuous rotation for decorative elements
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 20000,
                useNativeDriver: true,
                easing: Easing.linear,
            })
        ).start();

        // Staggered card animations
        cardScaleAnims.forEach((anim, index) => {
            Animated.spring(anim, {
                toValue: 1,
                delay: index * 150,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }).start();
        });
    }, []);

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const handleInputChange = (value) => {
        const name = modal.name.toLowerCase();

        // 🔹 Search Receipt → allow full alphanumeric input
        if (name.includes("search receipt")) {
            setIds(value);
            return;
        }

        // 🔹 Water & Service Charge → allow full text
        if (name.includes("water") || name.includes("service")) {
            setIds(value);
            return;
        }

        // 🔹 Taxpayer Code → alphanumeric
        if (name.includes("lease land")) {
            setIds(value);
            return;
        }

        // 🔹 Otherwise → numeric only (CID, Account No, etc.)
        const cleaned = value.replace(/\D/g, "").slice(0, 11);
        setIds(cleaned);
    };

    const getKeyboardType = () => {
        const name = modal.name.toLowerCase();

        if (name.includes("search receipt")) return "default";     // 🔥 Your requirement
        if (name.includes("water")) return "default";
        if (name.includes("service")) return "default";
        if (name.includes("lease land")) return "default";

        if (name.includes("search taxpayer")) return "numeric";
        if (name.includes("rental deposit")) return "numeric";

        return "numeric";  // fallback
    };

    const isPhuentsholing = useMemo(() => {
        return thromde?.toLowerCase().includes('phuentsholing') ||
            title?.toLowerCase().includes('phuentsholing');
    }, [thromde, title]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return '🌅 Good Morning';
        if (hour < 18) return '☀️ Good Afternoon';
        return '🌙 Good Evening';
    };

    const handleWaterBillSearch = async () => {
        // Basic validation
        if (!ids.trim()) {
            Alert.alert("Error", "Please enter a Water Account Number");
            return;
        }

        setLoading(true);

        try {
            // Fetch Water Bill
            const billData = await fetchGetWaterBill(ids, PREV_YEAR, PREV_MONTH, thromde);

            if (!billData) {
                Alert.alert("Error", "Error Occured. Please Try again!");
                return;
            }

            if (billData.error) {
                Alert.alert("Error", billData.error || "Bill not found.");
                return;
            }

            // Successfully fetched → close modal & navigate
            setModal(prev => ({ ...prev, visible: false }));

            navigation.navigate("WaterAndSeawage", {
                title,
                thromde,
                headertitle: "Water & Sewage Bill",
                consumerDetails: billData,
            });

        } catch (error) {
            console.log("🚨 Error in water bill search:", error);
            Alert.alert("Error", "Failed to fetch water bill details. Please try again.");
        } finally {
            setLoading(false);
            setIds("");
        }
    };

    const handleSearchReceipt = async () => {
        if (!ids.trim()) {
            Alert.alert("Error", "Please enter a Transaction ID");
            return;
        }

        // 🟢 Hide modal before starting API call
        setModal(prev => ({ ...prev, visible: false }));
        setLoading(true);

        try {
            const receiptData = await fetchSearchReceipt(ids, thromde);
            console.log('receiptData:', receiptData);

            if (receiptData.error) {
                Alert.alert("Error", receiptData.error || "Receipt not found");
                return;
            }

            if (receiptData.info) {
                Alert.alert("Info", receiptData.info || "Receipt not found");
                return;
            }

            // Navigate to Search Receipt screen with receipt data
            navigation.navigate("SearchRecipt", {
                title,
                headertitle: "Search Receipt",
                thromde: thromde,
                receiptData: receiptData,
            });

        } catch (error) {
            console.log("🚨 Error in receipt search:", error);
            Alert.alert("Error", "Failed to fetch receipt details. Please try again.");
        } finally {
            setLoading(false);
            setIds("");
        }
    };

    const handleSearch = async () => {
        // Water & Service Charge path
        if (
            modal.name.toLowerCase().includes("water") ||
            modal.name.toLowerCase().includes("service")
        ) {
            await handleWaterBillSearch();
            return;
        }

        // Search receipt path
        if (modal.name.toLowerCase().includes("search receipt")) {
            await handleSearchReceipt();
            return;
        }

        // Other inputs → numeric validation
        if (!(ids.length === 7 || ids.length === 11)) {
            Alert.alert("Invalid Input", "Please enter a valid 7 or 11 digit number.");
            return;
        }

        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setModal((prev) => ({ ...prev, visible: false }));
            modal.action?.();
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setModal(prev => ({ ...prev, visible: false }));
            setLoading(false);
            setIds("");
        }
    };

    const openModal = (action, name, label) => {
        setIds("");
        setModal({ visible: true, name, label, action });
    };

    const handleCardPress = (item, index) => {
        // Press animation
        const pressAnim = new Animated.Value(1);
        Animated.sequence([
            Animated.timing(pressAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(pressAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (item.alert) {
                Alert.alert("Payload", JSON.stringify({ title }));
            } else {
                openModal(
                    () => navigation.navigate(item.route, { 
                        title, 
                        headertitle: item.headertitle, 
                        thromde 
                    }),
                    item.name,
                    item.label
                );
            }
        });
    };

    const containerConfig = {
        phuentsholing: [
            {
                icon: SearchIcon,
                name: "Search TaxPayer",
                label: "Enter CID Number",
                alert: true,
                headertitle: "Search Tax Payer",
                gradient: ['#667eea', '#764ba2'],
                description: "Find taxpayer"
            },
            {
                icon: WaterIcon,
                name: "Water Bill",
                label: "Enter Water Account",
                route: "WaterAndSeawage",
                headertitle: "Water & Sewage",
                gradient: ['#4CAF50', '#2E7D32'],
                description: "View water bill"
            },
            {
                icon: ReceiptIcon,
                name: "Search Receipt",
                label: "Enter Transaction ID",
                route: "SearchRecipt",
                headertitle: "Search Receipt",
                gradient: ['#FF9800', '#F57C00'],
                description: "Payment receipts"
            },
        ],

        gelephu: [
            {
                icon: SearchIcon,
                name: "Search TaxPayer",
                label: "Enter CID Number",
                alert: true,
                headertitle: "Search Tax Payer",
                gradient: ['#667eea', '#764ba2'],
                description: "Find taxpayer"
            },
            {
                icon: WaterIcon,
                name: "Water Bill",
                label: "Enter Water Account",
                route: "WaterAndSeawage",
                headertitle: "Water & Sewage",
                gradient: ['#4CAF50', '#2E7D32'],
                description: "View water bill"
            },
            {
                icon: ReceiptIcon,
                name: "Search Receipt",
                label: "Enter Transaction ID",
                route: "SearchRecipt",
                headertitle: "Search Receipt",
                gradient: ['#FF9800', '#F57C00'],
                description: "Payment receipts"
            },
        ],

        samdrup: [
            {
                icon: SearchIcon,
                name: "Search TaxPayer",
                label: "Enter CID Number",
                alert: true,
                headertitle: "Search Tax Payer",
                gradient: ['#667eea', '#764ba2'],
                description: "Find taxpayer"
            },
            {
                icon: WaterIcon,
                name: "Water Bill",
                label: "Enter Water Account",
                route: "WaterAndSeawage",
                headertitle: "Water & Sewage",
                gradient: ['#4CAF50', '#2E7D32'],
                description: "View water bill"
            },
            {
                icon: ReceiptIcon,
                name: "Search Receipt",
                label: "Enter Transaction ID",
                route: "SearchRecipt",
                headertitle: "Search Receipt",
                gradient: ['#FF9800', '#F57C00'],
                description: "Payment receipts"
            },
        ],
    };

    const normalizedTitle = title?.toLowerCase() || "";
    const locationKey =
        Object.keys(containerConfig).find((key) => normalizedTitle.includes(key)) || "phuentsholing";

    const containers = useMemo(
        () =>
            containerConfig[locationKey].map((item, index) => ({
                icon: <item.icon width={wp(10)} height={wp(10)} fill="#fff" />,
                name: item.name,
                description: item.description,
                gradient: item.gradient,
                onPress: () => handleCardPress(item, index),
            })),
        [locationKey, wp]
    );

    return (
        <BackgroundWithoutScrollView>
            {/* Decorative Elements */}
            <View style={styles.backgroundElements}>
                <Animated.View 
                    style={[
                        styles.floatingCircle,
                        { 
                            transform: [{ rotate: rotateInterpolate }],
                            backgroundColor: theme.primary + '10'
                        }
                    ]} 
                />
            </View>

            <Animated.View 
                style={[
                    styles.container,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { translateY: slideAnim },
                            { scale: scaleAnim }
                        ]
                    }
                ]}
            >

                  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: hp(6) }} // 🔥 footer safe
  >
                {/* Carousel for Phuentsholing */}
                {isPhuentsholing && (
                    <Animated.View 
                        style={[
                            styles.carouselContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <ImageCarousel />
                    </Animated.View>
                )}

                {/* Header Section */}
                <View style={styles.headerContainer}>
                    <View style={styles.locationBadge}>
                        <Text style={styles.locationText}>
                            📍 {title || 'Water Services'}
                        </Text>
                        <View style={styles.activeDot} />
                    </View>
                    
                    <Animated.Text 
                        style={[
                            styles.welcomeText,
                            { transform: [{ scale: pulseAnim }] }
                        ]}
                    >
                        {getGreeting()}
                    </Animated.Text>
                    
                    <Text style={styles.title}>
                        Easy Payments, Anytime
                    </Text>
                    <Text style={styles.subtitle}>
                        Your Services, Made Simple & Secure
                    </Text>
                </View>

                {/* Section Title */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Quick Services</Text>
                    <View style={styles.titleUnderline} />
                </View>

                {/* Action Cards */}
                <View style={styles.cardsContainer}>
                    {containers.map((container, index) => (
                        <Animated.View
                            key={index}
                            style={[
                                styles.cardWrapper,
                                {
                                    transform: [{ scale: cardScaleAnims[index] }],
                                    opacity: cardScaleAnims[index],
                                }
                            ]}
                        >
                            <HomeContainer
                                icon={container.icon}
                                name={container.name}
                                description={container.description}
                                gradient={container.gradient}
                                onPress={container.onPress}
                                showText={true}
                                fontSize={RFValue(12)}
                                textLines={2}
                            />
                        </Animated.View>
                    ))}
                </View>

                {/* Info Section */}
                <Animated.View 
                    style={[
                        styles.infoContainer,
                        {
                            opacity: fadeAnim,
                            transform: [
                                { 
                                    translateY: fadeAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [30, 0]
                                    }) 
                                }
                            ]
                        }
                    ]}
                >
                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>💡 Quick Tips</Text>
                        <View style={styles.tipItem}>
                            <Text style={styles.tipBullet}>•</Text>
                            <Text style={styles.tipText}>Have your CID or Account Number ready</Text>
                        </View>
                        <View style={styles.tipItem}>
                            <Text style={styles.tipBullet}>•</Text>
                            <Text style={styles.tipText}>Ensure stable internet connection</Text>
                        </View>
                        <View style={styles.tipItem}>
                            <Text style={styles.tipBullet}>•</Text>
                            <Text style={styles.tipText}>24/7 service availability</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Footer */}
                <Animated.View 
                    style={[
                        styles.footer,
                        {
                            opacity: fadeAnim,
                            transform: [
                                { 
                                    translateY: fadeAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [20, 0]
                                    }) 
                                }
                            ]
                        }
                    ]}
                >
                    <Text style={styles.footerText}>
                        💧 Water Management System • Secure & Reliable
                    </Text>
                    <Text style={styles.footerSubText}>
                        {new Date().toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                        })}
                    </Text>
                </Animated.View>

                <InputModal
                    visible={modal.visible}
                    onClose={() => {
                        setModal((prev) => ({ ...prev, visible: false }));
                        setIds("");
                        setLoading(false);
                    }}
                    title={modal.name}
                    label={modal.label}
                    value={ids}
                    onChange={handleInputChange}
                    onSearch={handleSearch}
                    loading={loading}
                    theme={theme}
                    styles={modalStyles}
                    keyboardType={getKeyboardType()}
                />
                <Loader visible={loading} backgroundColor="rgba(0,0,0,0.4)" />
           
           
           </ScrollView>
           
            </Animated.View>

        </BackgroundWithoutScrollView>
    );
};

const createStyles = (theme, wp, hp, RFValue) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: wp(4),
            paddingTop: hp(2),
            backgroundColor: theme.background,
        },
        backgroundElements: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
        },
        floatingCircle: {
            position: 'absolute',
            top: hp(10),
            right: wp(-15),
            width: wp(50),
            height: wp(50),
            borderRadius: wp(25),
            borderWidth: 1,
            borderColor: theme.primary + '20',
        },
        carouselContainer: {
            marginBottom: hp(3),
            borderRadius: RFValue(20),
            overflow: 'hidden',
            ...Platform.select({
                ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                },
                android: {
                    elevation: 6,
                },
            }),
        },


        // headerContainer: {
        //     alignItems: 'center',
        //     marginBottom: hp(4),
        //     paddingHorizontal: wp(2),
        // },


headerContainer: {
  alignItems: 'center',
  marginBottom: hp(4),
  paddingHorizontal: wp(4),
  paddingVertical: hp(3),
  borderRadius: RFValue(22),
  backgroundColor: theme.primary + '12',
},


        locationBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.primary + '20',
            paddingHorizontal: wp(3.5),
            paddingVertical: hp(0.7),
            borderRadius: RFValue(18),
            marginBottom: hp(1.5),
        },
        locationText: {
            fontSize: RFValue(11),
            color: theme.primary,
            fontWeight: '600',
            marginRight: wp(1.5),
        },
        activeDot: {
            width: wp(2),
            height: wp(2),
            borderRadius: wp(1),
            backgroundColor: '#4CAF50',
        },
        welcomeText: {
            fontSize: RFValue(13),
            color: theme.textSecondary,
            fontWeight: '600',
            marginBottom: hp(0.8),
            opacity: 0.9,
        },
        // title: {
        //     fontSize: RFValue(24),
        //     fontWeight: '800',
        //     color: theme.text,
        //     textAlign: 'center',
        //     marginBottom: hp(0.8),
        //     letterSpacing: 0.3,
        // },
        // subtitle: {
        //     fontSize: RFValue(13),
        //     color: theme.textSecondary,
        //     textAlign: 'center',
        //     fontWeight: '500',
        //     opacity: 0.8,
        //     lineHeight: RFValue(18),
        //     paddingHorizontal: wp(8),
        // },


title: {
  fontSize: RFValue(26),
  fontWeight: '900',
  color: theme.text,
  textAlign: 'center',
  letterSpacing: 0.5,
},

subtitle: {
  fontSize: RFValue(14),
  color: theme.textSecondary,
  textAlign: 'center',
  marginTop: hp(0.5),
  opacity: 0.9,
},


        sectionHeader: {
            marginBottom: hp(3),
            paddingHorizontal: wp(1),
        },
        sectionTitle: {
            fontSize: RFValue(18),
            fontWeight: '700',
            color: theme.text,
            marginBottom: hp(1),
        },
        titleUnderline: {
            width: wp(14),
            height: 3,
            backgroundColor: theme.primary,
            borderRadius: 2,
        },
        // cardsContainer: {
        //     flexDirection: 'row',
        //     justifyContent: 'space-between',
        //     flexWrap: 'wrap',
        //     marginBottom: hp(3),
        //     paddingHorizontal: wp(0.5),
        // },

cardsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: hp(3),
},


        // cardWrapper: {
        //     width: wp(30),
        //     marginBottom: hp(2),
        //     alignItems: 'center',
        // },


        cardWrapper: {
  width: '30%',     // 🔥 bigger cards
  marginBottom: hp(2),
},



        infoContainer: {
            marginBottom: hp(3),
        },
        infoCard: {
            backgroundColor: theme.card,
            borderRadius: RFValue(14),
            padding: RFValue(16),
            ...Platform.select({
                ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 6,
                },
                android: {
                    elevation: 3,
                },
            }),
            borderWidth: 1,
            borderColor: theme.primary + '15',
        },
        infoTitle: {
            fontSize: RFValue(15),
            fontWeight: '700',
            color: theme.text,
            marginBottom: hp(1.2),
        },
        tipItem: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: hp(0.8),
        },
        tipBullet: {
            fontSize: RFValue(14),
            color: theme.primary,
            marginRight: wp(1.5),
            marginTop: hp(0.1),
        },
        tipText: {
            fontSize: RFValue(12),
            color: theme.textSecondary,
            flex: 1,
            lineHeight: RFValue(16),
        },
        footer: {
            alignItems: 'center',
            paddingBottom: hp(2),
            paddingHorizontal: wp(3),
        },
        footerText: {
            fontSize: RFValue(11),
            color: theme.textSecondary,
            fontWeight: '500',
            textAlign: 'center',
            opacity: 0.7,
            marginBottom: hp(0.5),
        },
        footerSubText: {
            fontSize: RFValue(10),
            color: theme.textSecondary,
            opacity: 0.5,
            textAlign: 'center',
        },
    });

const stylesModal = (theme, wp, hp, RFValue) =>
    StyleSheet.create({
        wrapper: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: wp(5),
        },
        content: {
            width: wp(88),
            borderRadius: RFValue(20),
            padding: RFValue(25),
            backgroundColor: theme.background,
            ...Platform.select({
                ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.25,
                    shadowRadius: 25,
                },
                android: {
                    elevation: 20,
                },
            }),
            borderWidth: 1,
            borderColor: theme.card + '80',
        },
        header: {
            fontSize: RFValue(18),
            fontWeight: '700',
            marginBottom: hp(2.5),
            color: theme.text,
            textAlign: 'center',
            paddingBottom: hp(1.5),
            borderBottomWidth: 2,
            borderBottomColor: theme.primary + '30',
        },
        body: {
            width: '100%',
            marginVertical: hp(3),
            justifyContent: 'center',
            alignItems: 'center',
        },
        closeButton: {
            position: 'absolute',
            top: hp(2),
            right: wp(4),
            padding: RFValue(8),
            zIndex: 10,
            backgroundColor: theme.card,
            borderRadius: RFValue(12),
            width: RFValue(32),
            height: RFValue(32),
            justifyContent: 'center',
            alignItems: 'center',
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.card,
            borderRadius: RFValue(16),
            paddingHorizontal: RFValue(18),
            marginBottom: hp(3),
            borderWidth: 2,
            borderColor: theme.primary + '20',
        },
        input: {
            flex: 1,
            padding: RFValue(16),
            fontSize: RFValue(16),
            color: theme.text,
            fontWeight: '500',
        },
        searchButton: {
            backgroundColor: theme.primary,
            borderRadius: RFValue(14),
            paddingVertical: RFValue(16),
            paddingHorizontal: RFValue(30),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            ...Platform.select({
                ios: {
                    shadowColor: theme.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                },
                android: {
                    elevation: 8,
                },
            }),
        },
        searchButtonText: {
            color: '#fff',
            fontSize: RFValue(16),
            fontWeight: '600',
            marginLeft: wp(2),
        },
    });

export default Thome;