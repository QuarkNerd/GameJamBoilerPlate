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

export function parseText(text, fontSize, targetWdith, topGap, ctx) {
  ctx.font = `${fontSize}px slkscr`;
  const lineHeight = fontSize + 2;
  const lines = text.flatMap((st) => splitStringByLength(st, targetWdith, ctx));
  const parsedLines = lines.map((text, i) => ({
    text,
    y: topGap + lineHeight * i,
  }));

  return { lines: parsedLines, fontSize };
}

function splitStringByLength(str, length, ctx) {
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
