const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const width = canvas.width;
const height = canvas.height;

function clearCanvas() {
  ctx.clearRect(0, 0, width, height);
}

function collider(circle, rect) {
  const distX = Math.abs(circle.x - rect.x - rect.width / 2);
  const distY = Math.abs(circle.y - rect.y - rect.height / 2);

  if (distX > rect.width / 2 + circle.radius) {
    return false;
  }
  if (distY > rect.height / 2 + circle.radius) {
    return false;
  }

  if (distX <= rect.width / 2) {
    return true;
  }
  if (distY <= rect.height / 2) {
    return true;
  }

  const dx = distX - rect.width / 2;
  const dy = distY - rect.height / 2;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
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
  speedX: -0.5,
  speedY: -1,
};

class Ball {
  color = "#ff0000";
  radius = BallConstants.radius;

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
    let rect = [...stairs]
      .reverse()
      .find((stair) => this.x + this.radius >= stair.x);
    if (!rect) {
      rect = floor;
    }
    if (!collider(this, rect)) {
      this.y = this.y - BallConstants.speedY;
    }
    if (this.x - this.radius > 0) {
      this.x += BallConstants.speedX;
    }
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
