import {View, Button, Text, Pressable, Alert} from 'react-native';
import React, {useState} from "react";
import moment from 'moment';
import 'moment/locale/de';
import {useRouter} from "expo-router";
import {useFetchPointsPerTask, useSaveData, WATER} from "../(tabs)/habits";
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import {Habit} from "../../components/HabitSummary";
import ModalPopup from "../../components/ModalPopup";
import WaterLogo from "../../assets/svg/WaterLogo";
import {CheckBox} from "react-native-elements";
import CryBaby from "../../assets/svg/CryBaby";
import Explosion from "../../assets/svg/Explosion";
import LonelyGuy from "../../assets/svg/LonelyGuy";
import HabitScreen from "../../components/habitScreen";
import LiePopup from "../../components/Popups/LiePopup";
import LosePointsWarningPopup from "../../components/Popups/LosePointsWarningPopup";
import LosePointsPopup from "../../components/Popups/LosePointsPopup";
import HabitScreenWithPopups from "../../components/HabitScreenWithPopups";

export default function Water() {
    const [liePopupVisible, setLiePopupVisible] = useState(false);
    const [losePointsWarningPopupVisible, setLosePointsWarningPopupVisible] = useState(false);
    const [shameCheckbox, setShameCheckbox] = useState(false);
    const [losePointsPopupVisible, setLosePointsPopupVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true)
    const [habit, setHabit] = useState<Habit>();
    const [lieOnDone, setLieOnDone] = useState(false);
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
        const currentDate = moment().locale('de').format('YYYY-MM-DD');
        await saveData(habit?.name!, currentDate, true, lieOnDone, habit?.pointsPerTask!);
        router.replace("/habits");
    }

    async function handlePressNotDone() {
        const currentDate = moment().locale('de').format('YYYY-MM-DD');
        await saveData(WATER, currentDate, false, lieOnDone, habit?.pointsPerTask!);
        router.replace("/habits");
    }

    return (
        <HabitScreenWithPopups
            isPlaying={isPlaying}
            duration={35}
            setLiePopupVisible={setLiePopupVisible}
            taskDescription={"Bitte trinke " + habit?.amountPerTask! + "ml Wasser!"}
            logo={<WaterLogo position={"relative"} width={280} height={280}/>}
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
        />
    );
}
