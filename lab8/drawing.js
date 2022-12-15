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

let actors = [];

const grid = new Array(9).fill("").map(() => new Array(9).fill(""));

const gameConfig = {
  gameOver: false,
  turn: "B",
};

class ScoreBoard {
  constructor(name) {
    this.name = name;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.font = "25px Arial";
    ctx.fillText(
      `Ruch: ${gameConfig.turn === "B" ? "Czarny" : "Biały"}`,
      10,
      30
    );
  }

  update() {}
}

class Plane {
  w = width;
  h = height;

  constructor(name) {
    this.name = name;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = "#f09f43";
    ctx.fillRect(0, 0, this.w, this.h);
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
        if (!grid[i][j]) continue;
        const color = grid[i][j] === "B" ? "black" : "white";
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(
          Grid.gridSpacing * i + Grid.x,
          Grid.gridSpacing * j + Grid.y,
          Grid.gridSpacing / 3,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }
    }
  }

  update() {}
}

const getNearstSameColorStones = (x, y) => {
  const color = grid[x][y];
  const result = [];
  const check = (x, y) => {
    if (x < 0 || y < 0 || x >= grid.length || y >= grid.length) return;
    if (grid[x][y] !== color) return;
    if (result.some((r) => r.x === x && r.y === y)) return;

    result.push({ x, y });
    check(x + 1, y);
    check(x - 1, y);
    check(x, y + 1);
    check(x, y - 1);
  };

  check(x, y);
  return result;
};

const removeStonesIfTrapped = () => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (!grid[i][j]) continue;
      const neares = getNearstSameColorStones(i, j);

      let isTrapped = true;
      for (let k = 0; k < neares.length; k++) {
        const { x, y } = neares[k];
        // check if there are emty space around
        if (x + 1 < grid.length && !grid[x + 1][y]) isTrapped = false;
        if (x - 1 >= 0 && !grid[x - 1][y]) isTrapped = false;
        if (y + 1 < grid.length && !grid[x][y + 1]) isTrapped = false;
        if (y - 1 >= 0 && !grid[x][y - 1]) isTrapped = false;

        if (!isTrapped) break;
      }

      if (isTrapped) {
        for (let k = 0; k < neares.length; k++) {
          const { x, y } = neares[k];
          grid[x][y] = "";
        }
      }
    }
  }
};

const { x, y } = canvas.getBoundingClientRect();

canvas.addEventListener("click", (event) => {
  const cx = event.clientX - x;
  const cy = event.clientY - y;

  let moved = false;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      const offset = 30;
      const x = Grid.gridSpacing * i + Grid.x - 30;
      const y = Grid.gridSpacing * j + Grid.y - 30;

      if (cx > x && cx < x + 2 * offset && cy > y && cy < y + 2 * offset) {
        if (grid[i][j]) break;
        grid[i][j] = gameConfig.turn;
        gameConfig.turn = gameConfig.turn === "B" ? "W" : "B";
        moved = true;
        break;
      }
    }

    if (moved) break;
  }

  if (moved) {
    removeStonesIfTrapped();
  }
});

