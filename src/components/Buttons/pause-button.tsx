import React from 'react';


type pauseProps = {
    click:Function,
    isPaused:boolean
};

const PauseButton = (props: { click:Function, isPaused:boolean }) => {
    const {click, isPaused} = props;


    return <button
        className="btn"
        onClick={() => click(isPaused)}
    >
        {isPaused ? 'Resume' : 'Pause'}
    </button>
};

export default PauseButton;