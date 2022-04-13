import React, { FormEvent, FC, InputHTMLAttributes, useCallback } from "react";
import styled, {css} from 'styled-components'
import { useTheme } from "../theme/useTheme";
import { Cell_Size, GameStatus, GameType, inSelectRowRange, inSelectColRange, inSelectBoxRange, isSameValue } from "../utils/game";

interface CellStyleProps {
    error: boolean
    selected: boolean
    disabled?: boolean
    hovered: boolean
    breakRow: boolean
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

const InputStyle = styled.input<CellStyleProps>`
    ${({theme: {colors}, error, selected, disabled, hovered, breakRow}) => {
        return css`
        transition: all .15s;
        text-align: center;
        width: ${Cell_Size};
        height: ${Cell_Size};
        border: .5px solid ${colors.dark};
        background-color: ${error ? colors.danger : selected ? colors.dark : hovered ? colors.light_dark : colors.light};
        color: ${(error || selected) ? colors.light : disabled ? colors.dark : colors.dark};
        padding:${({theme}) => theme.fontSize.sm + theme.fontSize.sm};
        font-size: 1.7rem;
        font-weight: bold;
        cursor: pointer;
        caret-color: transparent;
        margin-bottom: ${breakRow ? '4px' : 'inherit'};

        &:focus-visible {
            outline: unset;
        }

        :nth-child(3n){
            border-right: 4px solid ${colors.dark};
        }
        `;
    }}
`;

interface CellProps extends InputHTMLAttributes<HTMLInputElement> {
    selectedCell: any
    insert: any
    updateStartingBoardMap: any
    game: GameType
    startingBoardMap: any
    breakRow: boolean
}

const Cell:FC<CellProps> = ({selectedCell, startingBoardMap, insert, updateStartingBoardMap, breakRow, game, ...res}) => {
    const {theme} = useTheme()
    const  {colIndex, rowIndex, inputValue, selected, error, disabled, hovered} = selectedCell;

    const onChange = useCallback((e: FormEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        const lastChar = value.substring(value.length - 1);

        if(lastChar === '' || (+lastChar > 0 && +lastChar <= 9)){
            insert({colIndex, rowIndex, value: lastChar})
        }
    }, [])

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
        return <CellStyle error={error} hovered={hovered} selected={selected} breakRow={breakRow} onClick={focusHandler} {...res} >{inputValue}</CellStyle>
    }

    return <InputStyle error={error} hovered={hovered} selected={selected} disabled={false} breakRow={breakRow} type='number' step='1' onChange={onChange} onFocus={focusHandler} value={inputValue} {...res} />
};

export default Cell;