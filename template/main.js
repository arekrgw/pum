function clearCanvas() {
  ctx.clearRect(0, 0, width, height);
}

function setup() {
  actors.push(new Ball(centerX, centerY), new Ball(centerX + 100, centerY));
}

function update(timestamp) {
  actors.forEach((actor) => actor.update(timestamp));
}

function render(timestamp) {
  clearCanvas();
  actors.forEach((actor) => actor.draw(timestamp));
}

let lastRender;
function draw(timestamp) {
  if (lastRender && timestamp - lastRender < 1) {
    requestAnimationFrame(draw);
    return;
  }

  lastRender = timestamp;
  update(timestamp);
  render(timestamp);

  requestAnimationFrame(draw);
}

setup();
requestAnimationFrame(draw);
