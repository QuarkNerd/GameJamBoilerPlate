import {audioLoopTick, ac} from './input.js';
import {startGame, gameLoop} from './game.js';

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
const HEIGHT = canvas.height;
const WIDTH = canvas.width;

window.playing = false;
window.score = 0;

window.start = () => {
  ac.resume();
  startGame();
}

function loop() {
  audioLoopTick();
  if (playing) {
    gameLoop();
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);