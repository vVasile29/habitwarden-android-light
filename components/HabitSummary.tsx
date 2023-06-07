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
    // const fetchAllData = async () => {
    //
    //     try {
    //         const userName = await SecureStore.getItemAsync(USER_KEY);
    //         setUserName(userName);
    //
    //         const habitResponse = await axios.get<Habit>(`${API}/habits/getHabit/${props.habitName}`);
    //         const habit = habitResponse.data;
    //         setHabit(habit);
    //         setToDo(habit.timesPerDay);
    //         setFakeUserCancellationRate(habit.fakeUserCancellationRate);
    //
    //         const currentDate = moment().locale('de').format('YYYY-MM-DD');
    //
    //         const [habitDoneDataResponse, latestHabitDoneDataResponse, streakResponse] = await Promise.all([
    //             axios.post<HabitDoneData>(`${API}/dateData/getCurrentHabitDoneDataOfUser`, {
    //                 userName: userName,
    //                 habitName: habitName,
    //                 date: currentDate
    //             }),
    //             axios.post<HabitDoneData>(`${API}/dateData/getLastHabitDoneDataOfUser`, {
    //                 userName: userName,
    //                 habitName: habitName
    //             }),
    //             axios.post(`${API}/dateData/getStreak`, {
    //                 userName: userName,
    //                 habitName: habitName,
    //                 date: currentDate
    //             })
    //         ]);
    //
    //         const habitDoneData = habitDoneDataResponse.data;
    //         setDone(habitDoneData?.habitDoneDataInfo?.length || 0);
    //
    //         const streak = streakResponse.data;
    //         setStreak(streak);
    //
    //         const latestHabitDoneData = latestHabitDoneDataResponse.data;
    //
    //         if (!latestHabitDoneData || !latestHabitDoneData.habitDoneDataInfo) {
    //             setIsButtonClickable(true);
    //             setLoading(false);
    //             return;
    //         }
    //
    //         const lastDoneTime = moment(latestHabitDoneData?.habitDoneDataInfo?.at(-1)?.doneTime);
    //         const currentTime = moment();
    //         const currentSchedule = schedule.find((schedule: { startTime: string; endTime: string }) => {
    //             const startTime = moment(schedule.startTime, 'HH:mm');
    //             const endTime = moment(schedule.endTime, 'HH:mm');
    //             return startTime.isSameOrBefore(currentTime) && endTime.isSameOrAfter(currentTime);
    //         });
    //
    //         if (!currentSchedule || !lastDoneTime.isSame(currentTime, 'day')) {
    //             setIsButtonClickable(false);
    //             setLoading(false);
    //             return;
    //         }
    //
    //         const lastDoneTimeFormatted = lastDoneTime.format('HH:mm');
    //         if (lastDoneTimeFormatted >= currentSchedule.startTime && lastDoneTimeFormatted <= currentSchedule.endTime) {
    //             setIsButtonClickable(false);
    //         } else {
    //             setIsButtonClickable(true);
    //         }
    //
    //         setLoading(false);
    //     } catch (error) {
    //         console.log(error);
    //     }
    //
    // };

    const fetchAllData = async () => {
        try {
            const userName = await SecureStore.getItemAsync(USER_KEY);
            setUserName(userName);

            const [habitResponse, habitDoneDataResponse, latestHabitDoneDataResponse, streakResponse] = await Promise.all([
                axios.get<Habit>(`${API}/habits/getHabit/${props.habitName}`),
                axios.post<HabitDoneData>(`${API}/dateData/getCurrentHabitDoneDataOfUser`, {
                    userName: userName,
                    habitName: habitName,
                    date: moment().locale('de').format('YYYY-MM-DD')
                }),
                axios.post<HabitDoneData>(`${API}/dateData/getLastHabitDoneDataOfUser`, {
                    userName: userName,
                    habitName: habitName
                }),
                axios.post(`${API}/dateData/getStreak`, {
                    userName: userName,
                    habitName: habitName,
                    date: moment().locale('de').format('YYYY-MM-DD')
                })
            ]);

            const habit = habitResponse.data;
            setHabit(habit);
            setToDo(habit.timesPerDay);
            setFakeUserCancellationRate(habit.fakeUserCancellationRate);

            const habitDoneData = habitDoneDataResponse.data;
            setDone(habitDoneData?.habitDoneDataInfo?.length || 0);

            const streak = streakResponse.data;
            setStreak(streak);

            const latestHabitDoneData = latestHabitDoneDataResponse.data;

            if (!latestHabitDoneData || !latestHabitDoneData.habitDoneDataInfo) {
                setIsButtonClickable(true);
                setLoading(false);
                return;
            }

            const lastDoneTime = moment(latestHabitDoneData?.habitDoneDataInfo?.at(-1)?.doneTime);
            const currentTime = moment();

            const inCurrentSchedule = schedule.find((schedule: { startTime: string; endTime: string }) => {
                const startTime = moment(schedule.startTime, 'HH:mm');
                const endTime = moment(schedule.endTime, 'HH:mm');
                return startTime.isSameOrBefore(currentTime) && endTime.isSameOrAfter(currentTime);
            })!!;

            setIsButtonClickable(
                inCurrentSchedule &&
                !lastDoneTime.isSame(currentTime, 'day') &&
                lastDoneTime.format('HH:mm') > inCurrentSchedule.startTime &&
                lastDoneTime.format('HH:mm') < inCurrentSchedule.endTime
            );

            setLoading(false);
        } catch (error) {
            console.log(error);
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
