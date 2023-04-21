const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
const worlds = ["mario", "minecraft", "missing"];
const images = {};

["mario", "mariowall", "minecraft", "minecraftwall", "missing", "missingwall", "ship"].forEach(fileName => {
  const img = new Image();
  img.src = `img/${fileName}.png`;
  images[fileName] = img;
})

const idealFrameTime = 1000/60;

const CIRCLE_RADIUS = 15;
let GRAVITY = 0.3;
let JUMP_SPEED = 8;
let WALL_SPEED = 3;
let LASER_SPEED = 15;
let world;

let jumping = false;
let circle = {
  x: CIRCLE_RADIUS + 10,
  y: canvas.height / 2,
  vy: 0
};

let pipes = [];
let lasers = [];

export function gameLoop() {
  updateState();
  draw();
}

let worldNum;
export function startGame() {
  worldNum = Math.floor(Math.random() * worlds.length);
  world = worlds[worldNum];
  circle = {
    x: CIRCLE_RADIUS + 10,
    y: canvas.height / 2,
    vy: 0
  };
  score = 0;
  pipes = [];
  lasers = [];
  state = 'playing';
  
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("noiseStart", startLaser);
  window.addEventListener("noiseStop", endLaser);
  document.getElementById('start').blur();
}

function draw() {
  ctx.drawImage(images["ship"], circle.x - 15, circle.y - 15);
  drawPipes();
  drawLaser();
  drawScore();
}

let now;
let frames = 0;
function updateState() {
  let effectiveFrameDiff
  if (!now) {
    effectiveFrameDiff = 1;
    now = Date.now();
  } else {
    let delta = -now + (now = Date.now());
    effectiveFrameDiff = delta/idealFrameTime;
  }
  frames+=effectiveFrameDiff;

  updateShipState(effectiveFrameDiff);
  updateLaserState(effectiveFrameDiff);
  updatePipeState(effectiveFrameDiff);

  fireLaserIfNeeded();
  checkCollisionPlayerPipe();
  checkCollisionLaserPipe();
}

function updateShipState(effectiveFrameDiff) {
  jumpIfShould();

  circle.y += circle.vy*effectiveFrameDiff;
  circle.vy += GRAVITY*effectiveFrameDiff;
  
  if (circle.y + CIRCLE_RADIUS >= canvas.height) {
    circle.y = canvas.height - CIRCLE_RADIUS;
    circle.vy = 0;
  }

  if (circle.y - CIRCLE_RADIUS < 0) {
    circle.y = 0 + CIRCLE_RADIUS;
    circle.vy = 0;
  }
}

function updateLaserState(effectiveFrameDiff) {
  lasers.forEach(las => {
    las.x += LASER_SPEED*effectiveFrameDiff;
    las.vy += GRAVITY*effectiveFrameDiff;
    las.y += las.vy*effectiveFrameDiff;
  });
}

function updatePipeState(effectiveFrameDiff) {
  pipes.forEach(pipe => pipe.x -= pipe.speed*effectiveFrameDiff);
  if (pipes.some(rect => rect.x + rect.width <= 0)) {
    incrementscore();
    pipes = pipes.filter(rect => rect.x + rect.width >= 0);
  }
  addPipesIfNeeded();
}

let lastPipeFrame = -100;
function addPipesIfNeeded() {
    if (frames - lastPipeFrame > 150) {
      addPipe();
      lastPipeFrame = frames;
    }
}

function addPipe() {
  const RECT_WIDTH = 50;
  const GAP_HEIGHT = CIRCLE_RADIUS*15;
  const gapTop = Math.floor(Math.random() * (canvas.height - GAP_HEIGHT));
  pipes.push({world, x: canvas.width, y: 0, width: RECT_WIDTH, height: gapTop, speed: WALL_SPEED });
  pipes.push({world, x: canvas.width + 5, y: gapTop, width: RECT_WIDTH - 10, height: GAP_HEIGHT, speed: WALL_SPEED, gap: true });
  pipes.push({world, x: canvas.width, y: gapTop + GAP_HEIGHT, width: RECT_WIDTH, height: canvas.height - (gapTop + GAP_HEIGHT), speed: WALL_SPEED, end: true });
}

function drawPipes() {
  for (let i = 0; i < pipes.length; i++) {
    const rect = pipes[i];

    if (rect.gap) {
      const image = rect.world + "wall";
      ctx.drawImage(images[image], rect.x, rect.y);
    } else if (rect.end) {
      const image = rect.world;
      ctx.drawImage(images[image], rect.x, rect.y);
    } else {
      const image = rect.world;
      ctx.drawImage(images[image], rect.x, rect.height - 680);
    }
  }
}

