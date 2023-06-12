import {Pressable, StyleSheet, Text, View} from "react-native";

import ModalPopup from "../ModalPopup";
import React, {useState} from "react";
import {heightDP, widthDP} from "../../constants/DpScaling";


interface CancelPopupProps {
    cancelPopupVisible: boolean;
    setCancelPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handlePressNotDone: () => Promise<void>;
    setIsPlaying?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CancelPopup(props: CancelPopupProps) {
    const [disableButton, setDisableButton] = useState(false);

    return (
        <ModalPopup visible={props.cancelPopupVisible}>
            <Text style={{fontSize: 25, textAlign: 'center', fontWeight: "bold", marginBottom: heightDP("3%")}}>
                Möchtest du abbrechen, oder doch lieber weiter machen?
            </Text>
            <View style={{display: "flex", flexDirection: "row", justifyContent: "center", gap: 10}}>
                <Pressable
                    style={styles.pressable}
                    onPress={() => {
                        props.setCancelPopupVisible(false);
                        if (props.setIsPlaying) {
                            props.setIsPlaying(true)
                        }
                    }}
                >
                    <Text style={{fontSize: 20, fontWeight: "bold"}}>Weiter</Text>
                </Pressable>
                <Pressable
                    style={[styles.pressable, {backgroundColor: 'blue'}]}
                    disabled={disableButton}
                    onPress={() => {
                        setDisableButton(true);
                        props.handlePressNotDone();
                    }}
                >
                    <Text style={{fontSize: 20, fontWeight: "bold"}}>Abbrechen</Text>
                </Pressable>
            </View>
        </ModalPopup>
    );
}

const styles = StyleSheet.create({
    pressable: {
        alignItems: 'center',
        backgroundColor: '#82c91e',
        padding: heightDP("1%"),
        width: widthDP("35%"),
        borderColor: "black",
        borderWidth: 3,
        borderRadius: 15,
    },
});

