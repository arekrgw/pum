function clearCanvas() {
  ctx.clearRect(0, 0, width, height);
}

function setup() {
  const grass = new Grass("grass");
  const road = new Road("road");
  const scoreboard = new ScoreBoard();
  const speedometer = new Speedometer();

  const player = new Car("plr", "pink");

  actors.push(grass, road, player, scoreboard, speedometer);
  randomCar();
  randomBonus();
  randomRotate();
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
