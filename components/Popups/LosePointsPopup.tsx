import {Pressable, Text, View} from "react-native";
import CryBaby from "../../assets/svg/CryBaby";
import Explosion from "../../assets/svg/Explosion";
import ModalPopup from "../ModalPopup";
import React from "react";


interface LosePointsPopupProps {
    losePointsPopupVisible: boolean;
    pointsPerTask: number;
    handlePressNotDone: () => Promise<void>;
}

export default function LosePointsPopup(props: LosePointsPopupProps){
    return (
        <ModalPopup visible={props.losePointsPopupVisible}>
            <View style={{display: "flex", flexDirection: "column", justifyContent: "center", gap: 10}}></View>
            <Text style={{fontSize: 38, color: "red", textAlign: 'center', fontWeight: "bold"}}>
                {props.pointsPerTask} Punkte verloren!
            </Text>
            <View style={{display: "flex", flexDirection: "row", justifyContent: "center", gap: 10}}>
                <CryBaby position={"relative"} width={170} height={170}/>
                <Explosion position={"relative"} width={170} height={170}/>
            </View>
            <Pressable
                style={{
                    alignItems: 'center',
                    backgroundColor: '#4c6ef5',
                    padding: 10,
                    width: "100%",
                    borderColor: "black",
                    borderWidth: 3,
                    borderRadius: 15,
                }}
                onPress={props.handlePressNotDone}
            >
                <Text style={{fontSize: 16, fontWeight: "bold"}}>Okay, nächstes Mal breche ich nicht ab.</Text>
            </Pressable>
        </ModalPopup>
    );
}