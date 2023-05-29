import {Text, View} from "react-native";
import {CircularProgressBase} from "react-native-circular-progress-indicator";
import React, {ReactNode} from "react";
import {
    HABIT_READY_CIRCLE_COLOR,
    CIRCLE_RADIUS,
    HABIT_INACTIVE_CIRCLE_COLOR,
    INACTIVE_STROKE_COLOR,
    STROKE_WIDTH
} from "./Constants";

interface HabitButtonProps {
    done: number,
    toDo: number,
    isActive: boolean,
    logo: ReactNode,
}

export default function HabitButton(props: HabitButtonProps) {
    const done = props.done;
    const toDo = props.toDo;
    const isActive = props.isActive;
    const logo = props.logo;

    return (
        <View style={{display: "flex", gap: 20, alignItems: 'center', justifyContent: 'center'}}>
            <CircularProgressBase
                value={done + 0.00001}
                activeStrokeWidth={STROKE_WIDTH}
                inActiveStrokeWidth={STROKE_WIDTH}
                inActiveStrokeColor={INACTIVE_STROKE_COLOR}
                activeStrokeColor={getColorByPercentage(done / toDo)}
                circleBackgroundColor={done / toDo === 1 ? "#98FB98" : isActive ? HABIT_READY_CIRCLE_COLOR : HABIT_INACTIVE_CIRCLE_COLOR}
                radius={CIRCLE_RADIUS}
                maxValue={toDo}
            />
            {logo}
            <Text style={{
                position: "absolute",
                top: 140,
                fontSize: 28,
                fontWeight: "bold"
            }}>{done + "/" + toDo}</Text>
        </View>
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
