// Import React
import React, {Component} from 'react'
import TetrisBoard from './tetris-board'
import Tiles from "./tiles";
import BlockControlButtons from "./Buttons/block-control-buttons";
import GameControlButtons from "./Buttons/game-control-buttons";

// Define props for Tetris component
type TetrisProps = {
    boardWidth: any,
    boardHeight: any
}

// Define props for Tetris component state
type TetrisState = {
    activeTileX: number,
    activeTileY: number,
    activeTile: number,
    tileRotate: number,
    score: number,
    level: number,
    tileCount: number,
    gameOver: boolean,
    isPaused: boolean,
    field: any[],
    timerId: any,
    tiles: number[][][][]
}

class Tetris extends Component<TetrisProps, TetrisState> {
    constructor(props: any) {
        super(props);

        const {boardWidth, boardHeight} = props;

        const field: number[][] = this._generateBoardAndReturnField(boardWidth, boardHeight);

        const activeTileX = this._setStartingColumnWhereTilesBegin(boardWidth);

        this.state = {
            activeTileX,
            activeTileY: 1,
            activeTile: 1,
            tileRotate: 0,
            score: 0,
            level: 1,
            tileCount: 0,
            gameOver: false,
            isPaused: false,
            field,
            timerId: null,
            tiles: Tiles
        }
    }

    /**
     * @description
     * 1. We create the `field` double array.
     * 2. Iterate over `boardHeight`, during each iteration instantiate a new `row` array.
     * 3. Inner loop over the `boardWidth` and set each index in that `row` array to 0, to represent empty.
     * 4. push this row onto the `field` double array
     * 5. For every iteration over the boardWith we are setting an empty cell.
     * 6. Return the field
     *
     * @param boardWidth
     * @param boardHeight
     * @private
     * @memberof Tetris
     */
    _generateBoardAndReturnField = (boardWidth: number, boardHeight: number) => {
        let field = [];

        for (let y = 0; y < boardHeight; y++) {
            let row = [];

            for (let x = 0; x < boardWidth; x++) {
                row.push(0)
            }

            field.push(row)
        }

        return field;
    };


    _setStartingColumnWhereTilesBegin = (boardWidth: number) => {
        return Math.floor(boardWidth / 2);
    };

    /**
     * @description 1. Sets timer after component mounts
     * 2. Uses level (this.state.level) to determine the interval (game speed)
     * and executes _handleBoardUpdate() set to 'down' method during each interval
     *
     * @memberof Tetris
     */
    componentDidMount() {
        let timerId;

        timerId = window.setInterval(
            () => this._handleBoardUpdate('down'),
            1000 - (this.state.level * 10 > 600 ? 600 : this.state.level * 10)
        );

        this.setState({
            timerId
        })
    }

    /**
     * @description Resets the timer when component unmounts
     * @memberof Tetris
     */
    componentWillUnmount() {
        window.clearInterval(this.state.timerId)
    }

