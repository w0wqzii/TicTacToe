const board = document.getElementById('board');
const status = document.getElementById('status');
let cells = Array(9).fill('');
let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'pvp';

const winLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function showError(message) {
  console.error(`[TicTacToe Error] ${message}`);
  if (status) {
    status.textContent = `⚠️ Ошибка: ${message}`;
    status.style.color = 'red';
  }
}

function setMode(mode) {
  try {
    if (mode !== 'pvp' && mode !== 'ai') {
      throw new Error(`Недопустимый режим игры: "${mode}". Допустимые значения: "pvp", "ai".`);
    }
    gameMode = mode;
    resetGame();
  } catch (error) {
    showError(error.message);
  }
}

function createBoard() {
  try {
    if (!board) {
      throw new Error('Элемент #board не найден в DOM.');
    }
    board.innerHTML = '';
    cells.forEach((_, i) => {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.index = i;
      cell.addEventListener('click', handleClick);
      board.appendChild(cell);
    });
  } catch (error) {
    showError(error.message);
  }
}

function handleClick(e) {
  try {
    const index = Number(e.target.dataset.index);

    if (Number.isNaN(index)) {
      throw new Error('Некорректный индекс ячейки.');
    }
    if (index < 0 || index > 8) {
      throw new Error(`Индекс ячейки вне диапазона: ${index}.`);
    }
    if (cells[index] !== '') {
      throw new Error('Ячейка уже занята.');
    }
    if (!gameActive) {
      throw new Error('Игра завершена. Начните новую партию.');
    }

    makeMove(index, currentPlayer);

    if (checkGameEnd()) return;

    if (gameMode === 'ai' && currentPlayer === 'O') {
      setTimeout(() => {
        try {
          const bestMoveIndex = getBestMove();
          if (bestMoveIndex === undefined) {
            throw new Error('Не удалось определить ход ИИ.');
          }
          makeMove(bestMoveIndex, 'O');
          checkGameEnd();
        } catch (aiError) {
          showError(`Ошибка хода ИИ: ${aiError.message}`);
        }
      }, 300);
    }
  } catch (error) {
    showError(error.message);
  }
}

function makeMove(index, player) {
  try {
    if (index < 0 || index > 8) {
      throw new Error(`Недопустимый индекс хода: ${index}.`);
    }
    if (player !== 'X' && player !== 'O') {
      throw new Error(`Недопустимый игрок: "${player}".`);
    }
    if (cells[index] !== '') {
      throw new Error('Нельзя сделать ход в занятую ячейку.');
    }

    const cellElement = board?.children[index];
    if (!cellElement) {
      throw new Error(`Элемент ячейки с индексом ${index} не найден.`);
    }

    cells[index] = player;
    cellElement.textContent = player;
    cellElement.classList.add(player.toLowerCase());

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
  } catch (error) {
    showError(error.message);
  }
}

function updateStatus() {
  try {
    if (!gameActive) return;
    if (!status) {
      throw new Error('Элемент #status не найден в DOM.');
    }
    status.textContent = `Ход: ${currentPlayer}`;
    status.style.color = '';
  } catch (error) {
    showError(error.message);
  }
}

function checkGameEnd() {
  try {
    const lastPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (checkWin(lastPlayer)) {
      status.textContent = `🎉 Победил: ${lastPlayer}!`;
      gameActive = false;
      return true;
    }

    if (cells.every(c => c !== '')) {
      status.textContent = '🤝 Ничья!';
      gameActive = false;
      return true;
    }
    return false;
  } catch (error) {
    showError(error.message);
    return true; 
  }
}

function checkWin(player) {
  try {
    if (player !== 'X' && player !== 'O') {
      throw new Error(`Недопустимый игрок для проверки победы: "${player}".`);
    }
    return winLines.some(line => {
      const [a, b, c] = line;
      if (cells[a] === player && cells[b] === player && cells[c] === player) {
        highlightWin(line);
        return true;
      }
      return false;
    });
  } catch (error) {
    showError(error.message);
    return false;
  }
}

function highlightWin(line) {
  try {
    const cellElements = board.children;
    line.forEach(i => {
      if (cellElements[i]) {
        cellElements[i].classList.add('win');
      } else {
        throw new Error(`Невозможно подсветить ячейку с индексом ${i}.`);
      }
    });
  } catch (error) {
    showError(error.message);
  }
}

function getBestMove() {
  try {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
      if (cells[i] === '') {
        cells[i] = 'O';
        let score = minimax(cells, 0, false);
        cells[i] = '';

        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    if (move === undefined) {
      throw new Error('Нет доступных ходов для ИИ.');
    }
    return move;
  } catch (error) {
    showError(error.message);
    return undefined;
  }
}

const scores = {
  X: -10,
  O: 10,
  tie: 0
};

function minimax(boardState, depth, isMaximizing) {
  try {
    if (depth > 9) {
      throw new Error('Превышена максимальная глубина рекурсии.');
    }

    if (checkWinnerForMinimax('O')) return scores.O;
    if (checkWinnerForMinimax('X')) return scores.X;
    if (boardState.every(c => c !== '')) return scores.tie;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (boardState[i] === '') {
          boardState[i] = 'O';
          let score = minimax(boardState, depth + 1, false);
          boardState[i] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (boardState[i] === '') {
          boardState[i] = 'X';
          let score = minimax(boardState, depth + 1, true);
          boardState[i] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  } catch (error) {
    showError(`Minimax: ${error.message}`);
    return 0;
  }
}

function checkWinnerForMinimax(player) {
  try {
    return winLines.some(line => {
      return line.every(index => cells[index] === player);
    });
  } catch (error) {
    showError(error.message);
    return false;
  }
}

function resetGame() {
  try {
    cells = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;
    if (status) {
      status.textContent = 'Ход: X';
      status.style.color = '';
    }
    createBoard();
  } catch (error) {
    showError(error.message);
  }
}

window.addEventListener('error', (event) => {
  showError(`Непредвиденная ошибка: ${event.message}`);
});

window.addEventListener('unhandledrejection', (event) => {
  showError(`Необработанное отклонение промиса: ${event.reason}`);
});

// ===== Инициализация =====
try {
  createBoard();
} catch (error) {
  showError(`Ошибка инициализации: ${error.message}`);
}