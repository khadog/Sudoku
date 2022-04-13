import { ThemeType } from "../theme/types";

export const setToLS = (key: string, value: ThemeType) => {
    window.localStorage.setItem(key, JSON.stringify(value));
}

export const getFromLS = (key: string) => {
    const value = window.localStorage.getItem(key);

    if (value) {
        return JSON.parse(value);
    }
}