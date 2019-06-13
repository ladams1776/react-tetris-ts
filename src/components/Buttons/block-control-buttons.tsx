import React from 'react';

type BlockControlButtonsProps = {
    click:Function
}
const BlockControlButtons = (props:{click:Function}) => {
    let { click } = props;

    return <div className='tetris__block-controls'>
            <button className="btn" onClick={() => click('left')}>Left</button>

            <button className="btn" onClick={() => click('down')}>Down</button>

            <button className="btn" onClick={() => click('right')}>Right</button>

            <button className="btn" onClick={() => click('rotate')}>Rotate</button>
        </div>
};

export default BlockControlButtons;