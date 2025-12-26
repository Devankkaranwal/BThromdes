import { useMemo } from "react";
import { View, TouchableOpacity, SafeAreaView, Platform, StatusBar, BackHandler } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Thome from "../screens/Thome";
import Login from "../screens/Login";
import ContactUs from "../screens/ContactUs";
import HamburgerIcon from "../assets/images/menu.svg";
import BackIcon from "../assets/images/back.svg";
import { thromdesList } from "../helpers/validation";
import { useTheme } from "../context/ThemeContext";
import { createStyles } from "./styles";
import LoginIcon from "../assets/images/login.svg"
import ExitIcon from "../assets/images/logout.svg"
import ContactIcon from "../assets/images/contact.svg"
import WaterAndSeawage from "../screens/WaterAndSeawage";
import SearchRecipt from "../screens/SearchRecipt";
import BankSelection from "../screens/BankSelection";
import PaymentConfirmation from "../screens/PaymentConfirmation";
import { default as Text } from '../components/GlobalText';


const Drawer = createDrawerNavigator();

const CustomHeaderO = ({ navigation, route, styles }) => {
    const title = route?.params?.title || route?.name;
    return (
        <SafeAreaView
            style={{
                backgroundColor: styles.headerContainer.backgroundColor,
            }}
        >
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuButton}>
                    <HamburgerIcon width={24} height={24} fill={styles.headerTitle.color} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {title}
                </Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.menuButton}>
                    <BackIcon width={24} height={24} fill={styles.headerTitle.color} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};


const CustomHeaderT = ({ navigation, route, styles }) => {
    const headertitle = route?.params?.headertitle;
    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.menuButton}>
                <BackIcon width={24} height={24} fill={styles.headerTitle.color} />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
                {headertitle}
            </Text>
        </View>
    );
};





const CustomDrawerContent = ({ styles, theme, ...props }) => {
    const title = props?.state?.routes?.[0]?.params?.title;
    const thromde = props?.state?.routes?.[0]?.params?.thromde;

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={{ flex: 1, backgroundColor: theme.background }}
        >
            <View style={styles.drawerHeader}>
                <Text style={styles.drawerHeaderText}>{title}</Text>
            </View>

            <View style={styles.itemContainer}>
                <DrawerItem
                    label={() => (
                        <Text style={[styles.itemLabel, { color: theme.text }]}>
                            Login
                        </Text>
                    )}
                    labelStyle={styles.itemLabel}
                    onPress={() => props.navigation.navigate("Login", { title, thromde })}
                    icon={() => <LoginIcon width={20} height={20} fill={theme.text} />}
                />
                <DrawerItem
                    label={() => (
                        <Text style={[styles.itemLabel, { color: theme.text }]}>
                            Contact Us
                        </Text>
                    )}
                    labelStyle={styles.itemLabel}
                    onPress={() => props.navigation.navigate("ContactUs", { title, thromde })}
                    icon={() => <ContactIcon width={20} height={20} fill={theme.text} />}
                />
                <DrawerItem
                    label={() => (
                        <Text style={[styles.itemLabel, { color: theme.text }]}>
                            Exit
                        </Text>
                    )}
                    labelStyle={styles.itemLabel}
                    onPress={() => BackHandler.exitApp()}
                    icon={() => <ExitIcon width={20} height={20} fill={theme.text} />}
                />
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Developed by iTechnologies</Text>
            </View>
        </DrawerContentScrollView>
    );
};


export const ThomeDrawerNavigator = ({ route }) => {
    const { title, thromde } = route.params || {};
    const { theme, hp, wp, RFValue } = useTheme();

    const styles = useMemo(() => createStyles(theme, hp, wp, RFValue), [theme, hp, wp, RFValue]);

    const screenOptionsWithHeaderT = (navigation, route) => ({
        header: () => <CustomHeaderT navigation={navigation} route={route} styles={styles} />,
    });

    const screenOptionsWithHeader = (navigation, route) => ({
        header: () => <CustomHeaderO navigation={navigation} route={route} styles={styles} />,
    });


    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} styles={styles} theme={theme} />}
            screenOptions={{
                drawerStyle: {
                    width: "65%",
                    backgroundColor: theme.background,
                    borderTopRightRadius: RFValue(5),
                    borderBottomRightRadius: RFValue(5),
                },
                drawerActiveTintColor: theme.primary,
                drawerInactiveTintColor: theme.text,
                drawerLabelStyle: {
                    fontSize: 16,
                    fontWeight: "500",
                },
            }}
        >
            <Drawer.Screen
                name="Thome"
                component={Thome}
                initialParams={{ title }}
                options={({ navigation, route }) => screenOptionsWithHeader(navigation, route)}
            />
            <Drawer.Screen
                name="Login"
                component={Login}
                initialParams={{ title, thromde }}
                options={({ navigation, route }) => screenOptionsWithHeader(navigation, route)}
            />
            <Drawer.Screen
                name="ContactUs"
                component={ContactUs}
                initialParams={{ thromde: title }}
                options={({ navigation, route }) => screenOptionsWithHeader(navigation, route)}
            />
            <Drawer.Screen
                name="WaterAndSeawage"
                component={WaterAndSeawage}
                initialParams={{ thromde: title }}
                options={({ navigation, route }) => screenOptionsWithHeaderT(navigation, route)}
            />
            <Drawer.Screen
                name="SearchRecipt"
                component={SearchRecipt}
                initialParams={{ thromde: title }}
                options={({ navigation, route }) => screenOptionsWithHeaderT(navigation, route)}
            />
            <Drawer.Screen
                name="BankSelection"
                component={BankSelection}
                initialParams={{ thromde: title }}
                options={({ navigation, route }) => screenOptionsWithHeaderT(navigation, route)}
            />
            <Drawer.Screen
                name="PaymentConfirmation"
                component={PaymentConfirmation}
                initialParams={{ thromde: title }}
                options={({ navigation, route }) => screenOptionsWithHeaderT(navigation, route)}
            />
        </Drawer.Navigator>
    );
};

