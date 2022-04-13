import React, {MouseEvent, FC, useState, useCallback} from 'react';
import styled from 'styled-components'
import Button from './Button';
import GameProgress from './Game/GameProgress';
import { GameStatus, GameType, Level, LevelName } from '../utils/game';
  
const MainStyle = styled.main`
  text-align: center;
`;

const LevelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

interface MainProps{
}

const Main:FC<MainProps> = () => {
    const [game, setGame] = useState<GameType>({level: Level.none, status: GameStatus.none, errors: 0});

    const switchLevel = useCallback((e: MouseEvent<HTMLButtonElement>) => {
      const newGame: GameType = {level: e.currentTarget['name'] as Level, status: GameStatus.started, errors: 0}
      setGame(newGame);
    }, [])

    const startNewGame = useCallback(() => {
      const newGame: GameType = {level: Level.none, status: GameStatus.level, errors: 0}
      setGame(newGame)
    }, [])

    return <MainStyle>

        <Button onClick={startNewGame}>New Game</Button>

        {game.status === GameStatus.level && <LevelContainer>
          <Button name={Level.ease} onClick={switchLevel}>{LevelName[Level.ease]}</Button>
          <Button name={Level.normal} onClick={switchLevel}>{LevelName[Level.normal]}</Button>
          <Button name={Level.hard} onClick={switchLevel}>{LevelName[Level.hard]}</Button>
          <Button name={Level.expert} onClick={switchLevel}>{LevelName[Level.expert]}</Button>
        </LevelContainer>}

        <GameProgress game={game} setGame={setGame}/>
      </MainStyle>
}

export default Main;