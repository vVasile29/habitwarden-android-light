import {StyleSheet, Text} from 'react-native';
import {View} from "../../components/Themed";
import React from "react";

export default function Statistics() {

    return (
        <View style={styles.container}>
            <Text>Statistics</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    infoContainer: {
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    infoText: {
        fontSize: 18,
        marginBottom: 8,
    },
});
