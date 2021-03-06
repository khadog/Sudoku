import { Component, FormEvent } from "react";
import styled, { css } from "styled-components";
import Cell from "./Cell";
import {
  isGameOver,
  GameStatus,
  isGameFinished,
  Mode,
  Cell_Size,
  Numbers,
  LevelName,
  Error_Count,
  GameType,
  CellType,
  inSelectRowRange,
  inSelectColRange,
  inSelectBoxRange,
  isSameValue,
  DefaultNotes,
  ControlKeys,
  ControlKeyType,
  ControlsKeys,
} from "../utils/game";
import {
  fillPuzzle,
  pokeHoles,
  SudokuBoardType,
  SudokuBoardMapType,
  InsertEnum,
  InsertType,
} from "../utils/sudoku";
import { FaPen, FaTrash, FaUndoAlt, FaInfo, FaPlay } from "react-icons/fa";
import Timer from "../components/Timer";
import Controllers from "./Controllers";

const SudokuStyle = styled.section`
  ${({ theme: { colors } }) => {
    return css`
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      color: ${colors.light};
      background-color: ${colors.dark};
    `;
  }}
`;

const SudokuPauseStyle = styled.section`
  ${({ theme: { colors } }) => {
    return css`
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      font-size: 5rem;
      cursor: pointer;
      color: ${colors.dark};
      background-color: ${colors.light};
      width: calc(9 * ${Cell_Size} + 12px);
      height: calc(9 * ${Cell_Size} + 8px);
    `;
  }}
`;

const Container = styled.section`
  ${({ theme: { colors } }) => {
    return css`
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      flex-wrap: wrap;
      margin: 1rem;
      color: ${colors.light};
    `;
  }}
`;

const Main = styled.main`
  ${() => {
    return css`
      width: calc(9 * ${Cell_Size} + 12px);
    `;
  }}
`;

const Aside = styled.aside`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: calc(6 * ${Cell_Size});
`;

