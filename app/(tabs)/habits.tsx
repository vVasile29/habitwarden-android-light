import {Alert, Pressable, StyleSheet} from 'react-native';

import {Text, View} from '../../components/Themed';
import React, {useEffect, useMemo, useRef, useState} from "react";
import HabitSummary, {Habit} from "../../components/HabitSummary";
import WaterLogo from "../../assets/svg/WaterLogo";
import SquatsLogo from "../../assets/svg/SquatsLogo";
import MeditationLogo from "../../assets/svg/MeditationLogo";
import {API, USER_KEY} from "../context/AuthContext";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {heightDP} from '../../constants/DpScaling';
import ShowPointsPopup from "../../components/Popups/ShowPointsPopup";
import moment from "moment";
import {Ionicons} from "@expo/vector-icons";

export const WATER = "water";
export const SQUATS = "squats";
export const MEDITATION = "meditation";

const waterSchedule = [
    {startTime: '9:00', endTime: '10:45'},
    {startTime: '10:45', endTime: '12:30'},
    {startTime: '12:30', endTime: '14:15'},
    {startTime: '14:15', endTime: '16:00'},
    {startTime: '16:00', endTime: '17:45'},
    {startTime: '17:45', endTime: '19:30'},
    {startTime: '19:30', endTime: '21:00'},
    {startTime: '21:00', endTime: '23:59'},
];

const squatsSchedule = [
    {startTime: '9:30', endTime: '12:00'},
    {startTime: '12:00', endTime: '14:45'},
    {startTime: '14:45', endTime: '17:15'},
    {startTime: '17:15', endTime: '20:00'},
    {startTime: '20:00', endTime: '23:59'},
];

const meditationSchedule = [
    {startTime: '10:00', endTime: '12:45'},
    {startTime: '12:45', endTime: '15:15'},
    {startTime: '15:15', endTime: '18:00'},
    {startTime: '18:00', endTime: '20:30'},
    {startTime: '20:30', endTime: '23:59'},
];

export async function useFetchPointsPerTask(habitName: string) {
    try {
        const habitResponse = await axios.get<Habit>(`${API}/habits/getHabit/${habitName}`);
        return habitResponse.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export function useSaveData() {
    return async (habitName: string, done: boolean, lieOnDone: boolean, wantedToQuit: boolean, pointsPerTask: number) => {
        const userName = await SecureStore.getItemAsync(USER_KEY);

        try {
            // save date data
            await axios.post(`${API}/dateData/saveDateData`, {
                userName,
                habitName,
                done,
                lieOnDone,
                wantedToQuit
            });

            if (done) {
                await axios.post(`${API}/user/savePoints/${pointsPerTask}`)
            }
        } catch (e) {
            console.log(e);
        }
    };
}

export default function Habits() {
    const [waterLoading, setWaterLoading] = useState(true);
    const [squatsLoading, setSquatsLoading] = useState(true);
    const [meditationLoading, setMeditationLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const allSiblingsLoaded = !waterLoading && !squatsLoading && !meditationLoading;
    const [componentKey, setComponentKey] = useState(moment().format())
    const [canPressReload, setCanPressReload] = useState(true);

    useEffect(() => {
        setComponentKey(moment().format())
    }, [reload])

    const handleReload = () => {
        if (canPressReload) {
            setReload(prevState => !prevState);
            setCanPressReload(false);
            setTimeout(() => {
                setCanPressReload(true);
            }, 2000);
        }
    };

    return (
        <View key={componentKey} style={styles.container}>
            <View style={{width: "100%", display: "flex", flexDirection: "row"}}>
                <Text style={[styles.textStyle, styles.textLeft]}></Text>
                <View style={{flex: 1, alignItems: "center"}}>
                    <Pressable
                        onPress={handleReload}
                    >
                        <Ionicons
                            name={canPressReload ? "reload-circle-sharp" : "reload-circle-outline"}
                            size={heightDP("6%")}
                            color="black"
                        />
                    </Pressable>
                </View>
                <View style={{flex: 1, alignItems: "flex-end"}}>
                    <Text style={[styles.textStyle, styles.textRight]}>Deine{"\n"}Streak</Text>
                </View>
            </View>
            <HabitSummary
                habitName={WATER}
                logo={<WaterLogo position={"absolute"} top={heightDP("4.3%")} width={heightDP("12%")}
                                 height={heightDP("12%")}/>}
                onLoading={setWaterLoading}
                allSiblingsLoaded={allSiblingsLoaded}
                schedule={waterSchedule}
            />
            <HabitSummary
                habitName={SQUATS}
                logo={<SquatsLogo position={"absolute"} top={heightDP("-0.3%")} left={heightDP("2%")}
                                  width={heightDP("21%")} height={heightDP("21%")}/>}
                onLoading={setSquatsLoading}
                allSiblingsLoaded={allSiblingsLoaded}
                schedule={squatsSchedule}
            />
            <HabitSummary
                habitName={MEDITATION}
                logo={<MeditationLogo position={"absolute"} top={heightDP("-2.3%")} width={heightDP("25%")}
                                      height={heightDP("25%")}/>}
                onLoading={setMeditationLoading}
                allSiblingsLoaded={allSiblingsLoaded}
                schedule={meditationSchedule}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    textStyle: {
        flex: 1,
        fontSize: heightDP("2.65%"),
        fontWeight: "bold"
    },
    textLeft: {
        left: 14
    },
    textRight: {
        right: 14
    },
});
