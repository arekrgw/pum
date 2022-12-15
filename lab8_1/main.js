function clearCanvas() {
  ctx.clearRect(0, 0, width, height);
}

function setup() {
  const plane = new Plane("plane");
  const grid = new Grid("grid");
  const stones = new Stones("stones");
  const scoreboard = new ScoreBoard("scoreboard");

  actors.push(plane, grid, stones, scoreboard);
}

function update(timestamp) {
  if (gameConfig.gameOver) return;

  actors.forEach((actor) => actor.update(timestamp));
}

function render(timestamp) {
  clearCanvas();
  actors.forEach((actor) => actor.draw(timestamp));
}

let lastRender;
function draw(timestamp) {
  if (lastRender && timestamp - lastRender < 2) {
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
