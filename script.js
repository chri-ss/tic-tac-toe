const gameBoard = (() => {
    let board = ['', '', '', '', '', '', '', '', '']

    const updateBoard = () => {
        for (i = 0; i < board.length; ++i) {
            board[i] = 'X';
        }
        return board;
    }

    return { updateBoard};
})();

const game = (() => {
    const startGame = () => {
        let p1 = document.querySelector('.player-one');
        let p2 = document.querySelector('.player-two');
        player1 = createPlayer(p1.value, 'X');
        player2 = createPlayer(p2.value, 'O');
        displayController.buildBoard();

        console.log(player1, player2);
    }
    return {startGame}
})();

const createPlayer = (name, team) => {

    return { name, team }
}

const displayController = (() => {

    const buildBoard = () => {
        const boardContainer = document.querySelector('.board-container');
        const grid = document.createElement('div');
        grid.classList.add('grid');
        boardContainer.appendChild(grid);
        for (let i = 0; i < 9; ++i) {
            const square = document.createElement('div');
            square.classList.add('square');
            grid.appendChild(square);
        }
    }

    const initNewGame = () => {
        let start = document.querySelector('.new-game');
        start.addEventListener('click', (e) => {
            e.preventDefault();
            game.startGame();
        })
    }

    const removeForm = () => {
        let form = document.querySelector('.start-form');
        
        form.classList.add('hide-form');
    }

    const addForm = () => {
        let form = document.querySelector('.start-form');
        
        form.classList.remove('hide-form');
    }

    return {buildBoard, removeForm, addForm}
})();