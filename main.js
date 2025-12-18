const unitSize = 25;

const game = {
  state: {
    isRunning: false,
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    score: 0,
    difficulty: "normal",
    lastTailPosition: null,
    applePosition: [],
  },

  ui: {
    ctx: null,
    canvas: document.getElementById("canvas"),
    scoreText: document.getElementById("score"),
    gameOverText: document.querySelector("#game-over-text"),
    gameOverBackground: document.querySelector(".game-over-background"),
    pressAnyKeyMessage: document.getElementById("press-any-key"),
    highscoreList: document.getElementById("highscore-container"),
    normalBtn: document.getElementById("normal-btn"),
    allDifficultyBtn: document.querySelectorAll(".difficulty-btn"),
  },

  config: {
    gameSpeed: 120,
    canvasColor: "aliceblue",
  },

  entities: {
    apple: { x: 0, y: 0 },
    snake: [
      { x: 3 * unitSize, y: 0 },
      { x: 2 * unitSize, y: 0 },
      { x: 1 * unitSize, y: 0 },
      { x: 0 * unitSize, y: 0 },
    ],
    snakePart: {
      head_left: { x: 0, y: 0, width: 25, height: 25 },
      head_top: { x: 25, y: 0, width: 25, height: 25 },
      head_right: { x: 50, y: 0, width: 25, height: 25 },
      head_down: { x: 75, y: 0, width: 25, height: 25 },
      body_horizontal: { x: 100, y: 0, width: 25, height: 25 },
      body_horizontal_fill: { x: 125, y: 0, width: 25, height: 25 },
      body_vertical: { x: 150, y: 0, width: 25, height: 25 },
      body_vertical_fill: { x: 175, y: 0, width: 25, height: 25 },

      tail_top: { x: 0, y: 25, width: 25, height: 25 },
      tail_top_fill: { x: 25, y: 25, width: 25, height: 25 },
      tail_right: { x: 50, y: 25, width: 25, height: 25 },
      tail_right_fill: { x: 75, y: 25, width: 25, height: 25 },
      tail_down: { x: 100, y: 25, width: 25, height: 25 },
      tail_down_fill: { x: 125, y: 25, width: 25, height: 25 },
      tail_left: { x: 150, y: 25, width: 25, height: 25 },
      tail_left_fill: { x: 175, y: 25, width: 25, height: 25 },

      corner_left_down: { x: 0, y: 50, width: 25, height: 25 },
      corner_left_down_fill: { x: 25, y: 50, width: 25, height: 25 },
      corner_left_top: { x: 50, y: 50, width: 25, height: 25 },
      corner_left_top_fill: { x: 75, y: 50, width: 25, height: 25 },
      corner_right_top: { x: 100, y: 50, width: 25, height: 25 },
      corner_right_top_fill: { x: 125, y: 50, width: 25, height: 25 },
      corner_right_down: { x: 150, y: 50, width: 25, height: 25 },
      corner_right_down_fill: { x: 175, y: 50, width: 25, height: 25 },
    },
  },

  assets: {
    snakeSprite: (() => {
      const img = new Image();
      img.src = "./images/snake-sprite.png";
      return img;
    })(),
    appleSprite: (() => {
      const img = new Image();
      img.src = "./images/apple-sprite.png";
      return img;
    })(),
  },
};

//init
game.ui.ctx = game.ui.canvas.getContext("2d");
game.ui.normalBtn.style.color = "green";
const canvasWidth = game.ui.canvas.width;
const canvasHeight = game.ui.canvas.height;

//let randomTimer = 5 + Math.random() * 10; //FOR CARROT

function gameStart() {
  setHighscore();
  resetGameOverlay();
  game.state.isRunning = true;

  gameLoop();
}

