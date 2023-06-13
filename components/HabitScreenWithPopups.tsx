import CancelPopup from "./Popups/CancelPopup";
import React from "react";
import ShowPointsPopup from "./Popups/ShowPointsPopup";
import HabitScreen from "./HabitScreen";
import LiePopup from "./Popups/LiePopup";

interface HabitScreenWithPopupProps {
    setLiePopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
    taskDescription: string;
    handlePressDone: () => Promise<void>;
    logo: any;
    liePopupVisible: boolean;
    handlePressYesOnDone: () => Promise<void>;
    setLieOnDone: React.Dispatch<React.SetStateAction<boolean>>;
    setWantedToQuit: React.Dispatch<React.SetStateAction<boolean>>;
    pointsPerTask: number;
    handlePressNotDone: () => Promise<void>;
    showPointsPopupVisible: boolean;
    handleShowPointsClose: () => Promise<void>;
    cancelPopupVisible: boolean;
    setCancelPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
    habitScreenButtonsDisabled: boolean;
}

export default function HabitScreenWithPopups(props: HabitScreenWithPopupProps) {
    return (
        <>
            <HabitScreen
                setLiePopupVisible={props.setLiePopupVisible}
                taskDescription={props.taskDescription}
                handlePressDone={props.handlePressDone}
                setWantedToQuit={props.setWantedToQuit}
                logo={props.logo}
                setCancelPopupVisible={props.setCancelPopupVisible}
                habitScreenButtonsDisabled={props.habitScreenButtonsDisabled}
            />
            <LiePopup
                liePopupVisible={props.liePopupVisible}
                handlePressYesOnDone={props.handlePressYesOnDone}
                setLieOnDone={props.setLieOnDone}
                setLiePopupVisible={props.setLiePopupVisible}
                setCancelPopupVisible={props.setCancelPopupVisible}
            />
            <CancelPopup
                cancelPopupVisible={props.cancelPopupVisible}
                setCancelPopupVisible={props.setCancelPopupVisible}
                handlePressNotDone={props.handlePressNotDone}
            />
            <ShowPointsPopup
                showPointsPopupVisible={props.showPointsPopupVisible}
                pointsPerTask={props.pointsPerTask}
                handleClose={props.handleShowPointsClose}
            />
        </>
    );
}
