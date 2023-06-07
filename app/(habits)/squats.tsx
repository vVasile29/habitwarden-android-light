import {Button, Pressable, Text, View} from "react-native";
import axios from "axios";
import {API, USER_KEY} from "../context/AuthContext";
import React, {useEffect, useState} from "react";
import moment from 'moment';
import 'moment/locale/de';
import {useRouter} from "expo-router";
import * as SecureStore from "expo-secure-store";
import {SQUATS} from "../(tabs)/habits";
import {Habit} from "../../components/HabitSummary";

export default function Squats() {
    const [userName, setUserName] = useState("")
    const [pointsPerTask, setPointsPerTask] = useState(0);
    const habitName = SQUATS;
    const [lieOnDone, setLieOnDone] = useState(false);
    const router = useRouter();

    const fetchData = async () => {
        try {
            // fetch username
            const userName = await SecureStore.getItemAsync(USER_KEY);
            setUserName(userName!);

            // fetch habit
            const habitResponse = await axios.get<Habit>(`${API}/habits/getHabit/${habitName}`);
            const habit = habitResponse.data;
            setPointsPerTask(habit.pointsPerTask);
        } catch (e) {
            console.log(e);
        }
    };

    const saveData = async (userName: string, habitName: string, date: string, lieOnDone: boolean) => {
        try {
            // save user points
            await axios.post(`${API}/user/savePoints/${pointsPerTask}`);

            // save date data
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

    useEffect(() => {
        fetchData();
    })

    const handlePress = () => {
        const currentDate = moment().locale('de').format('YYYY-MM-DD'); // Get current date and time in German format
        saveData(userName!, habitName, currentDate, lieOnDone);
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