const NumberStyle = styled.button`
  ${({ theme: { colors } }) => {
    return css`
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
      text-align: center;
      width: calc(2 * ${Cell_Size});
      height: calc(2 * ${Cell_Size});
      border: 0.5px solid ${colors.dark};
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
  ${({ theme: { colors } }) => {
    return css`
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      width: 50px;
      height: 50px;
      border: 0.5px solid ${colors.dark};
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
        font-size: 0.8rem;

        &.mode {
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
  margin: 1rem auto;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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
  game: GameType;
  setGame: (game: GameType) => void;
};

type SudokuState = {
  startingBoardMap: SudokuBoardMapType;
};

// TODO: Typescript
class Sudoku extends Component<SudokuProps, SudokuState> {
  state: SudokuState = {
    startingBoardMap: {},
  };

  componentDidMount() {
    document.addEventListener("keydown", this.keydownHandler);
    this.newGame();
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keydownHandler);
  }

  keydownHandler = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      return this.toggleMode();
    }

    if (e.key === "Enter") {
      return this.insertByHint();
    }

    const key = e.code === "Backspace" ? "" : e.key;
    const controllKey = ControlKeys.find((k) => k.code === key);

    if (controllKey) {
      this.controlHandler(controllKey);
    } else {
      this.insertByKey(key);
    }
  };

  controlHandler = (controllKey: ControlKeyType) => {
    const startingBoardMap = { ...this.state.startingBoardMap };
    const listOfValues: CellType[] = Object.values(startingBoardMap);
    const active: CellType | undefined = listOfValues.find(
      (item) => item.active
    );

    if (!active) {
      return;
    }
    let nextRow = active.rowIndex + controllKey.value;
    let nextCol = active.colIndex + controllKey.value;

    const nextPosition = {
      rowIndex: active.rowIndex,
      colIndex: active.colIndex,
    };

    if (
      (controllKey.code === ControlsKeys.ArrowDown ||
        controllKey.code === ControlsKeys.ArrowUp ||
        controllKey.code === ControlsKeys.w ||
        controllKey.code === ControlsKeys.s) &&
      nextRow > -1 &&
      nextRow < 9
    ) {
      nextPosition.rowIndex = nextRow;
    } else if (
      (controllKey.code === ControlsKeys.ArrowLeft ||
        controllKey.code === ControlsKeys.ArrowRight ||
        controllKey.code === ControlsKeys.a ||
        controllKey.code === ControlsKeys.d) &&
      nextCol > -1 &&
      nextCol < 9
    ) {
      nextPosition.colIndex = nextCol;
    }

    this.getSelectedCells(
      nextPosition.rowIndex,
      nextPosition.colIndex,
      startingBoardMap
    );
  };

  // Start new game
  newGame = () => {
    const emptyBoard: SudokuBoardType = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    const startingBoardMap: SudokuBoardMapType = {};
    const sudokuBoard: SudokuBoardType | undefined = fillPuzzle(emptyBoard);

    if (typeof sudokuBoard === "undefined") {
      return;
    }

    const {
      removedVals,
      startingBoard,
    }: { removedVals: SudokuBoardMapType; startingBoard: SudokuBoardType } =
      pokeHoles(sudokuBoard, +this.props.game.level);

    startingBoard.forEach((row: number[], rowIndex: number) => {
      row.forEach((value, colIndex) => {
        const key = "row" + rowIndex + "_col" + colIndex;
        startingBoardMap[key] = {
          // Store the current value at the coordinates
          rowIndex,
          colIndex,
          value: removedVals[key] ? removedVals[key].value : value,
          inputValue: value === 0 ? "" : value,
          disabled: value !== 0,
          error: false,
          selected: false,
          hovered: false,
          active: false,
        };
      });
    });

    this.setState({ startingBoardMap });
  };

  updateHint = (
    active: CellType,
    game: GameType,
    startingBoardMap: SudokuBoardMapType
  ) => {
    active.inputValue = active.value;
    active.error = false;

    const finished = isGameFinished(startingBoardMap);
    if (finished) {
      game.status = GameStatus.success;
    }
  };

  updateNotes = (active: CellType, key: number) => {
    if (active.notes) {
      active.notes[key] = !active.notes[key];
    } else {
      active.notes = { ...DefaultNotes };
      active.notes[key] = !active.notes[key];
    }
  };

  insert = (value: string | number, insertType: InsertType) => {
    const game: GameType = { ...this.props.game };
    if (game.status === GameStatus.started) {
      const startingBoardMap: SudokuBoardMapType = {
        ...this.state.startingBoardMap,
      };
      const listOfValues: CellType[] = Object.values(startingBoardMap);

      const active: CellType | undefined = listOfValues.find(
        (item) => item.active && !item.disabled
      );
      if (!active) {
        return;
      }

      if (game.mode === Mode.notice) {
        if (insertType === InsertEnum.hint) {
          this.updateHint(active, game, startingBoardMap);
        } else {
          if (value === "") {
            active.inputValue = "";
            active.error = false;
            active.notes = { ...DefaultNotes };
          } else {
            this.updateNotes(active, +value);
          }
        }
      } else {
        const error = value !== "" && +value !== active.value;

        if (insertType === InsertEnum.hint) {
          this.updateHint(active, game, startingBoardMap);
        } else {
          let status: GameStatus = game.status;

          active.inputValue = value;
          active.error = error;

          if (error) {
            if (isGameOver(game)) {
              status = GameStatus.failed;
            }
            game.errors = game.errors + 1;
          } else {
            if (isGameFinished(startingBoardMap)) {
              status = GameStatus.success;
            }
          }
          game.status = status;
        }
      }
      this.props.setGame({ ...game });
      this.getSelectedCells(active.rowIndex, active.colIndex, startingBoardMap);
    }
  };

  isBreakRow = (index: number) => {
    return (index > 17 && index < 27) || (index > 44 && index < 54);
  };

  insertByButton = (e: FormEvent<HTMLButtonElement>) => {
    this.insert(e.currentTarget.value, InsertEnum.button);
  };

  insertByKey = (key: string) => {
    const reg = /^[1-9]+$/; // match only numbers
    if (key === "" || key.match(reg)) {
      this.insert(key, InsertEnum.key);
    }
  };

  insertByHint = () => {
    this.insert("", InsertEnum.hint);
  };

  remove = () => {
    const listOfValues: CellType[] = Object.values(this.state.startingBoardMap);
    const active: CellType | undefined = listOfValues.find(
      (item) => item.active && !item.disabled
    );
    if (!active) {
      return;
    }
    if (this.props.game.status === GameStatus.started) {
      const startingBoardMap: SudokuBoardMapType = {
        ...this.state.startingBoardMap,
      };
      const key = "row" + active.rowIndex + "_col" + active.colIndex;

      if (this.props.game.mode === Mode.notice) {
        startingBoardMap[key].inputValue = "";
        startingBoardMap[key].error = false;
        startingBoardMap[key].notes = { ...DefaultNotes };
      } else {
        startingBoardMap[key].inputValue = "";
        startingBoardMap[key].error = false;
      }
      this.getSelectedCells(active.rowIndex, active.colIndex, startingBoardMap);
    }
  };

  getSelectedCells = (
    rowIndex: number,
    colIndex: number,
    startingBoardMap?: SudokuBoardMapType
  ) => {
    const selectedKey = "row" + rowIndex + "_col" + colIndex;
    const boardMap = startingBoardMap
      ? startingBoardMap
      : { ...this.state.startingBoardMap };

    Object.keys(boardMap).forEach((key) => {
      boardMap[key].hovered =
        inSelectRowRange(boardMap[key], rowIndex) ||
        inSelectColRange(boardMap[key], colIndex) ||
        inSelectBoxRange(boardMap[key], colIndex, rowIndex);
      boardMap[key].selected =
        key === selectedKey ||
        isSameValue(boardMap[key], boardMap[selectedKey]);
      boardMap[key].active = key === selectedKey;
    });
    this.setState({ startingBoardMap: boardMap });
  };

  toggleMode = () => {
    const game: GameType = { ...this.props.game };
    const mode: Mode = game.mode === Mode.notice ? Mode.write : Mode.notice;
    this.props.setGame({ ...game, mode });
  };

  togglePausePlayGame = () => {
    const game: GameType = { ...this.props.game };
    if (
      game.status === GameStatus.failed ||
      game.status === GameStatus.success
    ) {
      return;
    }

    const status =
      game.status === GameStatus.started
        ? GameStatus.paused
        : GameStatus.started;
    this.props.setGame({ ...game, status });
  };

  render() {
    const {
      remove,
      isBreakRow,
      insertByButton,
      toggleMode,
      togglePausePlayGame,
      insertByHint,
      getSelectedCells,
      state,
    } = this;
    const { startingBoardMap } = state;
    const { game } = this.props;
    const startingBoardList = Object.keys(startingBoardMap);

    return (
      <Container>
        <Main>
          <Header>
            <NavItem>{LevelName[game.level]}</NavItem>
            <Timer
              status={game.status}
              togglePausePlayGame={togglePausePlayGame}
            />
            <NavItem>
              Errors: {game.errors} / {Error_Count}
            </NavItem>
          </Header>
          {game.status === GameStatus.paused ? (
            <SudokuPauseStyle onClick={togglePausePlayGame}>
              <FaPlay />
            </SudokuPauseStyle>
          ) : (
            <SudokuStyle>
              {startingBoardList.map((key, index) => {
                return (
                  <Cell
                    key={key}
                    selectedCell={startingBoardMap[key]}
                    breakRow={isBreakRow(index)}
                    getSelectedCells={getSelectedCells}
                    game={game}
                  />
                );
              })}
            </SudokuStyle>
          )}
        </Main>
        <Aside>
          <Header>
            <NotiStyle>
              <FaUndoAlt />
              <span>Undo</span>
            </NotiStyle>
            <NotiStyle onClick={remove}>
              <FaTrash />
              <span>Erase</span>
            </NotiStyle>
            <NotiStyle onClick={toggleMode}>
              <FaPen />
              <span className="mode">
                {game.mode === Mode.notice ? "On" : "Off"}
              </span>
              <span>Notes</span>
            </NotiStyle>
            <NotiStyle onClick={insertByHint}>
              <FaInfo />
              <span>Hint</span>
            </NotiStyle>
          </Header>
          {Numbers.map((item, key) => (
            <NumberStyle key={key} value={item} onClick={insertByButton}>
              {item}
            </NumberStyle>
          ))}
          <Controllers />
        </Aside>
      </Container>
    );
  }
}

export default Sudoku;
