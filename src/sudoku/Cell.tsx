import { FC, useCallback, HTMLAttributes } from "react";
import styled, { css } from "styled-components";
import {
  Cell_Size,
  GameStatus,
  GameType,
  CellType,
  DefaultNotes,
} from "../utils/game";
import Notes from "./Notes";

interface CellStyleProps {
  error?: boolean;
  selected?: boolean;
  disabled?: boolean;
  hovered?: boolean;
  breakRow?: boolean;
}

const CellStyle = styled.div<CellStyleProps>`
  ${({ theme: { colors }, error, selected, hovered, breakRow }) => {
    return css`
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
      text-align: center;
      width: ${Cell_Size};
      height: ${Cell_Size};
      border: 0.5px solid ${colors.dark};
      background-color: ${error
        ? colors.danger
        : selected
        ? colors.dark
        : hovered
        ? colors.light_dark
        : colors.light};
      color: ${selected ? colors.light : colors.dark};
      padding: ${({ theme }) => theme.fontSize.sm + theme.fontSize.sm};
      font-size: 1.7rem;
      cursor: pointer;
      margin-bottom: ${breakRow ? "4px" : "inherit"};

      :nth-child(3n) {
        margin-right: 4px;
      }
    `;
  }}
`;

interface CellProps extends HTMLAttributes<HTMLDivElement> {
  selectedCell: CellType;
  getSelectedCells: any;
  game: GameType;
  breakRow: boolean;
}

const Cell: FC<CellProps> = ({
  selectedCell,
  getSelectedCells,
  breakRow,
  game,
}) => {
  const {
    colIndex,
    rowIndex,
    inputValue,
    selected,
    error,
    disabled,
    hovered,
    notes,
  } = selectedCell;

  const isDisabled = useCallback(() => {
    return (
      disabled ||
      game.status === GameStatus.failed ||
      game.status === GameStatus.success ||
      game.status === GameStatus.paused
    );
  }, [game, selectedCell]);

  const getSelectedCellsHandler = useCallback(() => {
    getSelectedCells(rowIndex, colIndex);
  }, [colIndex, rowIndex]);

  if (isDisabled()) {
    return (
      <CellStyle
        error={error}
        hovered={hovered}
        selected={selected}
        breakRow={breakRow}
        onClick={getSelectedCellsHandler}
      >
        {inputValue}
      </CellStyle>
    );
  }

  return (
    <CellStyle
      error={error}
      hovered={hovered}
      selected={selected}
      disabled={false}
      breakRow={breakRow}
      onClick={getSelectedCellsHandler}
    >
      {inputValue ? inputValue : <Notes notes={notes || DefaultNotes} />}
    </CellStyle>
  );
};

export default Cell;
