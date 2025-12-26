// styles.js
import { StyleSheet } from "react-native";

export const createStyles = (theme, hp, wp, RFValue) =>
    StyleSheet.create({
        // Header
        headerContainer: {
            height: hp(7), // responsive height
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: wp(4),
            backgroundColor: theme.primary,
        },
        menuButton: {
            marginRight: wp(2),
        },
        headerTitle: {
            fontSize: RFValue(15),
            fontWeight: "bold",
            marginLeft: wp(5),
            flex: 1,
            color: theme.textLight,
        },

        // Drawer Header
        drawerHeader: {
            padding: hp(1),
            borderBottomWidth: 1,
            borderColor: theme.text,

        },
        drawerHeaderText: {
            fontSize: RFValue(14),
            fontWeight: "700",
            color: theme.text,
        },

        // Items
        itemContainer: {
            marginTop: hp(1),
        },
        itemLabel: {
            fontSize: RFValue(14),
            fontWeight: "500",
            color: theme.text,

        },

        // Footer
        footer: {
            marginTop: "auto",
            padding: hp(2),
            borderTopWidth: 1,
            borderColor: theme.text,
            alignItems: "center",
        },
        footerText: {
            fontSize: RFValue(12),
            color: theme.text,
        },
    });
