export enum ThemeId {
    LIGHT,
    DARK,
}

export type ThemeType = {
    id: ThemeId,
    name: string,
    colors: {[key: string]: string},
    font: string,
    fontSize: {
        xs: string,
        sm: string,
        md: string,
        lg: string,
        xl: string
    }
}