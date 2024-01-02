function Gameboard() {

    const rows = 3;
    const cols = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            board[i].push(Square());
        }
    };

    const getBoard = () => board;

    const markSquare = (row, col, player) => {
        if (board[row][col].getValue() == 0) {
            board[row][col].addSquare(player);
            return true;
        } else {
            return false;
        }
    };
    
    const printBoard = () => {
        const boardWithSquareValues = board.map((row) => row.map((square) => square.getValue()));
        console.log(boardWithSquareValues);
    };

    return {getBoard, markSquare, printBoard};
}

function Square() {
    let value = 0;

    const addSquare = (player) => {
        value = player;
    };

    const getValue = () => value;
    return {addSquare, getValue};

}


function GameController(playerOne = "Player One", playerTwo = "Player Two") {
    const board = Gameboard();
    const players = [{
        name: playerOne,
        shape: 1
    },
    {
        name: playerTwo,
        shape: 2
    }];

    let activePlayer = players[0];

    const switchTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]; 
    };

    const getActivePlayer = () => activePlayer;

    const printRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    const playRound = (row, col) => {
        console.log(`Marking ${getActivePlayer().name}'s shape into column ${col} and row ${row}.`)
        if(!board.markSquare(row, col, getActivePlayer().shape)) {
            console.log("The square is already marked. Please choose a different square.")
        } else {
            board.markSquare(row, col, getActivePlayer().shape)
            switchTurn();
            printRound();
        }  
    }

    printRound();

    return {playRound, getActivePlayer};

}

const game = GameController();