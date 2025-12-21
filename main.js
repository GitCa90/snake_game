const unitSize = 25;

const game = {
  state: {
    isRunning: false,
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    score: 0,
    difficulty: "normal",
    lastTailPosition: null,
    foodPosition: [],
    lastTime: 0,
    accumulator: 0,
    carrotSpawn: false,
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
    specialIcon: document.getElementById("special-Icon"),
    specialCountDown: document.getElementById("special-countdown"),
  },

  config: {
    gameSpeed: 10,
    carrotTimer: 2,
    canvasColor: "aliceblue",
    points: {
      apple: {
        120: 1,
        100: 2,
        80: 3,
        60: 4,
        40: 5,
      },
      carrot: {
        120: 10,
        100: 20,
        80: 30,
        60: 40,
        40: 50,
      },
    },
  },

  entities: {
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

  sprite: {
    snake: (() => {
      const img = new Image();
      img.src = "./images/snake-sprite.png";
      return img;
    })(),

    apple: {
      sprite: (() => {
        const img = new Image();
        img.src = "./images/apple-sprite.png";
        return img;
      })(),
      position: { x: 0, y: 0 },
      frames: [{ x: 0, y: 0 }],
      animation: {
        frame: 0,
        fps: 0,
        accumulator: 0,
      },
    },

    carrot: {
      sprite: (() => {
        const img = new Image();
        img.src = "./images/carrot-sprite-anim.png";
        return img;
      })(),
      position: { x: 0, y: 0 },
      frames: [
        { x: 0, y: 0 },
        { x: 25, y: 0 },
      ],
      animation: {
        frame: 0,
        fps: 2,
        accumulator: 0,
      },
    },
  },
};

//init
game.ui.ctx = game.ui.canvas.getContext("2d");
game.ui.normalBtn.style.color = "green";
const canvasWidth = game.ui.canvas.width;
const canvasHeight = game.ui.canvas.height;

function updateAnimation(item, delta) {
  if (!item.animation) return;

  item.animation.accumulator += delta;
  const frameDuration = 1000 / item.animation.fps;

  if (item.animation.accumulator >= frameDuration) {
    item.animation.frame = (item.animation.frame + 1) % item.frames.length;
    item.animation.accumulator -= frameDuration;
  }
}

function render() {
  game.ui.ctx.filter = game.state.isRunning ? "none" : "grayscale(100%)";
  game.ui.scoreText.textContent = `${game.state.score.toString().padStart(4, "0")}`;

  clearBoard();
  drawSnake();
  drawFood();
}

function update(delta) {
  updateAnimation(game.sprite.carrot, delta);
}

function gameStart() {
  setHighscore();
  resetGameOverlay();
  game.state.isRunning = true;
  game.state.lastTime = 0;
  game.state.accumulator = 0;
  requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
  //time
  const last = game.state.lastTime || timestamp;
  const delta = timestamp - last;
  game.state.lastTime = timestamp;

  update(delta);

  game.state.accumulator += delta;

  disableDifficultyButton();

  //tick, movement
  while (game.state.accumulator >= game.config.gameSpeed && game.state.isRunning) {
    moveSnake();
    foodLogic(game.sprite.apple, "apple");
    foodLogic(game.sprite.carrot, "carrot");
    isFilled();
    gameOver();

    game.state.accumulator -= game.config.gameSpeed;
  }

  //draw
  render();
  requestAnimationFrame(gameLoop);
}

function disableDifficultyButton() {
  game.ui.allDifficultyBtn.forEach((btn) => (btn.disabled = game.state.isRunning));
}

function getHeadSprite(vX, vY) {
  const snake = game.entities.snakePart;
  const direction = {
    "1,0": snake.head_right,
    "-1,0": snake.head_left,
    "0,1": snake.head_down,
    "0,-1": snake.head_top,
  };
  return direction[`${vX},${vY}`] || snake.head_right;
}

function getTailSprite(seg, i) {
  const snake = game.entities.snakePart;
  const foodPosition = game.state.foodPosition;
  const isFilled = foodPosition.some((apple) => apple.x === seg.x && apple.y === seg.y);
  let prev = game.entities.snake[i - 1];

  //MAPPING
  if (prev.x < seg.x) return isFilled ? snake.tail_right_fill : snake.tail_right;
  if (prev.x > seg.x) return isFilled ? snake.tail_left_fill : snake.tail_left;
  if (prev.y < seg.y) return isFilled ? snake.tail_down_fill : snake.tail_down;
  if (prev.y > seg.y) return isFilled ? snake.tail_top_fill : snake.tail_top;
}

//prettier-ignore
function getBodySprite(seg, i) {
  const snake = game.entities.snakePart;
  const foodPosition = game.state.foodPosition;
  let prev = game.entities.snake[i - 1];
  let next = game.entities.snake[i + 1];
  const xPrev = seg.x - prev.x;
  const yPrev = seg.y - prev.y;
  const xNext = next.x - seg.x;
  const yNext = next.y - seg.y;
  const isFilled = foodPosition.some((apple) => apple.x === seg.x && apple.y === seg.y);

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
  const tail = snake[snake.length - 1];
  const vX = game.state.direction.x;
  const vY = game.state.direction.y;

  game.state.lastTailPosition = { x: tail.x, y: tail.y };

  for (let i = snake.length - 1; i > 0; i--) {
    snake[i].x = snake[i - 1].x;
    snake[i].y = snake[i - 1].y;
  }

  snake[0].x += vX * unitSize;
  snake[0].y += vY * unitSize;
}

function isFilled() {
  const snake = game.entities.snake;
  const foodPosition = game.state.foodPosition;

  if (foodPosition.length === 0) return;
  const apple = foodPosition[0];
  const snakeArea = snake.some((seg) => apple.x === seg.x && apple.y === seg.y);

  if (!snakeArea) foodPosition.shift();
}

function clearBoard() {
  game.ui.ctx.fillStyle = game.config.canvasColor;
  game.ui.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawSnake() {
  const snake = game.entities.snake;
  snake.forEach((segment, index) => {
    let sprite;

    if (index === 0) sprite = getHeadSprite(game.state.direction.x, game.state.direction.y);
    else if (index === snake.length - 1) sprite = getTailSprite(segment, index);
    else sprite = getBodySprite(segment, index);

    game.ui.ctx.drawImage(
      game.sprite.snake,
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

function drawFood() {
  drawFoodItem(game.sprite.apple, game.sprite.apple.x, game.sprite.apple.y);
  if (game.state.carrotSpawn)
    drawFoodItem(game.sprite.carrot, game.sprite.carrot.x, game.sprite.carrot.y);
}

function drawFoodItem(item, x, y) {
  const frame = item.frames ? item.frames[item.animation.frame] : { x: 0, y: 0 };

  game.ui.ctx.drawImage(
    item.sprite,
    frame.x,
    frame.y,
    unitSize,
    unitSize,
    x,
    y,
    unitSize,
    unitSize
  );
}

function randomPosition(item) {
  const foodPosition = game.state.foodPosition;
  let validPosition = false;

  while (!validPosition) {
    item.x = Math.floor(Math.random() * (canvasWidth / unitSize)) * unitSize;
    item.y = Math.floor(Math.random() * (canvasHeight / unitSize)) * unitSize;

    validPosition = true;
    game.entities.snake.forEach((snakeSegment) => {
      if (item.x === snakeSegment.x && item.y === snakeSegment.y) validPosition = false;
    });

    if (item.x === foodPosition.x && item.y === foodPosition.y) validPosition = false;
  }

  item.position.x = item.x;
  item.position.y = item.y;
}

function foodLogic(item, type) {
  const snake = game.entities.snake;
  const tailPos = game.state.lastTailPosition;
  const foodPosition = game.state.foodPosition;
  const speed = game.config.gameSpeed;

  const itemPoints = game.config.points[type][speed];

  if (snake[0].x === item.x && snake[0].y === item.y) {
    foodPosition.push({ x: item.x, y: item.y });
    snake.push({ ...tailPos });

    if (type === "carrot") {
      game.state.carrotSpawn = false;
      game.ui.specialCountDown.textContent = "";
      game.ui.specialIcon.src = "";
    }

    game.state.score += itemPoints;
    randomPosition(item);
  }
}

function carrotLogic() {
  if (game.state.carrotSpawn || !game.state.isRunning) return;
  const randomTimer = 3000;
  //5000 + Math.random() * 10000;

  setTimeout(() => {
    game.state.carrotSpawn = true;
    const carrotPos = game.sprite.carrot.position;
    const applePos = game.sprite.apple.position;

    if (game.state.carrotSpawn && game.state.isRunning) {
      if (carrotPos.x === applePos.x && carrotPos.y === applePos.y) {
        randomPosition(game.sprite.carrot);
        console.log("New carrot position");
      }

      let count = game.config.carrotTimer;
      game.ui.specialCountDown.textContent = String(count).padStart(2, "0");
      game.ui.specialIcon.src = "./images/carrot-icon.png";

      const countDown = setInterval(() => {
        count--;
        game.ui.specialCountDown.textContent = String(count).padStart(2, "0");

        if (count <= 0 || game.state.carrotSpawn === false) {
          clearInterval(countDown);
          game.state.carrotSpawn = false;
          game.ui.specialCountDown.textContent = "";
          game.ui.specialIcon.src = "";
        }
        carrotLogic();
      }, 1000);
      console.log("Carrot");
    }
  }, randomTimer);
}

function snakeDirection(event) {
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
  const currentDir = game.state.direction;

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
      game.state.carrotSpawn = false;
      game.ui.specialCountDown.textContent = "";
      game.ui.specialIcon.src = "";

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
    game.state.carrotSpawn = false;
    game.state.direction = { x: 1, y: 0 };
    game.state.nextDirection = { x: 1, y: 0 };
    game.state.score = 0;
    game.state.foodPosition = [];
    game.entities.snake = [
      { x: 3 * unitSize, y: 0 },
      { x: 2 * unitSize, y: 0 },
      { x: 1 * unitSize, y: 0 },
      { x: 0 * unitSize, y: 0 },
    ];
  }
  gameStart();
  randomPosition(game.sprite.apple);
  randomPosition(game.sprite.carrot);
  carrotLogic();
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
randomPosition(game.sprite.apple);
randomPosition(game.sprite.carrot);
carrotLogic();

document.addEventListener("keydown", snakeDirection);
document.getElementById("difficulty-section").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  gameSpeedControl(btn);
});
