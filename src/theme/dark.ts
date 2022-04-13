import { ThemeId, ThemeType } from "./types";

const Dark: ThemeType = {
    id: ThemeId.DARK,
    name: "Dark",
    colors: {
        primary: '#857dcc',
        secondary: '#a7a7a7',
        success: '#2eb85c',
        danger: '#e55353',
        info: '#5299e0',
        light: '#ebedef',
        dark: '#4f5d73',
        light_dark: '#adb9cd',
        gray: '#8a93a2',
        white: '#ffffff'
    },
    font: "sans-serif",
    fontSize: {
        xs: '.25rem',
        sm: '.5rem',
        md: '1rem',
        lg: '2rem',
        xl: '4rem'
    }
  }

  export default Dark;