import { analyseAudioTick, drawAudioControl, audioCanvasTouchHandler } from "./input.js";
import {startGame, gameLoop} from './game.js';

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

const backgroundImage = new Image();
backgroundImage.src = 'img/bg.png';

window.state = 'intro';
window.score = 0;

requestAnimationFrame(loop);

window.start = () => {
  startGame();
}

canvas.addEventListener('mousedown', (e) => {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  if (state === 'intro') audioCanvasTouchHandler({x, y});
});

function loop() {
  analyseAudioTick();
  drawBackground();
  
  if (state === 'playing') {
    gameLoop();
  } else {
    drawStartScreen();
  }

  requestAnimationFrame(loop);
}

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

function drawStartScreen() {
    drawOverlay();
    drawSeperator();
    writeIntro();
    drawAudioControl();
}

function drawSeperator() {
  ctx.strokeStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 25);
  ctx.lineTo(canvas.width/2, canvas.height - 25);
  ctx.stroke();
}

function writeIntro() {
  const intro = getIntro();
  ctx.font = `${intro.fontSize}px slkscr`;
  ctx.fillStyle = "White";

  intro.lines.forEach(({ x, y, text }) => {
    ctx.fillText(text, x, y);
  });
}

function getIntro() {
  ctx.font = '20px slkscr';
  const intro = [
    "Welcome to Noisy Gamer. A game that involves your voice.",
    "",
    "Click/tap on the screen or press space to jump upwards. Speak/shout to fire your laser.",
    "",
    "Walls will move in from the right, and you can eliminate the middle bits with your laser. Your goal is to survive as long as you can without hitting a wall. When not playing on easy, your firepower is limited and shown on top of the screen.",
    "",
    "Adjust the slider on the right to determine the therehold for firing the laser, choose your difficulty and press start.",
  ];
  const sideGap = 10;
  const fontSize = 20;
  const lineHeight = fontSize + 2;
  const targetWdith = canvas.width / 2 - 2 * sideGap;
  const parsedIntro = intro.flatMap((st) =>
    splitStringByLength(st, targetWdith)
  );
  const lines = parsedIntro.length;
  const topGap = (canvas.height - lines * lineHeight) / 2;
  parsedIntro.forEach((chunk, i) => {
    chunk.x = (targetWdith - chunk.width) / 2 + sideGap;
    chunk.y = topGap + lineHeight * i;
  });

  return { lines: parsedIntro, fontSize };
}

function splitStringByLength(str, length) {
  const words = str.split(" ");
  const chunks = [];
  let currentChunk = "";

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    if (ctx.measureText(currentChunk + " " + word).width > length) {
      chunks.push({
        text: currentChunk.trim(),
        width: ctx.measureText(currentChunk.trim()).width,
      });
      currentChunk = "";
    }

    currentChunk += (currentChunk === "" ? "" : " ") + word;
  }

  chunks.push({
    text: currentChunk.trim(),
    width: ctx.measureText(currentChunk.trim()).width,
  });
  return chunks;
}