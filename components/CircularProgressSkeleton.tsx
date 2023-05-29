import {StyleSheet, Text, View} from "react-native";
import React, {ReactNode} from "react";
import {CircularProgressBase} from "react-native-circular-progress-indicator";
import {CIRCLE_RADIUS, HABIT_INACTIVE_CIRCLE_COLOR, INACTIVE_STROKE_COLOR, STROKE_WIDTH} from "./Constants";

interface CircularProgressSkeletonProps {
    logo: ReactNode,
}

export default function CircularProgressSkeleton(props: CircularProgressSkeletonProps) {
    const logo = props.logo;

    return (
        <View style={{display: "flex", gap: 20, alignItems: 'center', justifyContent: 'center'}}>
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
                top: 140,
                fontSize: 28,
                fontWeight: "bold"
            }}>{" / "}</Text>
        </View>
    );

}


