function clearCanvas() {
  ctx.clearRect(0, 0, width, height);
}

function setup() {
  actors.push(
    new Ball(new C(new V(centerX, centerY), Ball.radius), "ball1"),
    new Ball(new C(new V(centerX + 100, centerY), Ball.radius), "ball2")
  );
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
