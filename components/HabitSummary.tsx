import React, {ReactNode, useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import axios from "axios";
import {API, USER_KEY} from "../app/context/AuthContext";
import CircularProgressSkeleton from "./CircularProgressSkeleton";
import HabitButton from "./HabitButton";
import * as SecureStore from "expo-secure-store";
import moment from "moment/moment";
import 'moment/locale/de';

export interface Habit {
    name: string;
    pointsPerTask: number;
    pointsPerDay: number;
    amountPerTask: number;
    timesPerDay: number;
    fakeUserCancellationRate: number;
}

interface HabitDoneData {
    doneDate: string;
    habitDoneDataInfo: HabitDoneDataInfo[];
}

interface HabitDoneDataInfo {
    doneTime: string;
    lieOnDone: boolean;
}

interface HabitSummaryProps {
    habitName: string,
    logo: ReactNode,
    onLoading: React.Dispatch<React.SetStateAction<boolean>>,
    allSiblingsLoaded: boolean,
    schedule: { startTime: string, endTime: string }[]
}

const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    return `${hours}:${minutes}`;
};

const HabitSummary = (props: HabitSummaryProps) => {
    const logo = props.logo;
    const setLoading = props.onLoading;
    const allSiblingsLoaded = props.allSiblingsLoaded;
    const habitName = props.habitName;
    const schedule = props.schedule;

    const [userName, setUserName] = useState<string | null>("");
    const [habit, setHabit] = useState<Habit | null>(null);
    const [done, setDone] = useState(0);
    const [toDo, setToDo] = useState(0);
    const [fakeUserCancellationRate, setFakeUserCancellationRate] = useState(0);
    const [streak, setStreak] = useState(0);
    const [isButtonClickable, setIsButtonClickable] = useState(false);

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

            // fetch habitDoneData of this user and now()
            const habitDoneDataResponse = await axios.post<HabitDoneData>(
                `${API}/dateData/getCurrentHabitDoneDataOfUser`,
                {
                    userName: userName,
                    habitName: habitName,
                    date: moment().locale('de').format('YYYY-MM-DD')
                }
            );
            const habitDoneData = habitDoneDataResponse.data;
            // TODO this sometimes still logs the value before and therefore renders it, problem!
            setDone(habitDoneData.habitDoneDataInfo ? habitDoneData.habitDoneDataInfo.length : 0);

            // fetch streak
            const streakResponse = await axios.post(
                `${API}/dateData/getStreak`,
                {
                    userName: userName,
                    habitName: habitName,
                    date: moment().locale('de').format('YYYY-MM-DD')
                }
            );
            const streak = streakResponse.data;
            setStreak(streak)

            // check if we are in a schedule, if not obviously button is not clickable
            const currentTime = getCurrentTime();
            const currentSchedule = schedule.find(schedule => schedule.startTime <= currentTime && currentTime <= schedule.endTime);

            if (!currentSchedule) {
                setIsButtonClickable(false);
                setLoading(false);
            }

            const latestHabitDoneDataResponse = await axios.post<HabitDoneData>(
                `${API}/dateData/getLastHabitDoneDataOfUser`,
                {
                    userName: userName,
                    habitName: habitName,
                }
            );
            const latestHabitDoneData = latestHabitDoneDataResponse.data;

            if (!latestHabitDoneData) {
                setIsButtonClickable(true);
                setLoading(false);
                return;
            }

            const habitDoneDataInfo = latestHabitDoneData.habitDoneDataInfo.at(-1);

            // check if last done time even exists, if not obviously the button is clickable
            if (!habitDoneDataInfo) {
                setIsButtonClickable(true);
                setLoading(false);
                return;
            }

            // check if doneTime from lastDoneTime day is today, if not return true
            const lastDoneTimeDate = new Date(habitDoneDataInfo.doneTime);

            // Get the current date
            const currentDate = new Date();

            // Set both dates to the same date (ignoring time)
            lastDoneTimeDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);
            if (lastDoneTimeDate.getTime() !== currentDate.getTime()) {
                setIsButtonClickable(true);
                setLoading(false);
                return;
            }

            // otherwise check if lastDoneTime hour and minute is in schedule, if so, return false, otherwise return true
            const lastDoneTimeDate2 = new Date(habitDoneDataInfo.doneTime);
            const lastDoneTime = lastDoneTimeDate2.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false});
            if (lastDoneTime >= currentSchedule?.startTime! && lastDoneTime <= currentSchedule?.endTime!) {
                setIsButtonClickable(false);
                setLoading(false);
                return;
            }

            setIsButtonClickable(true);
            // set loading to false if nothing applied
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchAllData();
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
                    isActive={isButtonClickable}
                    logo={logo}
                    setIsButtonClickable={setIsButtonClickable}
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
