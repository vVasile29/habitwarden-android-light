import {Pressable, StyleSheet, Text, View} from "react-native";
import {CheckBox} from "react-native-elements";
import LonelyGuy from "../../assets/svg/LonelyGuy";
import ModalPopup from "../ModalPopup";
import React from "react";
import {heightDP, widthDP} from "../../constants/DpScaling";


interface LosePointsWarningPopupProps {
    losePointsWarningPopupVisible: boolean;
    pointsPerTask: number;
    fakeUserCancellationDescription: string;
    shameCheckbox: boolean;
    setShameCheckbox: React.Dispatch<React.SetStateAction<boolean>>;
    setLosePointsWarningPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setLosePointsPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LosePointsWarningPopup(props: LosePointsWarningPopupProps) {
    return (
        <ModalPopup visible={props.losePointsWarningPopupVisible}>
            <View style={{display: "flex", flexDirection: "column", gap: 10}}>
                <Text style={{fontSize: widthDP("8%"), textAlign: 'center', fontWeight: "bold", color: "red"}}>
                    Du würdest {props.pointsPerTask} Punkte verlieren...
                </Text>
                <Text style={{fontSize: widthDP("4%"), textAlign: "center", fontWeight: "bold"}}>
                    {props.fakeUserCancellationDescription}
                </Text>
                <View style={{display: "flex", flexDirection: "row"}}>
                    <View style={{display: "flex", flexDirection: "column"}}>
                        <View>
                            <Text>
                                Diese Box nicht abwählen,{"\n"}
                                wenn du nicht aufhören willst:
                            </Text>
                            <View style={{right: 10}}>
                                <CheckBox
                                    title={"Ich habe kein\nDurchhaltevermögen"}
                                    checked={props.shameCheckbox}
                                    onPress={() => props.setShameCheckbox(prevState => !prevState)}
                                />
                            </View>
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    gap: widthDP("1%")
                                }}>
                                <Pressable
                                    style={[styles.pressable, {backgroundColor: props.shameCheckbox ? '#4c6ef5' : 'grey'}]}
                                    disabled={!props.shameCheckbox}
                                    onPress={() => {
                                        if (props.shameCheckbox) {
                                            props.setLosePointsWarningPopupVisible(false);
                                            props.setLosePointsPopupVisible(true);
                                        }
                                    }}
                                >
                                    <Text style={{fontSize: widthDP("5%"), fontWeight: "bold"}}>Okay</Text>
                                </Pressable>
                                <Pressable
                                    style={styles.pressable}
                                    onPress={() => {
                                        props.setLosePointsWarningPopupVisible(false);
                                        props.setIsPlaying(true);
                                    }}
                                >
                                    <Text style={{fontSize: widthDP("5%"), fontWeight: "bold"}}>Weiter</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    <LonelyGuy position={"relative"} top={heightDP("3%")} width={widthDP("28%")} height={heightDP("20%")}/>
                </View>
            </View>
        </ModalPopup>
    );
}

const styles = StyleSheet.create({
    pressable: {
        alignItems: 'center',
        backgroundColor: '#82c91e',
        padding: heightDP("1%"),
        width: widthDP("26%"),
        borderColor: "black",
        borderWidth: 3,
        borderRadius: 15,
    },
});

