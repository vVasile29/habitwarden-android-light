import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TextInput, Button} from 'react-native';
import {useAuth} from "../context/AuthContext";
import {Redirect, useRouter} from "expo-router";
import {registerForPushNotificationsAsync, triggerNotifications} from "../notificationHooks";

const LoginForm = () => {
    const {onLogin, authState} = useAuth();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const login = async () => {
        const result = await onLogin!(name, password);
        if (result instanceof Error) {
            alert("invalid credentials")
        } else {
            await registerForPushNotificationsAsync();
            await triggerNotifications();
        }
    }

    if (authState?.isAuthenticated) {
        return <Redirect href={"/habits"}/>
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                onChangeText={(text) => setName(text)}
                value={name}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
                value={password}
            />
            <Button
                title="Login"
                disabled={!name || !password}
                onPress={login}
            />
            <Text style={{textDecorationLine: "underline"}} onPress={() => router.replace("/register")}>{"\n"}Noch nicht registriert? Klicke hier!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },
    input: {
        height: 40,
        width: 200,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 10,
        marginBottom: 16,
    },
});

export default LoginForm;
