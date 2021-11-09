const gameBoard = (() => {
    let board = ['', '', '', '', '', '', '', '', '']

    const updateBoard = () => {
        for(i = 0; i < board.length; ++i)
        {
            board[i] = 'X';
        }
        return board;
    }

    const buildBoard = () => {
        const boardContainer = document.querySelector('.board-container');
        const grid = document.createElement('div');
        grid.classList.add('grid');
        boardContainer.appendChild(grid);
        for(let i = 0; i < board.length; ++i)
        {
            const square = document.createElement('div');
            square.classList.add('square');
            square.textContent = board[i];
            grid.appendChild(square);
        }
    }

    return {updateBoard, buildBoard};
})();

const createPlayer = (name) => {
    let score = 0;
    return {score, name}
}