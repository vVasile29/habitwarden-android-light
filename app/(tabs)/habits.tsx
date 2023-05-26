import {Button, StyleSheet} from 'react-native';

import {Text, View} from '../../components/Themed';
import axios from "axios";
import {useState} from "react";
import {API, useAuth} from "../context/AuthContext";
import React from "react";
import HabitButton from "../../components/HabitButton";
import WaterLogo from "../../assets/svg/WaterLogo";
import SquatsLogo from "../../assets/svg/SquatsLogo";
import MeditationLogo from "../../assets/svg/MeditationLogo";

export default function Habits() {
    const [username, setUsername] = useState('');
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
            <HabitButton id={"water"} logo={<WaterLogo/>}/>
            <HabitButton id={"squats"} logo={<SquatsLogo/>}/>
            <HabitButton id={"meditation"} logo={<MeditationLogo/>}/>
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
