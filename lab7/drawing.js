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
  carsKilled: 0,
  bonusesCollected: 0,
};

let actors = [];

const reverseRotate = (modifier) => {
  ctx.translate(centerX, centerY);
  ctx.rotate((modifier * (Road.currentDegree * Math.PI)) / 180);
  ctx.translate(-centerX, -centerY);
};

class ScoreBoard {
  constructor() {
    this.x = 40;
    this.y = centerY - 100;
    this.color = "white";
    this.font = "20px Arial";
  }

  update() {}

  draw() {
    reverseRotate(-1);
    ctx.fillStyle = this.color;
    ctx.font = this.font;
    ctx.textAlign = "left";
    ctx.fillStyle = this.color;
    ctx.fillText(`Cars killed: ${gameConfig.carsKilled}`, this.x, this.y + 20);
    ctx.fillText(
      `Bonuses: ${gameConfig.bonusesCollected}`,
      this.x,
      this.y + 10 + 20 + 20
    );

    if (gameConfig.gameOver) {
      ctx.font = "40px Arial";
      ctx.fillStyle = "red";
      ctx.textAlign = "center";
      ctx.fillText(`Game Over`, centerX, centerY + 20);
    }

    reverseRotate(1);
  }
}

class Speedometer {
  constructor() {
    this.x = 40;
    this.y = centerY;
    this.color = "white";
    this.font = "20px Arial";
  }

  update() {}

  draw() {
    reverseRotate(-1);
    ctx.fillStyle = this.color;
    ctx.font = this.font;
    ctx.textAlign = "left";
    ctx.fillStyle = this.color;
    ctx.fillText(`Speed: ${(Road.speed * 10).toFixed(0)}kmh`, this.x, this.y);
    reverseRotate(1);
  }
}

class Road {
  static x = 200;
  static y = 0;
  static h = height;
  static w = width;
  static stripeWidth = 40;
  static speed = 5;
  static roadDeg = 0.03125;
  static currentDegree = 0;
  static maxDeg = 6;
  static toDir = null;

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

class Grass {
  static x = -300;
  static y = -300;
  static h = height + 600;
  static w = width + 600;

  constructor(name) {
    this.name = name;
  }

  draw(timestamp) {
    const { x, y, w, h } = Grass;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fillStyle = "green";
    ctx.fill();
  }

  update(timestamp) {}
}

const randomX = () => Math.floor(Math.random() * width);

class Bullet {
  constructor(x, y) {
    this.name = "bullet";
    this.object = new C(new V(x, y), 10);
    this.color = "black";
  }
  update() {
    const foundCar = actors.find(
      (a) => a.name === "car" && cCP(this.object, a.object)
    );

    if (foundCar) {
      actors = actors.filter((actor) => actor !== this && actor !== foundCar);
      gameConfig.carsKilled += 1;
      return;
    }

    if (this.object.pos.y < 0) {
      actors = actors.filter((actor) => actor !== this);
      return;
    }

    this.object.pos.add(new V(0, -5));
  }

  draw() {
    ctx.beginPath();
    ctx.arc(
      this.object.pos.x,
      this.object.pos.y,
      this.object.r,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Bonus {
  constructor(x, y) {
    this.object = new P(new V(), [
      new V(-10, -10),
      new V(10, -10),
      new V(10, 10),
      new V(-10, 10),
    ]);

    this.object.rotate(Math.PI / 4);
    this.object.setOffset(new V(this.randomPlaceX(), -15));
    this.color = "yellow";
    this.name = "bonus";
  }

  randomPlaceX() {
    let x = randomX();
    if (x - 15 < Road.x) x = Road.x + 15;
    if (x + 15 > Road.x + Road.w) x = Road.x + Road.w - 15;

    return x;
  }

  update() {
    if (this.object.calcPoints[0].y > height + 15) {
      // remove bonus
      actors.splice(actors.indexOf(this), 1);
      return;
    }

    this.object.translate(0, Road.speed);
  }
  draw() {
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
}
class Car {
  static offsetY = 30;
  static beginX = 25;
  static beginY = 25;
  static playerH = 40;
  static maxPlayerJump = 200;
  static jumpSpeed = 5;

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
      new V(40, 0),
      new V(40, 60),
      new V(0, 60),
    ]);

    this.object.setOffset(new V(this.randomPlaceX(), -60));
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
    this._jump(timestamp);
    // if (this.name !== "plr") {
    //   if (this.object.calcPoints[0].y > height + 60) {
    //     actors.splice(actors.indexOf(this), 1);
    //     return;
    //   }

    //   this.object.translate(0, Road.speed - 2);
    // }

    // if (this.name === "plr") {
    //   this.move();
    //   actors.forEach((actor) => {
    //     if (actor.name === "car") {
    //       if (cPP(this.object, actor.object)) {
    //         gameConfig.gameOver = true;
    //       }
    //     }

    //     if (actor.name === "bonus") {
    //       if (cPP(this.object, actor.object)) {
    //         gameConfig.bonusesCollected += 1;
    //         actors = actors.filter((a) => a !== actor);
    //       }
    //     }
    //   });
    // }
  }
}

const randomTime = () => Math.floor(Math.random() * 1500) + 700;

const randomCar = () => {
  const car = new Car("car", "blue");
  actors.push(car);
  setTimeout(randomCar, randomTime());
};

const randomBonus = () => {
  const bonus = new Bonus();
  actors.push(bonus);
  setTimeout(randomBonus, randomTime());
};

const randomRotate = () => {
  if (Road.toDir !== null) {
    setTimeout(randomRotate, randomTime());
    return;
  }
  Road.toDir = Math.random() > 0.5 ? "left" : "right";
  setTimeout(randomRotate, randomTime());
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
