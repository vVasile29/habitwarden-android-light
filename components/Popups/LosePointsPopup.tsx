import {Pressable, StyleSheet, Text, View} from "react-native";
import CryBaby from "../../assets/svg/CryBaby";
import Explosion from "../../assets/svg/Explosion";
import ModalPopup from "../ModalPopup";
import React from "react";
import {heightDP, widthDP} from "../../constants/DpScaling";


interface LosePointsPopupProps {
    losePointsPopupVisible: boolean;
    pointsPerTask: number;
    handlePressNotDone: () => Promise<void>;
}

export default function LosePointsPopup(props: LosePointsPopupProps){
    return (
        <ModalPopup visible={props.losePointsPopupVisible}>
            <View style={{display: "flex", flexDirection: "column", justifyContent: "center", gap: 10}}></View>
            <Text style={{fontSize: widthDP("12%"), color: "red", textAlign: 'center', fontWeight: "bold"}}>
                {props.pointsPerTask} Punkte verloren!
            </Text>
            <View style={{display: "flex", flexDirection: "row", justifyContent: "center", gap: 10}}>
                <CryBaby position={"relative"} width={widthDP("45%")} height={heightDP("25%")}/>
                <Explosion position={"relative"} width={widthDP("45%")} height={heightDP("25%")}/>
            </View>
            <Pressable
                style={styles.pressable}
                onPress={props.handlePressNotDone}
            >
                <Text style={{fontSize: widthDP("4%"), fontWeight: "bold"}}>Okay, nächstes Mal breche ich nicht ab.</Text>
            </Pressable>
        </ModalPopup>
    );
}

const styles = StyleSheet.create({
    pressable: {
        alignItems: 'center',
        backgroundColor: '#4c6ef5',
        padding: 10,
        width: "100%",
        borderColor: "black",
        borderWidth: 3,
        borderRadius: 15,
    },
});