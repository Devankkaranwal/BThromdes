// import { useMemo, useState, useEffect } from 'react';
// import { View, StyleSheet, Alert, BackHandler, StatusBar } from 'react-native';
// import { default as Text } from '../../components/GlobalText'
// import * as Keychain from 'react-native-keychain';
// import HomeContainer from '../../components/HomeContainer';
// import SearchIcon from '../../assets/images/search.svg';
// import ReceiptIcon from '../../assets/images/search-receipt.svg';
// import PrintIcon from '../../assets/images/print.svg';
// import { useTheme } from '../../context/ThemeContext';
// import BackgroundWithoutScrollView from '../../components/BackgroundWithoutScrollView';
// import InputModal from '../../components/InputModal';
// import { fetchConsumerDetails, fetchGetConsumerNoByMeterNo, fetchGetWaterBill, fetchGetWaterBillByWaterMeterReadingnId, fetchGetWaterReadingByWaterConnectionID } from '../../services/apiServices';

// const AuthHome = ({ route, navigation }) => {
//     const [modal, setModal] = useState({ visible: false, name: '', label: '', action: null });
//     const [ids, setIds] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [authData, setAuthData] = useState(null);

//     const { theme, wp, hp, RFValue } = useTheme();
//     const { title, thromde } = route.params || {
     
//     };
//     console.log("print the data thromde",thromde)
    

//     const now = new Date();
//     let yearid = now.getFullYear();
//     let monthid = now.getMonth() + 1;

//     // Previous month logic
//     if (monthid === 1) {
//         monthid = 12;       // December
//         yearid = yearid - 1;  // Previous year
//     } else {
//         monthid = monthid - 1;
//     }

//     useEffect(() => {
//         navigation.setOptions({
//             headerLeft: () => null, // disable header back button
//         });

//         const backHandler = BackHandler.addEventListener(
//             'hardwareBackPress',
//             () => true // disable physical back button
//         );

//         const loadAuth = async () => {
//             try {
//                 const credentials = await Keychain.getGenericPassword();
//                 if (credentials) {
//                     const parsed = JSON.parse(credentials.password);
//                     console.log("🔐 Loaded Auth:", parsed);
//                     setAuthData(parsed); // store in state
//                 } else {
//                     console.log("❌ No credentials found");
//                 }
//             } catch (error) {
//                 console.log("⚠️ Error reading Keychain:", error);
//             }
//         };

//         loadAuth();

//         return () => backHandler.remove();
//     }, [navigation]);

//     const handleInputChange = (value) => {
//         if (modal.name.toLowerCase().includes('search account')) {
//             setIds(value.replace(/\D/g, '').slice(0, 100)); // numeric only
//         } else {
//             setIds(value.slice(0, 100)); // alphanumeric allowed
//         }
//     };

//     const getKeyboardType = () =>
//         modal.name.toLowerCase().includes('search account') ? 'numeric' : 'default';

//     const handleSearch = async () => {
//         if (!ids.trim()) {
//             Alert.alert('Error', `Please enter a ${modal.label || 'value'}.`);
//             return;
//         }
//         setIsLoading(true);
//         try {
//             if (modal.name.toLowerCase().includes('search account')) {
//                 const response = await fetchGetConsumerNoByMeterNo(ids, thromde);
//                 if (!response || response.error) {
//                     Alert.alert('Error', response?.error || 'No consumer found.');
//                     return;
//                 }
                

//                 Alert.alert(
//                     'Consumer Details',
//                     `Consumer Number: ${response[0].consumerNo}\n` +
//                     `Water Meter Number: ${response[0].waterMeterNo}\n` +
//                     `Connection ID: ${response[0].waterConnectionDetailsId}`
//                 );
//             } else if (modal.name.toLowerCase().includes('print')) {
//                 const response = await fetchGetWaterBill(ids, yearid, monthid, thromde);
//                 console.log('waternilldata:', response)

//                 if (!response || response.error) {
//                     Alert.alert('Error', response?.error || 'No consumer found.');
//                     return;
//                 }


