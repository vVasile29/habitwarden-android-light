import {Pressable, StyleSheet, Text, View} from "react-native";
import ModalPopup from "../ModalPopup";
import React from "react";


interface LiePopupProps {
    liePopupVisible: boolean;
    handlePressYesOnDone: () => Promise<void>;
    setLieOnDone: React.Dispatch<React.SetStateAction<boolean>>;
    setLiePopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setCancelPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LiePopup(props: LiePopupProps) {

    return (
        <ModalPopup visible={props.liePopupVisible}>
            <Text style={{fontSize: 25, textAlign: 'center', fontWeight: "bold"}}>
                Hand aufs Herz, ehrlich abgeschlossen?
            </Text>
            <Text style={{fontSize: 100, textAlign: "center", marginBottom: 15}}>🤔</Text>
            <View style={{display: "flex", flexDirection: "row", justifyContent: "center", gap: 10}}>
                <Pressable
                    style={[styles.pressable, {backgroundColor: '#82c91e'}]}
                    onPress={props.handlePressYesOnDone}
                >
                    <Text style={{fontSize: 20, fontWeight: "bold"}}>Ja</Text>
                </Pressable>
                <Pressable
                    style={styles.pressable}
                    onPress={() => {
                        props.setLieOnDone(true);
                        props.setLiePopupVisible(false);
                        props.setCancelPopupVisible(true)
                    }}
                >
                    <Text style={{fontSize: 20, fontWeight: "bold"}}>Nein</Text>
                </Pressable>
            </View>
        </ModalPopup>
    );
}

const styles = StyleSheet.create({
    pressable: {
        alignItems: 'center',
        backgroundColor: 'red',
        padding: 10,
        width: "30%",
        borderColor: "black",
        borderWidth: 3,
        borderRadius: 15,
    },
});