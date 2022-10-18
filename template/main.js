const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const width = canvas.width;
const height = canvas.height;

function clearCanvas() {
  ctx.clearRect(0, 0, width, height);
}

const objects = [];

function update() {}

function render() {}

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