//                 navigation.navigate('PrintBill', {
//                     waterBillData: response,
//                     title
//                 });
//                 setModal((prev) => ({ ...prev, visible: false }));
//             } else if (modal.name.toLowerCase().includes('update')) {
//                 const response = await fetchConsumerDetails(ids, thromde);
//                 console.log('response dattaaa:', response)
//                 if (!response || response.error) {
//                     Alert.alert('Error', response?.error || 'No consumer found.');
//                     return;
//                 }
//                 const waterConnectionDetailsId = response[0].waterConnectionDetailsId
//                 const getreadingidresponse = await fetchGetWaterReadingByWaterConnectionID(waterConnectionDetailsId, thromde);
//                 if (!getreadingidresponse || getreadingidresponse.error) {
//                     Alert.alert('Error', getreadingidresponse?.error || 'No consumer found.');
//                     return;
//                 }
//                 console.log("printed the getreadingidresponse", getreadingidresponse)

//                 const createdDate = getreadingidresponse.createdDate;
//                 const asOfDate = createdDate.split("T")[0];
//                 const readingId = getreadingidresponse.meterReadingRecordID
                
//                 const meteridresponse = await fetchGetWaterBillByWaterMeterReadingnId(readingId, asOfDate, thromde);
//                 console.log('meteridresponse:', meteridresponse)


//                 console.log('getreadingidresponse:', getreadingidresponse)
//                  console.log("printed the createdDate", createdDate)
//                     console.log("printed the readingId", readingId)
//                      console.log("printed the asOfDate", asOfDate)

//                 if (!meteridresponse || meteridresponse.error || meteridresponse.info) {
//                     Alert.alert('Error', meteridresponse?.error || meteridresponse?.info || 'No consumer found.');
//                     return;
//                 }
//                 navigation.navigate('SearchnUpdate', {
//                     waterData: meteridresponse,
//                     getreadingidresponse: getreadingidresponse,
//                     thromde: thromde,
//                     title
//                 });
//                 setModal((prev) => ({ ...prev, visible: false }));
//             }

//             else {
//                 modal.action?.();
//                 setModal((prev) => ({ ...prev, visible: false }));
//             }
//         } catch (error) {
//             Alert.alert('Error', 'Something went wrong. Please try again.');
//         } finally {
//             setIsLoading(false);
//             setIds('');
//         }
//     };

//     const openModal = (action, name, label) => {
//         setIds('');
//         setModal({ visible: true, name, label, action });
//     };

//     const ptthomeContainersData = (wp, navigation, payload) => [
//         {
//             icon: <SearchIcon width={wp(10)} height={wp(10)} />,
//             name: 'Search',
//             label: 'Enter Water Meter Number',
//             onPress: () =>
//                 openModal(
//                     () => navigation.navigate('SearchTax', payload),
//                     'Search Account Number',
//                     'Enter Water Meter Number'
//                 ),
//         },
//         {
//             icon: <ReceiptIcon width={wp(10)} height={wp(10)} />,
//             name: 'Update',
//             label: 'Enter Water Account Number',
//             onPress: () =>
//                 openModal(
//                     () => navigation.navigate('SearchnUpdate', payload),
//                     'Search & Update',
//                     'Enter Water Account Number'
//                 ),
//         },
//         {
//             icon: <PrintIcon width={wp(10)} height={wp(10)} />,
//             name: 'Print',
//             label: 'Enter Water Account Number',
//             onPress: () =>
//                 openModal(
//                     () => navigation.navigate('PrintBill', payload),
//                     'Print',
//                     'Enter Water Account Number'
//                 ),
//         },
//     ];

//     const sjthomeContainersData = (wp, navigation, payload) => [
//         {
//             icon: <SearchIcon width={wp(10)} height={wp(10)} />,
//             name: 'Search',
//             label: 'Enter Water Meter Number',
//             onPress: () =>
//                 openModal(
//                     () => navigation.navigate('SearchTax', payload),
//                     'Search Account Number',
//                     'Enter Water Meter Number'
//                 ),
//         },
//         {
//             icon: <ReceiptIcon width={wp(10)} height={wp(10)} />,
//             name: 'Update',
//             label: 'Enter Water Account Number',
//             onPress: () =>
//                 openModal(
//                     () => navigation.navigate('SearchnUpdate', payload),
//                     'Search & Update',
//                     'Enter Water Account Number'
//                 ),
//         },
//         {
//             icon: <PrintIcon width={wp(10)} height={wp(10)} />,
//             name: 'Print',
//             label: 'Enter Water Account Number',
//             onPress: () =>
//                 openModal(
//                     () => navigation.navigate('PrintBill', payload),
//                     'Print',
//                     'Enter Water Account Number'
//                 ),
//         },
//     ];

