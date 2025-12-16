const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let scoreText = document.getElementById("score");
const gameOverText = document.querySelector("#game-over-text");
const gameOverBackground = document.querySelector(".game-over-background");
const pressAnyKeyMessage = document.getElementById("press-any-key");
const highscoreList = document.getElementById("highscore-container");
const allDifficultyBtn = document.querySelectorAll(".difficulty-btn");
const normalBtn = document.getElementById("normal-btn");

//initial
normalBtn.style.color = "green";

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const canvasColor = "aliceblue";
const unitSize = 25;
let isRunning = false;

let velocityX = 1;
let velocityY = 0;
let prevX = 0;
let prevY = 0;
let score = 0;

let lastTailPosition = null;
let canTurn = true;
let randomTimer = 5 + Math.random() * 10;
let gameDifficulty = "Normal";
let gameSpeed = 120;

let snakeSprite = new Image();
snakeSprite.src = "./images/snake-sprite.png";
let appleSprite = new Image();
appleSprite.src = "./images/apple-sprite.png";

let applePosition = [];
let goldenCarrot = { x: 0, y: 0 };
let apple = { x: 0, y: 0 };
let snake = [
  { x: 3 * unitSize, y: 0 },
  { x: 2 * unitSize, y: 0 },
  { x: 1 * unitSize, y: 0 },
  { x: 0 * unitSize, y: 0 },
];
const snakePart = {
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
};

function gameStart() {
  setHighscore()
  resetGameOverlay();
  isRunning = true;

  gameLoop();
}
function gameLoop() {
  ctx.filter = isRunning ? "none" : "grayscale(100%)";
  scoreText.textContent = `${score.toString().padStart(4, "0")}`;

  disableDifficultyButton();

  if (isRunning) {
    clearBoard();
    moveSnake();
    growSnake();
    isFilled();
    drawSnake();
    drawFood();
    gameOver();

    setTimeout(gameLoop, gameSpeed);
  } else {
    drawSnake();
    drawFood();
  }
}

function disableDifficultyButton() {
  allDifficultyBtn.forEach((btn) => (btn.disabled = isRunning));
}

