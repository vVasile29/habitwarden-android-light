import React, {ReactNode, useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, Pressable, Alert} from 'react-native';
import axios from "axios";
import {API, USER_KEY} from "../app/context/AuthContext";
import CircularProgressSkeleton from "./CircularProgressSkeleton";
import HabitButton from "./HabitButton";
import * as SecureStore from "expo-secure-store";
import moment from "moment/moment";
import 'moment/locale/de';
import {heightDP} from "../constants/DpScaling";

export interface Habit {
    name: string;
    pointsPerTask: number;
    pointsPerDay: number;
    amountPerTask: number;
    timesPerDay: number;
    fakeUserCancellationRate: number;
}

export interface HabitDoneData {
    habitName: string;
    habitDoneDataInfo: HabitDoneDataInfo[];
}

interface HabitDoneDataInfo {
    doneTime: string;
    done: boolean;
    lieOnDone: boolean;
    wantedToQuit: boolean;
}

interface HabitSummaryProps {
    habitName: string,
    logo: ReactNode,
    onLoading: React.Dispatch<React.SetStateAction<boolean>>,
    allSiblingsLoaded: boolean,
    schedule: { startTime: string, endTime: string }[]
}

const HabitSummary = (props: HabitSummaryProps) => {
    const logo = props.logo;
    const setLoading = props.onLoading;
    const allSiblingsLoaded = props.allSiblingsLoaded;
    const habitName = props.habitName;
    const schedule = props.schedule;

    const [doneAmount, setDoneAmountAmount] = useState(0);
    const [toDoAmount, setToDoAmount] = useState(0);
    const [fakeUserCancellationRate, setFakeUserCancellationRate] = useState(0);
    const [streak, setStreak] = useState(0);
    const [isButtonClickable, setIsButtonClickable] = useState(false);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const userName = await SecureStore.getItemAsync(USER_KEY);

            const [habitResponse, habitDoneDataResponse, latestHabitDoneDataResponse, streakResponse] = await Promise.all([
                await axios.get<Habit>(`${API}/habits/getHabit/${props.habitName}`),
                await axios.post<HabitDoneData>(`${API}/dateData/getCurrentHabitDoneDataOfUser`, {
                    userName: userName,
                    habitName: habitName,
                }),
                await axios.post<HabitDoneData>(`${API}/dateData/getLastHabitDoneDataOfUser`, {
                    userName: userName,
                    habitName: habitName
                }),
                await axios.post(`${API}/dateData/getStreak`, {
                    userName: userName,
                    habitName: habitName,
                }),
            ]);

            const habit = habitResponse.data;
            setToDoAmount(habit.timesPerDay);
            setFakeUserCancellationRate(habit.fakeUserCancellationRate);

            const habitDoneData = habitDoneDataResponse.data;
            const done = habitDoneData?.habitDoneDataInfo?.filter(
                habitDoneDataInfo => habitDoneDataInfo.done).length ?? 0;
            setDoneAmountAmount(done);

            const streak = streakResponse.data;
            setStreak(streak);

            const latestHabitDoneData = latestHabitDoneDataResponse.data;
            const lastDoneTime = moment(latestHabitDoneData?.habitDoneDataInfo?.at(-1)?.doneTime);
            const currentTime = moment();

            const currentSchedule = schedule.find((schedule: { startTime: string; endTime: string }) => {
                const startTime = moment(schedule.startTime, 'HH:mm');
                const endTime = moment(schedule.endTime, 'HH:mm');
                return startTime.isSameOrBefore(currentTime) && endTime.isSameOrAfter(currentTime);
            });

            const tasksLeft = done !== habit.timesPerDay;
            const inCurrentSchedule = !!currentSchedule;
            const thisTaskNotDoneYet = !latestHabitDoneData.habitDoneDataInfo
            const noTasksDoneYet = !latestHabitDoneData;

            if (!inCurrentSchedule) {
                setLoading(false);
                return;
            }

            if (tasksLeft && (noTasksDoneYet || thisTaskNotDoneYet)) {
                setIsButtonClickable(true);
                setLoading(false);
                return;
            }

            const lastDoneHourMinutes = moment(lastDoneTime.format('HH:mm'), "hoursToMinutes");
            const currentStartTime = moment(currentSchedule.startTime, "hoursToMinutes");

            setIsButtonClickable(
                lastDoneTime.isSame(currentTime, 'day') &&
                lastDoneTime.format('HH:mm') < currentSchedule.startTime &&
                lastDoneHourMinutes.isBefore(currentStartTime)
            );

            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

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
                    doneAmount={doneAmount}
                    toDoAmount={toDoAmount}
                    isActive={isButtonClickable}
                    // isActive={true} // das nur zum testen weil out of schedule nach mitternacht
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
        fontSize: heightDP("3.5%"),
        fontWeight: "bold",
        color: "#5c940d",
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
        fontSize: heightDP("5%"),
        right: heightDP("0.3%"),
        bottom: heightDP("1%")
    },
    streakText: {
        position: "absolute",
        fontSize: heightDP("3.5%"),
        fontWeight: "bold"
    }
})
export default HabitSummary;