//     const gtthomeContainersData = (wp, navigation, payload) => [
//         {
//             icon: <SearchIcon width={wp(10)} height={wp(10)} />,
//             name: 'Search',
//             label: 'Enter Water Meter Number',
//             onPress: () =>
//                 openModal(
//                     () => navigation.navigate('SearchTax', payload),
//                     'Search Account Number',
//                     'Enter Water Meter Number'
//                 ),
//         },
//         {
//             icon: <ReceiptIcon width={wp(10)} height={wp(10)} />,
//             name: 'Update',
//             label: 'Enter Water Account Number',
//             onPress: () =>
//                 openModal(
//                     () => navigation.navigate('SearchnUpdate', payload),
//                     'Search & Update',
//                     'Enter Water Account Number'
//                 ),
//         },
//         {
//             icon: <PrintIcon width={wp(10)} height={wp(10)} />,
//             name: 'Print',
//             label: 'Enter Water Account Number',
//             onPress: () =>
//                 openModal(
//                     () => navigation.navigate('PrintBill', payload),
//                     'Print',
//                     'Enter Water Account Number'
//                 ),
//         },
//     ];

//     const containers = useMemo(() => {
//         const payload = { title };
//         if (title?.toLowerCase().includes('phuntsholing')) return ptthomeContainersData(wp, navigation, payload);
//         if (title?.toLowerCase().includes('samdrup')) return sjthomeContainersData(wp, navigation, payload);
//         if (title?.toLowerCase().includes('gelephu')) return gtthomeContainersData(wp, navigation, payload);
//         return ptthomeContainersData(wp, navigation, payload);
//     }, [title, wp, navigation]);

//     const styles = useMemo(() => createStyles(theme, wp, hp, RFValue), [theme, wp, hp, RFValue]);
//     const modalStyles = useMemo(() => stylesModal(theme, wp, hp, RFValue), [theme, wp, hp, RFValue]);

//     return (
//         <>
//             <StatusBar
//                 barStyle={theme.isDark ? 'light-content' : 'dark-content'}
//                 backgroundColor={theme.background}
//             />
//             <BackgroundWithoutScrollView>
//                 <View style={styles.containerWrapper}>
//                     <View style={styles.logoContainer}>
//                         <Text style={[styles.slogan, { color: theme.text }]}>{title}</Text>
//                         <Text style={[styles.slogan, { color: theme.text }]}>
//                             Welcome {authData?.fullName || 'User'}
//                         </Text>
//                     </View>
//                 </View>

//                 <View style={styles.containerWrapper}>
//                     <View style={styles.containerRow}>
//                         {containers.map((container, index) => (
//                             <HomeContainer
//                                 key={index}
//                                 icon={container.icon}
//                                 name={container.name}
//                                 onPress={container.onPress}
//                             />
//                         ))}
//                     </View>
//                 </View>
//                 <InputModal
//                     visible={modal.visible}
//                     onClose={() => setModal((prev) => ({ ...prev, visible: false }))}
//                     title={modal.name}
//                     label={modal.label}
//                     value={ids}
//                     onChange={handleInputChange}
//                     onSearch={handleSearch}
//                     loading={isLoading}
//                     theme={theme}
//                     styles={modalStyles}
//                     keyboardType={getKeyboardType()}
//                 />
//             </BackgroundWithoutScrollView>
//         </>
//     );
// };

// const createStyles = (theme, wp, hp, RFValue) =>
//     StyleSheet.create({
//         containerWrapper: { justifyContent: 'center' },
//         containerRow: {
//             flexDirection: 'row',
//             flexWrap: 'wrap',
//             justifyContent: 'space-evenly',
//             alignItems: 'center',
//         },
//         logoContainer: { alignItems: 'center', marginVertical: hp(8) },
//         slogan: {
//             marginTop: hp(2),
//             fontSize: RFValue(16),
//             fontWeight: '600',
//             textAlign: 'center',
//             letterSpacing: 1.2,
//         },
//     });

