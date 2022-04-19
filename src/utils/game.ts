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
    ease = "1",
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

enum ControlsKeys {
    ArrowUp = "ArrowUp",
    ArrowLeft = "ArrowLeft",
    ArrowRight = "ArrowRight",
    ArrowDown = "ArrowDown",
    w = "w",
    a = "a",
    d = "d",
    s = "s"
}

const ControlKeys: ControlKeyType[] = [
    {
        code: ControlsKeys.ArrowUp,
        value: -1
    },
    {
        code: ControlsKeys.ArrowLeft,
        value: -1
    },
    {
        code: ControlsKeys.ArrowRight,
        value: 1
    },
    {
        code: ControlsKeys.ArrowDown,
        value: 1
    },
    {
        code: ControlsKeys.w,
        value: -1
    },
    {
        code: ControlsKeys.a,
        value: -1
    },
    {
        code: ControlsKeys.d,
        value: 1
    },
    {
        code: ControlsKeys.s,
        value: 1
    },
  ];

const DefaultNotes = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
  }

  export type ControlKeyType = {
    code: string
    value: number
}

export type CellType = {
    value: number
    inputValue?: number | string
    notes?: {[key: number]: boolean}
    colIndex: number
    rowIndex: number
    selected?: boolean
    error?: boolean
    disabled?: boolean
    hovered?: boolean
    active?: boolean
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
    ControlKeys,
    DefaultNotes,
    Mode,
    GameStatus,
    Level,
    ControlsKeys,
    isGameOver,
    isGameFinished,
    inSelectBoxRange,
    inSelectRowRange,
    inSelectColRange,
    isSameValue
}