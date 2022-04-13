const Error_Count = 3;
const Cell_Size = '70px';
const Numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const inSelectBoxRange = (selected: CellType, colIndex: number, rowIndex: number): boolean  => {
    const startCol = colIndex - (colIndex % 3);
    const endCol = startCol + 2;

    const startRow = rowIndex - (rowIndex % 3);
    const endRow = startRow + 2;

    return ((selected.colIndex >= startCol && selected.colIndex <= endCol) && (selected.rowIndex >= startRow && selected.rowIndex <= endRow))
}
const inSelectRowRange = (selected: CellType, rowIndex: number): boolean  => {
    return selected.rowIndex === rowIndex
}
const inSelectColRange = (selected: CellType, colIndex: number): boolean  => {
    return selected.colIndex === colIndex
}

const isSameValue = (cell: CellType, selected: CellType): boolean => {
    return selected.inputValue !== '' && cell.inputValue !== '' && selected.inputValue == cell.value;
}

const isGameOver = (game: GameType): boolean  => {
    return game.errors === Error_Count - 1;
}

const isGameFinished = (startingBoardMap: {[key: string]: any}): boolean  => {
    return !Object.keys(startingBoardMap).some(key => startingBoardMap[key].value !== +startingBoardMap[key].inputValue)
}

enum GameStatus {
    none = "none",
    level = "level",
    started = "started",
    paused = "paused",
    failed = "failed",
    success = "success"
}

enum Level {
    none = "0",
    ease = "20",
    normal = "30",
    hard = "45",
    expert = "60"
}

enum Mode {
    notice = "notice",
    write = "write"
}

const LevelName = {
    [Level.none]: "Unknown",
    [Level.ease]: "Easy",
    [Level.normal]: "Normal",
    [Level.hard]: "Hard",
    [Level.expert]: "Expert",
}

export type CellType = {
    value: string
    inputValue: string
    colIndex: number
    rowIndex: number
    selected: boolean
    error: boolean
    disabled: boolean
}


export type GameType = {
    status: GameStatus
    errors: number
    level: Level
    mode: Mode
}

export {
    Error_Count,
    Cell_Size,
    LevelName,
    Numbers,
    Mode,
    GameStatus,
    Level,
    isGameOver,
    isGameFinished,
    inSelectBoxRange,
    inSelectRowRange,
    inSelectColRange,
    isSameValue
}