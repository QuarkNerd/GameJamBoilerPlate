import {audioLoopTick, ac} from './input.js';
import {startGame, gameLoop} from './game.js';

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
const HEIGHT = canvas.height;
const WIDTH = canvas.width;

const backgroundImage = new Image();
backgroundImage.src = 'img/bg.png';

window.playing = false;
window.score = 0;

window.start = () => {
  ac.resume();
  startGame();
}

function loop() {
  audioLoopTick();
  drawBackground();
  
  if (playing) {
    gameLoop();
  } else {
    drawOverlay();
    writeIntro();
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

let bgOffset = 0;
function drawBackground() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.drawImage(backgroundImage, -bgOffset, 0);
  if (bgOffset > 400) {
    ctx.drawImage(backgroundImage, -bgOffset + 1200, 0);
  }
  if (bgOffset > 1200) {
    bgOffset = 0;
  }
  bgOffset++;
}

function drawOverlay() {
  ctx.fillStyle = "rgba(30, 30, 30, 0.9)";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function writeIntro() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "White";
  ctx.fillText("Hello World Hello World Hello World Hello World Hello World Hello World", 50, 50, WIDTH - 100);
}