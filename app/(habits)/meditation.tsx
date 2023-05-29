import {Button, Pressable, Text, View} from "react-native";
import axios from "axios";
import {API, USER_KEY} from "../context/AuthContext";
import React, {useState} from "react";
import moment from 'moment';
import {DateData} from "../../components/HabitSummary";
import {useRouter} from "expo-router";
import * as SecureStore from 'expo-secure-store';

export default function Meditation() {
    // TODO hardcoded, change this
    const [userName, setUserName] = useState("")
    const habitName = "meditation";
    const [lieOnDone, setLieOnDone] = useState(false);

    const router = useRouter();
    console.log("meditation rendered")

    const sendDateData = async (userName: string, habitName: string, date: string, lieOnDone: boolean) => {
        try {
            const userName = await SecureStore.getItemAsync(USER_KEY);
            if (userName) {
                setUserName(userName);
            }
            const result = await axios.post<DateData>(`${API}/dateData/saveDateData`, {
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
        console.log(currentDate)
        sendDateData(userName!, habitName, currentDate, lieOnDone);
        console.log('pressed!');
    };

    return (
        <View>
            <View>
                <Button
                    title={'Meditation done'}
                    onPress={handlePress}
                />
                <Button
                    title={'Zurück zu Habits'}
                    onPress={() => router.replace("/habits")}
                />
            </View>
        </View>
    );
}