function clearBoard() {
  //Resetting Board
  ctx.fillStyle = canvasColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function getHeadSprite(vX, vY) {
  if (vX === 1) return snakePart.head_right;
  if (vX === -1) return snakePart.head_left;
  if (vY === 1) return snakePart.head_down;
  if (vY === -1) return snakePart.head_top;
  return snakePart.head_right;
}

function getTailSprite(seg, i) {
  let prev = snake[i - 1];
  const isFilled = applePosition.some(
    (apple) => apple.x === seg.x && apple.y === seg.y
  );

  if (prev.x < seg.x)
    return isFilled ? snakePart.tail_right_fill : snakePart.tail_right;
  if (prev.x > seg.x)
    return isFilled ? snakePart.tail_left_fill : snakePart.tail_left;
  if (prev.y < seg.y)
    return isFilled ? snakePart.tail_down_fill : snakePart.tail_down;
  if (prev.y > seg.y)
    return isFilled ? snakePart.tail_top_fill : snakePart.tail_top;
}

function getBodySprite(seg, i) {
  let prev = snake[i - 1];
  let next = snake[i + 1];
  const xPrev = seg.x - prev.x;
  const yPrev = seg.y - prev.y;
  const xNext = next.x - seg.x;
  const yNext = next.y - seg.y;
  const isFilled = applePosition.some(
    (apple) => apple.x === seg.x && apple.y === seg.y
  );

  //straight
  if (xPrev === 0 && xNext === 0)
    return isFilled ? snakePart.body_vertical_fill : snakePart.body_vertical;

  if (yPrev === 0 && yNext === 0)
    return isFilled
      ? snakePart.body_horizontal_fill
      : snakePart.body_horizontal;

  //corners
  if (
    (xPrev === unitSize && yNext === unitSize) ||
    (yPrev === -unitSize && xNext === -unitSize)
  )
    return isFilled
      ? snakePart.corner_left_down_fill
      : snakePart.corner_left_down;

  if (
    (xPrev === unitSize && yNext === -unitSize) ||
    (yPrev === unitSize && xNext === -unitSize)
  )
    return isFilled
      ? snakePart.corner_left_top_fill
      : snakePart.corner_left_top;

  if (
    (xPrev === -unitSize && yNext === -unitSize) ||
    (yPrev === unitSize && xNext === unitSize)
  )
    return isFilled
      ? snakePart.corner_right_top_fill
      : snakePart.corner_right_top;

  if (
    (xPrev === -unitSize && yNext === unitSize) ||
    (yPrev === -unitSize && xNext === unitSize)
  )
    return isFilled
      ? snakePart.corner_right_down_fill
      : snakePart.corner_right_down;
}

function moveSnake() {
  lastTailPosition = {
    x: snake[snake.length - 1].x,
    y: snake[snake.length - 1].y,
  };

  for (let i = snake.length - 1; i > 0; i--) {
    snake[i].x = snake[i - 1].x;
    snake[i].y = snake[i - 1].y;
  }
  if (velocityX === 1) snake[0].x += unitSize;
  if (velocityX === -1) snake[0].x -= unitSize;
  if (velocityY === 1) snake[0].y += unitSize;
  if (velocityY === -1) snake[0].y -= unitSize;

  canTurn = true;
}

function growSnake() {
  if (snake[0].x === apple.x && snake[0].y === apple.y) {
    applePosition.push({ x: apple.x, y: apple.y });
    snake.push({ x: lastTailPosition.x, y: lastTailPosition.y });

    makeFood();

    if (gameSpeed == 120) {
      score += 1;
    } else if (gameSpeed == 100) {
      score += 2;
    } else if (gameSpeed == 80) {
      score += 3;
    } else if (gameSpeed == 60) {
      score += 4;
    } else if (gameSpeed == 40) {
      score += 5;
    }
  }
}

function isFilled() {
  if (applePosition.length === 0) return;
  const apple = applePosition[0];
  const snakeArea = snake.some((seg) => apple.x === seg.x && apple.y === seg.y);

  if (!snakeArea) applePosition.shift();
}

function drawSnake() {
  snake.forEach((segment, index) => {
    let sprite;

    if (index === 0) sprite = getHeadSprite(velocityX, velocityY);
    else if (index === snake.length - 1) sprite = getTailSprite(segment, index);
    else sprite = getBodySprite(segment, index);

    ctx.drawImage(
      snakeSprite,
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
  apple.x = Math.floor(Math.random() * (canvasWidth / unitSize)) * unitSize;
  apple.y = Math.floor(Math.random() * (canvasHeight / unitSize)) * unitSize;

  snake.forEach((snakeItem) => {
    if (apple.x === snakeItem.x && apple.y === snakeItem.y) {
      makeFood();
    }
  });
}

function drawFood() {
  //ctx.drawImage(image, source x, source y, sWidth, sHeight, destination x, destination y, dWidth, dHeight)
  ctx.drawImage(
    appleSprite,
    0,
    0,
    unitSize,
    unitSize,
    apple.x,
    apple.y,
    unitSize,
    unitSize
  );
}

function snakeDirection(event) {
  if (!canTurn) return;
  let prevX = velocityX;
  let prevY = velocityY;

  if (event.code === "ArrowLeft" && prevX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (event.code === "ArrowUp" && prevY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (event.code === "ArrowRight" && prevX != -1) {
    velocityX = 1;
    velocityY = 0;
  } else if (event.code === "ArrowDown" && prevY != -1) {
    velocityX = 0;
    velocityY = 1;
  }
  canTurn = false;
}

function gameSpeedControl(btn) {
  allDifficultyBtn.forEach((btn) => (btn.style.color = ""));

  if (!isRunning) {
    switch (btn.dataset.difficulty) {
      case "Normal":
        gameSpeed = 120;
        gameDifficulty = "Normal";
        break;
      case "Hard":
        gameSpeed = 100;
        gameDifficulty = "Hard";
        break;
      case "Expert":
        gameSpeed = 80;
        gameDifficulty = "Expert";
        break;
      case "Master":
        gameSpeed = 60;
        gameDifficulty = "Master";
        break;
      case "Inferno":
        gameSpeed = 40;
        gameDifficulty = "Inferno";
        break;
    }
    btn.style.color = "green";
  }
}

function gameOver() {
  let snakeHead = snake[0];

  for (let i = 3; i < snake.length; i++) {
    if (
      (snakeHead.x === snake[i].x && snakeHead.y === snake[i].y) ||
      snakeHead.x < 0 ||
      snakeHead.x > canvasWidth - unitSize ||
      snakeHead.y < 0 ||
      snakeHead.y > canvasHeight - unitSize
    ) {
      isRunning = false;
    
      gameOverBackground.classList.add("show");
      gameOverText.classList.add("show");

      setTimeout(() => {
        document.addEventListener("keydown", resetAndRemoveListener);
      }, 2000);

      setTimeout(() => {
        pressAnyKeyMessage.style.opacity = 1;
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
  pressAnyKeyMessage.style.opacity = 0;

  gameOverBackground.style.transition = "none";
  gameOverText.style.transition = "none";

  gameOverBackground.classList.remove("show");
  gameOverText.classList.remove("show");

  void gameOverBackground.offsetWidth;

  gameOverBackground.style.transition = "opacity 0.5s ease-in";
  gameOverText.style.transition = "opacity 1s ease-in 0.6s";
}

function resetGame() {
  if (!isRunning) {
    velocityX = 1;
    velocityY = 0;
    prevX = 0;
    prevY = 0;
    score = 0;
    applePosition = [];
    snake = [
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

  if (!isRunning) {
    getCurrentTime();
    scoreRow.forEach((item) => item.remove());
    let highscore = JSON.parse(localStorage.getItem("Snake-Highscore") || "[]");

    if (score > 0) {
      highscore.push({
        score: score,
        date: getCurrentTime(),
        difficulty: gameDifficulty,
      });
    }

    highscore.sort((a, b) => b.score - a.score);
    highscore = highscore.slice(0, 5);

    localStorage.setItem("Snake-Highscore", JSON.stringify(highscore));

    for (let i = 0; i < 5; i++) {
      const div = document.createElement("div");
      div.classList.add("score-row");

      const dateSpan = document.createElement("span");
      dateSpan.classList.add("date-col");

      const scoreSpan = document.createElement("span");
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

      highscoreList.appendChild(div);
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
