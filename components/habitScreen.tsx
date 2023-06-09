import {CountdownCircleTimer} from "react-native-countdown-circle-timer";
import {Pressable, Text, View} from "react-native";
import WaterLogo from "../assets/svg/WaterLogo";
import React from "react";
import {useRouter} from "expo-router";

interface HabitScreenProps {
    isPlaying: boolean;
    duration: number;
    setLiePopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
    taskDescription: string;
    handlePressDone: () => Promise<void>;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    setLosePointsWarningPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
    logo: any;
}

export default function HabitScreen(props: HabitScreenProps) {
    const router = useRouter();

    return (
        <View style={{display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 30, gap: 10}}>
            <CountdownCircleTimer
                isPlaying={props.isPlaying}
                duration={props.duration}
                colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                colorsTime={[10, 6, 3, 0]}
                onComplete={() => props.setLiePopupVisible(true)}
                updateInterval={0}
            >
                {({remainingTime, color}) => (
                    <Text style={{color, fontSize: 40}}>
                        {remainingTime}
                    </Text>
                )}
            </CountdownCircleTimer>
            {props.logo}
            <Text style={{fontSize: 30, fontWeight: "bold", marginTop: "5%", marginBottom: "5%"}}>
                {props.taskDescription}
            </Text>
            <Pressable
                style={{
                    alignItems: 'center',
                    backgroundColor: '#82c91e',
                    padding: 10,
                    width: "30%",
                    borderColor: "black",
                    borderWidth: 3,
                    borderRadius: 15,
                }}
                onPress={() => {
                    props.handlePressDone();
                }}
            >
                <Text style={{fontSize: 20, fontWeight: "bold"}}>Fertig</Text>
            </Pressable>
            <Pressable
                onPress={() => router.replace("/habits")}>
                <Text>Zurück zu Habits</Text>
            </Pressable>
            <Pressable
                style={{top: 50}}
                onPress={() => {
                    props.setIsPlaying(false);
                    props.setLosePointsWarningPopupVisible(true);
                }}>
                <Text style={{color: "lightgrey", textDecorationLine: "underline"}}>Abbrechen</Text>
            </Pressable>
        </View>
    );
}