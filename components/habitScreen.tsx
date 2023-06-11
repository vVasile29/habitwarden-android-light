import {CountdownCircleTimer} from "react-native-countdown-circle-timer";
import {Pressable, Text, View} from "react-native";
import React from "react";
import {heightDP, widthDP} from "../constants/DpScaling";

interface HabitScreenProps {
    isPlaying: boolean;
    duration: number;
    setLiePopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
    taskDescription: string;
    handlePressDone: () => Promise<void>;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    setWantedToQuit: React.Dispatch<React.SetStateAction<boolean>>;
    setLosePointsWarningPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
    logo: any;
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
            <CountdownCircleTimer
                isPlaying={props.isPlaying}
                duration={props.duration}
                colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                colorsTime={[10, 6, 3, 0]}
                onComplete={() => props.setLiePopupVisible(true)}
                updateInterval={0}
                size={heightDP("25%")}
            >
                {({remainingTime, color}) => (
                    <Text style={{color, fontSize: heightDP("5%")}}>
                        {remainingTime}
                    </Text>
                )}
            </CountdownCircleTimer>
            {props.logo}
            <Text style={{fontSize: widthDP("7%"), fontWeight: "bold", marginBottom: heightDP("2%")}}>
                {props.taskDescription}
            </Text>
            <Pressable
                style={{
                    alignItems: 'center',
                    backgroundColor: '#82c91e',
                    padding: heightDP("1%"),
                    width: widthDP("30%"),
                    borderColor: "black",
                    borderWidth: 3,
                    borderRadius: 15,
                }}
                onPress={() => {
                    props.handlePressDone();
                }}
            >
                <Text style={{fontSize: heightDP("2.5%"), fontWeight: "bold"}}>Fertig</Text>
            </Pressable>
            <Pressable
                style={{top: heightDP("3%")}}
                onPress={() => {
                    props.setWantedToQuit(true);
                    props.setIsPlaying(false);
                    props.setLosePointsWarningPopupVisible(true);
                }}>
                <Text style={{color: "lightgrey", textDecorationLine: "underline"}}>Abbrechen</Text>
            </Pressable>
        </View>
    );
}