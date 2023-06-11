import {CountdownCircleTimer} from "react-native-countdown-circle-timer";
import {Pressable, Text, View} from "react-native";
import React from "react";
import {heightDP, widthDP} from "../constants/DpScaling";

interface HabitScreenProps {
    setLiePopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
    taskDescription: string;
    handlePressDone: () => Promise<void>;
    setWantedToQuit: React.Dispatch<React.SetStateAction<boolean>>;
    logo: any;
    setCancelPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HabitScreen(props: HabitScreenProps) {
    return (
        <View style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: heightDP("15%"),
            gap: heightDP("1%")
        }}>
            {props.logo}
            <Text style={{fontSize: widthDP("7%"), fontWeight: "bold", marginBottom: heightDP("2%")}}>
                {props.taskDescription}
            </Text>
            <View style={{display: "flex", flexDirection: "row", gap: 10}}>
                <Pressable
                    style={{
                        alignItems: 'center',
                        backgroundColor: 'blue',
                        padding: heightDP("1%"),
                        width: widthDP("35%"),
                        borderColor: "black",
                        borderWidth: 3,
                        borderRadius: 15,
                    }}
                    onPress={() => {
                        props.setWantedToQuit(true);
                        props.setCancelPopupVisible(true);
                    }}>
                    <Text style={{fontSize: heightDP("2.5%"), fontWeight: "bold"}}>Abbrechen</Text>
                </Pressable>
                <Pressable
                    style={{
                        alignItems: 'center',
                        backgroundColor: '#82c91e',
                        padding: heightDP("1%"),
                        width: widthDP("35%"),
                        borderColor: "black",
                        borderWidth: 3,
                        borderRadius: 15,
                    }}
                    onPress={() => {
                        props.setLiePopupVisible(true);
                        props.handlePressDone();
                    }}
                >
                    <Text style={{fontSize: heightDP("2.5%"), fontWeight: "bold"}}>Fertig</Text>
                </Pressable>
            </View>
        </View>
    );
}