function gameLoop() {
  game.ui.ctx.filter = game.state.isRunning ? "none" : "grayscale(100%)";
  game.ui.scoreText.textContent = `${game.state.score.toString().padStart(4, "0")}`;

  disableDifficultyButton();

  if (game.state.isRunning) {
    clearBoard();
    moveSnake();
    growSnake();
    isFilled();
    drawSnake();
    drawFood();
    gameOver();

    setTimeout(gameLoop, game.config.gameSpeed);
  } else {
    drawSnake();
    drawFood();
  }
}

function disableDifficultyButton() {
  game.ui.allDifficultyBtn.forEach((btn) => (btn.disabled = game.state.isRunning));
}

function clearBoard() {
  game.ui.ctx.fillStyle = game.config.canvasColor;
  game.ui.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function getHeadSprite(vX, vY) {
  const snake = game.entities.snakePart;

  if (vX === 1) return snake.head_right;
  if (vX === -1) return snake.head_left;
  if (vY === 1) return snake.head_down;
  if (vY === -1) return snake.head_top;
  return snake.head_right;
}

function getTailSprite(seg, i) {
  const snake = game.entities.snakePart;
  const applePos = game.state.applePosition;
  const isFilled = applePos.some((apple) => apple.x === seg.x && apple.y === seg.y);
  let prev = game.entities.snake[i - 1];

  if (prev.x < seg.x) return isFilled ? snake.tail_right_fill : snake.tail_right;
  if (prev.x > seg.x) return isFilled ? snake.tail_left_fill : snake.tail_left;
  if (prev.y < seg.y) return isFilled ? snake.tail_down_fill : snake.tail_down;
  if (prev.y > seg.y) return isFilled ? snake.tail_top_fill : snake.tail_top;
}

//prettier-ignore
function getBodySprite(seg, i) {
  const snake = game.entities.snakePart;
  const applePos = game.state.applePosition;
  let prev = game.entities.snake[i - 1];
  let next = game.entities.snake[i + 1];
  const xPrev = seg.x - prev.x;
  const yPrev = seg.y - prev.y;
  const xNext = next.x - seg.x;
  const yNext = next.y - seg.y;
  const isFilled = applePos.some((apple) => apple.x === seg.x && apple.y === seg.y);

  //straight
  if (xPrev === 0 && xNext === 0) return isFilled ? snake.body_vertical_fill : snake.body_vertical;
  if (yPrev === 0 && yNext === 0)
    return isFilled ? snake.body_horizontal_fill : snake.body_horizontal;

  //corners
  if (
    (xPrev === unitSize && yNext === unitSize) ||
    (yPrev === -unitSize && xNext === -unitSize))
    return isFilled ? snake.corner_left_down_fill : snake.corner_left_down;

  if (
    (xPrev === unitSize && yNext === -unitSize) ||
    (yPrev === unitSize && xNext === -unitSize))
    return isFilled ? snake.corner_left_top_fill : snake.corner_left_top;

  if (
    (xPrev === -unitSize && yNext === -unitSize) ||
    (yPrev === unitSize && xNext === unitSize))
    return isFilled ? snake.corner_right_top_fill : snake.corner_right_top;

  if (
    (xPrev === -unitSize && yNext === unitSize) ||
    (yPrev === -unitSize && xNext === unitSize))
    return isFilled ? snake.corner_right_down_fill : snake.corner_right_down;
}

function moveSnake() {
  game.state.direction = game.state.nextDirection;

  const snake = game.entities.snake;
  const vX = game.state.direction.x;
  const vY = game.state.direction.y;

  game.state.lastTailPosition = {
    x: snake[snake.length - 1].x,
    y: snake[snake.length - 1].y,
  };

  for (let i = snake.length - 1; i > 0; i--) {
    snake[i].x = snake[i - 1].x;
    snake[i].y = snake[i - 1].y;
  }

  if (vX === 1) snake[0].x += unitSize;
  if (vX === -1) snake[0].x -= unitSize;
  if (vY === 1) snake[0].y += unitSize;
  if (vY === -1) snake[0].y -= unitSize;
}

function growSnake() {
  const snake = game.entities.snake;
  const apple = game.entities.apple;
  const tailPos = game.state.lastTailPosition;
  const applePos = game.state.applePosition;

  if (snake[0].x === apple.x && snake[0].y === apple.y) {
    applePos.push({ x: apple.x, y: apple.y });
    snake.push({ x: tailPos.x, y: tailPos.y });

    makeFood();

    if (game.config.gameSpeed == 120) {
      game.state.score += 1;
    } else if (game.config.gameSpeed == 100) {
      game.state.score += 2;
    } else if (game.config.gameSpeed == 80) {
      game.state.score += 3;
    } else if (game.config.gameSpeed == 60) {
      game.state.score += 4;
    } else if (game.config.gameSpeed == 40) {
      game.state.score += 5;
    }
  }
}

function isFilled() {
  const snake = game.entities.snake;
  const applePos = game.state.applePosition;

  if (applePos.length === 0) return;
  const apple = applePos[0];
  const snakeArea = snake.some((seg) => apple.x === seg.x && apple.y === seg.y);

  if (!snakeArea) applePos.shift();
}

function drawSnake() {
  const snake = game.entities.snake;
  snake.forEach((segment, index) => {
    let sprite;

    if (index === 0) sprite = getHeadSprite(game.state.direction.x, game.state.direction.y);
    else if (index === snake.length - 1) sprite = getTailSprite(segment, index);
    else sprite = getBodySprite(segment, index);

    game.ui.ctx.drawImage(
      game.assets.snakeSprite,
      sprite.x,
      sprite.y,
      sprite.width,
      sprite.height,
      segment.x,
      segment.y,
      unitSize,
      unitSize
    );
  });
}

function makeFood() {
  const apple = game.entities.apple;

  apple.x = Math.floor(Math.random() * (canvasWidth / unitSize)) * unitSize;
  apple.y = Math.floor(Math.random() * (canvasHeight / unitSize)) * unitSize;

  game.entities.snake.forEach((snakeSegment) => {
    if (apple.x === snakeSegment.x && apple.y === snakeSegment.y) {
      makeFood();
    }
  });
}

function drawFood() {
  //ctx.drawImage(image, source x, source y, sWidth, sHeight, destination x, destination y, dWidth, dHeight)
  game.ui.ctx.drawImage(
    game.assets.appleSprite,
    0,
    0,
    unitSize,
    unitSize,
    game.entities.apple.x,
    game.entities.apple.y,
    unitSize,
    unitSize
  );
}

function snakeDirection(event) {
  let currentDir = game.state.direction;

  const up = { x: 0, y: -1 };
  const left = { x: -1, y: 0 };
  const right = { x: 1, y: 0 };
  const down = { x: 0, y: 1 };

  const keyMap = {
    ArrowUp: up,
    KeyW: up,
    ArrowLeft: left,
    KeyA: left,
    ArrowRight: right,
    KeyD: right,
    ArrowDown: down,
    KeyS: down,
  };

  const tmp = keyMap[event.code];

  if (!tmp) return;
  if (tmp.x === -currentDir.x && tmp.y === -currentDir.y) return;

  game.state.nextDirection = tmp;
}

function gameSpeedControl(btn) {
  game.ui.allDifficultyBtn.forEach((btn) => (btn.style.color = ""));

  if (!game.state.isRunning) {
    switch (btn.dataset.difficulty) {
      case "Normal":
        game.config.gameSpeed = 120;
        game.state.difficulty = "Normal";
        break;
      case "Hard":
        game.config.gameSpeed = 100;
        game.state.difficulty = "Hard";
        break;
      case "Expert":
        game.config.gameSpeed = 80;
        game.state.difficulty = "Expert";
        break;
      case "Master":
        game.config.gameSpeed = 60;
        game.state.difficulty = "Master";
        break;
      case "Inferno":
        game.config.gameSpeed = 40;
        game.state.difficulty = "Inferno";
        break;
    }
    btn.style.color = "green";
  }
}

function gameOver() {
  const snake = game.entities.snake;
  let snakeHead = snake[0];

  for (let i = 3; i < snake.length; i++) {
    if (
      (snakeHead.x === snake[i].x && snakeHead.y === snake[i].y) ||
      snakeHead.x < 0 ||
      snakeHead.x > canvasWidth - unitSize ||
      snakeHead.y < 0 ||
      snakeHead.y > canvasHeight - unitSize
    ) {
      game.state.isRunning = false;

      game.ui.gameOverBackground.classList.add("show");
      game.ui.gameOverText.classList.add("show");

      setTimeout(() => {
        document.addEventListener("keydown", resetAndRemoveListener);
      }, 2000);

      setTimeout(() => {
        game.ui.pressAnyKeyMessage.style.opacity = 1;
      }, 2000);
    }
  }
  setHighscore();
}

function resetAndRemoveListener() {
  resetGame();
  document.removeEventListener("keydown", resetAndRemoveListener);
}

function resetGameOverlay() {
  game.ui.pressAnyKeyMessage.style.opacity = 0;
  game.ui.gameOverBackground.style.transition = "none";
  game.ui.gameOverText.style.transition = "none";
  game.ui.gameOverBackground.classList.remove("show");
  game.ui.gameOverText.classList.remove("show");
  void game.ui.gameOverBackground.offsetWidth;
  game.ui.gameOverBackground.style.transition = "opacity 0.5s ease-in";
  game.ui.gameOverText.style.transition = "opacity 1s ease-in 0.6s";
}

function resetGame() {
  if (!game.state.isRunning) {
    game.state.direction = { x: 1, y: 0 };
    game.state.nextDirection = { x: 1, y: 0 };
    game.state.score = 0;
    game.state.applePosition = [];
    game.entities.snake = [
      { x: 3 * unitSize, y: 0 },
      { x: 2 * unitSize, y: 0 },
      { x: 1 * unitSize, y: 0 },
      { x: 0 * unitSize, y: 0 },
    ];
  }
  gameStart();
}

function getCurrentTime() {
  let now = new Date();

  let day = String(now.getDate()).padStart(2, "0");
  let month = String(now.getMonth() + 1).padStart(2, "0");
  let year = String(now.getFullYear());
  let hour = String(now.getHours()).padStart(2, "0");
  let minute = String(now.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${year} - ${hour}:${minute}`;
}

function setHighscore() {
  const scoreRow = document.querySelectorAll(".score-row");

  if (!game.state.isRunning) {
    scoreRow.forEach((item) => item.remove());
    let highscore = JSON.parse(localStorage.getItem("Snake-Highscore") || "[]");

    if (game.state.score > 0) {
      highscore.push({
        score: game.state.score,
        date: getCurrentTime(),
        difficulty: game.state.difficulty,
      });
    }

    highscore.sort((a, b) => b.score - a.score).slice(0, 5);
    localStorage.setItem("Snake-Highscore", JSON.stringify(highscore));

    for (let i = 0; i < 5; i++) {
      const div = document.createElement("div");
      const dateSpan = document.createElement("span");
      const scoreSpan = document.createElement("span");

      div.classList.add("score-row");
      dateSpan.classList.add("date-col");
      scoreSpan.classList.add("score-col");

      if (highscore[i]) {
        dateSpan.textContent = highscore[i].date;
        scoreSpan.textContent = `${highscore[i].score} (${highscore[i].difficulty})`;
      } else {
        dateSpan.textContent = "---";
        scoreSpan.textContent = "---";
      }

      div.appendChild(dateSpan);
      div.appendChild(scoreSpan);

      game.ui.highscoreList.appendChild(div);
    }
  }
}

gameStart();
makeFood();

document.addEventListener("keydown", snakeDirection);
document.getElementById("difficulty-section").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  gameSpeedControl(btn);
});
