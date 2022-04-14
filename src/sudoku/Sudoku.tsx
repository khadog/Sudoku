import React, {Component, FormEvent} from "react";
import styled, {css} from 'styled-components'
import Cell from "./Cell";
import { isGameOver, GameStatus, isGameFinished, Mode, Cell_Size, Numbers, LevelName, Error_Count, GameType, CellType } from "../utils/game";
import { safeToPlace, fillPuzzle, pokeHoles, SudokuBoardType, SudokuBoardMapType } from "../utils/sudoku";
import {FaPen, FaTrash, FaUndoAlt, FaInfo} from 'react-icons/fa';
import Timer from "../components/Timer";

type SudokuStyleProps  = {
    active: boolean
}

const SudokuStyle = styled.section<SudokuStyleProps>`
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
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        width: 50px;
        height: 50px;
        border: .5px solid ${colors.dark};
        border-radius: 50%;
        background-color: ${colors.light};
        color: ${colors.dark};

        &:hover {
            background-color: ${colors.light_dark};
        }

        span {
            position: absolute;
            bottom: -18px;
            color: ${colors.light};
            font-size: .8rem;

            &.mode{
                bottom: unset;
                top: -8px;
                right: 0;
                border: 1px solid ${colors.light};
                border-radius: 6px;
                padding: 2px 5px;
                background-color: ${colors.dark};
                color: ${colors.light};
            }
        }
        `;
    }}
`;

const Header = styled.header`
    ${({theme: {colors}}) => {
        return css`
        margin: 1rem auto;
        padding: .5rem;
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

type SudokuProps = {
    game: GameType,
    setGame: any
};

type SudokuState = {
    startingBoardMap: SudokuBoardMapType,
};




// TODO: Typescript
class Sudoku extends Component<SudokuProps, SudokuState> {

    state: SudokuState = {
        startingBoardMap: {},
    };

    componentDidMount() {
        this.newGame()
    }

    // Start new game
    newGame = () => {
        const emptyBoard:SudokuBoardType = [
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

        const startingBoardMap: SudokuBoardMapType = {};
        const sudokuBoard: SudokuBoardType | undefined = fillPuzzle(emptyBoard);

        if(typeof sudokuBoard === 'undefined'){
            return
        }

        const {removedVals, startingBoard}:{removedVals: SudokuBoardMapType, startingBoard: SudokuBoardType} = pokeHoles(sudokuBoard, +this.props.game.level);

        startingBoard.forEach((row: number[], rowIndex: number) => {
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

    insert = ({colIndex, rowIndex, value}: {colIndex: number, rowIndex: number, value: string | number}) => {
        const game: GameType = {...this.props.game};
        if(game.status === GameStatus.started){
            const startingBoardMap:SudokuBoardMapType = {...this.state.startingBoardMap};
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

    updateStartingBoardMap = (startingBoardMap:SudokuBoardMapType) => {
        this.setState({startingBoardMap})
    };

    isBreakRow = (index: number) => {
        return (index > 17 && index < 27) || (index > 44 && index < 54)
    };

    insertByButton = (e: FormEvent<HTMLButtonElement>) => {
        const listOfValues: CellType[] = Object.values(this.state.startingBoardMap);
        const active: CellType | undefined = listOfValues.find(item => item.active && !item.disabled);
        if (!active){
            return;
        }
        this.insert({colIndex: active.colIndex, rowIndex: active.rowIndex, value: e.currentTarget.value})
    }

    insertByHint = () => {
        const listOfValues: CellType[] = Object.values(this.state.startingBoardMap);
        const active: CellType | undefined = listOfValues.find(item => item.active && !item.disabled);
        if (!active){
            return;
        }
        this.insert({colIndex: active.colIndex, rowIndex: active.rowIndex, value: active.value})
    }

    remove = () => {
        const listOfValues: CellType[] = Object.values(this.state.startingBoardMap);
        const active: CellType | undefined = listOfValues.find(item => item.active && !item.disabled);
        if (!active){
            return;
        }
        if(this.props.game.status === GameStatus.started){
            const startingBoardMap: SudokuBoardMapType = {...this.state.startingBoardMap};
            const key = 'row' + active.rowIndex + '_col' + active.colIndex;

            if(this.props.game.mode === Mode.notice){
                console.log({startingBoardMap})
            } else {
                startingBoardMap[key].inputValue = '';
                startingBoardMap[key].error = false;
            }
            this.setState({startingBoardMap})
        }
    }

    toggleMode = () => {
        const game: GameType = {...this.props.game};
        const mode: string = game.mode === Mode.notice ? Mode.write : Mode.notice
        this.props.setGame({...game, mode})
    };

    togglePausePlayGame = () => {
        const game: GameType = {...this.props.game};
        const status = game.status === GameStatus.started ? GameStatus.paused : GameStatus.started
        this.props.setGame({...game, status})
    };

    render() {
        const {insert, remove, updateStartingBoardMap, isBreakRow, insertByButton, toggleMode, togglePausePlayGame, insertByHint, state} = this;
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
                    <NotiStyle >
                        <FaUndoAlt />
                        <span>Undo</span>
                    </NotiStyle>
                    <NotiStyle onClick={remove} >
                        <FaTrash />
                        <span>Erase</span>
                    </NotiStyle>
                    <NotiStyle onClick={toggleMode} >
                        <FaPen />
                        <span className="mode">{game.mode === Mode.notice ? 'On' : 'Off'}</span>
                        <span>Notes</span>
                    </NotiStyle>
                    <NotiStyle onClick={insertByHint}>
                        <FaInfo />
                        <span>Hint</span>
                    </NotiStyle>
                </Header>
                {Numbers.map((item, key) => <NumberStyle key={key} value={item} onClick={insertByButton}>{item}</NumberStyle>)}
            </Aside>
        </Container>;
    }
}

export default Sudoku;