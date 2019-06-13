import React from 'react';
import NewGameButton from "./new-game-button";
import PauseButton from "./pause-button";

type GameControlButtonsProps = {
    click: Function,
    newGameClick: Function,
    isPaused: boolean
}

const GameControlButtons = (props: { pauseClick: Function, newGameClick: Function, isPaused: boolean }) => {
    const { pauseClick, newGameClick, isPaused } = props;

    return <div className="tetris__game-controls">
        <NewGameButton click={newGameClick}/>
        <PauseButton click={pauseClick} isPaused={isPaused}/>
   </div>
};

export default GameControlButtons;