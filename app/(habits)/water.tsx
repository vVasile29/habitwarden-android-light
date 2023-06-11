import {View, Button, Text, Pressable, Alert} from 'react-native';
import React, {useState} from "react";
import moment from 'moment';
import 'moment/locale/de';
import {useRouter} from "expo-router";
import {useFetchPointsPerTask, useSaveData, WATER} from "../(tabs)/habits";
import {Habit} from "../../components/HabitSummary";
import WaterLogo from "../../assets/svg/WaterLogo";
import HabitScreenWithPopups from "../../components/HabitScreenWithPopups";
import {heightDP} from "../../constants/DpScaling";

export default function Water() {
    const [liePopupVisible, setLiePopupVisible] = useState(false);
    const [losePointsWarningPopupVisible, setLosePointsWarningPopupVisible] = useState(false);
    const [shameCheckbox, setShameCheckbox] = useState(false);
    const [losePointsPopupVisible, setLosePointsPopupVisible] = useState(false);
    const [showPointsPopupVisible, setShowPointsPopupVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true)
    const [habit, setHabit] = useState<Habit>();
    const [lieOnDone, setLieOnDone] = useState(false);
    const [wantedToQuit, setWantedToQuit] = useState(false);
    const router = useRouter();

    const habitPromise = useFetchPointsPerTask(WATER);
    habitPromise.then(habit => setHabit(habit));
    const saveData = useSaveData();

    async function handlePressDone() {
        setIsPlaying(prev => !prev)
        setLiePopupVisible(true);
    }

    async function handlePressYesOnDone() {
        setLiePopupVisible(false)
        await saveData(habit?.name!, true, lieOnDone, wantedToQuit, habit?.pointsPerTask!);
        setShowPointsPopupVisible(true);
    }

    async function handlePressNotDone() {
        await saveData(WATER, false, lieOnDone, wantedToQuit, habit?.pointsPerTask!);
        router.replace("/habits");
    }

    async function handleShowPointsClose(){
        setShowPointsPopupVisible(false);
        router.replace("/habits");
    }

    return (
        <HabitScreenWithPopups
            isPlaying={isPlaying}
            duration={35}
            setLiePopupVisible={setLiePopupVisible}
            taskDescription={"Bitte trinke " + habit?.amountPerTask! + "ml Wasser!"}
            logo={<WaterLogo position={"relative"} width={heightDP("33%")} height={heightDP("33%")}/>}
            liePopupVisible={liePopupVisible}
            handlePressYesOnDone={handlePressYesOnDone}
            setLieOnDone={setLieOnDone}
            losePointsWarningPopupVisible={losePointsWarningPopupVisible}
            handlePressDone={handlePressDone}
            fakeUserCancellationDescription={
                "Es ist doch nur ein Glas Wasser?\n" +
                "Wieso würdest du jetzt aufgeben wollen, \n" +
                "hier geben im Durchschnitt nur " + habit?.fakeUserCancellationRate! * 100 + "% auf?"
            }
            shameCheckbox={shameCheckbox}
            setShameCheckbox={setShameCheckbox}
            setLosePointsWarningPopupVisible={setLosePointsWarningPopupVisible}
            setLosePointsPopupVisible={setLosePointsPopupVisible}
            setIsPlaying={setIsPlaying}
            losePointsPopupVisible={losePointsPopupVisible}
            pointsPerTask={habit?.pointsPerTask!}
            handlePressNotDone={handlePressNotDone}
            setWantedToQuit={setWantedToQuit}
            showPointsPopupVisible={showPointsPopupVisible}
            handleShowPointsClose={handleShowPointsClose}
        />
    );
}
