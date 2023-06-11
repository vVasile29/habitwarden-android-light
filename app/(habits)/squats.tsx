import React, {useState} from "react";
import 'moment/locale/de';
import {useRouter} from "expo-router";
import {SQUATS, useFetchPointsPerTask, useSaveData, WATER} from "../(tabs)/habits";
import {Habit} from "../../components/HabitSummary";
import SquatsLogo from "../../assets/svg/SquatsLogo";
import HabitScreenWithPopups from "../../components/HabitScreenWithPopups";
import {heightDP, widthDP} from "../../constants/DpScaling";

export default function Squats() {
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

    const habitPromise = useFetchPointsPerTask(SQUATS);
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
            duration={60}
            setLiePopupVisible={setLiePopupVisible}
            taskDescription={"Bitte mache " + habit?.amountPerTask! + " Kniebeugen!"}
            logo={<SquatsLogo position={"relative"} left={10} width={widthDP("100%")} height={heightDP("33%")}/>}
            liePopupVisible={liePopupVisible}
            handlePressYesOnDone={handlePressYesOnDone}
            setLieOnDone={setLieOnDone}
            setWantedToQuit={setWantedToQuit}
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
            showPointsPopupVisible={showPointsPopupVisible}
            handleShowPointsClose={handleShowPointsClose}
        />
    );
}