    /**
     * 1. Do nothing if game ends, or is paused
     * 2. Prepare variables for additions to x/y coordinates, current active tile and new rotation
     *
     * @description Handles board updates
     * @param {string} command
     * @memberof Tetris
     */
    _handleBoardUpdate = (command: string) => {
        const { gameOver, isPaused } = this.state;
        if (gameOver || isPaused) {
            return
        }

        let xAdd = 0;
        let yAdd = 0;
        let rotateAdd = 0;
        let tile = this.state.activeTile;

        // If tile should move to the left
        // set xAdd to -1
        if (command === 'left') {
            xAdd = -1
        }

        // If tile should move to the right
        // set xAdd to 1
        if (command === 'right') {
            xAdd = 1
        }

        // If tile should be rotated
        // set rotateAdd to 1
        if (command === 'rotate') {
            rotateAdd = 1
        }

        // If tile should fall faster
        // set yAdd to 1
        if (command === 'down') {
            yAdd = 1
        }

        // Get current x/y coordinates, active tile, rotate and all tiles
        let field = this.state.field;
        let x = this.state.activeTileX;
        let y = this.state.activeTileY;
        let rotate = this.state.tileRotate;

        const tiles = this.state.tiles;

        // Remove actual tile from field to test for new insert position
        field[y + tiles[tile][rotate][0][1]][x + tiles[tile][rotate][0][0]] = 0;
        field[y + tiles[tile][rotate][1][1]][x + tiles[tile][rotate][1][0]] = 0;
        field[y + tiles[tile][rotate][2][1]][x + tiles[tile][rotate][2][0]] = 0;
        field[y + tiles[tile][rotate][3][1]][x + tiles[tile][rotate][3][0]] = 0;

        // Test if the move can be executed on actual field
        let xAddIsValid = true;

        // Test if tile should move horizontally
        if (xAdd !== 0) {
            for (let i = 0; i <= 3; i++) {
                // Test if tile can be moved without getting outside the board
                if (
                    x + xAdd + tiles[tile][rotate][i][0] >= 0
                    && x + xAdd + tiles[tile][rotate][i][0] < this.props.boardWidth
                ) {
                    if (field[y + tiles[tile][rotate][i][1]][x + xAdd + tiles[tile][rotate][i][0]] !== 0) {
                        // Prevent the move
                        xAddIsValid = false
                    }
                } else {
                    // Prevent the move
                    xAddIsValid = false
                }
            }
        }

        // If horizontal move is valid update x variable (move the tile)
        if (xAddIsValid) {
            x += xAdd
        }

        // Try to rotate the tile
        let newRotate = rotate + rotateAdd > 3 ? 0 : rotate + rotateAdd;
        let rotateIsValid = true;

        // Test if tile should rotate
        if (rotateAdd !== 0) {
            for (let i = 0; i <= 3; i++) {
                // Test if tile can be rotated without getting outside the board
                if (
                    x + tiles[tile][newRotate][i][0] >= 0 &&
                    x + tiles[tile][newRotate][i][0] < this.props.boardWidth &&
                    y + tiles[tile][newRotate][i][1] >= 0 &&
                    y + tiles[tile][newRotate][i][1] < this.props.boardHeight
                ) {
                    // Test of tile rotation is not blocked by other tiles
                    if (
                        field[y + tiles[tile][newRotate][i][1]][
                        x + tiles[tile][newRotate][i][0]
                            ] !== 0
                    ) {
                        // Prevent rotation
                        rotateIsValid = false
                    }
                } else {
                    // Prevent rotation
                    rotateIsValid = false
                }
            }
        }

        // If rotation is valid update rotate variable (rotate the tile)
        if (rotateIsValid) {
            rotate = newRotate
        }

        // Try to speed up the fall of the tile
        let yAddIsValid = true;

        // Test if tile should fall faster
        if (yAdd !== 0) {
            for (let i = 0; i <= 3; i++) {
                // Test if tile can fall faster without getting outside the board
                if (
                    y + yAdd + tiles[tile][rotate][i][1] >= 0 &&
                    y + yAdd + tiles[tile][rotate][i][1] < this.props.boardHeight
                ) {
                    // Test if faster fall is not blocked by other tiles
                    if (
                        field[y + yAdd + tiles[tile][rotate][i][1]][
                        x + tiles[tile][rotate][i][0]
                            ] !== 0
                    ) {
                        // Prevent faster fall
                        yAddIsValid = false
                    }
                } else {
                    // Prevent faster fall
                    yAddIsValid = false
                }
            }
        }

        // If speeding up the fall is valid (move the tile down faster)
        if (yAddIsValid) {
            y += yAdd
        }

        // Render the tile at new position
        field[y + tiles[tile][rotate][0][1]][x + tiles[tile][rotate][0][0]] = tile
        field[y + tiles[tile][rotate][1][1]][x + tiles[tile][rotate][1][0]] = tile
        field[y + tiles[tile][rotate][2][1]][x + tiles[tile][rotate][2][0]] = tile
        field[y + tiles[tile][rotate][3][1]][x + tiles[tile][rotate][3][0]] = tile

        // If moving down is not possible, remove completed rows add score
        // and find next tile and check if game is over
        if (!yAddIsValid) {
            for (let row = this.props.boardHeight - 1; row >= 0; row--) {
                let isLineComplete = true

                // Check if row is completed
                for (let col = 0; col < this.props.boardWidth; col++) {
                    if (field[row][col] === 0) {
                        isLineComplete = false
                    }
                }

                // Remove completed rows
                if (isLineComplete) {
                    for (let yRowSrc = row; row > 0; row--) {
                        for (let col = 0; col < this.props.boardWidth; col++) {
                            field[row][col] = field[row - 1][col]
                        }
                    }

                    // Check if the row is the last
                    row = this.props.boardHeight
                }
            }

            // Update state - update score, update number of tiles, change level
            this.setState(prev => ({
                score: prev.score + 1 * prev.level,
                tileCount: prev.tileCount + 1,
                level: 1 + Math.floor(prev.tileCount / 10)
            }))

            // Prepare new timer
            let timerId

            // Reset the timer
            clearInterval(this.state.timerId)

            // Update new timer
            timerId = setInterval(
                () => this._handleBoardUpdate('down'),
                1000 - (this.state.level * 10 > 600 ? 600 : this.state.level * 10)
            )

            // Use new timer
            this.setState({
                timerId: timerId
            })

            // Create new tile
            tile = Math.floor(Math.random() * 7 + 1)
            x = parseInt(this.props.boardWidth) / 2
            y = 1
            rotate = 0

            // Test if game is over - test if new tile can't be placed in field
            if (
                field[y + tiles[tile][rotate][0][1]][x + tiles[tile][rotate][0][0]] !== 0 ||
                field[y + tiles[tile][rotate][1][1]][x + tiles[tile][rotate][1][0]] !== 0 ||
                field[y + tiles[tile][rotate][2][1]][x + tiles[tile][rotate][2][0]] !== 0 ||
                field[y + tiles[tile][rotate][3][1]][x + tiles[tile][rotate][3][0]] !== 0
            ) {
                // Stop the game
                this.setState({
                    gameOver: true
                })
            } else {
                // Otherwise, render new tile and continue
                field[y + tiles[tile][rotate][0][1]][x + tiles[tile][rotate][0][0]] = tile
                field[y + tiles[tile][rotate][1][1]][x + tiles[tile][rotate][1][0]] = tile
                field[y + tiles[tile][rotate][2][1]][x + tiles[tile][rotate][2][0]] = tile
                field[y + tiles[tile][rotate][3][1]][x + tiles[tile][rotate][3][0]] = tile
            }
        }

        // Update state - use new field, active x/y coordinates, rotation and activeTile
        this.setState({
            field: field,
            activeTileX: x,
            activeTileY: y,
            tileRotate: rotate,
            activeTile: tile
        })
    }

