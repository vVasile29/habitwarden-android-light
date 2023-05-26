import {StyleSheet, Text, View} from "react-native";
import React, {ReactNode} from "react";

interface CircularProgressSkeletonProps {
    logo: ReactNode,
    CIRCLE_RADIUS: number,
    CIRCLE_COLOR: string,
    STROKE_WIDTH: number,
    STROKE_COLOR: string,
}

export default function CircularProgressSkeleton(props: CircularProgressSkeletonProps) {
    const logo = props.logo;
    const CIRCLE_RADIUS = props.CIRCLE_RADIUS;
    const STROKE_WIDTH = props.STROKE_WIDTH - 2; // somehow needs to be 2px less
    const STROKE_COLOR = props.STROKE_COLOR;
    const CIRCLE_COLOR = props.CIRCLE_COLOR;

    const INNER_CIRCLE_RADIUS = CIRCLE_RADIUS - STROKE_WIDTH;

    const styles = StyleSheet.create({
        stroke: {
            display: "flex",
            width: 2 * CIRCLE_RADIUS,
            height: 2 * CIRCLE_RADIUS,
            backgroundColor: STROKE_COLOR,
            borderRadius: CIRCLE_RADIUS,
        },
        circle: {
            display: "flex",
            position: "absolute",
            width: 2 * INNER_CIRCLE_RADIUS,
            height: 2 * INNER_CIRCLE_RADIUS,
            backgroundColor: CIRCLE_COLOR,
            borderRadius: INNER_CIRCLE_RADIUS,
        }
    });

    return (
        <View style={{display: "flex", gap: 20, alignItems: 'center', justifyContent: 'center'}}>
            <View style={styles.stroke}/>
            <View style={styles.circle}/>
            {props.logo}
            <Text style={{
                position: "absolute",
                top: 140,
                fontSize: 28,
                fontWeight: "bold"
            }}>{" / "}</Text>
        </View>
    );

}


