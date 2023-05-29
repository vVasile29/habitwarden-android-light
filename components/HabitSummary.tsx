import React, {ReactNode, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import axios from "axios";
import {API} from "../app/context/AuthContext";
import CircularProgressSkeleton from "./CircularProgressSkeleton";
import HabitButton from "./HabitButton";
import {useRouter} from "expo-router";

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

export interface DateData {
    userId: string;
    habitId: string,
    date: string;
    lieOnDone: boolean,
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

const HabitSummary = (props: HabitSummaryProps) => {
    const logo = props.logo;
    const setLoading = props.onLoading;
    const allSiblingsLoaded = props.allSiblingsLoaded;

    const [habit, setHabit] = useState<Habit | null>(null);
    const [done, setDone] = useState(3);
    const [toDo, setToDo] = useState(0);
    const [fakeUserCancellationRate, setFakeUserCancellationRate] = useState(0);
    const [streak, setStreak] = useState(0);
    const [habitReady, setHabitReady] = useState(false);
    const router = useRouter();

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
        <Pressable
            style={styles.summary}
            onPress={() => router.replace(`/${props.id}`)}
        >
            <Text style={styles.rate}>{fakeUserCancellationRate * 100}%</Text>
            <View style={styles.habitButton}>
                <HabitButton
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
        </Pressable>
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
        fontSize: 30
    }
})
export default HabitSummary;
