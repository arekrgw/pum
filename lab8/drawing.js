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

const grid = new Array(9).fill("").map(() => new Array(9).fill(""));

const gameConfig = {
  gameOver: false,
};

class Plane {
  w = width;
  h = height;

  constructor(name) {
    this.name = name;
  }

  draw() {
    ctx.beginPath();
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.fillStyle = "#f09f43";
  }

  update() {}
}

class Grid {
  w = width - 200;
  h = height - 200;
  x = 100;
  y = 100;
  grid = grid;
  static gridSpacing = (width - 200) / (grid.length - 1);

  constructor(name) {
    this.name = name;
  }

  draw() {
    let start = this.x;
    for (let i = 0; i < this.grid.length; i++) {
      ctx.beginPath();
      ctx.moveTo(start, this.y);
      ctx.lineTo(start, this.h + this.y);
      ctx.stroke();
      start += Grid.gridSpacing;
    }

    start = this.y;
    for (let i = 0; i < this.grid.length; i++) {
      ctx.beginPath();
      ctx.moveTo(this.x, start);
      ctx.lineTo(this.w + this.x, start);
      ctx.stroke();
      start += this.h / (this.grid.length - 1);
    }
  }

  update() {}
}

let actors = [];
