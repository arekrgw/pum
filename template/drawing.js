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
