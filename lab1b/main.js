const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 70;

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const redVal = 0;
const greenVal = 128;
let current = 0;

let toGreen = true;

function paintCircle(color, x, y) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

paintCircle(`hsl(${current}, 100%, 50%)`);

setInterval(() => {
  if (toGreen) {
    current += 1;
    if (current >= 128) {
      toGreen = false;
    }
  } else {
    current -= 1;
    if (current <= 0) {
      toGreen = true;
    }
  }

  console.log(current)
  const currentColor = `hsl(${current}, 100%, 50%)`;
  paintCircle(currentColor);
}, 20);

// first circle
let colorF = "green";
let updateTime = 1000;
let x = 70, y = 70;


function update(timeElapsed) {
  // first circle
  if(timeElapsed > updateTime) {
    colorF === "green" ? "blue" : "green";
  }

}

function render() {
  // first circle
  paintCircle(colorF, x, y);
}

let lastRender = 0;
function draw(timestamp) {
  const progress = timestamp - lastRender;

  update(progress);
  render();

  lastRender = timestamp;
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw)
