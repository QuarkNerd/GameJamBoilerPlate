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
