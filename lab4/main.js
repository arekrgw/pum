function clearCanvas() {
  ctx.clearRect(0, 0, width, height);
}

function setup() {
  const b = new Ball(
    new C(new V(), Ball.radius),
    new V(centerX, centerY),
    "ball1"
  );

  actors.push(b);
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
