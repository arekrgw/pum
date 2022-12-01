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

class MazeBuilder {
  constructor(canvasWidth, canvasHeight, cellSize) {
    this.cellSize = cellSize;
    this.width = (canvasWidth - this.cellSize) / this.cellSize;
    this.height = (canvasHeight - this.cellSize) / this.cellSize;
    if (
      Math.trunc(this.width) !== this.width ||
      Math.trunc(this.height) !== this.height
    ) {
      throw new Error("Cell size must divide evenly into canvas dimensions");
    }

    console.log(this.width, this.height, canvasHeight, canvasWidth);
    this.cols = 2 * this.width + 1;
    this.rows = 2 * this.height + 1;

    this.maze = this.initArray([]);

    // place initial walls
    this.maze.forEach((row, r) => {
      row.forEach((cell, c) => {
        switch (r) {
          case 0:
          case this.rows - 1:
            this.maze[r][c] = ["wall"];
            break;

          default:
            if (r % 2 === 1) {
              if (c === 0 || c === this.cols - 1) {
                this.maze[r][c] = ["wall"];
              }
            } else if (c % 2 === 0) {
              this.maze[r][c] = ["wall"];
            }
        }
      });

      if (r === 0) {
        // place exit in top row
        let doorPos = this.posToSpace(this.rand(1, this.width));
        this.maze[r][doorPos] = ["door", "exit"];
      }

      // if (r === this.rows - 1) {
      //   // place entrance in bottom row
      //   let doorPos = this.posToSpace(this.rand(1, this.width));
      //   this.maze[r][doorPos] = ["door", "entrance"];
      // }
    });

    // start partitioning
    this.partition(1, this.height - 1, 1, this.width - 1);
  }

  initArray(value) {
    return new Array(this.rows)
      .fill()
      .map(() => new Array(this.cols).fill(value));
  }

  rand(min, max) {
    return min + Math.floor(Math.random() * (1 + max - min));
  }

  posToSpace(x) {
    return 2 * (x - 1) + 1;
  }

  posToWall(x) {
    return 2 * x;
  }

  inBounds(r, c) {
    if (
      typeof this.maze[r] === "undefined" ||
      typeof this.maze[r][c] === "undefined"
    ) {
      return false; // out of bounds
    }
    return true;
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  partition(r1, r2, c1, c2) {
    let horiz, vert, x, y, start, end;

    if (r2 < r1 || c2 < c1) {
      return false;
    }

    if (r1 === r2) {
      horiz = r1;
    } else {
      x = r1 + 1;
      y = r2 - 1;
      start = Math.round(x + (y - x) / 4);
      end = Math.round(x + (3 * (y - x)) / 4);
      horiz = this.rand(start, end);
    }

    if (c1 === c2) {
      vert = c1;
    } else {
      x = c1 + 1;
      y = c2 - 1;
      start = Math.round(x + (y - x) / 3);
      end = Math.round(x + (2 * (y - x)) / 3);
      vert = this.rand(start, end);
    }

    for (let i = this.posToWall(r1) - 1; i <= this.posToWall(r2) + 1; i++) {
      for (let j = this.posToWall(c1) - 1; j <= this.posToWall(c2) + 1; j++) {
        if (i === this.posToWall(horiz) || j === this.posToWall(vert)) {
          this.maze[i][j] = ["wall"];
        }
      }
    }

    let gaps = this.shuffle([true, true, true, false]);

    // create gaps in partition walls

    if (gaps[0]) {
      let gapPosition = this.rand(c1, vert);
      this.maze[this.posToWall(horiz)][this.posToSpace(gapPosition)] = [];
    }

    if (gaps[1]) {
      let gapPosition = this.rand(vert + 1, c2 + 1);
      this.maze[this.posToWall(horiz)][this.posToSpace(gapPosition)] = [];
    }

    if (gaps[2]) {
      let gapPosition = this.rand(r1, horiz);
      this.maze[this.posToSpace(gapPosition)][this.posToWall(vert)] = [];
    }

    if (gaps[3]) {
      let gapPosition = this.rand(horiz + 1, r2 + 1);
      this.maze[this.posToSpace(gapPosition)][this.posToWall(vert)] = [];
    }

    // recursively partition newly created chambers

    this.partition(r1, horiz - 1, c1, vert - 1);
    this.partition(horiz + 1, r2, c1, vert - 1);
    this.partition(r1, horiz - 1, vert + 1, c2);
    this.partition(horiz + 1, r2, vert + 1, c2);
  }

  draw() {
    this.maze.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell.length && cell.includes("wall")) {
          ctx.fillStyle = "black";
          ctx.fillRect(
            c * (this.cellSize / 2),
            r * (this.cellSize / 2),
            this.cellSize / 2,
            this.cellSize / 2
          );
        }
      });
    });
  }
  update() {}
}

// const maze = new MazeBuilder(10, 10);

// console.log(maze);
