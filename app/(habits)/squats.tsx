import {Button, View} from "react-native";
import React, {useState} from "react";
import moment from 'moment';
import 'moment/locale/de';
import {useRouter} from "expo-router";
import {SQUATS, useFetchPointsPerTask, useSaveData} from "../(tabs)/habits";
import {Habit} from "../../components/HabitSummary";
import HabitScreen from "../../components/habitScreen";
import LiePopup from "../../components/Popups/LiePopup";
import LosePointsWarningPopup from "../../components/Popups/LosePointsWarningPopup";
import LosePointsPopup from "../../components/Popups/LosePointsPopup";
import SquatsLogo from "../../assets/svg/SquatsLogo";
import WaterLogo from "../../assets/svg/WaterLogo";
import HabitScreenWithPopups from "../../components/HabitScreenWithPopups";

export default function Squats() {
    const [liePopupVisible, setLiePopupVisible] = useState(false);
    const [losePointsWarningPopupVisible, setLosePointsWarningPopupVisible] = useState(false);
    const [shameCheckbox, setShameCheckbox] = useState(false);
    const [losePointsPopupVisible, setLosePointsPopupVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true)
    const [habit, setHabit] = useState<Habit>();
    const [lieOnDone, setLieOnDone] = useState(false);
    const router = useRouter();

    const habitPromise = useFetchPointsPerTask(SQUATS);
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
        await saveData(SQUATS, currentDate, false, lieOnDone, habit?.pointsPerTask!);
        router.replace("/habits");
    }

    return (
        <HabitScreenWithPopups
            isPlaying={isPlaying}
            duration={60}
            setLiePopupVisible={setLiePopupVisible}
            taskDescription={"Bitte mache " + habit?.amountPerTask! + " Kniebeugen!"}
            logo={<SquatsLogo position={"relative"} left={10} width={280} height={280}/>}
            liePopupVisible={liePopupVisible}
            handlePressYesOnDone={handlePressYesOnDone}
            setLieOnDone={setLieOnDone}
            losePointsWarningPopupVisible={losePointsWarningPopupVisible}
            handlePressDone={handlePressDone}
            fakeUserCancellationDescription={
                "Bei den paar Kniebeugen machst du schon schlapp?\n" +
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

