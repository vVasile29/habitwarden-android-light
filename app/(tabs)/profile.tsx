import {Button, StyleSheet} from 'react-native';

import { Text, View } from '../../components/Themed';
import React, {useEffect} from "react";
import {useAuth} from "../context/AuthContext";

export default function Profile() {
    const {onTest} = useAuth();
    const {onLogout, authState} = useAuth();

    const logout = async () => {
        await onLogout!();
    }

    const test = async () => {
        const result = await onTest!();
        if (result && result.error) {
            alert(result)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Button
                title={'logout'}
                onPress={logout}
            />
            <Button
                title={'TestAuth'}
                onPress={test}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
