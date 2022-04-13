import { FC, useCallback } from "react";
import styled, { css } from 'styled-components'
import Sudoku from "../../sudoku/Sudoku";
import { Error_Count, Cell_Size, LevelName, GameStatus, GameType } from "../../utils/game";
import GameStatusMessage from "./GameStatusMessage";
import Timer from "../Timer";

const GameProgressStyle = styled.div`

`;

const DetailsChild = styled.span`
    width: 33%;
    &:first-child {
        text-align: left;
    }
    &:last-child {
        text-align: right;
    }
`;

const Details = styled.section`
    ${({theme: {colors}}) => {
        return css`
        margin: 1rem auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: calc(9 * ${Cell_Size});
        color: ${colors.light};
        `;
    }}
`;

type GameProgressProps = {
    game: GameType
    setGame: any
}

const GameProgress:FC<GameProgressProps> = ({game, setGame}) => {

    const showGame = useCallback(() => {
        return game.status === GameStatus.started || game.status === GameStatus.failed || game.status === GameStatus.success || game.status === GameStatus.paused
    }, [game]);

    const togglePausePlayGame = useCallback(() => {
        const status = game.status === GameStatus.started ? GameStatus.paused : GameStatus.started
        setGame({...game, status})
    }, [game]);

    return <GameProgressStyle>
        {showGame() && <>
            <Details>
            <DetailsChild>{LevelName[game.level]}</DetailsChild>
            <Timer status={game.status} togglePausePlayGame={togglePausePlayGame}/>
            <DetailsChild>Errors: {game.errors} / {Error_Count}</DetailsChild>
        </Details>
        <Sudoku game={game} setGame={setGame} />
        </>}

        <GameStatusMessage status={game.status} />
    </GameProgressStyle>
}

export default GameProgress;