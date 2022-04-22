import { ThemeId, ThemeType } from "./types";

const Light: ThemeType = {
  id: ThemeId.LIGHT,
  name: "Light",
  colors: {
    primary: "#321fdb",
    secondary: "#9da5b1",
    success: "#519668",
    danger: "#f27970",
    info: "#39f",
    light: "#4f5d73",
    dark: "#ebedef",
    light_dark: "#5f799b",
    gray: "#8a93a2",
    white: "#ffffff",
  },
  font: "sans-serif;",
  fontSize: {
    xs: ".25rem",
    sm: ".5rem",
    md: "1rem",
    lg: "2rem",
    xl: "4rem",
  },
};

export default Light;
