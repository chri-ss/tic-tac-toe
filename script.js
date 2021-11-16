const gameBoard = (() => {
    let board = []
    
    const updateBoard = () => {
        const cells = Array.from(document.querySelectorAll('.square'));
        for (let i = 0; i < 9; ++i)
        {
            board.pop();
        }
        for(let i = 0; i < 9; ++i)
        {
            if(cells[i].textContent != '')
            {
                board.push(cells[i].textContent);
            }
            else
            {
                board.push(i);
            }
        }
        return board;
    }
    
    const addMarkers = () => {
        let gridCells = Array.from(document.querySelectorAll('.square'));
        gridCells.forEach(cell => {
            cell.addEventListener('click', () => {
                if (player1.turn === true && cell.textContent === '' && player1.win != true &&  player2.win != true)
                {
                    cell.textContent = player1.team;
                    player1.turn = false;
                    player2.turn = true;
                    displayController.updateTurnDisplay();
                    updateBoard();
                    if(game.checkForWinner(board, player1.team))
                    {
                        player1.win = true;
                        displayController.updateWinner(player1);
                    }
                }
                else if (player2.turn === true && cell.textContent === '' && player1.win != true &&  player2.win != true)
                {
                    cell.textContent = player2.team;
                    player2.turn = false;
                    player1.turn = true; 
                    displayController.updateTurnDisplay();
                    updateBoard();
                    if (game.checkForWinner(board, player2.team))
                    {
                        player2.win = true;
                        displayController.updateWinner(player2);
                    }
                }
            })
        })
    }

    return { updateBoard, addMarkers};
})();

const game = (() => {

    const initNewGame = () => {
        let ai = document.getElementById('ai');
        let p2 = document.querySelector('.player-two');
        ai.addEventListener('change', () => {
            p2.disabled === true ? p2.disabled = false : p2.disabled = true;
        })

        let start = document.querySelector('.new-game');
        start.addEventListener('click', (e) => {
            e.preventDefault();
            game.startGame();
        })
    }

    const startGame = () => {
        let ai = document.getElementById('ai');
        let p1 = document.querySelector('.player-one');
        let p2 = document.querySelector('.player-two');
        player1 = createPlayer(p1.value, 'X');

        if (ai.checked)
        {
            player2 = createPlayer('ai', 'O')
            player2.type = 'ai';
        }
        else
        {
            player2 = createPlayer(p2.value, 'O');    
        }
        
        player1.turn = true;
        player2.turn = false;
        displayController.buildBoard();
        displayController.removeForm();
        gameBoard.addMarkers();
        displayController.updateTurnDisplay();

        return {player1, player2}
    }

    const checkForWinner = (board, sym) => {

        let winConditions = [board[0] === sym && board[1] === sym && board[2] === sym,
                            board[3] === sym && board[4] === sym && board[5] === sym,
                            board[6] === sym && board[7] === sym && board[8] === sym,
                            board[0] === sym && board[3] === sym && board[6] === sym,
                            board[1] === sym && board[4] === sym && board[7] === sym,
                            board[2] === sym && board[5] === sym && board[8] === sym,
                            board[0] === sym && board[4] === sym && board[8] === sym,
                            board[2] === sym && board[4] === sym && board[6] === sym,]

        for(let i = 0; i < 8; ++i)
        {
            if (winConditions[i])
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }

    
    return {initNewGame, startGame, checkForWinner}
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
            const square = document.createElement('button');
            const classes = ['square', i.toString()]
            square.classList.add(...classes);
            grid.appendChild(square);
            square.textContent = '';
        }
    }

    const updateTurnDisplay = () => {
        const playerContainer = document.querySelector('.player-container');
        if (player1.turn === true)
        {
            playerContainer.textContent = `${player1.name}'s turn'`;
        }
        else if(player2.turn === true)
        {
            playerContainer.textContent = `${player2.name}'s turn'`;
        }
    }

    const removeForm = () => {
        let form = document.querySelector('.start-form');
        
        form.classList.add('hide-form');
    }

    const addForm = () => {
        let form = document.querySelector('.start-form');
        
        form.classList.remove('hide-form');
    }

    const updateWinner = (player) => {
        const boardContainer = document.querySelector('.board-container');
        const winMessage = document.createElement('p');
        winMessage.textContent = `${player.name} Won!`;
        boardContainer.appendChild(winMessage);
    }

    return {buildBoard, updateTurnDisplay, updateWinner, removeForm, addForm}
})();

const aiController = (() => {

    const getEmpties = (board) => {
        return board.filter (cell => cell != 'X' && cell != 'O');
    }

    return {getEmpties}
})();

game.initNewGame();
