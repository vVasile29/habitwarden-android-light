import HabitScreenWithTimer from "./habitScreenWithTimer";
import LiePopup from "./Popups/LiePopup";
import CancelPopup from "./Popups/CancelPopup";
import React from "react";
import ShowPointsPopup from "./Popups/ShowPointsPopup";

interface HabitScreenTimerWithPopupProps {
    isPlaying: boolean;
    duration: number;
    setLiePopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
    taskDescription: string;
    handlePressDone: () => Promise<void>;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
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
}

export default function HabitScreenTimerWithPopups(props: HabitScreenTimerWithPopupProps) {
    return (
        <>
            <HabitScreenWithTimer
                isPlaying={props.isPlaying}
                duration={props.duration}
                setLiePopupVisible={props.setLiePopupVisible}
                taskDescription={props.taskDescription}
                handlePressDone={props.handlePressDone}
                setIsPlaying={props.setIsPlaying}
                setWantedToQuit={props.setWantedToQuit}
                logo={props.logo}
                setCancelPopupVisible={props.setCancelPopupVisible}
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
                handlePressNotDone={props.handlePressNotDone}
                setCancelPopupVisible={props.setCancelPopupVisible}
                setIsPlaying={props.setIsPlaying}
            />
            <ShowPointsPopup
                showPointsPopupVisible={props.showPointsPopupVisible}
                pointsPerTask={props.pointsPerTask}
                handleClose={props.handleShowPointsClose}
            />
        </>
    );
}