import {Button, View} from "react-native";
import React, {useState} from "react";
import moment from 'moment';
import 'moment/locale/de';
import {useRouter} from "expo-router";
import {MEDITATION, useFetchPointsPerTask, useSaveData, WATER} from "../(tabs)/habits";
import {Habit} from "../../components/HabitSummary";
import MeditationLogo from "../../assets/svg/MeditationLogo";
import HabitScreenWithPopups from "../../components/HabitScreenWithPopups";
import {heightDP, widthDP} from "../../constants/DpScaling";

export default function Meditation() {
    const [liePopupVisible, setLiePopupVisible] = useState(false);
    const [losePointsWarningPopupVisible, setLosePointsWarningPopupVisible] = useState(false);
    const [shameCheckbox, setShameCheckbox] = useState(false);
    const [losePointsPopupVisible, setLosePointsPopupVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true)
    const [habit, setHabit] = useState<Habit>();
    const [lieOnDone, setLieOnDone] = useState(false);
    const router = useRouter();

    const habitPromise = useFetchPointsPerTask(MEDITATION);
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
        await saveData(MEDITATION, currentDate, false, lieOnDone, habit?.pointsPerTask!);
        router.replace("/habits");
    }

    return (
        <HabitScreenWithPopups
            isPlaying={isPlaying}
            duration={60}
            setLiePopupVisible={setLiePopupVisible}
            taskDescription={"Bitte meditiere für " + habit?.amountPerTask! + " Minute!"}
            logo={<MeditationLogo position={"relative"} width={widthDP("100%")} height={heightDP("33%")}/>}
            liePopupVisible={liePopupVisible}
            handlePressYesOnDone={handlePressYesOnDone}
            setLieOnDone={setLieOnDone}
            losePointsWarningPopupVisible={losePointsWarningPopupVisible}
            handlePressDone={handlePressDone}
            fakeUserCancellationDescription={
                "Wer hat denn bitte etwas gegen Entspannung?\n" +
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