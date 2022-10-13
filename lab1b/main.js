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
let x1 = 280,
  y1 = 70;

function update(timestamp) {
  // first circle
  if (timestamp - lastUpdateCircle1 > updateTime) {
    lastUpdateCircle1 = timestamp;
    colorF = colorF === "green" ? "blue" : "green";
  }

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
}

function render() {
  // first circle
  paintCircle(colorF, x, y);
  paintCircle(`hsl(${currentColor}, 100%, 50%)`, x1, y1);
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
