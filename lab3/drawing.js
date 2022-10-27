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
  static radius = 20;
  color = "red";

  constructor(object, name) {
    super(object, name);
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
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(timestamp) {}
}

const randomTime = () => Math.floor(Math.random() * 1000) + 2000;
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

document.addEventListener("keydown", (e) => {
  if (Player.moved) return;

  const player = actors.find((actor) => actor.iam(/player/));

  if (e.key === "ArrowLeft") {
    player.move(-6);
    Player.moved = true;
  }
  if (e.key === "ArrowRight") {
    player.move(6);
    Player.moved = true;
  }
  console.log(e.key)
  if (e.key === " ") {
    console.log("space");
  }
  // console.log(e.key);
  // const { x, y, w, h } = player.coords;
});
