const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const width = canvas.width;
const height = canvas.height;

function clearCanvas() {
  ctx.clearRect(0, 0, width, height);
}

class Ball {
  color = "#ff0000";

  draw() {}
}

class Floor {
  x = 0;
  y = height - 50;
  width = width;
  height = 50;
  color = "#00ff00";

  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

const floor = new Floor();
class Stair {
  draw() {
    // draw stairs on canvas
  }
}

function update() {}

function render() {
  floor.draw();
}

let lastRender;
function draw(timestamp) {
  if (lastRender && timestamp - lastRender < 1) {
    requestAnimationFrame(draw);
    return;
  }

  lastRender = timestamp;
  update(timestamp);
  render();

  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
