import React, {Component} from "react";
import styled, {css} from 'styled-components'
import Cell from "./Cell";
import { isGameOver, GameStatus, isGameFinished, Mode, Cell_Size, Numbers, LevelName, Error_Count } from "../utils/game";
import {FaPen, FaTrash} from 'react-icons/fa';
import Timer from "../components/Timer";

const SudokuStyle = styled.section`
    ${({theme: {colors}, active}) => {
        return css`
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        color: ${colors.light};
        background-color: ${colors.dark};
        filter: blur(${active ? '0px' : '5px'});
        `;
    }}
`;

const Container = styled.section`
    ${({theme: {colors}}) => {
        return css`
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1rem;
        color: ${colors.light};
        `;
    }}
`;

const Main = styled.main`
    ${() => {
        return css`
        width: calc(9 * ${Cell_Size});
        `;
    }}
`;

const Aside = styled.aside`
    ${({theme: {colors}}) => {
        return css`
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-left: 5rem;
        width: calc(6 * ${Cell_Size});
        `;
    }}
`;

const NumberStyle = styled.button`
    ${({theme: {colors}}) => {
        return css`
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all .15s;
        text-align: center;
        width: calc(2 * ${Cell_Size});
        height: calc(2 * ${Cell_Size});
        border: .5px solid ${colors.dark};
        border-radius: unset;
        background-color: ${colors.light};
        color: ${colors.dark};
        font-size: 3rem;

        &:hover {
            background-color: ${colors.light_dark};
        }
        `;
    }}
`;

const NotiStyle = styled.div`
    ${({theme: {colors}}) => {
        return css`
        cursor: pointer;
        `;
    }}
`;

const Header = styled.header`
    ${({theme: {colors}}) => {
        return css`
        margin: 1rem auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        `;
    }}
`;

const NavItem = styled.span`
    width: 33%;
    &:first-child {
        text-align: left;
    }
    &:last-child {
        text-align: right;
    }
`;


let counter = 0;
let pokeCounter = 0;
const numArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// TODO: Typescript
class Sudoku extends Component {

    state = {
        startingBoardMap: {},
    };

    componentDidMount() {
        this.newGame()
    }

    componentDidUpdate(prevProps, prevState) {
    }

    // Start new game
    newGame = () => {
        counter = 0;
        pokeCounter = 0;
        const emptyBoard = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];

        const startingBoardMap = {};
        const [removedVals, startingBoard] = this.pokeHoles(this.fillPuzzle(emptyBoard), this.props.game.level);
        console.log({removedVals, startingBoard})

