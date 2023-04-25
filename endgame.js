import { drawButton } from "./utils.js";

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

export function endGameLoop() {
  ctx.font = `40px slkscr`;
  ctx.fillStyle = "White";
  ctx.textBaseline = "middle";
  ctx.fillText(`Final score: ${score}`, canvas.width / 2, canvas.height / 2 - 80);
  drawButton(ctx, getContinueButton());
}

export function endGameClickHandler({ x, y }) {
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

function getContinueButton() {
  return {
    x: canvas.width / 2,
    y: canvas.height / 2 - 20,
    width: 120,
    height: 40,
    color: "grey",
    text: "continue",
  };
}
