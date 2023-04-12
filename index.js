const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
const HEIGHT = canvas.getAttribute('height');
const WIDTH = canvas.getAttribute('width');

ctx.strokeStyle = "red";

const CIRCLE_RADIUS = 15;
const GRAVITY = 0.5;
const JUMP_SPEED = -8;

let playing = false;
let score = 0;
let circle = {
  x: CIRCLE_RADIUS + 10,
  y: canvas.height / 2,
  vy: 0
};

let pipes = [];

function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCircle() {
  // Update circle position
  circle.y += circle.vy;
  circle.vy += GRAVITY;
  
  // Check for collision with bottom of screen
  if (circle.y + CIRCLE_RADIUS >= canvas.height) {
    circle.y = canvas.height - CIRCLE_RADIUS;
    circle.vy = 0;
  }
  // Draw circle
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, CIRCLE_RADIUS, 0, 2 * Math.PI);
  ctx.fill();
}

function drawRectangles() {
  // Draw rectangles
  ctx.fillStyle = "green";
  for (let i = 0; i < pipes.length; i++) {
    const rect = pipes[i];
    rect.x -= rect.speed;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  }
  
  // Remove rectangles that have moved off the screen
  if (pipes.some(rect => rect.x + rect.width <= 0)) {
    incrementscore();
    pipes = pipes.filter(rect => rect.x + rect.width >= 0);
  }
}

function addRectangles() {
  const RECT_WIDTH = 50;
  const SPEED = 5;
  const GAP_HEIGHT = CIRCLE_RADIUS*12;
  const gapTop = Math.floor(Math.random() * (HEIGHT - GAP_HEIGHT));
  pipes.push({ x: canvas.width, y: 0, width: RECT_WIDTH, height: gapTop, speed: SPEED });
  pipes.push({ x: canvas.width, y: gapTop + GAP_HEIGHT, width: RECT_WIDTH, height: HEIGHT - (gapTop + GAP_HEIGHT), speed: SPEED });

}

function checkCollision() {
  for (let i = 0; i < pipes.length; i++) {
    const rect = pipes[i];
    if (RectCircleColliding(circle, rect)) {
      stop();
      return;
    }
  }
}
let end;
let start = 0;
function animate() {
  if (!playing) return;
  drawBackground();
  drawCircle();
  drawRectangles();
  checkCollision();
  
  // Add rectangles at fixed interval
  if (frames % 100 === 0) {
    end = Date.now();
    console.log(`Execution time: ${end - start} ms`);
    start = Date.now();
    addRectangles();
  }
  
  frames++;
  requestAnimationFrame(animate);
}

let frames = 0;

function handleKeyDown(event) {
  if (event.code === "Space") {
    jump();
  }
}

function handleKeyUp(event) {
  if (event.code === "Space") {
    unjump();
  }
}


let lastJumpFrame=-100;
function jump() {
  if (frames - lastJumpFrame < 30) return;
  lastJumpFrame = frames;
  circle.vy = JUMP_SPEED;
}

function unjump() {
  lastJumpFrame =-100;
}

window.start = function start() {
  if (playing) return;
  playing = true;
  animate();
  
  // Add event listener for spacebar
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("noiseStart", jump);
  window.addEventListener("noiseStop", unjump);
  document.getElementById('start').blur();
}

window.stop = function stop() {
  playing = false;
}

function incrementscore() {
  score++;
  document.getElementById("score").innerHTML = score/2;
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