        startingBoard.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                const key = 'row' + rowIndex + '_col' + colIndex;
                startingBoardMap[key] = {  // Store the current value at the coordinates
                    rowIndex,
                    colIndex,
                    value: removedVals[key] ? removedVals[key].value : value,
                    inputValue: value === 0 ? '' : value,
                    disabled: value !== 0,
                    error: false,
                    selected: false,
                    hovered: false,
                    active: false
                }
            })
        })

        this.setState({startingBoardMap});
    }

    // Placement Criteria
    rowSafe = (puzzleArray, emptyCell, num) => {
        // -1 is return value of .find() if value not found
        return puzzleArray[emptyCell.rowIndex].indexOf(num) === -1;
    };

    colSafe = (puzzleArray, emptyCell, num) => {
        return !puzzleArray.some(row => row[emptyCell.colIndex] === num);
    };

    boxSafe = (puzzleArray, emptyCell, num) => {
        // Define top left corner of box region for empty cell
        const boxStartRow = emptyCell.rowIndex - (emptyCell.rowIndex % 3);
        const boxStartCol = emptyCell.colIndex - (emptyCell.colIndex % 3);
        let safe = true;

        for (let boxRow of [0, 1, 2]) {  // Each box region has 3 rows
            for (let boxCol of [0, 1, 2]) { // Each box region has 3 columns
                // Is num is present in box region?
                if (puzzleArray[boxStartRow + boxRow][boxStartCol + boxCol] === num) {
                    safe = false; // If number is found, it is not safe to place
                }
            }
        }
        return safe;
    };

    safeToPlace = (puzzleArray, emptyCell, num) => {
        return this.rowSafe(puzzleArray, emptyCell, num) &&
            this.colSafe(puzzleArray, emptyCell, num) &&
            this.boxSafe(puzzleArray, emptyCell, num);
    };

    // Generating a Game Board
    nextEmptyCell = (puzzleArray) => {
        const emptyCell = {rowIndex: '', colIndex: ''};

        puzzleArray.forEach((row, rowIndex) => {
            // If this key has already been assigned, skip iteration
            if (emptyCell.colIndex !== '') return;

            // find first zero-element
            const firstZero = row.find(col => col === 0);
            // if no zero present, skip to next row
            if (firstZero === undefined) return;

            emptyCell.rowIndex = rowIndex;
            emptyCell.colIndex = row.indexOf(firstZero);
        });

        if (emptyCell.colIndex !== '') return emptyCell;
        // If emptyCell was never assigned, there are no more zeros
        return false;
    };

    shuffle = array => {
        let newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    fillPuzzle = emptyBoard => {
        const emptyCell = this.nextEmptyCell(emptyBoard);
        // If there are no more zeros, the board is finished, return it
        if (!emptyCell) return emptyBoard;

        for (let num of this.shuffle(numArray)) {
            // counter is a global variable tracking the number of iterations performed in generating a puzzle
            // Most puzzles generate in < 500ms, but occassionally random generation could run in to
            // heavy backtracking and result in a long wait. Best to abort this attempt and restart.
            // See initializer function for more
            counter++;
            if (counter > 20_000_000) throw new Error('Recursion Timeout');

            if (this.safeToPlace(emptyBoard, emptyCell, num)) {
                // If safe to place number, place it
                emptyBoard[emptyCell.rowIndex][emptyCell.colIndex] = num;

                // Recursively call the fill function to place num in next empty cell
                if (this.fillPuzzle(emptyBoard)) return emptyBoard;

                // If we were unable to place the future num, that num was wrong.
                // Reset it and try next
                emptyBoard[emptyCell.rowIndex][emptyCell.colIndex] = 0;
            }
        }
        // If unable to place any number, return false,
        // causing previous round to go to next num
        return false;
    };

    // Generating a Playable Board
    pokeHoles = (startingBoard, holes) => {
        const removedVals = {};
        const val = this.shuffle(this.range(0, 80));

        while (Object.keys(removedVals).length < holes) {
            const nextVal = val.pop();
            if (nextVal === undefined) throw new Error('Impossible Game');
            const randomRowIndex = Math.floor(nextVal / 9); // Integer 0-8 for row index
            const randomColIndex = nextVal % 9;

            if (!startingBoard[randomRowIndex]) continue; // guard against cloning error
            if (startingBoard[randomRowIndex][randomColIndex] === 0) continue; // If cell already empty, restart loop
            const key = 'row' + randomRowIndex + '_col' + randomColIndex;
            removedVals[key] = {  // Store the current value at the coordinates
                rowIndex: randomRowIndex,
                colIndex: randomColIndex,
                value: startingBoard[randomRowIndex][randomColIndex],
            }

            startingBoard[randomRowIndex][randomColIndex] = 0; // "poke a hole" in the board at the coords

            // Attempt to solve the board after removing value. If it cannot be solved, restore the old value.
            // and remove that option from the list

            if (this.multiplePossibleSolutions(startingBoard.map(row => row.slice()))) {
                startingBoard[randomRowIndex][randomColIndex] = removedVals[key].value;
            }

        }
        return [removedVals, startingBoard];
    };

    // The board will be completely solved once for each item in the empty cell list.
    // The empty cell array is rotated on each iteration, so that the order of the empty cells
    // And thus the order of solving the game, is different each time.
    // The solution for each attempt is pushed to a possibleSolutions array as a string
    // Multiple solutions are identified by taking a unique Set from the possible solutions
    // and measuring its length. If multiple possible solutions are found at any point
    // If will return true, prompting the pokeHoles function to select a new value for removal.

    multiplePossibleSolutions(boardToCheck) {
        const possibleSolutions = [];
        const emptyCellArray = this.emptyCellCoords(boardToCheck);
        for (let index = 0; index < emptyCellArray.length; index++) {
            // Rotate a clone of the emptyCellArray by one for each iteration
            const emptyCellClone = [...emptyCellArray];
            const startingPoint = emptyCellClone.splice(index, 1);
            emptyCellClone.unshift(startingPoint[0]);
            const thisSolution = this.fillFromArray(boardToCheck.map(row => row.slice()), emptyCellClone);
            possibleSolutions.push(thisSolution.join());
            if (Array.from(new Set(possibleSolutions)).length > 1) return true;
        }
        return false;
    }

    // This will attempt to solve the puzzle by placing values into the board in the order that
    // the empty cells list presents
    fillFromArray(startingBoard, emptyCellArray) {
        const emptyCell = this.nextStillEmptyCell(startingBoard, emptyCellArray);
        if (!emptyCell) return startingBoard;
        for (let num of this.shuffle(numArray)) {
            pokeCounter++;
            if (pokeCounter > 60_000_000) throw new Error('Poke Timeout');
            if (this.safeToPlace(startingBoard, emptyCell, num)) {
                startingBoard[emptyCell.rowIndex][emptyCell.colIndex] = num;
                if (this.fillFromArray(startingBoard, emptyCellArray)) return startingBoard;
                startingBoard[emptyCell.rowIndex][emptyCell.colIndex] = 0;
            }
        }
        return false;
    }

    // As numbers get placed, not all of the initial cells are still empty.
    // This will find the next still empty cell in the list
    nextStillEmptyCell(startingBoard, emptyCellArray) {
        for (let coords of emptyCellArray) {
            if (startingBoard[coords.row][coords.col] === 0) return {rowIndex: coords.row, colIndex: coords.col};
        }
        return false;
    }

    // Generate array from range, inclusive of start & endbounds.
    range = (start, end) => {
        const length = end - start + 1;
        return Array.from({length}, (_, i) => start + i);
    };

    // Get a list of all empty cells in the board from top-left to bottom-right
    emptyCellCoords(startingBoard) {
        const listOfEmptyCells = [];
        for (const row of this.range(0, 8)) {
            for (const col of this.range(0, 8)) {
                if (startingBoard[row][col] === 0) listOfEmptyCells.push({row, col});
            }
        }
        return listOfEmptyCells;
    }

    insert = ({colIndex, rowIndex, value}) => {
        const game = {...this.props.game};
        if(game.status === GameStatus.started){
            const startingBoardMap = {...this.state.startingBoardMap};
            const key = 'row' + rowIndex + '_col' + colIndex;

            if(game.mode === Mode.notice){
                console.log({startingBoardMap, value})
            } else {
                const error = value !== '' && +value !== startingBoardMap[key].value;

                startingBoardMap[key].inputValue = value;
                startingBoardMap[key].error = error;
                
                if (error) {
                    const status = isGameOver(game) ? GameStatus.failed : game.status;
                    this.props.setGame({...game, errors: ++game.errors, status}) 
                } else {
                    const finished = isGameFinished(startingBoardMap)
                    if (finished) {
                        this.props.setGame({...game, status: GameStatus.success})
                    }
                }
            }
            this.setState({startingBoardMap})
        }
    }

    updateStartingBoardMap = (startingBoardMap) => {
        this.setState({startingBoardMap})
    };

    isBreakRow = (index) => {
        return (index > 17 && index < 27) || (index > 44 && index < 54)
    };

    insertByButton = (e) => {
        const active = Object.values(this.state.startingBoardMap).find(item => item.active && !item.disabled);
        if (!active){
            return;
        }
        this.insert({colIndex: active.colIndex, rowIndex: active.rowIndex, value: e.currentTarget.value})
    }

    toggleMode = () => {
        const game = {...this.props.game};
        const mode = game.mode === Mode.notice ? Mode.write : Mode.notice
        this.props.setGame({...game, mode})
    };

    togglePausePlayGame = () => {
        const game = {...this.props.game};
        const status = game.status === GameStatus.started ? GameStatus.paused : GameStatus.started
        this.props.setGame({...game, status})
    };

    render() {
        const {insert, updateStartingBoardMap, isBreakRow, insertByButton, toggleMode, togglePausePlayGame, state} = this;
        const {startingBoardMap} = state;
        const {game} = this.props;
        const startingBoardList = Object.keys(startingBoardMap);

        return <Container>
            <Main>
                <Header>
                    <NavItem>{LevelName[game.level]}</NavItem>
                    <Timer status={game.status} togglePausePlayGame={togglePausePlayGame}/>
                    <NavItem>Errors: {game.errors} / {Error_Count}</NavItem>
                </Header>
                <SudokuStyle active={game.status !== GameStatus.paused}>
                    {startingBoardList.map((key, index) => {
                    return <Cell key={key} selectedCell={startingBoardMap[key]} startingBoardMap={startingBoardMap} breakRow={isBreakRow(index)} insert={insert} updateStartingBoardMap={updateStartingBoardMap} game={game} />
                    })}
                </SudokuStyle>
            </Main>
            <Aside>
                <Header>
                    <NotiStyle onClick={toggleMode} ><FaPen /></NotiStyle>
                    <NotiStyle ><FaTrash /></NotiStyle>
                </Header>
                {Numbers.map((item, key) => <NumberStyle key={key} value={item} onClick={insertByButton}>{item}</NumberStyle>)}
            </Aside>
        </Container>;
    }
}

export default Sudoku;