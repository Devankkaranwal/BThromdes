import React, { useState, useCallback, useMemo } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { default as Text } from '../components/GlobalText';
import { thromdesList } from '../helpers/validation'

import { useTheme } from '../context/ThemeContext';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Loader from '../components/Loader';
import BackgroundWithScrollView from '../components/BackgroundWithScrollView';
import { ApiLogin } from '../services/apiServices';
import * as Keychain from 'react-native-keychain';

const Login = ({ route, navigation }) => {

    // ============= THEME HOOK ======================
    const { theme, wp, hp, RFValue } = useTheme();
    const { title, thromde } = route.params || {};

    // ============= STATES ==========================
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // ============= SELECT LOGO ======================

    const selectedThromde = useMemo(() => {
        return thromdesList.find(item => item.name === title);
    }, [title]);

    const logoSource = selectedThromde?.icon ?? null;


    // ============= LOGIN HANDLER ====================
    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert('Error', 'Please enter both username and password.');
            return;
        }

        setLoading(true);

        try {
            const response = await ApiLogin({
                userName: username.trim(),
                password: password.trim(),
                thomde: thromde,
            });

            console.log('🔐 Login Response:', response);

            if (response?.success) {

                // Save credentials into Keychain
                await Keychain.setGenericPassword(
                    'auth',
                    JSON.stringify({
                        success: true,
                        userID: response.userID,
                        userName: response.userName,
                        fullName: response.fullName,
                        roleID: response.roleID,
                        timestamp: new Date().toISOString(),
                        thromde,
                    })
                );

                console.log('✅ Authentication saved to Keychain');

                // Navigate to main Auth Home screen
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'AuthHome',
                            params: { title, thromde, ...response },
                        },
                    ],
                });

            } else {
                Alert.alert('Login Failed', response?.message || 'Invalid credentials.');
            }

        } catch (error) {
            console.error('🚨 Login Error:', error);
            Alert.alert('Error', error?.error || 'Unable to login. Try again.');
        } finally {
            setLoading(false);
        }
    };

    // ============= STYLES ==========================
    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: {
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: hp(3),
                    paddingHorizontal: wp(5),
                },
                logo: {
                    width: wp(35),
                    height: wp(35),
                    marginBottom: hp(2),
                },
                title: {
                    fontSize: RFValue(22),
                    fontWeight: '700',
                    color: theme.primary,
                    marginBottom: hp(4),
                    textAlign: 'center',
                },
                inputContainer: {
                    width: '100%',
                    marginBottom: hp(3),
                },
                input: {
                    width: '100%',
                    paddingVertical: RFValue(12),
                    paddingHorizontal: RFValue(14),
                    backgroundColor: theme.white,
                    borderRadius: RFValue(6),
                    borderWidth: 1,
                    borderColor: theme.text + '33',
                    fontSize: RFValue(14),
                    color: theme.black,
                    marginBottom: hp(1.5),
                },
                button: {
                    backgroundColor: theme.primary,
                    width: '100%',
                },
            }),
        [theme, wp, hp, RFValue]
    );

    // ============= UI ==============================
    return (
        <BackgroundWithScrollView>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                {logoSource && (
                    <Image source={logoSource} style={styles.logo} resizeMode="contain" />
                )}

                {title && <Text style={styles.title}>{title}</Text>}

                {/* Inputs */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="#999"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        returnKeyType="next"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        returnKeyType="done"
                    />
                </View>

                {/* Login Button */}
                <Button
                    onPress={handleLogin}
                    label="Login"
                    style={styles.button}
                    isDisabled={!username || !password || loading}
                />
            </KeyboardAvoidingView>

            {/* Global Loader */}
            <Loader visible={loading} spinnerSize="large" />
        </BackgroundWithScrollView>
    );
};

export default Login;
