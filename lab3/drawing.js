// https://github.com/jriecken/sat-js
const C = SAT.Circle;
const V = SAT.Vector;
const P = SAT.Polygon;
const B = SAT.Box;
const cCC = SAT.testCircleCircle;
const cCP = SAT.testCirclePolygon;
const cPC = SAT.testPolygonCircle;
const cPP = SAT.testPolygonPolygon;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const score = document.querySelector("#score");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const width = canvas.width;
const height = canvas.height;

const actors = [];
class Actor {
  constructor(object, name) {
    this.object = object;
    this.name = name;
  }

  actors(nameRegexp = null) {
    return actors.filter(
      (actor) =>
        actor !== this && this.turnIntoRegexp(nameRegexp).test(actor.name)
    );
  }

  turnIntoRegexp(name) {
    if (typeof name === "string") {
      return new RegExp(`^${name}$`);
    }
    return name;
  }

  iam(nameRegexp) {
    return this.turnIntoRegexp(nameRegexp).test(this.name);
  }

  draw(timestamp) {}
  update(timestamp) {}
}

// user defined code

class Player extends Actor {
  color = "blue";
  static moved = false;
  static score = 0;

  constructor(object, name) {
    super(object, name);
  }

  get coords() {
    return {
      x: this.object.pos.x,
      y: this.object.pos.y,
      w: this.object.w,
      h: this.object.h,
    };
  }

  move(dir) {
    const { x } = this.coords;
    if (dir > 0 && x + dir + 30 > width) return;
    if (dir < 0 && x + dir < 0) return;
    this.object.pos.add(new V(dir, 0));
  }

  draw(timestamp) {
    const { x, y, w, h } = this.coords;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(x, y, w, h);
    ctx.closePath();
    Player.moved = false;
  }

  update(timestamp) {}
}

class Ball extends Actor {
  static lastShot = performance.now();
  static radius = 20;
  color = "red";
  bullet = "green";
  static bulletRadius = 10;

  constructor(object, name) {
    super(object, name);
    this.createdAt = performance.now();
  }

  get coords() {
    return {
      x: this.object.pos.x,
      y: this.object.pos.y,
      r: this.object.r,
    };
  }

  draw(timestamp) {
    const { x, y, r } = this.coords;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = this.name === "bullet" ? this.bullet : this.color;
    ctx.fill();
  }

  update(timestamp) {
    if (this.name === "ball") {
      if (performance.now() - this.createdAt > 10000) {
        actors.splice(actors.indexOf(this), 1);
      }
    }
    if (this.name === "bullet") {
      this.object.pos.add(new V(0, -8));
      if (this.object.pos.y < 0) {
        actors.splice(actors.indexOf(this), 1);
      }

      const balls = this.actors("ball");
      for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];
        if (cCC(this.object, ball.object)) {
          actors.splice(actors.indexOf(ball), 1);
          actors.splice(actors.indexOf(this), 1);
          Player.score += 1;
          score.innerText = Player.score;
        }
      }
    }
  }
}

const randomTime = () => Math.floor(Math.random() * 1000) + 1500;
const randomX = () => Math.floor(Math.random() * width);
const randomY = () => Math.floor((Math.random() * height) / 2);

const randomBall = () => {
  let x = randomX();
  if (x - 20 < 0) x = 20;
  if (x + 20 > width) x = width - 20;
  let y = randomY();
  if (y - 20 < 0) y = 20;
  const ball = new Ball(new C(new V(x, y), Ball.radius), "ball");
  actors.push(ball);
  setTimeout(randomBall, randomTime());
};

randomBall();

const spawnMovingBall = () => {
  if(Ball.lastShot + 200 > performance.now()) return;
  const player = actors.find((actor) => actor.iam("player"));
  const { x, y } = player.coords;
  const ball = new Ball(
    new C(new V(x + 15, y - Ball.bulletRadius), Ball.bulletRadius),
    "bullet"
  );
  actors.push(ball);
  Ball.lastShot = performance.now();
};

document.addEventListener("keydown", (e) => {
  if (Player.moved) return;

  const player = actors.find((actor) => actor.iam(/player/));

  if (e.key === "ArrowLeft") {
    player.move(-8);
    Player.moved = true;
  }
  if (e.key === "ArrowRight") {
    player.move(8);
    Player.moved = true;
  }

  if (e.key === " ") {
    spawnMovingBall();
  }
});
