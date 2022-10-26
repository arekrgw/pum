const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const width = canvas.width;
const height = canvas.height;

function collCR(circle, rect) {
  const distX = Math.abs(circle.x - rect.x - rect.width / 2);
  const distY = Math.abs(circle.y - rect.y - rect.height / 2);

  if (distX > rect.width / 2 + circle.radius) {
    return false;
  }
  if (distY > rect.height / 2 + circle.radius) {
    return false;
  }

  if (distX <= rect.width / 2) {
    return true;
  }
  if (distY <= rect.height / 2) {
    return true;
  }

  const dx = distX - rect.width / 2;
  const dy = distY - rect.height / 2;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

function collRR() {
  if (
    rect1.x < rect2.x + rect2.w &&
    rect1.x + rect1.w > rect2.x &&
    rect1.y < rect2.y + rect2.h &&
    rect1.h + rect1.y > rect2.y
  ) {
    return true;
  }

  return false;
}

const actors = [];
class Actor {
  constructor(name) {
    this.name = name;
  }
  actors(name = null) {
    return actors.filter((actor) => actor !== this && name !== actor.name);
  }
  draw(timestamp) {}
  update(timestamp) {}
}

class Ball extends Actor {
  static radius = 30;

  constructor(x, y) {
    super("Ball");
    this.x = x;
    this.y = y;
  }

  draw(timestamp) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, Ball.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
  }

  update(timestamp) {}
}
