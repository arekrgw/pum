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
    this.object.pos.add(new V(dir, 0));
  }

  draw(timestamp) {
    const { x, y, w, h } = this.coords;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(x, y, w, h);
    ctx.closePath();
  }

  update(timestamp) {}
}

class Ball extends Actor {
  static radius = 30;
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

  update(timestamp) {
    if (this.iam(/ball3/)) {
      console.log("ball");
    }
  }
}

document.addEventListener("keydown", (e) => {
  if (Player.moved) return;

  const player = actors.find((actor) => actor.iam(/player/));

  if (e.key === "ArrowLeft") {
    player.move(-6);
  }
  if (e.key === "ArrowRight") {
    player.move(6);
  }
  // console.log(e.key);
  // const { x, y, w, h } = player.coords;
});
