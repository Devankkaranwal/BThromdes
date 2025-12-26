// import React from 'react';
// import {
//     View,
//     StyleSheet,
//     Linking,
//     TouchableOpacity,
//     ScrollView,
//     Alert,
// } from 'react-native';

// import LocationIcon from '../assets/images/location.svg';
// import PhoneIcon from '../assets/images/phone.svg';
// import FaxIcon from '../assets/images/fax.svg';
// import EmailIcon from '../assets/images/email.svg';
// import FacebookIcon from '../assets/images/facebook.svg';
// import WebIcon from '../assets/images/web.svg';
// import WhatsAppIcon from '../assets/images/whatsapp.svg';
// import InfoContainer from '../components/InfoContainer';
// import { default as Text } from '../components/GlobalText';



// /** Reusable contact row */
// const ContactRow = ({ icon: Icon, label, onPress }) => (
//     <TouchableOpacity
//         disabled={!onPress}
//         style={styles.row}
//         onPress={onPress}
//         activeOpacity={0.7}
//     >
//         <Icon width={20} height={20} />
//         <Text style={[styles.text, onPress && styles.link]}>{label}</Text>
//     </TouchableOpacity>
// );

// const ContactUs = ({ route }) => {
//     const { title } = route.params || {};

//     const contactData = {
//         'Samdrup Jongkhar Thromde': {
//             location: '23 Dungsam Lam',
//             phones: ['+975-7-251616', '+975-7-251619', '+975-7-251629'],
//             fax: ['+975-7-251305'],
//             email: 'sjthromde@sjthromde.gov.bt',
//             facebook: 'https://facebook.com/sjthromde',
//             website: 'https://sjthromde.gov.bt',
//             tollfree: '1555',
//         },
//         'Gelephu Thromde': {
//             location: 'Post Box No. 184',
//             phones: ['+975-06-251289'],
//             fax: ['+975-06-251288'],
//             email: 'gelephuthromde@gelephuthrom.bt',
//             facebook: 'https://facebook.com/gelephuthromde',
//             website: 'https://gelephuthrom.bt',
//             tollfree: '3131',
//             whatsapp: 'https://wa.me/97577251616',
//         },
//         'Phuentsholing Thromde': {
//             location: 'CR-04 Pelkhil Lam',
//             fax: ['+975-05-251208', '+975-05-252168'],
//             email: 'ict@phuenthrom.bt',
//             facebook: 'https://www.facebook.com/phuentsholingthromde',
//             website: 'https://phuenthrom.bt/',
//             tollfree: '1870',
//         },
//     };

//     const data = contactData[title];

//     if (!data) {
//         return (
//             <View style={styles.center}>
//                 <Text style={styles.emptyText}>No contact information found.</Text>
//             </View>
//         );
//     }

//     const openLink = async (url) => {
//         if (!url) return;

//         try {
//             if (url.startsWith('tel:')) url = url.replace(/[-\s]/g, '');

//             const supported = await Linking.canOpenURL(url);
//             if (supported) {
//                 await Linking.openURL(url);
//             } else {
//                 Alert.alert('Action Not Supported', `Unable to open: ${url}`);
//             }
//         } catch (error) {
//             console.warn('Failed to open link:', error);
//             Alert.alert('Error', 'Failed to open the link.');
//         }
//     };

//     return (
//         <ScrollView style={styles.container}>
//             <Text style={styles.header}>{title}</Text>

//             <InfoContainer>
//                 {data.location && <ContactRow icon={LocationIcon} label={data.location} />}

//                 {data.phones?.map((phone, index) => (
//                     <ContactRow
//                         key={index}
//                         icon={PhoneIcon}
//                         label={phone}
//                         onPress={() => openLink(`tel:${phone}`)}
//                     />
//                 ))}

//                 {data.fax?.map((fax, index) => (
//                     <ContactRow
//                         key={index}
//                         icon={FaxIcon}
//                         label={`Fax: ${fax}`}
//                         onPress={() => openLink(`tel:${fax}`)}
//                     />
//                 ))}

//                 {data.email && (
//                     <ContactRow
//                         icon={EmailIcon}
//                         label={data.email}
//                         onPress={() => openLink(`mailto:${data.email}`)}
//                     />
//                 )}
//             </InfoContainer>

