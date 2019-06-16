import React, { useEffect } from 'react';

type TetrisShapeProps = {
    boardWidth: number,
}

type TetrisShapeState = {
    activeTileX: number,
    activeTileY: number,
}

class TetrisShape extends React.Component {
    constructor(props: any) {
        const { boardWidth } = props;

        const activeTileX = this._setStartingColumnWhereTilesBegin(boardWidth);

    }

    // useEffect(() => {
    //     function update(command: String) {
    //         let xAdd = 0;
    //         let yAdd = 0;
    //         let rotateAdd = 0;

    //         // If tile should move to the left
    //         // set xAdd to -1
    //         if (command === 'left') {
    //             xAdd = -1
    //         }

    //         // If tile should move to the right
    //         // set xAdd to 1
    //         if (command === 'right') {
    //             xAdd = 1
    //         }

    //         // If tile should be rotated
    //         // set rotateAdd to 1
    //         if (command === 'rotate') {
    //             rotateAdd = 1
    //         }

    //         // If tile should fall faster
    //         // set yAdd to 1
    //         if (command === 'down') {
    //             yAdd = 1
    //         }

    //         // Get current x/y coordinates, active tile, rotate and all tiles
    //         let x = activeTileX;
    //         let y = activeTileY;
    //         let rotate = tileRotate;
    //     }
    // });

    _setStartingColumnWhereTilesBegin = (boardWidth: number) => {
        return Math.floor(boardWidth / 2);
    }
}