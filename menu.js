import { drawAudioControl, audioCanvasTouchHandler } from "./input.js";
import { startGame } from "./game.js";
import { drawButton, parseText } from "./utils.js";

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

export function drawMenu() {
  drawSeperator();
  writeIntro();
  drawAudioControl();
  drawButtons();
}

export function menuTouchHandler({ x, y }) {
  const buttons = getButtons();
  const buttonPressed = buttons.find(
    (btn) =>
      btn.x - btn.width / 2 <= x &&
      btn.x + btn.width / 2 >= x &&
      btn.y - btn.height / 2 <= y &&
      btn.y + btn.height / 2 >= y
  );

  if (!buttonPressed) {
    audioCanvasTouchHandler({ x, y });
    return;
  }
  if (buttonPressed.text === "start") {
    startGame();
  } else {
    difficulty = buttonPressed.text;
  }
}

function drawButtons() {
  getButtons().forEach((btn) => drawButton(ctx, btn));
}

function drawSeperator() {
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 25);
  ctx.lineTo(canvas.width / 2, canvas.height - 25);
  ctx.stroke();
}

function writeIntro() {
  const intro = getIntro();
  ctx.font = `${intro.fontSize}px slkscr`;
  ctx.fillStyle = "White";
  ctx.textAlign = "center";

  intro.lines.forEach(({ y, text }) => {
    ctx.fillText(text, canvas.width / 4, y);
  });
}

function getButtons() {
  const buttons = [
    {
      x: (3 * canvas.width) / 4,
      y: canvas.height - 50,
      width: 100,
      height: 40,
      color: "grey",
      text: "start",
    },
    {
      x: (3 * canvas.width) / 4 - 110,
      y: canvas.height - 110,
      width: 100,
      height: 40,
      color: "grey",
      text: "easy",
    },
    {
      x: (3 * canvas.width) / 4,
      y: canvas.height - 110,
      width: 100,
      height: 40,
      color: "grey",
      text: "medium",
    },
    {
      x: (3 * canvas.width) / 4 + 110,
      y: canvas.height - 110,
      width: 100,
      height: 40,
      color: "grey",
      text: "hard",
    },
  ];

  buttons.forEach((btn) =>
    difficulty === btn.text ? (btn.color = "green") : null
  );
  return buttons;
}

function getIntro() {
  const intro = [
    "This is Noisy Gamer. A game that involves your voice.",
    "",
    "Click/tap on the screen or press space to jump upwards. Speak/shout to fire your laser. Any sound works, but a high-pitched 'pew' is supreme",
    "",
    "Walls will move in from the right, and you can eliminate the middle bits with your laser. Your goal is to survive as long as you can without hitting a wall. When not playing on easy, your firepower is limited and shown on top of the screen.",
    "",
    "Adjust the slider on the right to determine the therehold for firing the laser, choose your difficulty and press start.",
  ];
  const targetWidth = canvas.width / 2 - 20;
  return parseText(intro, 20, targetWidth, 40, ctx);
}
