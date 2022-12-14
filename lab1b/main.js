const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 70;

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function paintCircle(color, x, y) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

// first circle
let colorF = "green";
let lastUpdateCircle1 = 0;
let updateTime = 1000;
let x = 70,
  y = 70;

// second circle
let currentColor = 0;
let toGreen = true;
let lastUpdateCircle2 = 0;
let updateTime2 = 50;
let x1 = 220,
  y1 = 70;

// third circle
let currentColor2 = 0;
let toGreen2 = true;
let lastUpdateCircle3 = 0;
let lastPositionChangeTime = 0;
let updateTime3 = 50;
let up = false;
let step = 0.03;
let lastPositionChange = 0;
let positionChangeInterval = 20;
let x2 = 400,
  y2Max = 400,
  y2 = 70;
y2Min = 70;
y2Delta = 330;
yprogress = 0;

function easeInCubic(x) {
  return x * x * x;
}

function update(timestamp) {
  // first circle
  if (timestamp - lastUpdateCircle1 > updateTime) {
    lastUpdateCircle1 = timestamp;
    colorF = colorF === "green" ? "blue" : "green";
  }

  // second circle
  if (timestamp - lastUpdateCircle2 > updateTime2) {
    lastUpdateCircle2 = timestamp;
    if (toGreen) {
      currentColor += 1;
      if (currentColor >= 128) {
        toGreen = false;
      }
    } else {
      currentColor -= 1;
      if (currentColor <= 0) {
        toGreen = true;
      }
    }
  }

  // third circle
  if (timestamp - lastUpdateCircle3 > updateTime3) {
    lastUpdateCircle3 = timestamp;
    if (toGreen2) {
      currentColor2 += 1;
      if (currentColor2 >= 128) {
        toGreen2 = false;
      }
    } else {
      currentColor2 -= 1;
      if (currentColor2 <= 0) {
        toGreen2 = true;
      }
    }
  }

  if (timestamp - lastPositionChangeTime > positionChangeInterval) {
    lastPositionChangeTime = timestamp;
    if (up) {
      yprogress -= step;
      y2 = y2Delta * easeInCubic(yprogress) + y2Min;
      if (y2 <= 70) {
        up = false;
      }
    } else {
      yprogress += step;
      y2 = y2Delta * easeInCubic(yprogress) + y2Min;
      if (y2 >= y2Max) {
        up = true;
      }
    }
  }
}

function render() {
  // first circle
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  paintCircle(colorF, x, y);
  paintCircle(`hsl(${currentColor}, 100%, 50%)`, x1, y1);
  paintCircle(`hsl(${currentColor2}, 100%, 50%)`, x2, y2);
}

let lastRender = 0;
function draw(timestamp) {
  const progress = timestamp - lastRender;
  if (progress < 20) {
    requestAnimationFrame(draw);
    return;
  }

  update(timestamp);
  render();

  lastRender = timestamp;
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
