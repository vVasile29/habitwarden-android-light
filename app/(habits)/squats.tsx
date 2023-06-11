import React, {useState} from "react";
import 'moment/locale/de';
import {useRouter} from "expo-router";
import {SQUATS, useFetchPointsPerTask, useSaveData, WATER} from "../(tabs)/habits";
import {Habit} from "../../components/HabitSummary";
import SquatsLogo from "../../assets/svg/SquatsLogo";
import {heightDP, widthDP} from "../../constants/DpScaling";
import HabitScreenWithPopups from "../../components/HabitScreenWithPopups";
import {View} from "../../components/Themed";

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
    const [cancelPopupVisible, setCancelPopupVisible] = useState(false);
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
        await saveData(SQUATS, false, lieOnDone, wantedToQuit, habit?.pointsPerTask!);
        router.replace("/habits");
    }

    async function handleShowPointsClose() {
        setShowPointsPopupVisible(false);
        router.replace("/habits");
    }

    return (
        <View style={{flex: 1, justifyContent: "center"}}>
            <HabitScreenWithPopups
                setLiePopupVisible={setLiePopupVisible}
                taskDescription={"Bitte mache " + habit?.amountPerTask! + " Kniebeugen!"}
                logo={<SquatsLogo position={"relative"} left={10} width={widthDP("100%")} height={heightDP("50%")}/>}
                liePopupVisible={liePopupVisible}
                handlePressYesOnDone={handlePressYesOnDone}
                setLieOnDone={setLieOnDone}
                setWantedToQuit={setWantedToQuit}
                handlePressDone={handlePressDone}
                pointsPerTask={habit?.pointsPerTask!}
                handlePressNotDone={handlePressNotDone}
                showPointsPopupVisible={showPointsPopupVisible}
                handleShowPointsClose={handleShowPointsClose}
                cancelPopupVisible={cancelPopupVisible}
                setCancelPopupVisible={setCancelPopupVisible}
            />
        </View>
    );
}

