import {Button, Platform, StyleSheet, Text} from 'react-native';
import {View} from "../../components/Themed";
import React, {useEffect, useState} from "react";
import {Calendar, LocaleConfig} from "react-native-calendars";
import {MarkedDates} from "react-native-calendars/src/types";
import moment from "moment";
import {API, USER_KEY} from "../context/AuthContext";
import {Habit, HabitDoneData} from "../../components/HabitSummary";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {heightDP, widthDP} from "../../constants/DpScaling";
import {MEDITATION, SQUATS, WATER} from "./habits";
import {VictoryBar, VictoryChart, VictoryTheme} from "victory-native";

interface UserHabitData {
    userName: string;
    habitDoneData: HabitDoneData[];
}

type UserHabitDataWithDate = {
    date: string,
    userHabitData: UserHabitData
}

export default function Statistics() {
    LocaleConfig.locales['de'] = {
        monthNames: [
            'Januar',
            'Februar',
            'März',
            'April',
            'Mai',
            'Juni',
            'Juli',
            'August',
            'September',
            'Oktober',
            'November',
            'Dezember'
        ],
        monthNamesShort: [
            'Jan.',
            'Feb.',
            'März',
            'Apr.',
            'Mai',
            'Juni',
            'Juli',
            'Aug.',
            'Sept.',
            'Okt.',
            'Nov.',
            'Dez.'
        ],
        dayNames: [
            'Sonntag',
            'Montag',
            'Dienstag',
            'Mittwoch',
            'Donnerstag',
            'Freitag',
            'Samstag'
        ],
        dayNamesShort: ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.']
    };
    LocaleConfig.defaultLocale = 'de';

    const [loading, setLoading] = useState(true);
    const [markedDates, setMarkedDates] = useState<MarkedDates>({});
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
    const [completed, setCompleted] = useState<UserHabitDataWithDate[]>();
    const [incompleted, setIncompleted] = useState<UserHabitDataWithDate[]>();
    const [barChartWater, setBarChartWater] = useState(0);
    const [barChartSquats, setBarChartSquats] = useState(0);
    const [barChartMeditation, setBarChartMeditation] = useState(0);
    const [waterToDoAmount, setWaterToDoAmount] = useState(0);
    const [squatsToDoAmount, setSquatsToDoAmount] = useState(0);
    const [meditationToDoAmount, setMeditationToDoAmount] = useState(0);

    const getAllUserHabitDataWithDateCompleted = async (userName: string): Promise<UserHabitDataWithDate[]> => {
        const response = await axios.get(`${API}/dateData/getAllUserHabitDataWithDateCompleted/${userName}`);
        return response.data;
    };
    const getAllUserHabitDataWithDateIncompleted = async (userName: string): Promise<UserHabitDataWithDate[]> => {
        const response = await axios.get(`${API}/dateData/getAllUserHabitDataWithDateIncompleted/${userName}`);
        return response.data;
    };

    const getWater = async () => {
        const waterResponse = await axios.get<Habit>(`${API}/habits/getHabit/${WATER}`);
        return waterResponse.data;
    }

    const getSquats = async () => {
        const waterResponse = await axios.get<Habit>(`${API}/habits/getHabit/${SQUATS}`);
        return waterResponse.data;
    }

    const getMeditation = async () => {
        const waterResponse = await axios.get<Habit>(`${API}/habits/getHabit/${MEDITATION}`);
        return waterResponse.data;
    }

    useEffect(() => {
        async function getAllUserData() {
            const userName = await SecureStore.getItemAsync(USER_KEY);

            const water = await getWater();
            setWaterToDoAmount(water.timesPerDay);

            const squats = await getSquats();
            setSquatsToDoAmount(squats.timesPerDay);

            const meditation = await getMeditation();
            setMeditationToDoAmount(meditation.timesPerDay);

            const completed = await getAllUserHabitDataWithDateCompleted(userName!);
            setCompleted(completed);

            const incompleted = await getAllUserHabitDataWithDateIncompleted(userName!);
            setIncompleted(incompleted);

            const marked = markAllDates(completed, incompleted);
            setMarkedDates(marked);

            loadSelectedDate(completed, incompleted);

            setLoading(false);
        }

        getAllUserData();
    }, []);

    useEffect(() => {
        if (completed && incompleted) {
            loadSelectedDate(completed, incompleted);
        }
    }, [selectedDate])

    function markAllDates(completed: UserHabitDataWithDate[], incompleted: UserHabitDataWithDate[]) {
        const marked: MarkedDates = {};
        mark(completed.map(dataWithDate => dataWithDate.date), "#82c91e");
        mark(incompleted.map(dataWithDate => dataWithDate.date), "yellow");

        function mark(dates: string[], color: string) {
            dates.forEach(date => {
                marked[moment(date).format('YYYY-MM-DD')] = {
                    customStyles: {
                        container: {
                            backgroundColor: color,
                            opacity: 0.5,
                        },
                        text: {
                            color: 'black',
                            fontWeight: 'bold',
                        },
                    },
                };
            });
        }

        // remove marking for today
        marked[moment().format("YYYY-MM-DD")] = {};
        return marked;
    }

    function loadSelectedDate(completed: UserHabitDataWithDate[], incompleted: UserHabitDataWithDate[]) {
        // TODO find a way to not have to mark all dates again for single change
        // something like save old date marking and reassign only new selected date, revert old back to old

        const marked = markAllDates(completed, incompleted);
        marked[selectedDate] = {
            ...marked[selectedDate],
            customStyles: {
                ...marked[selectedDate]?.customStyles,
                container: {
                    ...marked[selectedDate]?.customStyles?.container,
                    opacity: 1,
                    borderColor: "black",
                    borderWidth: 1,
                },
            },
        };
        setMarkedDates(marked);

        const allUserHabitDataWithDate = [...completed, ...incompleted];
        const userHabitDataWithSelectedDate = allUserHabitDataWithDate
            .find(userHabitDataWithDate => {
                return selectedDate === moment(userHabitDataWithDate.date).format("YYYY-MM-DD");
            });

        setBarChartWater((userHabitDataWithSelectedDate?.userHabitData.habitDoneData
            .find(habitDoneData => habitDoneData.habitName === WATER)?.habitDoneDataInfo
            .filter(habitData => habitData.done).length) || 0);
        setBarChartSquats((userHabitDataWithSelectedDate?.userHabitData.habitDoneData
            .find(habitDoneData => habitDoneData.habitName === SQUATS)?.habitDoneDataInfo
            .filter(habitData => habitData.done).length) || 0);
        setBarChartMeditation((userHabitDataWithSelectedDate?.userHabitData.habitDoneData
            .find(habitDoneData => habitDoneData.habitName === MEDITATION)?.habitDoneDataInfo
            .filter(habitData => habitData.done).length) || 0);
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.flexContainer}>
                    <View></View>
                    <View style={{position: "absolute", zIndex: 1}}>
                        <Calendar
                            style={{
                                width: widthDP("100%"),
                            }}
                        />
                    </View>
                    <View>
                        <VictoryChart
                            theme={VictoryTheme.material}
                            domainPadding={20}
                            width={widthDP("100%")}
                            height={heightDP("37%")}
                        >
                            <VictoryBar
                                key={moment().format()}
                                data={[
                                    {x: "Wasser", y: 0},
                                    {x: "Kniebeugen", y: 0},
                                    {x: "Meditation", y: 0}
                                ]}
                                labels={[barChartWater, barChartSquats, barChartMeditation]}
                                categories={{
                                    x: ["Wasser", "Kniebeugen", "Meditation"],
                                    y: ["10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"]
                                }}
                                alignment="middle"
                            />
                        </VictoryChart>
                    </View>
                </View>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <View style={styles.flexContainer}>
                    <View></View>
                    <View style={{position: "absolute", zIndex: 1}}>
                        <Calendar
                            theme={{
                                // @ts-ignore
                                'stylesheet.day.basic': {
                                    'base': {
                                        width: heightDP("4%"),
                                        height: heightDP("4%")
                                    },
                                    'text': {fontSize: widthDP("5%"), textAlign: "center"}
                                },
                            }}
                            style={{
                                width: widthDP("100%"),
                            }}
                            markingType={'custom'}
                            markedDates={markedDates}
                            onDayPress={date => setSelectedDate(date.dateString)}
                            date={selectedDate}
                        />
                    </View>
                    <View>
                        <VictoryChart
                            theme={VictoryTheme.material}
                            domainPadding={20}
                            width={widthDP("100%")}
                            height={heightDP("37%")}
                            style={{}}
                        >
                            <VictoryBar
                                data={[
                                    {x: "Wasser", y: barChartWater / waterToDoAmount * 10},
                                    {x: "Kniebeugen", y: barChartSquats / squatsToDoAmount * 10},
                                    {x: "Meditation", y: barChartMeditation / meditationToDoAmount * 10}
                                ]}
                                labels={[barChartWater, barChartSquats, barChartMeditation]}
                                style={{
                                    data: {fill: ({datum}) => getColorByCategory(datum.x)},
                                }}
                                categories={{
                                    x: ["Wasser", "Kniebeugen", "Meditation"],
                                    y: ["10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"]
                                }}
                                alignment="middle"
                                animate={{
                                    duration: 500,
                                    onLoad: {duration: 1000}
                                }}
                            />
                        </VictoryChart>
                    </View>
                </View>
            </View>
        )
            ;

    }
}

// Function to determine the color based on category
function getColorByCategory(category: any) {
    switch (category) {
        case "Wasser":
            return "blue";
        case "Kniebeugen":
            return "gray";
        case "Meditation":
            return "orange";
        default:
            return "red";
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    flexContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: widthDP("100%"),
    },
    header: {
        fontSize: 2
    }
});