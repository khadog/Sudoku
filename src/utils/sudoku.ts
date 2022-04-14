import { CellType } from "./game";

export type SudokuBoardType = number[][];
export type SudokuBoardMapType = {[key: string]: CellType};

const numArray:number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let counter:number = 0;
let pokeCounter:number = 0;

// Placement Criteria
const rowSafe = (puzzleArray: SudokuBoardType, emptyCell: CellType, num: number) :boolean => {
    // -1 is return value of .find() if value not found
    return puzzleArray[emptyCell.rowIndex].indexOf(num) === -1;
};

const colSafe = (puzzleArray: SudokuBoardType, emptyCell: CellType, num: number) :boolean  => {
    return !puzzleArray.some(row => row[emptyCell.colIndex] === num);
};

const boxSafe = (puzzleArray: SudokuBoardType, emptyCell: CellType, num: number) :boolean  => {
    // Define top left corner of box region for empty cell
    const boxStartRow = emptyCell.rowIndex - (emptyCell.rowIndex % 3);
    const boxStartCol = emptyCell.colIndex - (emptyCell.colIndex % 3);
    let safe = true;

    for (let boxRow of [0, 1, 2]) {  // Each box region has 3 rows
        for (let boxCol of [0, 1, 2]) { // Each box region has 3 columns
            // Is num is present in box region?
            if (puzzleArray[boxStartRow + boxRow][boxStartCol + boxCol] === num) {
                safe = false; // If number is found, it is not safe to place
            }
        }
    }
    return safe;
};

const safeToPlace = (puzzleArray: SudokuBoardType, emptyCell: CellType, num: number) :boolean => {
    return rowSafe(puzzleArray, emptyCell, num) &&
        colSafe(puzzleArray, emptyCell, num) &&
        boxSafe(puzzleArray, emptyCell, num);
};

