import React, {ReactNode, useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {CircularProgressBase} from 'react-native-circular-progress-indicator';
import axios from "axios";
import {API} from "../app/context/AuthContext";
import {Circle} from "react-native-svg";
import CircularProgressSkeleton from "./CircularProgressSkeleton";

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

interface HabitButtonProps {
    id: string,
    logo: ReactNode,
}

const CIRCLE_RADIUS: number = 95;
const STROKE_WIDTH: number = 15;
const INACTIVE_STROKE_COLOR: string = '#708090';
const INACTIVE_CIRCLE_COLOR: string = '#DCDCDC';
const ACTIVE_CIRCLE_COLOR: string = '#87CEEB';

const HabitButton = (props: HabitButtonProps) => {
    const [loading, setLoading] = useState(true); // Loading state
    const [done, setDone] = useState(2);
    const [toDo, setToDo] = useState(0);
    const [fakeUserCancellationRate, setFakeUserCancellationRate] = useState(0);
    const [streak, setStreak] = useState(0);
    const [habit, setHabit] = useState<Habit | null>(null); // State for habit data
    const [isActive, setIsActive] = useState(false);

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
                const habit: Habit = await getHabit();
                setHabit(habit);
                // Set other state values based on habit properties
                setToDo(habit.timesPerDay);
                setFakeUserCancellationRate(habit.fakeUserCancellationRate);
                setLoading(false); // Mark loading as complete
            } catch (error) {
                console.error(error);
            }
        };

        fetchHabit();
    }, []);

    if (loading) {
        // Render loading state
        return (
            <CircularProgressSkeleton
                logo={props.logo}
                CIRCLE_RADIUS={CIRCLE_RADIUS}
                CIRCLE_COLOR={INACTIVE_CIRCLE_COLOR}
                STROKE_WIDTH={STROKE_WIDTH}
                STROKE_COLOR={INACTIVE_STROKE_COLOR}
            />
        );
    }

    return (
        <View style={{display: "flex", gap: 20, alignItems: 'center', justifyContent: 'center'}}>
            <CircularProgressBase
                value={done + 0.00001}
                activeStrokeWidth={STROKE_WIDTH}
                inActiveStrokeWidth={STROKE_WIDTH}
                inActiveStrokeColor={INACTIVE_STROKE_COLOR}
                activeStrokeColor={getColorByPercentage(done / toDo)}
                circleBackgroundColor={isActive ? ACTIVE_CIRCLE_COLOR : INACTIVE_CIRCLE_COLOR}
                radius={CIRCLE_RADIUS}
                maxValue={toDo}
            />
            {props.logo}
            <Text style={{
                position: "absolute",
                top: 140,
                fontSize: 28,
                fontWeight: "bold"
            }}>{done + "/" + toDo}</Text>
        </View>
    );


}

function getColorByPercentage(percentage: number) {
    let color = '';

    switch (Math.floor(percentage * 10)) {
        case 0:
            color = '#FF0000';
            break;
        case 1:
            color = '#FF3300';
            break;
        case 2:
            color = '#ff6600';
            break;
        case 3:
            color = '#ff9900';
            break;
        case 4:
            color = '#FFCC00';
            break;
        case 5:
            color = '#FFFF00';
            break;
        case 6:
            color = '#ccff00';
            break;
        case 7:
            color = '#99ff00';
            break;
        case 8:
            color = '#66ff00';
            break;
        case 9:
            color = '#33ff00';
            break;
        case 10:
            color = '#00FF00';
            break;
        default:
            color = '#FF0000';
            break;
    }

    return color;
}

export default HabitButton;
