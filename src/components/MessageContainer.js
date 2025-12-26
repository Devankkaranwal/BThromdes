import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const MessageContainer = ({ message }) => {
    const { theme, wp, hp, RFValue } = useTheme();
    const styles = StyleSheet.create({
        messageContainer: {
            padding: RFValue(10),
            backgroundColor: theme.container,
            borderRadius: wp(2),
            marginVertical: hp(1),
        },
        messageText: {
            color: theme.danger,
            textAlign: 'center',
            fontSize: RFValue(12),
        },
    });
    return (
        <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{message}</Text>
        </View>
    );
};



export default MessageContainer;
