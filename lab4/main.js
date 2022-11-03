function clearCanvas() {
  ctx.clearRect(0, 0, width, height);
}

function setup() {
  const grass = new Grass("grass");
  const road = new Road("road");

  actors.push(grass, road);
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
