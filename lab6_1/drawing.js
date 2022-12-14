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
  static w = width - Road.x * 2;
  static stripeHeight = 40;
  static speed = 5;
  static roadDeg = 0.03125;
  static currentDegree = 0;
  static maxDeg = 6;
  static toDir = null;

  constructor(name) {
    this.name = name;
    this.stripes = [];
    this.left = [];
    this.right = [];
    this.speedDir = null;
    for (let i = -1; i < Road.h / Road.stripeHeight; i++) {
      this.stripes.push({
        y: i * Road.stripeHeight - Road.speed,
        color: Math.abs(i % 2) ? "white" : "gray",
      });

      this.left.push({
        y: i * Road.stripeHeight - Road.speed,
        color: Math.abs(i % 2) ? "red" : "white",
      });

      this.right.push({
        y: i * Road.stripeHeight - Road.speed,
        color: Math.abs(i % 2) ? "red" : "white",
      });
    }
  }

  speedChange(dir) {
    this.speedDir = dir;
  }

  draw() {
    const { x, y, w, h } = Road;
    ctx.beginPath();
    ctx.rect(x, y - 300, w, h + 600);
    ctx.fillStyle = "gray";
    ctx.fill();

    this.stripes.forEach((stripe) => {
      ctx.beginPath();
      ctx.rect(centerX - 5, stripe.y, 10, Road.stripeHeight);
      ctx.fillStyle = stripe.color;
      ctx.fill();
    });
    this.left.forEach((stripe) => {
      ctx.beginPath();
      ctx.rect(x - 10, stripe.y, 10, Road.stripeHeight);
      ctx.fillStyle = stripe.color;
      ctx.fill();
    });
    this.right.forEach((stripe) => {
      ctx.beginPath();
      ctx.rect(w + x, stripe.y, 10, Road.stripeHeight);
      ctx.fillStyle = stripe.color;
      ctx.fill();
    });
  }
  setDegree(modifier) {
    ctx.translate(centerX, centerY);
    ctx.rotate((modifier * (Road.roadDeg * Math.PI)) / 180);
    ctx.translate(-centerX, -centerY);
  }

  updateDeg() {
    if (Road.toDir === "right") {
      Road.currentDegree += Road.roadDeg;
      this.setDegree(1);
      if (Road.currentDegree === Road.maxDeg) {
        Road.toDir = "finishing";
      }
    } else if (Road.toDir === "left") {
      Road.currentDegree -= Road.roadDeg;
      this.setDegree(-1);
      if (Road.currentDegree === -Road.maxDeg) {
        Road.toDir = "finishing";
      }
    } else if (Road.toDir === "finishing") {
      if (Road.currentDegree > 0) {
        Road.currentDegree -= Road.roadDeg;
        this.setDegree(-1);
      } else if (Road.currentDegree < 0) {
        Road.currentDegree += Road.roadDeg;
        this.setDegree(1);
      }

      if (Road.currentDegree === 0) {
        Road.toDir = null;
      }
    }
  }

  update(timestamp) {
    if (this.speedDir === "up") {
      if (Road.speed < 20) Road.speed += 0.5;
    } else if (this.speedDir === "down") {
      if (Road.speed > 4) Road.speed -= 0.5;
    }
    const currentSpeed = Road.speed;

    for (let i = this.stripes.length - 1; i >= 0; i--) {
      let stripe = this.stripes[i];
      if (stripe.y >= Road.h) {
        // gameConfig.gameOver = true;
        stripe.y = -Road.stripeHeight + (stripe.y - Road.h);
      }
      stripe.y += currentSpeed;

      stripe = this.left[i];
      if (stripe.y >= Road.h) {
        stripe.y = -Road.stripeHeight + (stripe.y - Road.h);
      }
      stripe.y += currentSpeed;

      stripe = this.right[i];
      if (stripe.y >= Road.h) {
        stripe.y = -Road.stripeHeight + (stripe.y - Road.h);
      }
      stripe.y += currentSpeed;
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
  playerSpeed = 7;
  constructor(name, color) {
    if (name === "plr") {
      this.color = color;
      this.moveX = null;
      this.moveY = null;
      this.name = name;
      this.object = new P(new V(), [
        new V(),
        new V(40, 0),
        new V(40, 60),
        new V(0, 60),
      ]);

      this.object.setOffset(new V(centerX - 20, height - 100));
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

  randomPlaceX() {
    let x = randomX();
    if (x - 40 < Road.x) x = Road.x + 40;
    if (x + 40 > Road.x + Road.w) x = Road.x + Road.w - 40;

    return x;
  }

  shoot() {
    if (this.lastShot && performance.now() - this.lastShot < 200) return;

    const [{ x, y }] = this.object.calcPoints;
    actors.push(new Bullet(x + 20, y));
    this.lastShot = performance.now();
  }

  moveXDone() {
    this.moveX = null;
  }

  moveYDone() {
    this.moveY = null;
  }

  setMoveX(move) {
    if (this.moveX !== null) return;
    this.moveX = move;
  }

  setMoveY(move) {
    if (this.moveY !== null) return;
    this.moveY = move;
  }

  move() {
    if (this.moveX === "left") {
      if (this.object.calcPoints[0].x > Road.x) {
        this.object.translate(-this.playerSpeed, 0);
      }
    } else if (this.moveX === "right") {
      if (this.object.calcPoints[1].x < Road.x + Road.w) {
        this.object.translate(this.playerSpeed, 0);
      }
    }
    if (this.moveY === "up") {
      if (this.object.calcPoints[0].y > this.playerSpeed + Car.offsetY) {
        this.object.translate(0, -this.playerSpeed);
      }
    } else if (this.moveY === "down") {
      if (
        this.object.calcPoints[1].y <
        height - 60 - this.playerSpeed - Car.offsetY
      ) {
        this.object.translate(0, this.playerSpeed);
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
      if (this.object.calcPoints[0].y > height + 60) {
        actors.splice(actors.indexOf(this), 1);
        return;
      }

      this.object.translate(0, Road.speed - 2);
    }

    if (this.name === "plr") {
      this.move();
      actors.forEach((actor) => {
        if (actor.name === "car") {
          if (cPP(this.object, actor.object)) {
            gameConfig.gameOver = true;
          }
        }

        if (actor.name === "bonus") {
          if (cPP(this.object, actor.object)) {
            gameConfig.bonusesCollected += 1;
            actors = actors.filter((a) => a !== actor);
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
    const road = actors.find((a) => a.name === "road");

    if (e.key === "a") {
      road.speedChange("up");
    }

    if (e.key === "z") {
      road.speedChange("down");
    }

    if (e.key === "ArrowLeft") {
      a.setMoveX("left");
    }
    if (e.key === "ArrowRight") {
      a.setMoveX("right");
    }
    if (e.key === "ArrowDown") {
      a.setMoveY("down");
    }
    if (e.key === "ArrowUp") {
      a.setMoveY("up");
    }
    if (e.key === " ") {
      a.shoot();
    }
  },
  { passive: true }
);

document.addEventListener(
  "keyup",
  (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const a = actors.find((a) => a.name === "plr");
      a.moveXDone();
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const a = actors.find((a) => a.name === "plr");
      a.moveYDone();
    }
    if (e.key === "a" || e.key === "z") {
      actors.find((a) => a.name === "road")?.speedChange(null);
    }
  },
  { passive: true }
);
