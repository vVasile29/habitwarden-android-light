import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from "react-native";

/**
 * Get permissions from user.
 * This needs to be done both for local and server notifications.
 * Call this method after user click some 'Allow notifications' button
 */
export async function registerForPushNotificationsAsync() {

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const {status} = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        alert('Bitte in den Einstellungen die Permissions für Benachrichtigungen an schalten!');
        return;
    }

}


const triggerWaterNotifications = async () => {
    const hours = [9, 10, 12, 14, 16, 17, 19, 21]
    const minutes = [0, 45, 30, 15, 0, 45, 30, 0]

    for (let i = 0; i < hours.length; i++) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Hast du durst?",
                body: "Trink dein Wasser!",
                data: {data: "goes here"},
            },
            trigger: {
                hour: hours.at(i),
                minute: minutes.at(i),
                repeats: true,
                channelId: 'default'
            },
        });
    }
    console.log("I scheduled water")
}

const triggerSquatsNotifications = async () => {
    const hours = [9, 12, 14, 17, 20]
    const minutes = [30, 0, 45, 15, 0]

    for (let i = 0; i < hours.length; i++) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Bist du sportlich unterwegs?",
                body: "Mach deine Squats!",
                data: {data: "goes here"},
            },
            trigger: {
                hour: hours.at(i),
                minute: minutes.at(i),
                repeats: true,
                channelId: 'default'
            },
        });
    }
    console.log("I scheduled squats")
}

const triggerMeditationNotifications = async () => {
    const hours = [10, 12, 15, 18, 20]
    const minutes = [0, 45, 15, 0, 30]

    for (let i = 0; i < hours.length; i++) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Bist du entspannt?",
                body: "Meditiere!",
                data: {data: "goes here"},
            },
            trigger: {
                hour: hours.at(i),
                minute: minutes.at(i),
                repeats: true,
                channelId: 'default'
            },
        });
    }
    console.log("I scheduled meditation")
}

export const triggerNotifications = async () => {
    console.log("I am triggering all the notifications!")
    const isFirstLogin = await AsyncStorage.getItem('isFirstLogin');
    console.log("isFirstLogin: " + isFirstLogin)
    if (isFirstLogin === null) {
        await triggerWaterNotifications();
        await triggerSquatsNotifications();
        await triggerMeditationNotifications();

        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });

        await AsyncStorage.setItem('isFirstLogin', 'not the first login!');
    } else {
        console.log("not triggering notifications because it's not first login")
    }
};

export const cancelAllNotificationsAndRemoveFirstLogin = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('if cancelled all notifications successfully, none left:');
    await displayAllNotifications();
    await AsyncStorage.removeItem('isFirstLogin');
    console.log("removed isFirstLogin")
};

export const displayAllNotifications = async () => {
    console.log("I am printing all the notifications now!")
    await Notifications.getAllScheduledNotificationsAsync().then(requests =>
        requests.forEach(request => console.log(request)))
};
