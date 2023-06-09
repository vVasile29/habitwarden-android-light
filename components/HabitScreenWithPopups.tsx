import HabitScreen from "./habitScreen";
import LiePopup from "./Popups/LiePopup";
import LosePointsWarningPopup from "./Popups/LosePointsWarningPopup";
import LosePointsPopup from "./Popups/LosePointsPopup";
import React from "react";

interface HabitScreenWithPopupProps {
    isPlaying: boolean;
    duration: number;
    setLiePopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
    taskDescription: string;
    handlePressDone: () => Promise<void>;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    setLosePointsWarningPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
    logo: any;
    liePopupVisible: boolean;
    handlePressYesOnDone: () => Promise<void>;
    setLieOnDone: React.Dispatch<React.SetStateAction<boolean>>;
    losePointsWarningPopupVisible: boolean;
    pointsPerTask: number;
    fakeUserCancellationDescription: string;
    shameCheckbox: boolean;
    setShameCheckbox: React.Dispatch<React.SetStateAction<boolean>>;
    setLosePointsPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
    losePointsPopupVisible: boolean;
    handlePressNotDone: () => Promise<void>;
}

export default function HabitScreenWithPopups(props: HabitScreenWithPopupProps){
    return (
        <>
            <HabitScreen
                isPlaying={props.isPlaying}
                duration={props.duration}
                setLiePopupVisible={props.setLiePopupVisible}
                taskDescription={props.taskDescription}
                handlePressDone={props.handlePressDone}
                setIsPlaying={props.setIsPlaying}
                setLosePointsWarningPopupVisible={props.setLosePointsWarningPopupVisible}
                logo={props.logo}
            />
            <LiePopup
                liePopupVisible={props.liePopupVisible}
                handlePressYesOnDone={props.handlePressYesOnDone}
                setLieOnDone={props.setLieOnDone}
                setLiePopupVisible={props.setLiePopupVisible}
                setIsPlaying={props.setIsPlaying}
            />
            <LosePointsWarningPopup
                losePointsWarningPopupVisible={props.losePointsWarningPopupVisible}
                pointsPerTask={props.pointsPerTask}
                fakeUserCancellationDescription={props.fakeUserCancellationDescription}
                shameCheckbox={props.shameCheckbox}
                setShameCheckbox={props.setShameCheckbox}
                setLosePointsWarningPopupVisible={props.setLosePointsWarningPopupVisible}
                setLosePointsPopupVisible={props.setLosePointsPopupVisible}
                setIsPlaying={props.setIsPlaying}
            />
            <LosePointsPopup
                losePointsPopupVisible={props.losePointsPopupVisible}
                pointsPerTask={props.pointsPerTask}
                handlePressNotDone={props.handlePressNotDone}
            />
        </>
    );
}