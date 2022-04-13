import { useEffect, useState } from 'react';
import { setToLS, getFromLS } from '../utils/storage';
import Light from './light';
import { ThemeType } from './types';

export const useTheme = () => {
  const [theme, setTheme] = useState(Light);
  const [themeLoaded, setThemeLoaded] = useState(false);

  const setMode = (mode: ThemeType) => {
    setToLS('theme', mode)
    setTheme(mode);
  };

  useEffect(() =>{
    const localTheme = getFromLS('theme');
    localTheme ? setTheme(localTheme) : setTheme(Light);
    setThemeLoaded(true);
  }, []);

  return { theme, themeLoaded, setMode };
};