//             <InfoContainer>
//                 {data.facebook && (
//                     <ContactRow
//                         icon={FacebookIcon}
//                         label="Facebook Page"
//                         onPress={() => openLink(data.facebook)}
//                     />
//                 )}
//                 {data.website && (
//                     <ContactRow
//                         icon={WebIcon}
//                         label="Official Website"
//                         onPress={() => openLink(data.website)}
//                     />
//                 )}
//                 {data.whatsapp && (
//                     <ContactRow
//                         icon={WhatsAppIcon}
//                         label="WhatsApp Group"
//                         onPress={() => openLink(data.whatsapp)}
//                     />
//                 )}
//             </InfoContainer>

//             {/* Toll-Free */}
//             {data.tollfree && (
//                 <InfoContainer>
//                     <ContactRow icon={PhoneIcon} label={`Toll Free: ${data.tollfree}`} />
//                     <TouchableOpacity
//                         style={styles.callButton}
//                         onPress={() => openLink(`tel:${data.tollfree}`)}
//                         activeOpacity={0.8}
//                     >
//                         <Text style={styles.callText}>Call Now</Text>
//                     </TouchableOpacity>
//                 </InfoContainer>
//             )}
//         </ScrollView>
//     );
// };

// export default ContactUs;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F8FAFB',
//         padding: 16,
//     },
//     header: {
//         fontSize: 20,
//         fontWeight: '600',
//         color: '#00695C',
//         textAlign: 'center',
//         marginBottom: 20,
//     },
//     card: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: 10,
//         padding: 15,
//         marginBottom: 15,

//     },
//     row: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     text: {
//         marginLeft: 10,
//         fontSize: 15,
//         color: '#333',
//     },
//     link: {
//         color: '#00796B',
//         textDecorationLine: 'underline',
//     },
//     callButton: {
//         backgroundColor: '#C62828',
//         paddingVertical: 12,
//         borderRadius: 8,
//         alignItems: 'center',
//         marginTop: 8,
//     },
//     callText: {
//         color: '#FFF',
//         fontSize: 16,
//         fontWeight: '500',
//     },
//     center: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     emptyText: {
//         fontSize: 16,
//         color: '#888',
//     },
// });





import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Linking,
    TouchableOpacity,
    ScrollView,
    Alert,
    Animated,
    Easing,
    Dimensions,
    Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import LocationIcon from '../assets/images/location.svg';