    /**
     * @description Stops and resumes the game
     * @memberof Tetris
     */
    handlePauseClick = () => {
        this.setState(prev => ({
            isPaused: !prev.isPaused
        }))
    };

    /**
     * @description Resets the game
     * @memberof Tetris
     */
    handleNewGameClick = () => {
        const {boardWidth, boardHeight} = this.props;

        const field: number[][] = this._generateBoardAndReturnField(boardWidth, boardHeight);

        const activeTileX = this._setStartingColumnWhereTilesBegin(boardWidth);

        // Initialize state with starting conditions
        this.setState({
            activeTileX,
            activeTileY: 1,
            activeTile: 2,
            tileRotate: 0,
            score: 0,
            level: 1,
            tileCount: 0,
            gameOver: false,
            field
        })
    };

    render() {
        return (
            <div className="tetris">
                {/* Tetris board */}
                <TetrisBoard
                    field={this.state.field}
                    gameOver={this.state.gameOver}
                    score={this.state.score}
                    level={this.state.level}
                    rotate={this.state.tileRotate}
                />

                <BlockControlButtons click={this._handleBoardUpdate}/>
                <GameControlButtons pauseClick={this.handlePauseClick} newGameClick={this.handleNewGameClick} isPaused={this.state.isPaused}/>
            </div>
        )
    }
}

export default Tetris