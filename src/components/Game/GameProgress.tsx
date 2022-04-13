import { FC, useCallback, FormEvent } from "react";
import styled, { css } from 'styled-components'
import Sudoku from "../../sudoku/Sudoku";
import { Error_Count, LevelName, GameStatus, GameType, Mode } from "../../utils/game";
import GameStatusMessage from "./GameStatusMessage";
import Timer from "../Timer";

const GameProgressStyle = styled.div`

`;

type GameProgressProps = {
    game: GameType
    setGame: any
}

const GameProgress:FC<GameProgressProps> = ({game, setGame}) => {

    const showGame = useCallback(() => {
        return game.status === GameStatus.started || game.status === GameStatus.failed || game.status === GameStatus.success || game.status === GameStatus.paused
    }, [game]);

    return <GameProgressStyle>
        {showGame() && <>
            <Sudoku game={game} setGame={setGame} />
        </>}
        <GameStatusMessage status={game.status} />
    </GameProgressStyle>
}

export default GameProgress;