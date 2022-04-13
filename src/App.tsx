import React, { useState, useEffect, FC } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import {useTheme} from './theme/useTheme';
import { GlobalStyles } from './theme/GlobalStyles';
import { Light, Dark } from './theme';
import { ThemeId } from './theme/types';
import Header from './components/Header';

import './App.css';
import Main from './components/Main';

const AppStyle = styled.div`
  height: 100vh;
  background-color: ${({theme}) => theme.colors.dark};
`;

const App:FC = () => {
  const {theme, themeLoaded, setMode} = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);

  useEffect(() => {
    setSelectedTheme(theme);
   }, [themeLoaded, theme]);

  const themeSwitcher = () => {
    let theme;
    if(selectedTheme.id === ThemeId.LIGHT){
      theme = Dark;
    }else {
      theme = Light;
    }
    setMode(theme);
    setSelectedTheme(theme)
  }

  return (<>
    {themeLoaded && <ThemeProvider theme={selectedTheme}>
      <GlobalStyles />
      <AppStyle>
        <Header themeSwitcher={themeSwitcher} selectedTheme={selectedTheme} />
        <Main />
      </AppStyle>
    </ThemeProvider>}
    </>
  );
}

export default App;
