import {Button, StyleSheet} from 'react-native';

import {Text, View} from '../../components/Themed';
import axios from "axios";
import {useEffect, useState} from "react";
import {API, useAuth, USER_KEY} from "../context/AuthContext";
import React from "react";
import HabitSummary from "../../components/HabitSummary";
import WaterLogo from "../../assets/svg/WaterLogo";
import SquatsLogo from "../../assets/svg/SquatsLogo";
import MeditationLogo from "../../assets/svg/MeditationLogo";
import * as SecureStore from "expo-secure-store";

export const WATER = "water";
export const SQUATS = "squats";
export const MEDITATION = "meditation";

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
            />
            <HabitSummary
                habitName={SQUATS}
                logo={<SquatsLogo/>}
                onLoading={setSquatsLoading}
                allSiblingsLoaded={allSiblingsLoaded}

            />
            <HabitSummary
                habitName={MEDITATION}
                logo={<MeditationLogo/>}
                onLoading={setMeditationLoading}
                allSiblingsLoaded={allSiblingsLoaded}
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
