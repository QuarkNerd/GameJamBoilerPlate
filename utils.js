export function drawButton(ctx, details) {
  const {x, y, height, width, color, text} = details;
  ctx.textAlign="center";
  ctx.font = `20px slkscr`;
  
  ctx.fillStyle = color;
  ctx.fillRect(x - width/2, y - height/2, width, height)
  ctx.fillStyle = "White";
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}


// function drawGameButtons() {
//   ctx.textAlign="center";
//   const buttonHeight = 35;
//   const buttonWidth = 100;

//   const middle = 3*canvas.width / 4;
//   ctx.fillStyle = 'grey';
  
//   ctx.fillRect(middle - buttonWidth/2, canvas.height - 60, buttonWidth, buttonHeight)
//   ctx.font = `20px slkscr`;
//   ctx.fillStyle = "White";
//   ctx.fillText('Start', middle, canvas.height - 37);
// }