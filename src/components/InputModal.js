import { Modal, View, TouchableOpacity } from "react-native";
import TextInput from "./TextInput";
import Button from "./Button";
import Loader from "./Loader";
import CloseSvgIcon from "../assets/images/close.svg";
import { default as Text } from './GlobalText';


const InputModal = ({
    visible,
    onClose,
    title,
    label,
    value,
    onChange,
    onSearch,
    loading,
    theme,
    styles,
    keyboardType = "default" // Add this prop with default value
}) => {
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

                    {/* Input + Button */}
                    <View style={styles.body}>
                        <TextInput
                            label={title}
                            placeholder={label}
                            keyboardType={keyboardType} // Use the prop here
                            value={value}
                            onChangeText={onChange}
                            maxLength={100}
                        />

                        <Button
                            onPress={onSearch}
                            label="Search"
                            isDisabled={!(value.length > 4) || loading}
                            style={{ backgroundColor: theme.primary }}
                        />
                    </View>

                    {/* Loader */}
                    <Loader visible={loading} spinnerSize="small" />
                </View>
            </View>
        </Modal>
    );
};

export default InputModal;