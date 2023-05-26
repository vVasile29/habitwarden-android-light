import React, {ReactNode, useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {CircularProgressBase} from 'react-native-circular-progress-indicator';
import axios from "axios";
import {API} from "../app/context/AuthContext";
import {Circle} from "react-native-svg";
import CircularProgressSkeleton from "./CircularProgressSkeleton";
import HabitButton from "./HabitButton";

interface Habit {
    _id: string;
    name: string;
    pointsPerTask: number;
    pointsPerDay: number;
    amountPerTask: number;
    timesPerDay: number;
    fakeUserCancellationRate: number;
    notificationText: NotificationText;
}

interface NotificationText {
    // Define the structure of the notification text fields here
}

interface HabitSummaryProps {
    id: string,
    logo: ReactNode,
    onLoading: React.Dispatch<React.SetStateAction<boolean>>,
    allSiblingsLoaded: boolean,
}

export const CIRCLE_RADIUS: number = 95;
export const STROKE_WIDTH: number = 15;
export const INACTIVE_STROKE_COLOR: string = '#708090';
export const HABIT_INACTIVE_CIRCLE_COLOR: string = '#DCDCDC';
export const HABIT_READY_CIRCLE_COLOR: string = '#87CEEB';

const HabitSummary = (props: HabitSummaryProps) => {
    const logo = props.logo;
    const setLoading = props.onLoading;
    const allSiblingsLoaded = props.allSiblingsLoaded;

    const [habit, setHabit] = useState<Habit | null>(null);
    const [done, setDone] = useState(2);
    const [toDo, setToDo] = useState(0);
    const [fakeUserCancellationRate, setFakeUserCancellationRate] = useState(0);
    const [streak, setStreak] = useState(0);
    const [habitReady, setHabitReady] = useState(false);

    const getHabit = async (): Promise<Habit> => {
        try {
            const response = await axios.get<Habit>(`${API}/habits/getHabit/${props.id}`);
            return response.data;
        } catch (e: any) {
            throw e;
        }
    }

    useEffect(() => {
        const fetchHabit = async () => {
            try {
                setLoading(true)
                const habit: Habit = await getHabit();
                setHabit(habit);
                // Set other state values based on habit properties
                setToDo(habit.timesPerDay);
                setFakeUserCancellationRate(habit.fakeUserCancellationRate);
                setLoading(false)
            } catch (error) {
                console.error(error);
            }
        };

        fetchHabit();
    }, []);

    if (!allSiblingsLoaded) {
        return (
            <CircularProgressSkeleton
                logo={logo}
            />
        );
    }

    return (
        <HabitButton
            done={done}
            toDo={toDo}
            isActive={habitReady}
            logo={logo}
        />
    );

}
export default HabitSummary;
