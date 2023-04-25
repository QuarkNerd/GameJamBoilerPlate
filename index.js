import { analyseAudioTick } from "./input.js";
import {
  gameLoop,
  gameTouchStartHandler,
  gameTouchStopHandler,
} from "./game.js";
import { drawMenu, menuTouchHandler } from "./menu.js";

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

const backgroundImage = new Image();
backgroundImage.src = 'img/bg.png';

// Global variables, not ideal
window.state = 'menu';
window.score = 0;
window.difficulty = 'easy';

requestAnimationFrame(loop);

function loop() {
  analyseAudioTick();
  drawBackground();
  if (state !== 'playing') drawOverlay();
  
  switch (state) {
    case 'playing':
      gameLoop();
      break;
    case 'menu':
      drawMenu();
      break;
  }

  requestAnimationFrame(loop);
}

canvas.addEventListener('mousedown', (e) => {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  switch (state) {
    case 'menu': 
      menuTouchHandler({ x, y });
      break;
    case 'playing': 
      gameTouchStartHandler();
      break;
  }
});
  console.log(33333);
canvas.addEventListener('mouseup', () => {
  console.log(22222, state);
  switch (state) {
    case 'playing': 
      gameTouchStopHandler();
      break;
  }
});

let bgOffset = 0;
function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
