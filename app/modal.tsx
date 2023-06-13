import {StatusBar} from 'expo-status-bar';
import {Button, Platform, StyleSheet} from 'react-native';

import {Text, View} from '../components/Themed';
import {widthDP} from "../constants/DpScaling";
import React from "react";

export default function ModalScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Habitwarden</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                    Bei dieser App geht es darum, die Habits Trinken, Kniebeugen und Meditation mehrere Male pro Tag
                    durchzuführen.
                </Text>
                <Text style={styles.infoText}>
                    Du kannst dir auf der Statistiken-Seite anschauen, wie oft du deine Habits pro Tag ausgeführt hast.
                </Text>
                <Text style={styles.infoText}>
                    Pro Habit sammelst du Punkte, deinen Punktestand kannst du dir in der Profil-Seite anschauen.
                </Text>
            </View>
            <Text style={styles.haveFunText}>Viel Spaß!</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 16,
    },
    title: {
        fontSize: widthDP("10%"),
        fontWeight: 'bold',
        marginBottom: widthDP("10%"),
        textAlign: 'center',
    },
    infoContainer: {
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    infoText: {
        fontSize: widthDP("5%"),
        textAlign: "center",
        marginBottom: 16,
    },
    haveFunText: {
        fontSize: widthDP("7%"),
        fontWeight: 'bold',
        marginTop: widthDP("10%"),
        textAlign: 'center',
    }
});
