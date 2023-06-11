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
import {heightDP, widthDP} from "../../constants/DpScaling";

interface User {
    name: string;
    gender: string;
    age: number;
    profession: string;
    codeword: string;
    points: number;
}

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState(0);
    const [profession, setProfession] = useState("");
    const [codeword, setCodeword] = useState("");
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
            setCodeword(user.codeword)
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

    async function reloadNotifications() {
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
            <View>
                <Text style={styles.points}>Punktzahl: {points}</Text>
                <Text style={styles.shameText}>Na, das geht aber besser! Sei nicht so faul und halt' dich
                    ran!</Text>
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.infoText}>
                    <Text style={styles.infoLabel}>Alter</Text>
                    <Text style={styles.infoValue}>{age}</Text>
                </View>
                <View style={styles.separator}/>
                <View style={styles.infoText}>
                    <Text style={styles.infoLabel}>Geschlecht</Text>
                    <Text style={styles.infoValue}>{gender}</Text>
                </View>
                <View style={styles.separator}/>
                <View style={styles.infoText}>
                    <Text style={styles.infoLabel}>Beruf</Text>
                    <Text style={styles.infoValue}>{profession}</Text>
                </View>
                <View style={styles.separator}/>
                <View style={styles.infoText}>
                    <Text style={styles.infoLabel}>Codeword</Text>
                    <Text style={styles.infoValue}>{codeword}</Text>
                </View>
            </View>
            {/*<View style={styles.buttonContainer}>*/}
            {/*    <Button title={'reload notifications'} onPress={reloadNotifications}/>*/}
            {/*    <Button title={'logout'} onPress={logout}/>*/}
            {/*</View>*/}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 16,
    },
    title: {
        fontSize: heightDP("6%"),
        fontWeight: 'bold',
        marginBottom: heightDP("3%"),
        textAlign: 'center',
    },
    points: {
        fontSize: heightDP("4.5%"),
        color: "red",
        fontWeight: "bold",
        marginBottom: 2,
    },
    shameText: {
        fontSize: heightDP("2.2%"),
        marginBottom: heightDP("5%"),
        fontStyle: "italic",
    },
    infoContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: 35,
        padding: heightDP("5%"),
        marginBottom: 20,
        width: '100%',
    },
    infoText: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        margin: -heightDP("2%"),
    },
    infoLabel: {
        fontSize: heightDP("2.5%"),
        fontWeight: 'bold',
    },
    infoValue: {
        fontSize: heightDP("2.5%"),
        marginLeft: 'auto',
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 10,
    },
    separator: {
        marginVertical: 30,
        height: 2,
        width: '100%',
        backgroundColor: "#fd7e14",
        opacity: 0.2,
    },
});
