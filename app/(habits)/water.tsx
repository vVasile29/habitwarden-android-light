import React, {useState} from "react";
import 'moment/locale/de';
import {useRouter} from "expo-router";
import {useFetchPointsPerTask, useSaveData, WATER} from "../(tabs)/habits";
import {Habit} from "../../components/HabitSummary";
import WaterLogo from "../../assets/svg/WaterLogo";
import {heightDP} from "../../constants/DpScaling";
import HabitScreenWithPopups from "../../components/HabitScreenWithPopups";
import {View} from "../../components/Themed";

export default function Water() {
    const [liePopupVisible, setLiePopupVisible] = useState(false);
    const [showPointsPopupVisible, setShowPointsPopupVisible] = useState(false);
    const [habit, setHabit] = useState<Habit>();
    const [lieOnDone, setLieOnDone] = useState(false);
    const [wantedToQuit, setWantedToQuit] = useState(false);
    const [cancelPopupVisible, setCancelPopupVisible] = useState(false);
    const [habitScreenButtonsDisabled, setHabitScreenButtonsDisabled] = useState(false);
    const router = useRouter();

    const habitPromise = useFetchPointsPerTask(WATER);
    habitPromise.then(habit => setHabit(habit));
    const saveData = useSaveData();

    async function handlePressDone() {
        setLiePopupVisible(true);
    }

    async function handlePressYesOnDone() {
        setHabitScreenButtonsDisabled(true);
        setLiePopupVisible(false)
        await saveData(habit?.name!, true, lieOnDone, wantedToQuit, habit?.pointsPerTask!);
        setShowPointsPopupVisible(true);
    }

    async function handlePressNotDone() {
        setHabitScreenButtonsDisabled(true);
        await saveData(WATER, false, lieOnDone, wantedToQuit, habit?.pointsPerTask!);
        router.replace("/habits");
    }

    async function handleShowPointsClose() {
        setShowPointsPopupVisible(false);
        router.replace("/habits");
    }

    return (
        <View style={{flex: 1, justifyContent: "center"}}>
            <HabitScreenWithPopups
                logo={<WaterLogo position={"relative"} width={heightDP("50%")} height={heightDP("50%")}/>}
                taskDescription={"Bitte trinke " + habit?.amountPerTask! + "ml Wasser!"}
                pointsPerTask={habit?.pointsPerTask!}
                liePopupVisible={liePopupVisible}
                setLiePopupVisible={setLiePopupVisible}
                handlePressDone={handlePressDone}
                handlePressYesOnDone={handlePressYesOnDone}
                handlePressNotDone={handlePressNotDone}
                setLieOnDone={setLieOnDone}
                setWantedToQuit={setWantedToQuit}
                showPointsPopupVisible={showPointsPopupVisible}
                handleShowPointsClose={handleShowPointsClose}
                cancelPopupVisible={cancelPopupVisible}
                setCancelPopupVisible={setCancelPopupVisible}
                habitScreenButtonsDisabled={habitScreenButtonsDisabled}
            />
        </View>
    );
}