// const stylesModal = (theme, wp, hp, RFValue) =>
//     StyleSheet.create({
//         wrapper: {
//             flex: 1,
//             backgroundColor: theme.transparent,
//             justifyContent: 'center',
//             alignItems: 'center',
//             padding: wp(2),
//         },
//         content: {
//             width: wp(90),
//             borderRadius: RFValue(8),
//             alignItems: 'center',
//             padding: RFValue(20),
//             backgroundColor: theme.background,
//         },
//         header: {
//             fontSize: RFValue(16),
//             fontWeight: '600',
//             marginVertical: hp(1.5),
//             color: theme.text,
//             borderBottomWidth: 1,
//             borderBottomColor: theme.text,
//         },
//         body: {
//             width: '100%',
//             marginVertical: hp(2),
//             justifyContent: 'center',
//             alignItems: 'center',
//         },
//         closeButton: {
//             position: 'absolute',
//             top: hp(1.5),
//             right: wp(3),
//             padding: RFValue(8),
//             zIndex: 10,
//         },
//     });

// export default AuthHome;



import { useMemo, useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  BackHandler, 
  StatusBar, 
  Platform,
  TouchableOpacity,
  Animated,
  ActivityIndicator
} from 'react-native';
import { default as Text } from '../../components/GlobalText';
import * as Keychain from 'react-native-keychain';
import HomeContainer from '../../components/HomeContainer';
import SearchIcon from '../../assets/images/search.svg';
import ReceiptIcon from '../../assets/images/search-receipt.svg';
import PrintIcon from '../../assets/images/print.svg';
import { useTheme } from '../../context/ThemeContext';
import BackgroundWithoutScrollView from '../../components/BackgroundWithoutScrollView';
import InputModal from '../../components/InputModal';
import { fetchConsumerDetails, fetchGetConsumerNoByMeterNo, fetchGetWaterBill, fetchGetWaterBillByWaterMeterReadingnId, fetchGetWaterReadingByWaterConnectionID } from '../../services/apiServices';

