import { drawAudioControl, audioCanvasTouchHandler } from "./input.js";
import { startGame } from "./game.js";
import { drawButton } from "./utils.js";

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
  ctx.font = "20px slkscr";
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
  const lines = intro.flatMap((st) => splitStringByLength(st, targetWdith));
  const lineCount = lines.length;
  const topGap = (canvas.height - lineCount * lineHeight) / 2;
  const parsedIntro = lines.map((text, i) => ({
    text,
    y: topGap + lineHeight * i,
  }));

  return { lines: parsedIntro, fontSize };
}

function splitStringByLength(str, length) {
  const words = str.split(" ");
  const chunks = [];
  let currentChunk = "";

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    if (ctx.measureText(currentChunk + " " + word).width > length) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
    }

    currentChunk += (currentChunk === "" ? "" : " ") + word;
  }

  chunks.push(currentChunk.trim());
  return chunks;
}
