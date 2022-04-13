import React, {FC} from 'react';
import styled, { useTheme } from 'styled-components'
import Button from './Button';
import { ThemeId, ThemeType } from '../theme/types';
import { FaMoon, FaSun } from 'react-icons/fa';

type ThemeIconProps = {
    id: ThemeId
  }
  
  const ThemeIcon:FC<ThemeIconProps> = ({id}) => {
    if(id === ThemeId.LIGHT){
      return <FaSun /> 
    }
    return <FaMoon />
  }

const HeaderStyle = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid ${({theme}) => theme.colors.light};
    padding:${({theme}) => theme.fontSize.xs + ' ' + theme.fontSize.md};
`;

const TitleStyle = styled.h1`
    font-size: ${({theme}) => theme.fontSize.lg};
    color: ${({theme}) => theme.colors.light};
`;

interface HeaderProps{
    selectedTheme: ThemeType,
    themeSwitcher: any
}

const Header:FC<HeaderProps> = ({themeSwitcher, selectedTheme, ...res}) => {
    const theme = useTheme()
    return <HeaderStyle theme={theme} {...res}>
        <TitleStyle>Sudoku</TitleStyle>
        <Button onClick={themeSwitcher}>
        <   ThemeIcon id={selectedTheme.id}/>
        </Button>
    </HeaderStyle>
}

export default Header;