const AuthHome = ({ route, navigation }) => {
  const [modal, setModal] = useState({ visible: false, name: '', label: '', action: null });
  const [ids, setIds] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authData, setAuthData] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const { theme, wp, hp, RFValue } = useTheme();
  const { title, thromde } = route.params || {};

  const now = new Date();
  let yearid = now.getFullYear();
  let monthid = now.getMonth() + 1;

  if (monthid === 1) {
    monthid = 12;
    yearid = yearid - 1;
  } else {
    monthid = monthid - 1;
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerStyle: {
        backgroundColor: theme.background,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        color: theme.text,
        fontSize: RFValue(18),
        fontWeight: '700',
      },
    });

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    const loadAuth = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          const parsed = JSON.parse(credentials.password);
          setAuthData(parsed);
        }
      } catch (error) {
        console.log("⚠️ Error reading Keychain:", error);
      }
    };

    loadAuth();

    // Animation on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    return () => backHandler.remove();
  }, [navigation]);

  const handleInputChange = (value) => {
    if (modal.name.toLowerCase().includes('search account')) {
      setIds(value.replace(/\D/g, '').slice(0, 100));
    } else {
      setIds(value.slice(0, 100));
    }
  };

  const getKeyboardType = () =>
    modal.name.toLowerCase().includes('search account') ? 'numeric' : 'default';

  const handleSearch = async () => {
    if (!ids.trim()) {
      Alert.alert('Error', `Please enter a ${modal.label || 'value'}.`);
      return;
    }
    
    setIsLoading(true);
    try {
      if (modal.name.toLowerCase().includes('search account')) {
        const response = await fetchGetConsumerNoByMeterNo(ids, thromde);
        if (!response || response.error) {
          Alert.alert('Error', response?.error || 'No consumer found.');
          return;
        }
        
        Alert.alert(
          '✅ Consumer Details',
          `Consumer Number: ${response[0].consumerNo}\n` +
          `Water Meter Number: ${response[0].waterMeterNo}\n` +
          `Connection ID: ${response[0].waterConnectionDetailsId}`
        );
      } else if (modal.name.toLowerCase().includes('print')) {
        const response = await fetchGetWaterBill(ids, yearid, monthid, thromde);
        
        if (!response || response.error) {
          Alert.alert('Error', response?.error || 'No consumer found.');
          return;
        }

        navigation.navigate('PrintBill', {
          waterBillData: response,
          title
        });
        setModal((prev) => ({ ...prev, visible: false }));
      } else if (modal.name.toLowerCase().includes('update')) {
        const response = await fetchConsumerDetails(ids, thromde);
        if (!response || response.error) {
          Alert.alert('Error', response?.error || 'No consumer found.');
          return;
        }
        
        const waterConnectionDetailsId = response[0].waterConnectionDetailsId;
        const getreadingidresponse = await fetchGetWaterReadingByWaterConnectionID(waterConnectionDetailsId, thromde);
        
        if (!getreadingidresponse || getreadingidresponse.error) {
          Alert.alert('Error', getreadingidresponse?.error || 'No consumer found.');
          return;
        }

        const createdDate = getreadingidresponse.createdDate;
        const asOfDate = createdDate.split("T")[0];
        const readingId = getreadingidresponse.meterReadingRecordID;
        
        const meteridresponse = await fetchGetWaterBillByWaterMeterReadingnId(readingId, asOfDate, thromde);

        if (!meteridresponse || meteridresponse.error || meteridresponse.info) {
          Alert.alert('Error', meteridresponse?.error || meteridresponse?.info || 'No consumer found.');
          return;
        }
        
        navigation.navigate('SearchnUpdate', {
          waterData: meteridresponse,
          getreadingidresponse: getreadingidresponse,
          thromde: thromde,
          title
        });
        setModal((prev) => ({ ...prev, visible: false }));
      } else {
        modal.action?.();
        setModal((prev) => ({ ...prev, visible: false }));
      }
    } catch (error) {
      Alert.alert('❌ Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      setIds('');
    }
  };

  const openModal = (action, name, label) => {
    setIds('');
    setModal({ visible: true, name, label, action });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good Morning';
    if (hour < 18) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
  };

  const ptthomeContainersData = (wp, navigation, payload) => [
    {
      icon: <SearchIcon width={wp(12)} height={wp(12)} fill={theme.primary} />,
      name: 'Search',
      label: 'Enter Water Meter Number',
      description: 'Find account by meter number',
      gradient: ['#667eea', '#764ba2'],
      onPress: () =>
        openModal(
          () => navigation.navigate('SearchTax', payload),
          'Search Account Number',
          'Enter Water Meter Number'
        ),
    },
    {
      icon: <ReceiptIcon width={wp(12)} height={wp(12)} fill={theme.secondary} />,
      name: 'Update',
      label: 'Enter Water Account Number',
      description: 'View & update consumer details',
      gradient: ['#4CAF50', '#2E7D32'],
      onPress: () =>
        openModal(
          () => navigation.navigate('SearchnUpdate', payload),
          'Search & Update',
          'Enter Water Account Number'
        ),
    },
    {
      icon: <PrintIcon width={wp(12)} height={wp(12)} fill={theme.accent} />,
      name: 'Print',
      label: 'Enter Water Account Number',
      description: 'Generate water bill receipt',
      gradient: ['#FF9800', '#F57C00'],
      onPress: () =>
        openModal(
          () => navigation.navigate('PrintBill', payload),
          'Print',
          'Enter Water Account Number'
        ),
    },
  ];

  const sjthomeContainersData = (wp, navigation, payload) => ptthomeContainersData(wp, navigation, payload);
  const gtthomeContainersData = (wp, navigation, payload) => ptthomeContainersData(wp, navigation, payload);

  const containers = useMemo(() => {
    const payload = { title };
    if (title?.toLowerCase().includes('phuntsholing')) return ptthomeContainersData(wp, navigation, payload);
    if (title?.toLowerCase().includes('samdrup')) return sjthomeContainersData(wp, navigation, payload);
    if (title?.toLowerCase().includes('gelephu')) return gtthomeContainersData(wp, navigation, payload);
    return ptthomeContainersData(wp, navigation, payload);
  }, [title, wp, navigation]);

  const styles = useMemo(() => createStyles(theme, wp, hp, RFValue), [theme, wp, hp, RFValue]);
  const modalStyles = useMemo(() => stylesModal(theme, wp, hp, RFValue), [theme, wp, hp, RFValue]);

  return (
    <>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
        translucent={false}
      />
      <BackgroundWithoutScrollView>
        <Animated.View 
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.profileSection}>
              <View style={styles.welcomeCard}>
                <Text style={styles.greetingText}>{getGreeting()}</Text>
                <Text style={styles.userName}>
                  {authData?.fullName?.split(' ')[0] || 'User'}
                </Text>
                <View style={styles.locationTag}>
                  <Text style={styles.locationText}>📍 {title || 'Water Management'}</Text>
                </View>
              </View>
              
              <View style={styles.dateCard}>
                <Text style={styles.dateText}>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </Text>
                <Text style={styles.timeText}>
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Actions Title */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.titleUnderline} />
          </View>

          {/* Action Cards */}
          <View style={styles.cardsContainer}>
            {containers.map((container, index) => (
              <HomeContainer
                key={index}
                pulse
                icon={container.icon}
                name={container.name}
                description={container.description}
                gradient={container.gradient}
                onPress={container.onPress}
                delay={index * 150}
              />
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Water Management System v2.0
            </Text>
            <Text style={styles.footerSubText}>
              Last sync: Today, {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </Text>
          </View>
        </Animated.View>

        {/* Modal */}
        <InputModal
          visible={modal.visible}
          onClose={() => setModal((prev) => ({ ...prev, visible: false }))}
          title={modal.name}
          label={modal.label}
          value={ids}
          onChange={handleInputChange}
          onSearch={handleSearch}
          loading={isLoading}
          theme={theme}
          styles={modalStyles}
          keyboardType={getKeyboardType()}
        />
      </BackgroundWithoutScrollView>
    </>
  );
};

const createStyles = (theme, wp, hp, RFValue) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: wp(5),
      paddingTop: hp(2),
    },
    headerContainer: {
      marginTop: hp(1),
      marginBottom: hp(4),
    },
    profileSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    welcomeCard: {
      flex: 1,
      marginRight: wp(3),
    },
    greetingText: {
      fontSize: RFValue(13),
      color: theme.textSecondary,
      fontWeight: '500',
      marginBottom: hp(0.5),
      opacity: 0.8,
    },
    userName: {
      fontSize: RFValue(28),
      fontWeight: '700',
      color: theme.text,
      marginBottom: hp(1),
      letterSpacing: 0.5,
    },
    locationTag: {
      backgroundColor: theme.primary + '20',
      paddingHorizontal: wp(3),
      paddingVertical: hp(0.5),
      borderRadius: RFValue(20),
      alignSelf: 'flex-start',
    },
    locationText: {
      fontSize: RFValue(12),
      color: theme.primary,
      fontWeight: '600',
    },
    dateCard: {
      backgroundColor: theme.card,
      paddingHorizontal: wp(4),
      paddingVertical: hp(1.5),
      borderRadius: RFValue(15),
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    dateText: {
      fontSize: RFValue(12),
      color: theme.text,
      fontWeight: '600',
    },
    timeText: {
      fontSize: RFValue(14),
      color: theme.primary,
      fontWeight: '700',
      marginTop: hp(0.5),
    },
    sectionHeader: {
      marginBottom: hp(3),
    },
    sectionTitle: {
      fontSize: RFValue(20),
      fontWeight: '700',
      color: theme.text,
      marginBottom: hp(1),
    },
    titleUnderline: {
      width: wp(15),
      height: 3,
      backgroundColor: theme.primary,
      borderRadius: 2,
    },
    cardsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      marginBottom: hp(4),
    },
    footer: {
      position: 'absolute',
      bottom: hp(2),
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    footerText: {
      fontSize: RFValue(11),
      color: theme.textSecondary,
      fontWeight: '500',
      opacity: 0.7,
    },
    footerSubText: {
      fontSize: RFValue(10),
      color: theme.textSecondary,
      opacity: 0.5,
      marginTop: hp(0.5),
    },
  });

const stylesModal = (theme, wp, hp, RFValue) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
          shadowOpacity: 0.2,
          shadowRadius: 20,
        },
        android: {
          elevation: 15,
        },
      }),
      borderWidth: 1,
      borderColor: theme.card,
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
      width: '100%',
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
      width: '100%',
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

export default AuthHome;