const shuffle = (array: number[]) => {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const fillPuzzle = (emptyBoard: SudokuBoardType) : undefined | SudokuBoardType => {
    counter = 0;
    pokeCounter = 0;
    const emptyCell: CellType | undefined = nextEmptyCell(emptyBoard);
    // If there are no more zeros, the board is finished, return it
    if (typeof emptyCell === 'undefined') return emptyBoard;

    for (let num of shuffle(numArray)) {
        // counter is a global variable tracking the number of iterations performed in generating a puzzle
        // Most puzzles generate in < 500ms, but occassionally random generation could run in to
        // heavy backtracking and result in a long wait. Best to abort this attempt and restart.
        // See initializer function for more
        counter++;
        if (counter > 20_000_000) throw new Error('Recursion Timeout');

        if (safeToPlace(emptyBoard, emptyCell, num)) {
            // If safe to place number, place it
            emptyBoard[emptyCell.rowIndex][emptyCell.colIndex] = num;

            // Recursively call the fill function to place num in next empty cell
            if (fillPuzzle(emptyBoard)) return emptyBoard;

            // If we were unable to place the future num, that num was wrong.
            // Reset it and try next
            emptyBoard[emptyCell.rowIndex][emptyCell.colIndex] = 0;
        }
    }
    // If unable to place any number, return false,
    // causing previous round to go to next num
    return undefined;
};

// Generating a Playable Board
const pokeHoles = (startingBoard: SudokuBoardType, holes: number) => {
    const removedVals: SudokuBoardMapType = {};
    const val = shuffle(range(0, 80));

    while (Object.keys(removedVals).length < holes) {
        const nextVal = val.pop();
        if (nextVal === undefined) throw new Error('Impossible Game');
        const randomRowIndex = Math.floor(nextVal / 9); // Integer 0-8 for row index
        const randomColIndex = nextVal % 9;

        if (!startingBoard[randomRowIndex]) continue; // guard against cloning error
        if (startingBoard[randomRowIndex][randomColIndex] === 0) continue; // If cell already empty, restart loop
        const key = 'row' + randomRowIndex + '_col' + randomColIndex;
        removedVals[key] = {  // Store the current value at the coordinates
            rowIndex: randomRowIndex,
            colIndex: randomColIndex,
            value: startingBoard[randomRowIndex][randomColIndex],
        }

        startingBoard[randomRowIndex][randomColIndex] = 0; // "poke a hole" in the board at the coords

        // Attempt to solve the board after removing value. If it cannot be solved, restore the old value.
        // and remove that option from the list

        if (multiplePossibleSolutions(startingBoard.map(row => row.slice()))) {
            startingBoard[randomRowIndex][randomColIndex] = removedVals[key].value;
        }

    }
    return {removedVals, startingBoard};
};

// Generating a Game Board
const nextEmptyCell = (puzzleArray: SudokuBoardType) : undefined | CellType => {
    const emptyCell: CellType = {rowIndex: -1, colIndex: -1, value: 0};

    puzzleArray.forEach((row, rowIndex) => {
        // If this key has already been assigned, skip iteration
        if (emptyCell.colIndex !== -1) return;

        // find first zero-element
        const firstZero = row.find(col => col === 0);
        // if no zero present, skip to next row
        if (firstZero === undefined) return;

        emptyCell.rowIndex = rowIndex;
        emptyCell.colIndex = row.indexOf(firstZero);
    });

    if (emptyCell.colIndex !== -1) return emptyCell;
    // If emptyCell was never assigned, there are no more zeros
    return undefined;
};


// The board will be completely solved once for each item in the empty cell list.
// The empty cell array is rotated on each iteration, so that the order of the empty cells
// And thus the order of solving the game, is different each time.
// The solution for each attempt is pushed to a possibleSolutions array as a string
// Multiple solutions are identified by taking a unique Set from the possible solutions
// and measuring its length. If multiple possible solutions are found at any point
// If will return true, prompting the pokeHoles function to select a new value for removal.

const multiplePossibleSolutions = (boardToCheck: SudokuBoardType) : SudokuBoardType | undefined => {
    const possibleSolutions = [];
    const emptyCellArray = emptyCellCoords(boardToCheck);
    for (let index = 0; index < emptyCellArray.length; index++) {
        // Rotate a clone of the emptyCellArray by one for each iteration
        const emptyCellClone: CellType[] = [...emptyCellArray];
        const startingPoint = emptyCellClone.splice(index, 1);
        emptyCellClone.unshift(startingPoint[0]);

        const thisSolution = fillFromArray(boardToCheck.map(row => row.slice()), emptyCellClone);
        if(typeof thisSolution !== 'undefined'){
            possibleSolutions.push(thisSolution.join());
        }
        if (Array.from(new Set(possibleSolutions)).length > 1) return;
    }
    return;
}

// This will attempt to solve the puzzle by placing values into the board in the order that
// the empty cells list presents
const fillFromArray = (startingBoard: SudokuBoardType, emptyCellArray: CellType[]) : SudokuBoardType | undefined => {
    const emptyCell: CellType | undefined = nextStillEmptyCell(startingBoard, emptyCellArray);
    if (typeof emptyCell === 'undefined') return startingBoard;

    for (let num of shuffle(numArray)) {
        pokeCounter++;
        if (pokeCounter > 60_000_000) throw new Error('Poke Timeout');
        if (safeToPlace(startingBoard, emptyCell, num)) {
            startingBoard[emptyCell.rowIndex][emptyCell.colIndex] = num;
            if (fillFromArray(startingBoard, emptyCellArray)) return startingBoard;
            startingBoard[emptyCell.rowIndex][emptyCell.colIndex] = 0;
        }
    }
    return;
}

// As numbers get placed, not all of the initial cells are still empty.
// This will find the next still empty cell in the list
const nextStillEmptyCell = (startingBoard: SudokuBoardType, emptyCellArray: CellType[]) : CellType | undefined => {
    for (let coords of emptyCellArray) {
        if (startingBoard[coords.rowIndex][coords.colIndex] === 0) return {rowIndex: coords.rowIndex, colIndex: coords.colIndex, value: 0};
    }
    return;
}

// Generate array from range, inclusive of start & endbounds.
const range = (start:number, end:number) :number[] => {
    const length = end - start + 1;
    return Array.from({length}, (_, i) => start + i);
};

// Get a list of all empty cells in the board from top-left to bottom-right
const emptyCellCoords = (startingBoard: SudokuBoardType) => {
    const listOfEmptyCells = [];
    for (const rowIndex of range(0, 8)) {
        for (const colIndex of range(0, 8)) {
            if (startingBoard[rowIndex][colIndex] === 0) listOfEmptyCells.push({rowIndex, colIndex, value: 0});
        }
    }
    return listOfEmptyCells;
}

export {
    pokeHoles,
    fillPuzzle,
    safeToPlace
}