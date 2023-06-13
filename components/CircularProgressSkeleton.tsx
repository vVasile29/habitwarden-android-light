import {StyleSheet, Text, View} from "react-native";
import React, {ReactNode} from "react";
import {CircularProgressBase} from "react-native-circular-progress-indicator";
import {CIRCLE_RADIUS, HABIT_INACTIVE_CIRCLE_COLOR, INACTIVE_STROKE_COLOR, STROKE_WIDTH} from "./Constants";
import {heightDP} from "../constants/DpScaling";

interface CircularProgressSkeletonProps {
    logo: ReactNode,
}

export default function CircularProgressSkeleton(props: CircularProgressSkeletonProps) {
    const logo = props.logo;

    return (
        <View style={{display: "flex", gap: heightDP("2%"), alignItems: 'center', justifyContent: 'center'}}>
            <CircularProgressBase
                value={0}
                activeStrokeWidth={STROKE_WIDTH}
                inActiveStrokeWidth={STROKE_WIDTH}
                inActiveStrokeColor={INACTIVE_STROKE_COLOR}
                circleBackgroundColor={HABIT_INACTIVE_CIRCLE_COLOR}
                radius={CIRCLE_RADIUS}
                maxValue={1}
            />
            {logo}
            <Text style={{
                position: "absolute",
                top: heightDP("16%"),
                fontSize: heightDP("3.5%"),
                fontWeight: "bold"
            }}>{" / "}</Text>
        </View>
    );

}


