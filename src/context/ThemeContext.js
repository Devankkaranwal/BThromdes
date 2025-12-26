import { createContext, useContext, useState, useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { theme } from '../helpers/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemTheme = useColorScheme();
    const [currentTheme, setCurrentTheme] = useState(systemTheme || 'light');
    const [paymentData, setPaymentData] = useState({});

    useEffect(() => {
        setCurrentTheme(systemTheme || 'light');
    }, [systemTheme]);

    useEffect(() => {
        StatusBar.setBarStyle(currentTheme === 'light' ? 'dark-content' : 'light-content');
    }, [currentTheme]);

    const toggleTheme = () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setCurrentTheme(newTheme);
    };

    const updatePaymentData = (newData) => {
        setPaymentData((prevData) => ({
            ...prevData,
            ...newData,
        }));
    };

    return (
        <ThemeContext.Provider
            value={{
                theme: theme.colors[currentTheme],
                toggleTheme,
                currentTheme,
                wp: theme.wp,
                hp: theme.hp,
                RFValue: theme.RFValue,
                paymentData,
                updatePaymentData,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
