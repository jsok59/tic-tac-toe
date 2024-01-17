function Gameboard() {
	const rows = 3;
	const cols = 3;
	const board = [];

	for (let i = 0; i < rows; i++) {
		board[i] = [];
		for (let j = 0; j < cols; j++) {
			board[i].push(new Square(0));
		}
	}

	const getBoard = () => board;

	const markSquare = (row, col, player) => {
		if (board[row][col].value == 0) {
			board[row][col].value = player;
			return true;
		} else {
			return false;
		}
	};

	const checkWin = () => {
		/* Horizonal Check and Vertical Check */
		for (let i = 0; i < 3; i++) {
			let sumH = board[i].reduce((total, element) => {
				return total + element.value;
			}, 0);
			if (sumH === 3) return 1;
			else if (sumH === 30) return 2;

			let sumV = 0;
			for (let j = 0; j < 3; j++) {
				sumV += board[j][i].value;
			}
			if (sumV === 3) return 1;
			else if (sumV === 30) return 2;
		}
		/* Diagonals Check */
		let sumDiagTopBot = board[0][0].value + board[1][1].value + board[2][2].value;
		if (sumDiagTopBot === 3) return 1;
		else if (sumDiagTopBot === 30) return 2;
		let sumDiagBotTop = board[2][0].value + board[1][1].value + board[0][2].value;
		if (sumDiagBotTop === 3) return 1;
		else if (sumDiagBotTop === 30) return 2;

		/*Tie Check*/
		let numberOfOpenSpots = 0;
		for (let i = 0; i < 3; i++) {
			numberOfOpenSpots += board[i].reduce((total, element) => {
                
				return element.value === 0 ? total + 1 : total;
			}, 0);
            
		}
		if (numberOfOpenSpots === 0) {
			return 3;
		}

		return 0;
	};

	const printBoard = () => {
		const boardWithSquareValues = board.map((row) => row.map((square) => square.value));
		console.log(boardWithSquareValues);
	};

	const reset = () => {
		for (let i = 0; i < rows; i++) {
			board[i] = [];
			for (let j = 0; j < cols; j++) {
				board[i].push(new Square(0));
			}
		}
	};
	return { getBoard, markSquare, printBoard, checkWin, reset };
}

class Square {

	constructor(value) {
		this._value= value;
	}

	set value(player) {
		this._value = player;
	}

	get value() {
		return this._value;
	}
}

function GameController() {
	const board = Gameboard();

	const players = [
		{
			name: "Player One",
			shape: 1,
		},
		{
			name: "Player Two",
			shape: 10,
		},
	];

	const setName1 = (name) => {
		if (name != "") {
			players[0].name = name;
		}
	};

	const setName2 = (name) => {
		if (name != "") {
			players[1].name = name;
		}
	};

    const getName1 = () => {
		return players[0].name
	};

	const getName2 = (name) => {
		return players[1].name
	};

	let activePlayer = players[0];

	const switchTurn = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	const getActivePlayer = () => activePlayer;

	const printRound = () => {
		board.printBoard();
		console.log(`${getActivePlayer().name}'s turn.`);
	};

	const playRound = (row, col) => {
		console.log(`Marking ${getActivePlayer().name}'s shape into column ${col} and row ${row}.`);
		if (!board.markSquare(row, col, getActivePlayer().shape)) {
			console.log("The square is already marked. Please choose a different square.");
			return null;
		} else {
			board.markSquare(row, col, getActivePlayer().shape);
			let result = board.checkWin();
			if (result === 1) {
				printRound();
				console.log("Player 1 wins");
				return 1;
			} else if (result === 2) {
				printRound();
				console.log("Player 2 wins");
				return 2;
			} else if (result === 3) {
				printRound();
				console.log("It's a tie");
				return 3;
			} else {
				switchTurn();
				printRound();
			}
		}
	};

    const reset = () => {
        activePlayer = players[0];
    }

	return { setName1, setName2, getName1, getName2, playRound, getActivePlayer, board, reset };
}

const screenController = (function () {
	const squares = document.querySelectorAll(".board > div");
	const playerOneInput = document.querySelector(".player1");
	const playerTwoInput = document.querySelector(".player2");
	const controller = GameController();
	const playerTurn = document.querySelector(".turn");


	const updateScreen = (result) => {
		

		let currentBoard = controller.board.getBoard();
		let activePlayer = controller.getActivePlayer();
        if (result == 1 || result == 2){
            playerTurn.textContent = `${activePlayer.name} Wins!`;
            squares.forEach((element) => {
                element.removeEventListener("click", clickHandlerBoard);
            });
        } else if (result == 3) {
            playerTurn.textContent = `It's a tie!`;
            playerTurn.style.color = 'purple';
            squares.forEach((element) => {
                element.removeEventListener("click", clickHandlerBoard);
            });
        } else {
            if (activePlayer.name == controller.getName1()) {
                playerTurn.style.color = 'blue';
            } else {
                playerTurn.style.color = 'red'
            }
            playerTurn.textContent = `${activePlayer.name}'s turn`;
        }

		squares.forEach((element) => {
			let row = element.getAttribute("row");
			let col = element.getAttribute("col");

			if (currentBoard[row][col].value === 1) {
				element.firstElementChild.textContent = "O";
                element.firstElementChild.style.color = 'blue';
			} else if (currentBoard[row][col].value === 10) {
				element.firstElementChild.textContent = "X";
                element.firstElementChild.style.color = 'red';
			} else {
				element.firstElementChild.textContent = "";
			}
		});
	};

	const clickHandlerBoard = (event) => {
		let result = controller.playRound(event.target.parentElement.getAttribute("row"), event.target.parentElement.getAttribute("col"));
		updateScreen(result);
	};

	

	const start = () => {
		controller.board.reset();
        controller.reset();
		controller.setName1(playerOneInput.value);
		controller.setName2(playerTwoInput.value);

        updateScreen();

		squares.forEach((element) => {
			element.removeEventListener("click", clickHandlerBoard);
		});
		squares.forEach((element) => {
			element.addEventListener("click", clickHandlerBoard);
		});
	};

	return { updateScreen, clickHandlerBoard, start };
})();

// test