import PhoneIcon from '../assets/images/phone.svg';
import FaxIcon from '../assets/images/fax.svg';
import EmailIcon from '../assets/images/email.svg';
import FacebookIcon from '../assets/images/facebook.svg';
import WebIcon from '../assets/images/web.svg';
import WhatsAppIcon from '../assets/images/whatsapp.svg';
import CallIcon from '../assets/images/contact.svg';
import InfoContainer from '../components/InfoContainer';
import { default as Text } from '../components/GlobalText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/** Reusable contact row with animation */
const ContactRow = ({ icon: Icon, label, onPress, index, theme, wp, hp, RFValue }) => {
    const [scaleAnim] = useState(new Animated.Value(0.9));
    const [opacityAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                delay: index * 100,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                delay: index * 100,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handlePress = () => {
        // Button press animation
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onPress?.();
        });
    };

    // Create styles inside ContactRow component
    const contactRowStyles = StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: hp(1.5),
            borderBottomWidth: 1,
            borderBottomColor: theme.card + '80',
        },
        iconContainer: {
            width: wp(12),
            height: wp(12),
            borderRadius: wp(6),
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: wp(4),
        },
        textContainer: {
            flex: 1,
        },
        text: {
            fontSize: RFValue(15),
            fontWeight: '500',
            marginBottom: hp(0.3),
            color: theme.text,
        },
        link: {
            color: theme.primary,
            fontWeight: '600',
        },
        linkHint: {
            fontSize: RFValue(10),
            fontWeight: '500',
            marginTop: hp(0.2),
            color: theme.primary + '80',
        },
    });

    return (
        <Animated.View
            style={{
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
            }}
        >
            <TouchableOpacity
                disabled={!onPress}
                style={contactRowStyles.row}
                onPress={handlePress}
                activeOpacity={0.7}
            >
                <View style={[
                    contactRowStyles.iconContainer,
                    { backgroundColor: theme.primary + '15' }
                ]}>
                    <Icon width={wp(6)} height={wp(6)} fill={theme.primary} />
                </View>
                <View style={contactRowStyles.textContainer}>
                    <Text style={[
                        contactRowStyles.text,
                        onPress && contactRowStyles.link,
                    ]}>
                        {label}
                    </Text>
                    {onPress && (
                        <Text style={contactRowStyles.linkHint}>
                            Tap to open
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const ContactUs = ({ route }) => {
    const { title } = route.params || {};
    const { theme, wp, hp, RFValue } = useTheme();
    
    // Animation values
    const [headerAnim] = useState(new Animated.Value(0));
    const [cardAnimations] = useState([0, 1, 2].map(() => new Animated.Value(0)));
    const [pulseAnim] = useState(new Animated.Value(1));

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        background: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },
        floatingCircle: {
            position: 'absolute',
            top: hp(10),
            right: wp(-20),
            width: wp(60),
            height: wp(60),
            borderRadius: wp(30),
            backgroundColor: theme.primary + '08',
            borderWidth: 1,
            borderColor: theme.primary + '15',
        },
        content: {
            flex: 1,
            paddingHorizontal: wp(5),
            paddingTop: hp(3),
        },
        headerContainer: {
            alignItems: 'center',
            marginBottom: hp(4),
            paddingHorizontal: wp(4),
        },
        headerBadge: {
            backgroundColor: theme.primary + '20',
            paddingHorizontal: wp(4),
            paddingVertical: hp(1),
            borderRadius: RFValue(20),
            marginBottom: hp(2),
        },
        headerBadgeText: {
            fontSize: RFValue(12),
            fontWeight: '600',
            color: theme.primary,
            letterSpacing: 1,
        },
        headerTitle: {
            fontSize: RFValue(28),
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: hp(1),
            letterSpacing: 0.5,
            color: theme.text,
        },
        headerSubtitle: {
            fontSize: RFValue(14),
            fontWeight: '500',
            textAlign: 'center',
            color: theme.textSecondary,
            opacity: 0.8,
            lineHeight: RFValue(20),
        },
        sectionTitle: {
            fontSize: RFValue(18),
            fontWeight: '700',
            color: theme.text,
            marginBottom: hp(2),
            marginTop: hp(2),
            paddingLeft: wp(1),
        },
        sectionTitleAccent: {
            color: theme.primary,
        },
        callButton: {
            backgroundColor: theme.primary,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: hp(1.8),
            paddingHorizontal: wp(8),
            borderRadius: RFValue(14),
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
        callButtonText: {
            color: '#fff',
            fontSize: RFValue(16),
            fontWeight: '700',
            marginLeft: wp(2),
        },
        tollFreeContainer: {
            backgroundColor: theme.primary + '10',
            borderRadius: RFValue(16),
            padding: RFValue(20),
            marginTop: hp(2),
            alignItems: 'center',
            borderWidth: 2,
            borderColor: theme.primary + '20',
        },
        tollFreeTitle: {
            fontSize: RFValue(16),
            fontWeight: '700',
            color: theme.primary,
            marginBottom: hp(1),
        },
        tollFreeNumber: {
            fontSize: RFValue(28),
            fontWeight: '800',
            color: theme.text,
            marginBottom: hp(1.5),
        },
        emergencyBadge: {
            backgroundColor: '#FF5252',
            paddingHorizontal: wp(3),
            paddingVertical: hp(0.5),
            borderRadius: RFValue(12),
            marginTop: hp(1),
        },
        emergencyText: {
            fontSize: RFValue(10),
            color: '#fff',
            fontWeight: '700',
            letterSpacing: 0.5,
        },
        footer: {
            alignItems: 'center',
            marginTop: hp(5),
            marginBottom: hp(3),
            paddingHorizontal: wp(5),
        },
        footerText: {
            fontSize: RFValue(12),
            color: theme.textSecondary,
            fontWeight: '500',
            textAlign: 'center',
            opacity: 0.7,
            lineHeight: RFValue(18),
        },
        hoursContainer: {
            backgroundColor: theme.card,
            borderRadius: RFValue(12),
            padding: RFValue(16),
            marginTop: hp(3),
            borderWidth: 1,
            borderColor: theme.primary + '15',
        },
        hoursTitle: {
            fontSize: RFValue(14),
            fontWeight: '700',
            color: theme.text,
            marginBottom: hp(1),
        },
        hoursText: {
            fontSize: RFValue(13),
            color: theme.textSecondary,
            lineHeight: RFValue(20),
        },
    });

    const contactData = {
        'Samdrup Jongkhar Thromde': {
            location: '23 Dungsam Lam, Samdrup Jongkhar',
            phones: ['+975-7-251616', '+975-7-251619', '+975-7-251629'],
            fax: ['+975-7-251305'],
            email: 'sjthromde@sjthromde.gov.bt',
            facebook: 'https://facebook.com/sjthromde',
            website: 'https://sjthromde.gov.bt',
            tollfree: '1555',
            hours: 'Mon-Fri: 9:00 AM - 5:00 PM\nSat: 9:00 AM - 1:00 PM',
        },
        'Gelephu Thromde': {
            location: 'Post Box No. 184, Gelephu',
            phones: ['+975-06-251289'],
            fax: ['+975-06-251288'],
            email: 'gelephuthromde@gelephuthrom.bt',
            facebook: 'https://facebook.com/gelephuthromde',
            website: 'https://gelephuthrom.bt',
            tollfree: '3131',
            whatsapp: 'https://wa.me/97577251616',
            hours: 'Mon-Fri: 8:30 AM - 5:00 PM\nSat: 9:00 AM - 1:00 PM',
        },
        'Phuentsholing Thromde': {
            location: 'CR-04 Pelkhil Lam, Phuentsholing',
            fax: ['+975-05-251208', '+975-05-252168'],
            email: 'ict@phuenthrom.bt',
            facebook: 'https://www.facebook.com/phuentsholingthromde',
            website: 'https://phuenthrom.bt/',
            tollfree: '1870',
            hours: 'Mon-Fri: 9:00 AM - 5:00 PM\nSat: 9:00 AM - 1:00 PM',
        },
    };

    const data = contactData[title];

    useEffect(() => {
        // Header animation
        Animated.timing(headerAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
        }).start();

        // Pulse animation for call button
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

        // Card animations
        cardAnimations.forEach((anim, index) => {
            Animated.spring(anim, {
                toValue: 1,
                delay: index * 200,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }).start();
        });
    }, []);

    if (!data) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={[styles.headerTitle, { color: theme.textSecondary }]}>
                    No contact information found.
                </Text>
            </View>
        );
    }

    const openLink = async (url) => {
        if (!url) return;

        try {
            if (url.startsWith('tel:')) {
                url = url.replace(/[-\s]/g, '');
            }

            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert(
                    'Action Not Supported',
                    `Unable to open: ${url}`,
                    [{ text: 'OK', style: 'default' }]
                );
            }
        } catch (error) {
            console.warn('Failed to open link:', error);
            Alert.alert(
                'Error',
                'Failed to open the link. Please try again.',
                [{ text: 'OK', style: 'default' }]
            );
        }
    };

    return (
        <View style={styles.container}>
            {/* Background Decoration */}
            <View style={styles.background}>
                <Animated.View style={styles.floatingCircle} />
            </View>

            <ScrollView 
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: hp(4) }}
            >
                {/* Header */}
                <Animated.View 
                    style={[
                        styles.headerContainer,
                        {
                            opacity: headerAnim,
                            transform: [{
                                translateY: headerAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [30, 0]
                                })
                            }]
                        }
                    ]}
                >
                    <View style={styles.headerBadge}>
                        <Text style={styles.headerBadgeText}>CONTACT INFORMATION</Text>
                    </View>
                    
                    <Text style={styles.headerTitle}>{title}</Text>
                    
                    <Text style={styles.headerSubtitle}>
                        Get in touch with us for support and inquiries
                    </Text>
                </Animated.View>

                {/* Contact Details */}
                <Animated.View
                    style={{
                        opacity: cardAnimations[0],
                        transform: [{
                            translateY: cardAnimations[0].interpolate({
                                inputRange: [0, 1],
                                outputRange: [30, 0]
                            })
                        }]
                    }}
                >
                    <Text style={styles.sectionTitle}>
                        Contact <Text style={styles.sectionTitleAccent}>Details</Text>
                    </Text>
                    
                    <InfoContainer style={{ padding: RFValue(20) }}>
                        {data.location && (
                            <ContactRow 
                                icon={LocationIcon} 
                                label={data.location}
                                index={0}
                                theme={theme}
                                wp={wp}
                                hp={hp}
                                RFValue={RFValue}
                            />
                        )}

                        {data.phones?.map((phone, index) => (
                            <ContactRow
                                key={`phone-${index}`}
                                icon={PhoneIcon}
                                label={phone}
                                onPress={() => openLink(`tel:${phone}`)}
                                index={index + 1}
                                theme={theme}
                                wp={wp}
                                hp={hp}
                                RFValue={RFValue}
                            />
                        ))}

                        {data.fax?.map((fax, index) => (
                            <ContactRow
                                key={`fax-${index}`}
                                icon={FaxIcon}
                                label={`Fax: ${fax}`}
                                onPress={() => openLink(`tel:${fax}`)}
                                index={data.phones?.length + index + 1 || index + 1}
                                theme={theme}
                                wp={wp}
                                hp={hp}
                                RFValue={RFValue}
                            />
                        ))}

                        {data.email && (
                            <ContactRow
                                icon={EmailIcon}
                                label={data.email}
                                onPress={() => openLink(`mailto:${data.email}`)}
                                index={(data.phones?.length || 0) + (data.fax?.length || 0) + 1}
                                theme={theme}
                                wp={wp}
                                hp={hp}
                                RFValue={RFValue}
                            />
                        )}
                    </InfoContainer>
                </Animated.View>

                {/* Online Presence */}
                <Animated.View
                    style={{
                        opacity: cardAnimations[1],
                        transform: [{
                            translateY: cardAnimations[1].interpolate({
                                inputRange: [0, 1],
                                outputRange: [30, 0]
                            })
                        }]
                    }}
                >
                    <Text style={styles.sectionTitle}>
                        Online <Text style={styles.sectionTitleAccent}>Presence</Text>
                    </Text>
                    
                    <InfoContainer style={{ padding: RFValue(20) }}>
                        {data.facebook && (
                            <ContactRow
                                icon={FacebookIcon}
                                label="Facebook Page"
                                onPress={() => openLink(data.facebook)}
                                index={0}
                                theme={theme}
                                wp={wp}
                                hp={hp}
                                RFValue={RFValue}
                            />
                        )}
                        {data.website && (
                            <ContactRow
                                icon={WebIcon}
                                label="Official Website"
                                onPress={() => openLink(data.website)}
                                index={1}
                                theme={theme}
                                wp={wp}
                                hp={hp}
                                RFValue={RFValue}
                            />
                        )}
                        {data.whatsapp && (
                            <ContactRow
                                icon={WhatsAppIcon}
                                label="WhatsApp Support"
                                onPress={() => openLink(data.whatsapp)}
                                index={2}
                                theme={theme}
                                wp={wp}
                                hp={hp}
                                RFValue={RFValue}
                            />
                        )}
                    </InfoContainer>
                </Animated.View>

                {/* Toll Free & Hours */}
                <Animated.View
                    style={{
                        opacity: cardAnimations[2],
                        transform: [{
                            translateY: cardAnimations[2].interpolate({
                                inputRange: [0, 1],
                                outputRange: [30, 0]
                            })
                        }]
                    }}
                >
                    {data.tollfree && (
                        <>
                            <Text style={styles.sectionTitle}>
                                Emergency <Text style={styles.sectionTitleAccent}>Support</Text>
                            </Text>
                            
                            <View style={styles.tollFreeContainer}>
                                <Text style={styles.tollFreeTitle}>Toll Free Number</Text>
                                <Animated.Text 
                                    style={[
                                        styles.tollFreeNumber,
                                        { transform: [{ scale: pulseAnim }] }
                                    ]}
                                >
                                    {data.tollfree}
                                </Animated.Text>
                                
                                <TouchableOpacity
                                    style={styles.callButton}
                                    onPress={() => openLink(`tel:${data.tollfree}`)}
                                    activeOpacity={0.8}
                                >
                                    <CallIcon width={wp(6)} height={wp(6)} fill="#fff" />
                                    <Text style={styles.callButtonText}>Call Toll Free</Text>
                                </TouchableOpacity>
                                
                                <View style={styles.emergencyBadge}>
                                    <Text style={styles.emergencyText}>24/7 EMERGENCY SUPPORT</Text>
                                </View>
                            </View>
                        </>
                    )}

                    {/* Working Hours */}
                    {data.hours && (
                        <View style={styles.hoursContainer}>
                            <Text style={styles.hoursTitle}>Working Hours</Text>
                            <Text style={styles.hoursText}>{data.hours}</Text>
                        </View>
                    )}
                </Animated.View>

                {/* Footer */}
                <Animated.View 
                    style={[
                        styles.footer,
                        {
                            opacity: headerAnim,
                            transform: [{
                                translateY: headerAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0]
                                })
                            }]
                        }
                    ]}
                >
                    <Text style={styles.footerText}>
                        We're here to help you with any questions or concerns you may have.
                    </Text>
                    <Text style={[styles.footerText, { marginTop: hp(1) }]}>
                        Thank you for choosing {title}
                    </Text>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default ContactUs;