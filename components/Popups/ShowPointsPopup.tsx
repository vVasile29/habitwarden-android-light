import {Pressable, StyleSheet, Text, View} from "react-native";
import CryBaby from "../../assets/svg/CryBaby";
import Explosion from "../../assets/svg/Explosion";
import ModalPopup from "../ModalPopup";
import React, {useState} from "react";
import {heightDP, widthDP} from "../../constants/DpScaling";


interface ShowPointsPopup {
    showPointsPopupVisible: boolean;
    pointsPerTask: number;
    handleClose: () => Promise<void>;
}

export default function ShowPointsPopup(props: ShowPointsPopup) {
    return (
        <ModalPopup visible={props.showPointsPopupVisible}>
            <View style={{display: "flex", flexDirection: "column", justifyContent: "center", gap: 10}}></View>
            <Text style={{fontSize: widthDP("12%"), color: "#82c91e", textAlign: 'center', fontWeight: "bold"}}>
                {props.pointsPerTask} Punkte bekommen!
            </Text>
            <View style={{display: "flex", flexDirection: "row", justifyContent: "center", gap: 10}}>
                <Text style={{fontSize: 100, textAlign: "center", marginBottom: 15}}>🥳</Text>
                <Text style={{fontSize: 100, textAlign: "center", marginBottom: 15}}>🎉</Text>
            </View>
            <Pressable
                style={styles.pressable}
                onPress={() => {
                    props.handleClose();
                }}
            >
                <Text style={{fontSize: widthDP("4%"), fontWeight: "bold"}}>
                    Okay
                </Text>
            </Pressable>
        </ModalPopup>
    );
}

const styles = StyleSheet.create({
    pressable: {
        alignItems: 'center',
        backgroundColor: '#82c91e',
        padding: 10,
        width: "100%",
        borderColor: "black",
        borderWidth: 3,
        borderRadius: 15,
    },
});