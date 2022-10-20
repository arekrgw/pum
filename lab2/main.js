const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const width = canvas.width;
const height = canvas.height;

function clearCanvas() {
  ctx.clearRect(0, 0, width, height);
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
  beginX: 150,
  beginY: height - 100,
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

const BallConstants = {
  radius: 30,
  beginX:
    StairConstants.beginX +
    StairConstants.maxStairs * StairConstants.width -
    StairConstants.width / 2,
  beginY:
    StairConstants.beginY -
    (StairConstants.maxStairs - 1) * StairConstants.height -
    30,
  speed: -1,
};

class Ball {
  color = "#ff0000";

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, BallConstants.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(timestamp) {
    this.x += BallConstants.speed;
  }
}
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

const beginY = height - (StairConstants.height + 50);

const stairs = new Array(5)
  .fill(0)
  .map(
    (_, i) =>
      new Stair(
        StairConstants.beginX + i * StairConstants.width,
        StairConstants.beginY - i * StairConstants.height
      )
  );

const ball = new Ball(BallConstants.beginX, BallConstants.beginY);

let lastRender;
function update(timestamp) {
  StairConstants.checkStairsToRender(timestamp);

  if (StairConstants.stairsToRender === StairConstants.maxStairs) {
    ball.update();
  }
}

function render() {
  clearCanvas();
  floor.draw();
  stairs
    .slice()
    .slice(0, StairConstants.stairsToRender + 1)
    .forEach((stair) => stair.draw());

  if (StairConstants.stairsToRender === StairConstants.maxStairs) {
    ball.draw();
  }
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
