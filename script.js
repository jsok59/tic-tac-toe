class Gameboard {
	// rows = 3;
	// cols = 3;
	// board = [];

	constructor() {
		this.rows = 3;
		this.cols = 3;
		this.board = [];
		for (let i = 0; i < this.rows; i++) {
			this.board[i] = [];
			for (let j = 0; j < this.cols; j++) {
				this.board[i].push(new Square(0));
			}
		}
	}

	getBoard() {
		return this.board;
	}

	markSquare(row, col, player) {
		if (this.board[row][col].value == 0) {
			this.board[row][col].value = player;
			return true;
		} else {
			return false;
		}
	}

	checkWin() {
		/* Horizonal Check and Vertical Check */
		for (let i = 0; i < 3; i++) {
			let sumH = this.board[i].reduce((total, element) => {
				return total + element.value;
			}, 0);
			if (sumH === 3) return 1;
			else if (sumH === 30) return 2;

			let sumV = 0;
			for (let j = 0; j < 3; j++) {
				sumV += this.board[j][i].value;
			}
			if (sumV === 3) return 1;
			else if (sumV === 30) return 2;
		}
		/* Diagonals Check */
		let sumDiagTopBot = this.board[0][0].value + this.board[1][1].value + this.board[2][2].value;
		if (sumDiagTopBot === 3) return 1;
		else if (sumDiagTopBot === 30) return 2;
		let sumDiagBotTop = this.board[2][0].value + this.board[1][1].value + this.board[0][2].value;
		if (sumDiagBotTop === 3) return 1;
		else if (sumDiagBotTop === 30) return 2;

		/*Tie Check*/
		let numberOfOpenSpots = 0;
		for (let i = 0; i < 3; i++) {
			numberOfOpenSpots += this.board[i].reduce((total, element) => {
				return element.value === 0 ? total + 1 : total;
			}, 0);
		}
		if (numberOfOpenSpots === 0) {
			return 3;
		}

		return 0;
	}



	reset() {
		for (let i = 0; i < this.rows; i++) {
			this.board[i] = [];
			for (let j = 0; j < this.cols; j++) {
				this.board[i].push(new Square(0));
			}
		}
	}
}

class Square {
	constructor(value) {
		this._value = value;
	}

	set value(player) {
		this._value = player;
	}

	get value() {
		return this._value;
	}
}

class GameController {
	board = new Gameboard();

	players = [
		{
			name: "Player One",
			shape: 1,
		},
		{
			name: "Player Two",
			shape: 10,
		},
	];

	activePlayer = this.players[0];

	setName1(name) {
		if (name != "") {
			this.players[0].name = name;
		}
	}

	setName2(name) {
		if (name != "") {
			this.players[1].name = name;
		}
	}

	getName1() {
		return this.players[0].name;
	}

	getName2(name) {
		return this.players[1].name;
	}

	switchTurn() {
		this.activePlayer = this.activePlayer === this.players[0] ? this.players[1] : this.players[0];
	}

	getActivePlayer() {
		return this.activePlayer;
	}

	

	playRound(row, col) {

		if (!this.board.markSquare(row, col, this.getActivePlayer().shape)) {

			return null;
		} else {
			this.board.markSquare(row, col, this.getActivePlayer().shape);
			let result = this.board.checkWin();
			if (result === 1) {
				
				return 1;
			} else if (result === 2) {
				
				return 2;
			} else if (result === 3) {
				
				return 3;
			} else {
				this.switchTurn();
			}
		}
	}

	reset() {
		this.activePlayer = this.players[0];
	}
}

const screenController = (function () {
	const squares = document.querySelectorAll(".board > div");
	const playerOneInput = document.querySelector(".player1");
	const playerTwoInput = document.querySelector(".player2");
	const controller = new GameController();
	const playerTurn = document.querySelector(".turn");

	const updateScreen = (result) => {
		let currentBoard = controller.board.getBoard();
		let activePlayer = controller.getActivePlayer();
		if (result == 1 || result == 2) {
			playerTurn.textContent = `${activePlayer.name} Wins!`;
			squares.forEach((element) => {
				element.removeEventListener("click", clickHandlerBoard);
			});
		} else if (result == 3) {
			playerTurn.textContent = `It's a tie!`;
			playerTurn.style.color = "purple";
			squares.forEach((element) => {
				element.removeEventListener("click", clickHandlerBoard);
			});
		} else {
			if (activePlayer.name == controller.getName1()) {
				playerTurn.style.color = "blue";
			} else {
				playerTurn.style.color = "red";
			}
			playerTurn.textContent = `${activePlayer.name}'s turn`;
		}

		squares.forEach((element) => {
			let row = element.getAttribute("row");
			let col = element.getAttribute("col");

			if (currentBoard[row][col].value === 1) {
				element.firstElementChild.textContent = "O";
				element.firstElementChild.style.color = "blue";
			} else if (currentBoard[row][col].value === 10) {
				element.firstElementChild.textContent = "X";
				element.firstElementChild.style.color = "red";
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
