import React from 'react';

type NewGameButtonProps = {
    click: Function,
}

const NewGameButton = (props: { click: Function }) => {
    const {click} = props;
    return <button
        className="btn"
        onClick={() => click()}>
        New Game
    </button>
};

export default NewGameButton;