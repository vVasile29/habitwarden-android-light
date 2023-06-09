import {Button, StyleSheet} from 'react-native';

import {Text, View} from '../../components/Themed';
import React, {useEffect, useState} from "react";
import {API, useAuth} from "../context/AuthContext";
import axios from "axios";
import {
    cancelAllNotificationsAndRemoveFirstLogin,
    displayAllNotifications, registerForPushNotificationsAsync,
    triggerNotifications
} from "../notificationHooks";

interface User {
    name: string;
    gender: string;
    age: number;
    profession: string;
    points: number;
}

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState(0);
    const [profession, setProfession] = useState("");
    const [points, setPoints] = useState(0);
    const {onLogout, authState} = useAuth();

    const getUserName = async () => {
        try {
            const userResponse = await axios.get<User>(`${API}/user/currentUser`);
            const user: User = userResponse.data;
            setUserName(user.name);
            setGender(user.gender);
            setAge(user.age);
            setProfession(user.profession);
            setPoints(user.points);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getUserName();
    })

    const logout = async () => {
        await onLogout!();
    }

    async function reloadNotifications(){
        await cancelAllNotificationsAndRemoveFirstLogin();
        await registerForPushNotificationsAsync();
        await triggerNotifications();
        await displayAllNotifications();
    }

    if (loading) {
        return (
            <Button title={'logout'} onPress={logout}/>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hallo, {userName}!</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Punktzahl: {points}</Text>
                <Text style={styles.infoText}>Alter: {age}</Text>
                <Text style={styles.infoText}>Geschlecht: {gender}</Text>
                <Text style={styles.infoText}>Beruf: {profession}</Text>
            </View>
            <Button title={'logout'} onPress={logout}/>
            <Button title={'reload notifications'} onPress={reloadNotifications}/>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    infoContainer: {
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    infoText: {
        fontSize: 18,
        marginBottom: 8,
    },
});
