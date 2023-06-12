import React, {useState} from 'react';
import {StyleSheet, View, Text, TextInput, Button, Pressable} from 'react-native';
import {useAuth} from "../context/AuthContext";
import {Redirect, useRouter} from "expo-router";
import {RadioButton} from 'react-native-paper';
import {heightDP, widthDP} from "../../constants/DpScaling";

const RegisterForm = () => {
    const {onRegister, authState} = useAuth();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [profession, setProfession] = useState('');
    const [gender, setGender] = useState('');
    const [codeword, setCodeword] = useState('');
    const router = useRouter();

    const register = async () => {
        const result = await onRegister!(name.trimEnd(), password, age, gender, profession, codeword, false);
        if (result instanceof Error) {
            alert("User already exists")
        } else {
            return router.replace("/login")
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registrieren</Text>
            <View style={styles.inputContainer}>
                <View style={styles.row}>
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
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.input}
                        placeholder="Alter"
                        keyboardType="numeric"
                        onChangeText={(text) => setAge(text)}
                        value={age}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Beruf (Student, ...)"
                        onChangeText={(text) => setProfession(text)}
                        value={profession}
                    />
                </View>
            </View>
            <View style={{marginBottom: heightDP("2%")}}>
                <RadioButton.Group
                    onValueChange={(gender: string) => setGender(gender)}
                    value={gender}
                >
                    <View style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <Text>Geschlecht</Text>
                        <View style={{display: "flex", flexDirection: "row"}}>
                            <RadioButton.Item label="M" value="M"/>
                            <RadioButton.Item label="W" value="W"/>
                            <RadioButton.Item label="D" value="D"/>
                        </View>
                    </View>
                </RadioButton.Group>
            </View>
            <Text style={{
                fontSize: widthDP("5%"),
                marginBottom: heightDP("2%")
            }}>
                Codeword Generation
            </Text>
            <Text style={{fontSize: widthDP("3%")}}>
                Beispiel: {"\n"}{"\n"}
                1. Vorname Mutter (erste 2 Buchstaben): {<Text style={{fontWeight: "bold"}}>AL</Text>}ice{"\n"}
                2. Nachname Mutter (Anzahl Buchstaben): Musterfrau ({<Text
                style={{fontWeight: "bold"}}>10</Text>}){"\n"}
                3. Nachname Vater (letzte 2 Buchstaben: Musterma{<Text style={{fontWeight: "bold"}}>NN</Text>} {"\n"}
                4. Der Tag deines Geburtstages: {<Text style={{fontWeight: "bold"}}>01</Text>}.01.1970 {"\n"}{"\n"}
                Daraus ergibt sich als Codewort: {<Text style={{fontWeight: "bold"}}>AL10NN01</Text>}{"\n"}
            </Text>
            <TextInput
                style={[styles.input]}
                placeholder="Codewort"
                onChangeText={(text) => setCodeword(text)}
                value={codeword}
            />
            <Button
                title={"register"}
                disabled={!name || !password || !age || !gender || !profession || !codeword}
                onPress={register}
            />
            <Text onPress={() => router.replace("/login")}>{"\n"}Bereits registriert? Hier gehts zum Login!</Text>
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
    inputContainer: {
        marginBottom: heightDP("2%")
    },
    title: {
        fontSize: widthDP("10%"),
        marginBottom: heightDP("2%")
    },
    row: {
        flexDirection: 'row',
    },
    input: {
        height: heightDP("5%"),
        width: widthDP("40%"),
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 10,
        margin: widthDP("2%"),
    }
});

export default RegisterForm;
