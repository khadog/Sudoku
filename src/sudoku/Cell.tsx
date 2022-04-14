import { FC, useCallback, HTMLAttributes } from "react";
import styled, {css} from 'styled-components'
import { Cell_Size, GameStatus, GameType, inSelectRowRange, inSelectColRange, inSelectBoxRange, isSameValue, CellType } from "../utils/game";

interface CellStyleProps {
    error?: boolean
    selected?: boolean
    disabled?: boolean
    hovered?: boolean
    breakRow?: boolean
}

const CellStyle = styled.div<CellStyleProps>`
    ${({theme: {colors}, error, selected, hovered, breakRow}) => {
        return css`
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all .15s;
        text-align: center;
        width: ${Cell_Size};
        height: ${Cell_Size};
        border: .5px solid ${colors.dark};
        background-color: ${error ? colors.danger : selected ? colors.dark : hovered ? colors.light_dark : colors.light};
        color: ${selected ? colors.light : colors.dark};
        padding:${({theme}) => theme.fontSize.sm + theme.fontSize.sm};
        font-size: 1.7rem;
        cursor: pointer;
        margin-bottom: ${breakRow ? '4px' : 'inherit'};

        :nth-child(3n){
            border-right: 4px solid ${colors.dark};
        }
        `;
    }}
`;


interface CellProps extends HTMLAttributes<HTMLDivElement> {
    selectedCell: CellType
    updateStartingBoardMap: any
    game: GameType
    startingBoardMap: any
    breakRow: boolean
}

const Cell:FC<CellProps> = ({selectedCell, startingBoardMap, updateStartingBoardMap, breakRow, game}) => {
    const  {colIndex, rowIndex, inputValue, selected, error, disabled, hovered} = selectedCell;

    const focusHandler = useCallback(() => {
        const selectedKey = 'row' + rowIndex + '_col' + colIndex;
        Object.keys(startingBoardMap).forEach((key) => {
            startingBoardMap[key].hovered = inSelectRowRange(startingBoardMap[key], rowIndex) || inSelectColRange(startingBoardMap[key], colIndex) || inSelectBoxRange(startingBoardMap[key], colIndex, rowIndex);
            startingBoardMap[key].selected = (key === selectedKey) || isSameValue(startingBoardMap[key], startingBoardMap[selectedKey]);
            startingBoardMap[key].active = (key === selectedKey)
        })
        updateStartingBoardMap({...startingBoardMap})
    }, [colIndex, rowIndex, startingBoardMap])

    const isDisabled = useCallback(() => {
        return disabled || game.status === GameStatus.failed || game.status === GameStatus.success || game.status === GameStatus.paused
    }, [game, selectedCell]);

    
    if (isDisabled()) {
        return <CellStyle error={error} hovered={hovered} selected={selected} breakRow={breakRow} onClick={focusHandler}>{inputValue}</CellStyle>
    }

    return <CellStyle error={error} hovered={hovered} selected={selected} disabled={false} breakRow={breakRow} onClick={focusHandler}>{inputValue}</CellStyle>
};

export default Cell;