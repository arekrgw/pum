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

const gameConfig = {
  gameOver: false,
};

let actors = [];

class ScoreBoard {
  constructor() {
    this.x = 40;
    this.y = centerY - 100;
    this.color = "white";
    this.font = "20px Arial";
  }

  update() {}

  draw() {
    if (gameConfig.gameOver) {
      ctx.font = "40px Arial";
      ctx.fillStyle = "red";
      ctx.textAlign = "center";
      ctx.fillText(`Game Over`, centerX, centerY + 20);
    }
  }
}
class Road {
  static x = 200;
  static y = 0;
  static h = height;
  static w = width;
  static stripeWidth = 40;
  static speed = 5;

  constructor(name) {
    this.name = name;
    this.left = [];
    this.speedDir = null;
    for (let i = Road.w / Road.stripeWidth; i >= -1; i--) {
      this.left.push({
        x: i * Road.stripeWidth - Road.speed,
        color: Math.abs(i % 2) ? "red" : "white",
      });
    }
  }

  speedChange(dir) {
    this.speedDir = dir;
  }

  draw() {
    const { w, h } = Road;
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.fillStyle = "gray";
    ctx.fill();

    this.left.forEach((stripe) => {
      ctx.beginPath();
      ctx.rect(stripe.x, Road.h - 20, Road.stripeWidth, 20);
      ctx.fillStyle = stripe.color;
      ctx.fill();
    });
  }

  update(timestamp) {
    const currentSpeed = Road.speed;
    for (let i = this.left.length - 1; i >= 0; i--) {
      let stripe = this.left[i];
      if (stripe.x <= -Road.stripeWidth) {
        stripe.x = Road.w + Road.stripeWidth - Road.speed;
      }
      stripe.x -= currentSpeed;
    }
  }
}

class Car {
  static offsetY = 30;
  static beginX = 25;
  static beginY = 20;
  static playerH = 40;
  static maxPlayerJump = 200;
  static jumpSpeed = 8;

  static minimalJump = 60;

  constructor(name, color) {
    if (name === "plr") {
      this.color = color;
      this.jumpingDir = null;
      this.jumpBlocked = false;
      this.jumpPressed = false;

      this.name = name;
      this.object = new P(new V(), [
        new V(),
        new V(60, 0),
        new V(60, 40),
        new V(0, 40),
      ]);

      this.object.setOffset(
        new V(Car.beginX, height - Car.beginY - Car.playerH)
      );
      return;
    }

    this.color = color;
    this.name = name;
    this.object = new P(new V(), [
      new V(),
      new V(60, 0),
      new V(60, 40),
      new V(0, 40),
    ]);

    this.object.setOffset(new V(Road.w, height - Car.beginY - Car.playerH));
  }

  jump() {
    this.jumpPressed = true;
    this.jumpBlocked = true;
  }

  jumpDone() {
    this.jumpPressed = false;
  }

  _jump() {
    if (this.jumpingDir === null && this.jumpPressed) {
      this.jumpingDir = "up";
    }

    if (this.jumpingDir === "up") {
      this.object.translate(0, -Car.jumpSpeed);

      if (
        this.object.calcPoints[0].y <
        height - Car.beginY - Car.playerH - Car.minimalJump
      ) {
        if (!this.jumpPressed) {
          this.jumpingDir = "down";
        }

        if (
          this.jumpPressed &&
          this.object.calcPoints[0].y <
            height - Car.beginY - Car.playerH - Car.maxPlayerJump
        ) {
          this.jumpingDir = "down";
        }
      }

      return;
    }

    if (this.jumpingDir === "down") {
      this.object.translate(0, Car.jumpSpeed);

      if (this.object.calcPoints[0].y >= height - Car.beginY - Car.playerH) {
        this.jumpingDir = null;
      }
    }
  }

  draw(timestamp) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    this.object.calcPoints.forEach(({ x, y }, i) => {
      if (i === 0) {
        ctx.moveTo(x, y);
        return;
      }
      ctx.lineTo(x, y);
    });

    ctx.closePath();
    ctx.fill();
  }

  update(timestamp) {
    if (this.name !== "plr") {
      if (this.object.calcPoints[0].x + 60 < 0) {
        actors.splice(actors.indexOf(this), 1);
        return;
      }

      this.object.translate(-Road.speed, 0);
    }

    if (this.name === "plr") {
      this._jump(timestamp);
      actors.forEach((actor) => {
        if (actor.name === "car") {
          if (cPP(this.object, actor.object)) {
            gameConfig.gameOver = true;
          }
        }
      });
    }
  }
}

const randomTime = () => Math.floor(Math.random() * 1500) + 700;

const randomCar = () => {
  const car = new Car("car", "blue");
  actors.push(car);
  setTimeout(randomCar, randomTime());
};

document.addEventListener(
  "keydown",
  (e) => {
    if (gameConfig.gameOver) return;
    const a = actors.find((a) => a.name === "plr");
    if (e.key === " ") {
      a.jump();
    }
  },
  { passive: true }
);

document.addEventListener(
  "keyup",
  (e) => {
    if (e.key === " ") {
      const a = actors.find((a) => a.name === "plr");
      a.jumpDone();
    }
  },
  { passive: true }
);
