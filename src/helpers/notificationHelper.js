import notifee, { AndroidImportance } from '@notifee/react-native';

export const displayImportantNotification = async (title, body) => {
    try {
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            importance: AndroidImportance.HIGH,
            sound: 'notification_sound',
            badge: false,
        });

        await notifee.setBadgeCount(0);

        await notifee.displayNotification({
            title,
            body,
            android: {
                channelId,
                smallIcon: 'ic_notification',
                largeIcon: 'ic_launcher',
                badge: 0,
            },
            ios: {
                sound: 'notification_sound',
                foregroundPresentationOptions: {
                    sound: true,
                    alert: true,
                },
            },
        });
    } catch (error) {
        // Do nothing (silent error handling)
    }
};