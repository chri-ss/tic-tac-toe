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
                    else if (player2.type === 'ai')
                    {
                        aiController.makeMove();
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

    return {board, updateBoard, addMarkers};
})();

const game = (() => {

    const initNewGame = () => {
        let ai = document.getElementById('ai');
        let p2 = document.querySelector('.player-two');
        ai.addEventListener('change', () => {
            if (p2.disabled)
            {
                p2.disabled = false;
            }
            else
            {
                p2.value = '';
                p2.disabled = true;
            }

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
        displayController.addResetButton();

        return {player1, player2}
    }

    const checkForWinner = (board, sym) => {

        if (board[0] === sym && board[1] === sym && board[2] === sym ||
            board[3] === sym && board[4] === sym && board[5] === sym ||
            board[6] === sym && board[7] === sym && board[8] === sym ||
            board[0] === sym && board[3] === sym && board[6] === sym ||
            board[1] === sym && board[4] === sym && board[7] === sym ||
            board[2] === sym && board[5] === sym && board[8] === sym ||
            board[0] === sym && board[4] === sym && board[8] === sym ||
            board[2] === sym && board[4] === sym && board[6] === sym)
            {
                return true;
            }
            else
            {
                return false;
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
        if (player1.turn)
        {
            playerContainer.textContent = `${player1.name}'s turn'`;
        }
        else if(player2.turn)
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
        const playerContainer = document.querySelector('.player-container');
        playerContainer.style.fontSize = '50px';
        playerContainer.textContent = `${player.name} Wins!`;
    }

    const addResetButton = () => {
        const footer = document.querySelector('.footer');
        const resetButton = document.createElement('button');
        resetButton.classList.add('reset');
        resetButton.textContent = 'reset';
        footer.appendChild(resetButton);
        resetButton.addEventListener('click', () => {
            location.reload();
        });

    }

    return {buildBoard, updateTurnDisplay, updateWinner, removeForm, addForm, addResetButton}
})();

const aiController = (() => {

    const getEmpties = (board) => {
        return board.filter(cell => cell != 'X' && cell != 'O');
    }

    const minimax = (board, player) => {

        const empties = getEmpties(board);

        if(game.checkForWinner(board, player1.team))
        {
            return {score: -10};
        }
            else if(game.checkForWinner(board, player2.team))
        {
            return {score: 10};
        }
        else if (empties.length === 0)
        {
            return {score: 0};
        }

        let moves = [];

        for(i = 0; i < empties.length; ++i)
        {
            var move = {};
            move.index = board[empties[i]];

            board[empties[i]] = player;

            if(player === player2.team)
            {
                var result = minimax(board, player1.team);
                move.score = result.score;
            }
            else
            {
                var result = minimax(board, player2.team)
                move.score = result.score;
            }

            board[empties[i]] = move.index;
            moves.push(move)
        }

        var bestMove;

        if(player === player2.team)
        {
            var bestScore = -10000;
            for(var i = 0; i < moves.length; ++i)
            {
                if(moves[i].score > bestScore)
                {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        else
        {
            var bestScore = 10000;
            for(var i = 0; i < moves.length; ++i)
            {
                if (moves[i].score < bestScore)
                {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }


    let makeMove = () => {
        if (player2.type ===  'ai')
        {
            gameBoard.updateBoard();
            let moveToMake = minimax(gameBoard.board, player2.team)
            console.log(moveToMake);
            let cells = Array.from(document.querySelectorAll('.square'));
            cells[moveToMake.index].textContent = player2.team;
            player2.turn = false;
            player1.turn = true; 
            displayController.updateTurnDisplay();
            gameBoard.updateBoard();
            if (game.checkForWinner(gameBoard.board, player2.team))
            {
                player2.win = true;
                displayController.updateWinner(player2);
            }
        }
    }

    return {getEmpties, makeMove, minimax}
})();

game.initNewGame();
