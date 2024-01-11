function Gameboard() {
	const rows = 3;
	const cols = 3;
	const board = [];

	for (let i = 0; i < rows; i++) {
		board[i] = [];
		for (let j = 0; j < cols; j++) {
			board[i].push(Square());
		}
	}

	const getBoard = () => board;

	const markSquare = (row, col, player) => {
		if (board[row][col].getValue() == 0) {
			board[row][col].addSquare(player);
			return true;
		} else {
			return false;
		}
	};

	const checkWin = () => {
		/* Horizonal Check and Vertical Check */
		for (let i = 0; i < 3; i++) {
			let sumH = board[i].reduce((total, element) => {
				return total + element.getValue();
			}, 0);
			if (sumH === 3) return 1;
			else if (sumH === 30) return 2;

			let sumV = 0;
			for (let j = 0; j < 3; j++) {
				sumV += board[j][i].getValue();
			}
			if (sumV === 3) return 1;
			else if (sumV === 30) return 2;
		}
		/* Diagonals Check */
		let sumDiagTopBot = board[0][0].getValue() + board[1][1].getValue() + board[2][2].getValue();
		if (sumDiagTopBot === 3) return 1;
		else if (sumDiagTopBot === 30) return 2;
		let sumDiagBotTop = board[2][0].getValue() + board[1][1].getValue() + board[0][2].getValue();
		if (sumDiagBotTop === 3) return 1;
		else if (sumDiagBotTop === 30) return 2;

		/*Tie Check*/
		let numberOfOpenSpots = 0;
		for (let i = 0; i < 3; i++) {
			numberOfOpenSpots = board[i].reduce((total, element) => {
				return element.getValue() === 0 ? total + 1 : total;
			}, 0);
		}
		if (numberOfOpenSpots === 0) {
			return 3;
		}

		return 0;
	};

	const printBoard = () => {
		const boardWithSquareValues = board.map((row) => row.map((square) => square.getValue()));
		console.log(boardWithSquareValues);
	};

	const reset = () => {
		for (let i = 0; i < rows; i++) {
			board[i] = [];
			for (let j = 0; j < cols; j++) {
				board[i].push(Square());
			}
		}
	};
	return { getBoard, markSquare, printBoard, checkWin, reset };
}

function Square() {
	let value = 0;

	const addSquare = (player) => {
		value = player;
	};

	const getValue = () => value;
	return { addSquare, getValue };
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

	return { setName1, setName2, playRound, getActivePlayer, board };
}

const screenController = (function () {
	const squares = document.querySelectorAll(".board > div");
	const playerOneInput = document.querySelector(".player1");
	const playerTwoInput = document.querySelector(".player2");
	const controller = GameController();
	const playerTurn = document.querySelector(".turn");

	const updateScreen = () => {
		squares.forEach((element) => {
			element.firstElementChild.textContent = "";
		});

		let currentBoard = controller.board.getBoard();
		let activePlayer = controller.getActivePlayer();

		playerTurn.textContent = `${activePlayer.name}'s turn`;

		squares.forEach((element) => {
			let row = element.getAttribute("row");
			let col = element.getAttribute("col");

			if (currentBoard[row][col].getValue() === 1) {
				element.firstElementChild.textContent = "O";
			} else if (currentBoard[row][col].getValue() === 10) {
				element.firstElementChild.textContent = "X";
			} else {
				element.firstElementChild.textContent = "";
			}
		});
	};

	const clickHandlerBoard = (event) => {
		controller.playRound(event.target.parentElement.getAttribute("row"), event.target.parentElement.getAttribute("col"));
		updateScreen();
	};

	const reset = () => {
		controller.board.reset();
        updateScreen();
		squares.forEach((element) => {
			element.firstElementChild.textContent = "";
		});
	};

	const start = () => {
		reset();
		controller.setName1(playerOneInput.value);
		controller.setName2(playerTwoInput.value);
		squares.forEach((element) => {
			element.removeEventListener("click", clickHandlerBoard);
		});
		squares.forEach((element) => {
			element.addEventListener("click", clickHandlerBoard);
		});
	};

	return { updateScreen, clickHandlerBoard, squares, reset, start };
})();
