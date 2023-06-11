import React, {useState} from "react";
import moment from 'moment';
import 'moment/locale/de';
import {useRouter} from "expo-router";
import {MEDITATION, useFetchPointsPerTask, useSaveData, WATER} from "../(tabs)/habits";
import {Habit} from "../../components/HabitSummary";
import MeditationLogo from "../../assets/svg/MeditationLogo";
import HabitScreenTimerWithPopups from "../../components/HabitScreenTimerWithPopups";
import {heightDP, widthDP} from "../../constants/DpScaling";

export default function Meditation() {
    const [liePopupVisible, setLiePopupVisible] = useState(false);
    const [losePointsWarningPopupVisible, setLosePointsWarningPopupVisible] = useState(false);
    const [shameCheckbox, setShameCheckbox] = useState(false);
    const [losePointsPopupVisible, setLosePointsPopupVisible] = useState(false);
    const [showPointsPopupVisible, setShowPointsPopupVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true)
    const [habit, setHabit] = useState<Habit>();
    const [lieOnDone, setLieOnDone] = useState(false);
    const [wantedToQuit, setWantedToQuit] = useState(false);
    const [cancelPopupVisible, setCancelPopupVisible] = useState(false);
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
        await saveData(habit?.name!, true, lieOnDone, wantedToQuit, habit?.pointsPerTask!);
        setShowPointsPopupVisible(true);
    }

    async function handlePressNotDone() {
        await saveData(MEDITATION, false, lieOnDone, wantedToQuit, habit?.pointsPerTask!);
        router.replace("/habits");
    }

    async function handleShowPointsClose() {
        setShowPointsPopupVisible(false);
        router.replace("/habits");
    }

    return (
        <HabitScreenTimerWithPopups
            isPlaying={isPlaying}
            duration={60}
            setLiePopupVisible={setLiePopupVisible}
            taskDescription={"Bitte meditiere für " + habit?.amountPerTask! + " Minute!"}
            logo={<MeditationLogo position={"relative"} width={widthDP("100%")} height={heightDP("33%")}/>}
            liePopupVisible={liePopupVisible}
            handlePressYesOnDone={handlePressYesOnDone}
            setLieOnDone={setLieOnDone}
            handlePressDone={handlePressDone}
            setIsPlaying={setIsPlaying}
            pointsPerTask={habit?.pointsPerTask!}
            handlePressNotDone={handlePressNotDone}
            setWantedToQuit={setWantedToQuit}
            showPointsPopupVisible={showPointsPopupVisible}
            handleShowPointsClose={handleShowPointsClose}
            cancelPopupVisible={cancelPopupVisible}
            setCancelPopupVisible={setCancelPopupVisible}
        />
    );
}