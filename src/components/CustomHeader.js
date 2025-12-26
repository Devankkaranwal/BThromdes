import { View, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Svg, { Path } from 'react-native-svg';


const CustomHeaderHome = () => {
    const { theme, toggleTheme, wp, hp } = useTheme();

    const styles = StyleSheet.create({
        headerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: wp(15),
            paddingHorizontal: wp(5),
            borderBottomWidth: 0.5,
            borderBottomColor: theme.text,
            backgroundColor: theme.background,
        },
        logo: {
            width: wp(25),
            height: wp(20),
            resizeMode: 'contain',
        },
    });
    const ThemeIconSVG = ({ size = wp(6) }) => (
        <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 563.055 563.055" fill={theme.text}>
            <Path
                d="M281.527 0c14.135 0 25.593 11.459 25.593 25.593V76.78c0 14.135-11.458 25.593-25.593 25.593s-25.593-11.459-25.593-25.593V25.593C255.934 11.459 267.392 0 281.527 0zM281.527 139.539c-78.414 0-141.982 63.567-141.982 141.983 0 78.413 63.568 141.982 141.982 141.982 78.416 0 141.982-63.569 141.982-141.982 0-78.416-63.566-141.983-141.982-141.983zM119.252 83.052c-9.995-9.995-26.2-9.995-36.194 0-9.995 9.995-9.995 26.2 0 36.195l36.562 36.562c9.995 9.995 26.2 9.995 36.194 0 9.995-9.995 9.995-26.2 0-36.195zM0 281.527c0-14.135 11.459-25.593 25.593-25.593H76.78c14.135 0 25.593 11.458 25.593 25.593S90.915 307.12 76.78 307.12H25.593C11.459 307.121 0 295.663 0 281.527zM155.814 443.436c9.995-9.994 9.995-26.197 0-36.194-9.995-9.994-26.2-9.994-36.194 0l-36.562 36.563c-9.995 9.994-9.995 26.2 0 36.194s26.199 9.994 36.194 0zM281.527 460.681c14.135 0 25.593 11.458 25.593 25.593v51.187c0 14.135-11.458 25.593-25.593 25.593s-25.593-11.458-25.593-25.593v-51.187c0-14.135 11.458-25.593 25.593-25.593zM443.436 407.242c-9.997-9.994-26.2-9.994-36.194 0-9.997 9.997-9.997 26.2 0 36.194l36.56 36.563c9.997 9.994 26.2 9.994 36.194 0 9.997-9.994 9.997-26.2 0-36.194zM460.681 281.527c0-14.135 11.458-25.593 25.593-25.593h51.187c14.135 0 25.593 11.458 25.593 25.593s-11.458 25.593-25.593 25.593h-51.187c-14.135.001-25.593-11.457-25.593-25.593zM479.997 119.246c9.997-9.995 9.997-26.2 0-36.195-9.994-9.995-26.197-9.995-36.194 0l-36.56 36.562c-9.997 9.995-9.997 26.2 0 36.195 9.994 9.995 26.197 9.995 36.194 0z"
            />
        </Svg>
    );

    return (
        <SafeAreaView style={styles.headerContainer}>
            <Image source={require('../assets/images/logo.webp')} style={styles.logo} />
            <TouchableOpacity onPress={toggleTheme}>
                <ThemeIconSVG />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default CustomHeaderHome;


