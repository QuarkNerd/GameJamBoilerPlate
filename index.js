import {audioLoopTick, ac} from './input.js';
import {startGame, gameLoop} from './game.js';

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

const backgroundImage = new Image();
backgroundImage.src = 'img/bg.png';

window.playing = false;
window.score = 0;

requestAnimationFrame(loop);

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
}

function drawSeperator() {
  ctx.strokeStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 25);
  ctx.lineTo(canvas.width/2, canvas.height - 25);
  ctx.stroke();
}

const intro = [
  'Welcome to Noisy Gamer. A game that involves your voice.',
  'Click/tap on the screen or press space to jump upwards. Speak/shout ' +
    'to fire your laser. Walls will move in from the right, and you can ' + 
    'eliminate the middle bits with your laser. Your goal is to survive ' + 
    'as long as you can without hitting a wall. When not playing on easy, ' + 
    'your firepower is limited and shown on top of the screen',
  'Adjust the slider on the right to determine the therehold for firing the laser, choose your difficulty and press start'
]
function writeIntro() {
  // console.log(splitString(intro[0], 100));
  const minimumSideSpace = 20;
  const maxWidth = canvas.width - 2*minimumSideSpace;
  ctx.font = '20px Arial';
  ctx.fillStyle = 'White';


  intro.forEach(line => {
    splitString(string, maxWidth)
  });

  // const parsedIntro = intro.flatMap(line => {
  //   const split = line.split(' ');
  //   const parsedLines = [];

  // });


  

  // console.log(ctx.measureText('aaaaaaaaaa').width);
  ctx.fillText(intro[0], 20, 50, canvas.width - 100);
}

//calculate only after resize
function splitString(string, maxWidth) {
  const split = string.split(' ');
  const chunks = [];

  let currentChunk = { 
    string: split[0],
    width
  };
  
  for (let i = 1; i < split.length; i++) {
    currentChunk += ' ' + split[i];
    if (ctx.measureText(currentChunk).width > maxWidth) {
      chunks.push(currentChunk.slice(0, -(split[i].length + 1)));
      currentChunk = split[i];
    }
  }
  
  chunks.push(currentChunk);
  return chunks;
}