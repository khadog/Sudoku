import { FC, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { getTimerFormat } from "../utils/date";
import { FaPlay, FaPause } from "react-icons/fa";
import { GameStatus } from "../utils/game";

const TimerStyle = styled.span`
  width: 33%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconStyle = styled.span`
  display: flex;
  cursor: pointer;
  margin-left: 0.4rem;
  font-size: 0.75rem;
`;

type TimerProps = {
  status: string;
  togglePausePlayGame: () => void;
};

const Timer: FC<TimerProps> = ({ status, togglePausePlayGame }) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      status === GameStatus.started && setTimer(timer + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, status]);

  const TimerIcon = useCallback(() => {
    if (status === GameStatus.paused) {
      return (
        <IconStyle onClick={togglePausePlayGame}>
          <FaPlay />
        </IconStyle>
      );
    }
    return (
      <IconStyle onClick={togglePausePlayGame}>
        <FaPause />
      </IconStyle>
    );
  }, [status, togglePausePlayGame]);

  return (
    <TimerStyle>
      Time: {getTimerFormat(timer)} <TimerIcon />
    </TimerStyle>
  );
};

export default Timer;
