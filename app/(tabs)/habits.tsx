import {Button, StyleSheet} from 'react-native';

import {Text, View} from '../../components/Themed';
import {useEffect, useState} from "react";
import React from "react";
import HabitSummary from "../../components/HabitSummary";
import WaterLogo from "../../assets/svg/WaterLogo";
import SquatsLogo from "../../assets/svg/SquatsLogo";
import MeditationLogo from "../../assets/svg/MeditationLogo";

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
    {startTime: '21:00', endTime: '00:00'},
];

const squatsSchedule = [
    {startTime: '9:30', endTime: '12:00'},
    {startTime: '12:00', endTime: '14:45'},
    {startTime: '14:45', endTime: '17:15'},
    {startTime: '17:15', endTime: '20:00'},
    {startTime: '20:00', endTime: '00:00'},
];

const meditationSchedule = [
    {startTime: '10:00', endTime: '12:45'},
    {startTime: '12:45', endTime: '15:15'},
    {startTime: '15:15', endTime: '18:00'},
    {startTime: '18:00', endTime: '20:30'},
    {startTime: '20:30', endTime: '00:00'},
];

export default function Habits() {
    const [waterLoading, setWaterLoading] = useState(true);
    const [squatsLoading, setSquatsLoading] = useState(true);
    const [meditationLoading, setMeditationLoading] = useState(true);

    const allSiblingsLoaded = !waterLoading && !squatsLoading && !meditationLoading;

    return (
        <View style={styles.container}>
            <Text style={styles.textLeft}>Abbruchrate{"\n"}aller{"\n"}Nutzer</Text>
            <Text style={styles.textRight}>Deine{"\n"}Streak</Text>
            {/* TODO Logos are just hardcoded into place in their own component, make it flexible*/}
            <HabitSummary
                habitName={WATER}
                logo={<WaterLogo/>}
                onLoading={setWaterLoading}
                allSiblingsLoaded={allSiblingsLoaded}
                schedule={waterSchedule}
            />
            <HabitSummary
                habitName={SQUATS}
                logo={<SquatsLogo/>}
                onLoading={setSquatsLoading}
                allSiblingsLoaded={allSiblingsLoaded}
                schedule={squatsSchedule}
            />
            <HabitSummary
                habitName={MEDITATION}
                logo={<MeditationLogo/>}
                onLoading={setMeditationLoading}
                allSiblingsLoaded={allSiblingsLoaded}
                schedule={meditationSchedule}
            />
        </View>
    );
}

const textStyle = {
    position: "absolute",
    top: 10,
    fontSize: 20,
    fontWeight: "bold"
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'center',
    },
    // @ts-ignore
    textLeft: {
        ...textStyle,
        left: 18,
    },
    // @ts-ignore
    textRight: {
        ...textStyle,
        right: 18,
    },
});
