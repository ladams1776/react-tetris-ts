import React, {useEffect} from 'react';

const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;

type BlockControlButtonsProps = {
    click:Function,
}

const BlockControlButtons = (props:{click:Function}) => {
    let { click } = props;

    useEffect(() => {
        function handleDirectionKeyPress(event: any) {
            switch (event.keyCode) {
                case LEFT_KEY:
                    click('left');
                    break;
                case UP_KEY:
                    click('rotate');
                    break;
                case RIGHT_KEY:
                    click('right');
                    break;
                case DOWN_KEY:
                    click('down');
                    break;
            }
        }

        document.addEventListener("keydown", handleDirectionKeyPress, false);
        return () => document.removeEventListener("keydown", handleDirectionKeyPress, false);

    });

    return <div className='tetris__block-controls'>
            <button className="btn" onClick={() => click('left')}>Left</button>

            <button className="btn" onClick={() => click('down')}>Down</button>

            <button className="btn" onClick={() => click('right')}>Right</button>

            <button className="btn" onClick={() => click('rotate')}>Rotate</button>
        </div>
};

export default BlockControlButtons;