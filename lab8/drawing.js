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

const grid = new Array(9).fill("").map(() => new Array(9).fill("B"));

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
  static w = width - 200;
  static h = height - 200;
  static x = 100;
  static y = 100;
  static gridSpacing = this.w / (grid.length - 1);

  constructor(name) {
    this.name = name;
  }

  draw() {
    let start = Grid.x;
    for (let i = 0; i < grid.length; i++) {
      ctx.beginPath();
      ctx.moveTo(start, Grid.y);
      ctx.lineTo(start, Grid.h + Grid.y);
      ctx.stroke();
      start += Grid.gridSpacing;
    }

    start = Grid.y;
    for (let i = 0; i < grid.length; i++) {
      ctx.beginPath();
      ctx.moveTo(Grid.x, start);
      ctx.lineTo(Grid.w + Grid.x, start);
      ctx.stroke();
      start += Grid.gridSpacing;
    }
  }

  update() {}
}

class Stones {
  constructor(name) {
    this.name = name;
  }

  draw() {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        const color = grid[i][j] === "B" ? "black" : "white";
        if (grid[i][j] && i === 0) {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.fillRect(20, 20, 5, 5);
          ctx.fill();
          // ctx.beginPath();
          // ctx.fillStyle = color;
          // ctx.arc(
          //   Grid.gridSpacing * i + Grid.x,
          //   Grid.gridSpacing * j + Grid.y,
          //   10,
          //   0,
          //   2 * Math.PI
          // );
          // ctx.fill();
        }
      }
    }
  }

  update() {}
}

let actors = [];
