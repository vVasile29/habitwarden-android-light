import React, {ReactNode, useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import axios from "axios";
import {API, USER_KEY} from "../app/context/AuthContext";
import CircularProgressSkeleton from "./CircularProgressSkeleton";
import HabitButton from "./HabitButton";
import {useRouter} from "expo-router";
import {shouldThrowAnErrorOutsideOfExpo} from "expo/build/environment/validatorState";
import * as SecureStore from "expo-secure-store";
import moment, {locale} from "moment/moment";

interface Habit {
    name: string;
    pointsPerTask: number;
    pointsPerDay: number;
    amountPerTask: number;
    timesPerDay: number;
    fakeUserCancellationRate: number;
    notificationText: NotificationText;
}

interface HabitDoneData {
    habitName: string;
    lieOnDone: boolean[];
}

interface NotificationText {
    // Define the structure of the notification text fields here
}

interface HabitSummaryProps {
    habitName: string,
    logo: ReactNode,
    onLoading: React.Dispatch<React.SetStateAction<boolean>>,
    allSiblingsLoaded: boolean,
}

const HabitSummary = (props: HabitSummaryProps) => {
    const logo = props.logo;
    const setLoading = props.onLoading;
    const allSiblingsLoaded = props.allSiblingsLoaded;

    const [userName, setUserName] = useState<string | null>("");
    const [habit, setHabit] = useState<Habit | null>(null);
    const [done, setDone] = useState(0);
    const [toDo, setToDo] = useState(0);
    const [fakeUserCancellationRate, setFakeUserCancellationRate] = useState(0);
    const [streak, setStreak] = useState(0);
    const [habitReady, setHabitReady] = useState(false);

    // TODO find out how to make this better and split into multiple methods, just doesn't work otherwise currently
    const fetchAllData = async () => {
        try {
            // fetch username
            const userName = await SecureStore.getItemAsync(USER_KEY);
            setUserName(userName);

            // fetch habit
            const habitResponse = await axios.get<Habit>(`${API}/habits/getHabit/${props.habitName}`);
            const habit = habitResponse.data;
            setHabit(habit);
            setToDo(habit.timesPerDay);
            setFakeUserCancellationRate(habit.fakeUserCancellationRate);

            // fetch habitDoneData
            const habitDoneDataResponse = await axios.post<HabitDoneData>(
                `${API}/dateData/getHabitDoneData`,
                {
                    userName: userName,
                    habitName: habit?.name,
                    date: moment().locale('de').format('YYYY-MM-DD')
                }
            );
            const habitDoneData = habitDoneDataResponse.data;
            setDone( habitDoneData ? habitDoneData.lieOnDone.length : 0);

            // fetch streak
            const streakResponse = await axios.post(
                `${API}/dateData/getStreak`,
                {
                    userName: userName,
                    habitName: habit?.name,
                    date: moment().locale('de').format('YYYY-MM-DD')
                }
            );
            const streak = streakResponse.data;
            setStreak(streak)
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchAllData()
    }, []);

    if (!allSiblingsLoaded) {
        return (
            <View
                style={styles.summary}>
                <Text style={styles.rate}>-</Text>
                <View style={styles.habitButton}>
                    <CircularProgressSkeleton
                        logo={logo}
                    />
                </View>
                <View style={styles.streak}>
                    {streak !== 0 && <Text style={styles.streakFlame}>🔥</Text>}
                    <Text style={styles.streakText}>-</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.summary}>
            <Text style={styles.rate}>{fakeUserCancellationRate * 100}%</Text>
            <View style={styles.habitButton}>
                <HabitButton
                    habitName={props.habitName}
                    done={done}
                    toDo={toDo}
                    isActive={habitReady}
                    logo={logo}
                />
            </View>
            <View style={styles.streak}>
                {streak !== 0 && <Text style={styles.streakFlame}>🔥</Text>}
                <Text style={styles.streakText}>{streak}</Text>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    summary: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30
    },
    rate: {
        flex: 1,
        fontSize: 30,
        fontWeight: "bold",
        color: "limegreen",
    },
    habitButton: {
        flex: 6,
        alignItems: "center"
    },
    streak: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    streakFlame: {
        fontSize: 38,
        bottom: 6,
        right: 2
    },
    streakText: {
        position: "absolute",
        fontSize: 30,
        fontWeight: "bold"
    }
})
export default HabitSummary;
