import React, {useState} from 'react';
import {StyleSheet, View, Text, TextInput, Button} from 'react-native';
import {useAuth} from "../context/AuthContext";
import {Redirect, useRouter} from "expo-router";

const RegisterForm = () => {
    const {onRegister, authState} = useAuth();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('')
    const [profession, setProfession] = useState('')
    const router = useRouter();

    const register = async () => {
        const result = await onRegister!(name, password, age, gender, profession, true);
        if (result instanceof Error) {
            alert("User already exists")
        } else {
            return router.replace("/login")
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
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
            <TextInput
                style={styles.input}
                placeholder="Alter"
                onChangeText={(text) => setAge(text)}
                value={age}
            />
            <TextInput
                style={styles.input}
                placeholder="Geschlecht (M/W/D)"
                onChangeText={(text) => setGender(text)}
                value={gender}
            />
            <TextInput
                style={styles.input}
                placeholder="Beruf (Student, ...)"
                onChangeText={(text) => setProfession(text)}
                value={profession}
            />
            <Button
                title="Register"
                disabled={!name || !password || !age || !gender || !profession}
                onPress={register}
            />
            <Text onPress={() => router.replace("/login")}>Already registered? Click here to login</Text>
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

export default RegisterForm;
