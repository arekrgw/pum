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

const StairConstants = {
  height: 50,
  width: 100,
  stairsToRender: 0,
  lastUpdated: 0,
  maxStairs: 5,
  checkStairsToRender(timestamp) {
    if (
      timestamp - this.lastUpdated > 1000 &&
      this.stairsToRender < this.maxStairs
    ) {
      this.lastUpdated = timestamp;
      this.stairsToRender++;
    }
  },
};
class Stair {
  color = "brown";
  height = StairConstants.height;
  width = StairConstants.width;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    // draw stairs on canvas
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

const beginX = 150;
const beginY = height - (StairConstants.height + 50);

const stairs = new Array(5)
  .fill(0)
  .map(
    (_, i) =>
      new Stair(
        beginX + i * StairConstants.width,
        beginY - i * StairConstants.height
      )
  );

let lastRender;
function update(timestamp) {
  StairConstants.checkStairsToRender(timestamp);
}

function render() {
  floor.draw();
  stairs
    .slice()
    .slice(0, StairConstants.stairsToRender + 1)
    .forEach((stair) => stair.draw());
}

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
