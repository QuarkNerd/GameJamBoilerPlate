const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

let position = 0;
let speed = 3;

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSquare(x,y) {
    ctx.fillStyle = "yellow";
    ctx.fillRect(x ,y, 50, 50);
}


function animate() {
  drawBackground();
  drawSquare(position, position);
  
  position += speed;
  if (position > 250 || position < 0) {
    speed = -speed;
  }
  requestAnimationFrame(animate);
}

window.start = function start() {
    animate();
}