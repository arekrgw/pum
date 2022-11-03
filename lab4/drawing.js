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
  constructor(object, offset, name) {
    this.object = object;
    this.object.setOffset(offset);
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

  get coords() {
    return {
      x: this.object.offset.x,
      y: this.object.offset.y,
      r: this.object.r,
    };
  }

  constructor(object, offset, name) {
    super(object, offset, name);
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

class Road extends Actor {
  static x = 200;
  static y = 0;
  static h = height;
  static w = width - Road.x * 2;

  constructor(name) {
    this.name = name
  }

  draw(timestamp) {
    const { x, y, w, h } = Road;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fillStyle = "gray";
    ctx.fill();
  }
}

class Grass {
  static x = 0;
  static y = 0;
  static h = height;
  static w = width;

  constructor(name) {
    this.name = name;
  }

  draw(timestamp) {
    const { x, y, w, h } = Road;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fillStyle = "green";
    ctx.fill();
  }
}

class Car extends Actor {
  constructor(name, color) {
    this.color = color;
    super(object, offset, name);
  }
}
