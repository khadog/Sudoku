import { FC, useCallback } from "react";
import styled from 'styled-components'
import Sudoku from "../../sudoku/Sudoku";
import { GameStatus, GameType } from "../../utils/game";
import GameStatusMessage from "./GameStatusMessage";

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