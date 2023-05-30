import {Button, Pressable, Text, View} from "react-native";
import axios from "axios";
import {API, USER_KEY} from "../context/AuthContext";
import React, {useState} from "react";
import moment from 'moment';
import {useRouter} from "expo-router";
import * as SecureStore from "expo-secure-store";
import {SQUATS} from "../(tabs)/habits";

export default function Squats() {
    const [userName, setUserName] = useState("")
    const habitName = SQUATS;
    const [lieOnDone, setLieOnDone] = useState(false);
    const router = useRouter();

    const sendDateData = async (userName: string, habitName: string, date: string, lieOnDone: boolean) => {
        try {
            const userName = await SecureStore.getItemAsync(USER_KEY);
            if (userName) {
                setUserName(userName);
            }
            await axios.post(`${API}/dateData/saveDateData`, {
                userName,
                habitName,
                date,
                lieOnDone
            });
        } catch (e) {
            console.log(e);
        }
    };

    const handlePress = () => {
        const currentDate = moment().locale('de').format('YYYY-MM-DD'); // Get current date and time in German format
        sendDateData(userName!, habitName, currentDate, lieOnDone);
    };

    return (
        <View>
            <Button
                title={habitName + 'done'}
                onPress={() => {
                    handlePress();
                    router.replace("/habits");
                }}
            />
            <Button
                title={'I lied'}
                onPress={() => setLieOnDone(true)}
            />
            <Button
                title={'Zurück zu Habits'}
                onPress={() => router.replace("/habits")}
            />
        </View>
    );
}

