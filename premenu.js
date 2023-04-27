import { drawButton } from "./utils.js";

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

export function preMenuLoop(start) {
  ctx.font = `40px slkscr`;
  ctx.fillStyle = "White";
  ctx.textBaseline = "middle";
  ctx.fillText(
    start ? 'Noisy Gamer' : `Final score: ${score}`, 
    canvas.width / 2, 
    canvas.height / 2 - 80
    );
  drawButton(ctx, getContinueButton(start));
}

export function preMenuClickHandler({ x, y }) {
  const btn = getContinueButton();

  if (
    btn.x - btn.width / 2 <= x &&
    btn.x + btn.width / 2 >= x &&
    btn.y - btn.height / 2 <= y &&
    btn.y + btn.height / 2 >= y
  ) {
    state = "menu";
  }
}

function getContinueButton(start) {
  return {
    x: canvas.width / 2,
    y: canvas.height / 2 - 20,
    width: 120,
    height: 40,
    color: "grey",
    text: start ? "enter" : "continue",
  };
}
