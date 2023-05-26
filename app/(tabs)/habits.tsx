import {Button, StyleSheet} from 'react-native';

import {Text, View} from '../../components/Themed';
import axios from "axios";
import {useEffect, useState} from "react";
import {API, useAuth} from "../context/AuthContext";
import React from "react";
import HabitSummary from "../../components/HabitSummary";
import WaterLogo from "../../assets/svg/WaterLogo";
import SquatsLogo from "../../assets/svg/SquatsLogo";
import MeditationLogo from "../../assets/svg/MeditationLogo";

const WATER = "water";
const SQUATS = "squats";
const MEDITATION = "meditation";

export default function Habits() {
    const [username, setUsername] = useState('');
    const [waterLoading, setWaterLoading] = useState(false);
    const [squatsLoading, setSquatsLoading] = useState(false);
    const [meditationLoading, setMeditationLoading] = useState(false);

    // this will not update automatically to false after this component has rendered, but any HabitSummary will on render
    // always true on every re-render in the beginning, then immediately set to false!
    // TODO find better option?
    const allSiblingsLoaded = !waterLoading && !squatsLoading && !meditationLoading;

    const whoAmI = async () => {
        try {
            const result = await axios.get(API + '/user/currentUser');
            setUsername(result.data.name);
        } catch (e) {
            return {error: true, message: (e as any).response.data.message}
        }
    }

    whoAmI();

    return (
        <View style={styles.container}>
            {/* TODO Logos are just hardcoded into place in their own component, make it flexible*/}
            <HabitSummary
                id={WATER}
                logo={<WaterLogo/>}
                onLoading={setWaterLoading}
                allSiblingsLoaded={allSiblingsLoaded}
            />
            <HabitSummary
                id={SQUATS}
                logo={<SquatsLogo/>}
                onLoading={setSquatsLoading}
                allSiblingsLoaded={allSiblingsLoaded}

            />
            <HabitSummary
                id={MEDITATION}
                logo={<MeditationLogo/>}
                onLoading={setMeditationLoading}
                allSiblingsLoaded={allSiblingsLoaded}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'center',
    },
});
