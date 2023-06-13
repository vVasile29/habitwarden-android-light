import {Dimensions, Pressable, Text, View} from "react-native";
import {CircularProgressBase} from "react-native-circular-progress-indicator";
import React, {ReactNode} from "react";
import {
    HABIT_READY_CIRCLE_COLOR,
    CIRCLE_RADIUS,
    HABIT_INACTIVE_CIRCLE_COLOR,
    INACTIVE_STROKE_COLOR,
    STROKE_WIDTH
} from "./Constants";
import {useRouter} from "expo-router";
import {heightDP} from "../constants/DpScaling";

interface HabitButtonProps {
    habitName: string;
    doneAmount: number;
    toDoAmount: number;
    isActive: boolean;
    logo: ReactNode;
    setIsButtonClickable: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function HabitButton(props: HabitButtonProps) {
    const doneAmount = props.doneAmount;
    const toDoAmount = props.toDoAmount;
    const isActive = props.isActive;
    const logo = props.logo;
    const setIsButtonClickable = props.setIsButtonClickable;
    const router = useRouter();


    return (
        <Pressable
            style={{display: "flex", gap: heightDP("2%"), alignItems: 'center', justifyContent: 'center'}}
            onPress={() => {
                setIsButtonClickable(false);
                router.replace(`/${props.habitName}`)
            }}
            disabled={doneAmount / toDoAmount === 1 || !isActive}
        >
            <CircularProgressBase
                value={doneAmount + 0.00001}
                activeStrokeWidth={STROKE_WIDTH}
                inActiveStrokeWidth={STROKE_WIDTH}
                inActiveStrokeColor={INACTIVE_STROKE_COLOR}
                activeStrokeColor={getColorByPercentage(doneAmount / toDoAmount)}
                circleBackgroundColor={
                    doneAmount / toDoAmount === 1 ? "#98FB98" :
                        isActive ? HABIT_READY_CIRCLE_COLOR : HABIT_INACTIVE_CIRCLE_COLOR
                }
                radius={CIRCLE_RADIUS}
                maxValue={toDoAmount}
            />
            {logo}
            <Text style={{
                position: "absolute",
                top: heightDP("16%"),
                fontSize: heightDP("3.5%"),
                fontWeight: "bold"
            }}>{doneAmount + "/" + toDoAmount}</Text>
        </Pressable>
    );
}

function getColorByPercentage(percentage: number) {
    let color = '';

    switch (Math.floor(percentage * 10)) {
        case 0:
            color = '#FF0000';
            break;
        case 1:
            color = '#FF3300';
            break;
        case 2:
            color = '#ff6600';
            break;
        case 3:
            color = '#ff9900';
            break;
        case 4:
            color = '#FFCC00';
            break;
        case 5:
            color = '#FFFF00';
            break;
        case 6:
            color = '#ccff00';
            break;
        case 7:
            color = '#99ff00';
            break;
        case 8:
            color = '#66ff00';
            break;
        case 9:
            color = '#33ff00';
            break;
        case 10:
            color = '#00FF00';
            break;
        default:
            color = '#FF0000';
            break;
    }

    return color;
}