function drawLaser() {
  lasers.forEach(las => {
    ctx.fillStyle = "red";
    ctx.fillRect(las.x, las.y, las.width, las.height);
  });
}

function drawScore() {
  ctx.fillStyle = "red";
  ctx.fillText("Score: " + score, 5, canvas.height - 15);
}

let lasering = false;
let lastLaserFrame = -100;
function fireLaserIfNeeded() {
  if (!lasering) return;
  if (frames - lastLaserFrame < 20) return;
  lastLaserFrame = frames;
  lasers.push({
    x: circle.x + CIRCLE_RADIUS + 4,
    y: circle.y,
    vy: 0,
    height:10,
    width: 30
  })
}

let lastJumpFrame=-100;
function jumpIfShould(e) {
  if (!jumping) return;
  if (frames - lastJumpFrame < 30) return;
  lastJumpFrame = frames;
  circle.vy = -JUMP_SPEED;
}

function checkCollisionPlayerPipe() {
  for (let i = 0; i < pipes.length; i++) {
    const rect = pipes[i];
    if (RectCircleColliding(circle, rect)) {
      stop();
      return;
    }
  }
}

function checkCollisionLaserPipe() {
  for (let i = pipes.length - 1; i > -1 ; i--) {
    for (let j = lasers.length - 1; j > -1 ; j--) {
      const rect = pipes[i];
      const laser = lasers[j];

      if (checkOverlap(rect, laser)) {
        if (rect.gap) {
          pipes.splice(i, 1);
        }
        lasers.splice(j,1);
      }
    }
  }
}

function handleKeyDown(event) {
  event.preventDefault();
  if (event.code === "Space") {
    jump();
  }
}

function handleKeyUp(event) {
  if (event.code === "Space") {
    unjump();
  }
}

function startLaser() {
  lasering = true;
}

function endLaser() {
  lasering = false;
  lastLaserFrame = -100;
}

function jump() {
  jumping = true;
}

function unjump() {
  jumping = false;
  lastJumpFrame =-100;
}

function noiseStart(e) {
  // if (e.detail.highPitch) {
  //   laser();
  //   jump();
  // } else {
  //   jump();
  // }

  startLaser();

  // e.detail.highPitch ? laser() : jump();
}

function stop() {
  state = 'intro';
}

function incrementscore() {
  score++;

  if (score%3 === 0) {
    worldNum = Math.floor(Math.random() * worlds.length);
    world = worlds[worldNum];
  }
}


function RectCircleColliding(circle,rect){
  var distX = Math.abs(circle.x - rect.x-rect.width/2);
  var distY = Math.abs(circle.y - rect.y-rect.height/2);

  if (distX > (rect.width/2 + CIRCLE_RADIUS)) { return false; }
  if (distY > (rect.height/2 + CIRCLE_RADIUS)) { return false; }

  if (distX <= (rect.width/2)) { return true; } 
  if (distY <= (rect.height/2)) { return true; }

  var dx=distX-rect.width/2;
  var dy=distY-rect.height/2;
  return (dx*dx+dy*dy<=(CIRCLE_RADIUS*CIRCLE_RADIUS));
}

function checkOverlap(rect1, rect2) {
  // Calculate the x and y coordinates of the edges of each rectangle
  const rect1Left = rect1.x;
  const rect1Right = rect1.x + rect1.width;
  const rect1Top = rect1.y;
  const rect1Bottom = rect1.y + rect1.height;
  
  const rect2Left = rect2.x;
  const rect2Right = rect2.x + rect2.width;
  const rect2Top = rect2.y;
  const rect2Bottom = rect2.y + rect2.height;
  
  // Check if the rectangles overlap in the x and y axes
  const xOverlap = rect1Left < rect2Right && rect1Right > rect2Left;
  const yOverlap = rect1Top < rect2Bottom && rect1Bottom > rect2Top;
  
  // Return true if the rectangles overlap in both axes, false otherwise
  return xOverlap && yOverlap;
}

const gravityConfig = document.getElementById("gravConfig");
gravityConfig.value = GRAVITY;
gravityConfig.addEventListener("input", e => GRAVITY = Number(e.target.value));

const jumpConfig = document.getElementById("jumpConfig");
jumpConfig.value = JUMP_SPEED;
jumpConfig.addEventListener("input", e => JUMP_SPEED = Number(e.target.value));

const speedConfig = document.getElementById("speedConfig");
speedConfig.value = WALL_SPEED;
speedConfig.addEventListener("input", e => WALL_SPEED = Number(e.target.value));

const laserConfig = document.getElementById("laserConfig");
laserConfig.value = LASER_SPEED;
laserConfig.addEventListener("input", e => LASER_SPEED = Number(e.target.value));