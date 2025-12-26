import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/Home';
import AuthHome from '../screens/auth/AuthHome';
import { ThomeDrawerNavigator } from './ThomeDrawerNavigator';
import CustomHeaderHome from '../components/CustomHeader';
import { TouchableOpacity } from 'react-native';
import LogoutIcon from "../assets/images/logout.svg";
import * as Keychain from 'react-native-keychain';
import SearchnUpdate from '../screens/auth/SearchnUpdate';
import PrintBill from '../screens/auth/PrintBill';
import { useTheme } from '../context/ThemeContext';


const AppNavigator = () => {
    const Stack = createNativeStackNavigator();
    const { theme } = useTheme();


    const handleLogout = async (navigation) => {
        try {
            await Keychain.resetGenericPassword();
            navigation.navigate("Home");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    // ✅ You must return this!
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: { backgroundColor: theme.primary },
                    headerTintColor: theme.white,
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{
                        header: (props) => <CustomHeaderHome {...props} />,
                    }}
                />
                <Stack.Screen
                    name="ThomeDrawer"
                    component={ThomeDrawerNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AuthHome"
                    component={AuthHome}
                    options={({ navigation }) => ({
                        title: 'Meter Billing',
                        headerRight: () => (
                            <TouchableOpacity onPress={() => handleLogout(navigation)}>
                                <LogoutIcon width={24} height={24} />
                            </TouchableOpacity>
                        ),
                    })}
                />
                <Stack.Screen
                    name="SearchnUpdate"
                    component={SearchnUpdate}
                    options={() => ({
                        title: 'Search & Update',
                    })}
                />
                <Stack.Screen
                    name="PrintBill"
                    component={PrintBill}
                    options={() => ({
                        title: 'Print Bill',
                    })}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;

