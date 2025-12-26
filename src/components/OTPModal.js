import React, { useRef } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput as RNTextInput } from "react-native";
import Button from "./Button";
import Loader from "./Loader";
import CloseSvgIcon from "../assets/images/close.svg";

const OTPModal = ({
    visible,
    onClose,
    title = "OTP Verification",
    value,
    onChange,
    onSubmit,
    loading,
    theme,
    styles,
}) => {
    const hiddenInputRef = useRef(null);

    const handlePress = () => {
        hiddenInputRef.current?.focus();
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.wrapper}>
                <View style={styles.content}>
                    {/* Close button */}
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <CloseSvgIcon width={20} height={20} fill={theme.text} />
                    </TouchableOpacity>

                    {/* Header */}
                    <Text style={styles.header}>{title}</Text>

                    {/* Instruction text */}
                    <Text style={[styles.otpPrompt, { color: theme.text }]}>
                        Enter the 6-digit OTP sent to your registered number.
                    </Text>

                    {/* OTP Boxes */}
                    <TouchableOpacity
                        style={styles.otpContainer}
                        onPress={handlePress}
                        activeOpacity={1}
                    >
                        {[...Array(6)].map((_, index) => (
                            <View
                                key={index}
                                style={[styles.otpBox, { borderColor: theme.primary }]}
                            >
                                <Text style={[styles.otpText, { color: theme.text }]}>
                                    {value[index] || ""}
                                </Text>
                            </View>
                        ))}
                    </TouchableOpacity>

                    {/* Hidden input */}
                    <RNTextInput
                        ref={hiddenInputRef}
                        style={styles.hiddenInput}
                        value={value}
                        onChangeText={(text) => onChange(text.slice(0, 6))}
                        keyboardType="numeric"
                        maxLength={6}
                        autoFocus
                    />

                    {/* Submit button */}
                    <Button
                        onPress={onSubmit}
                        label="Submit OTP"
                        isDisabled={value.length < 6 || loading}
                        style={{ backgroundColor: theme.primary }}
                    />

                    {/* Loader */}
                    <Loader visible={loading} spinnerSize="small" />
                </View>
            </View>
        </Modal>
    );
};

export default OTPModal;
