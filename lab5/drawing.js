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
// user defined code

class Road {
  static x = 200;
  static y = 0;
  static h = height;
  static w = width - Road.x * 2;
  static stripeHeight = 40;
  static speed = 5;

  constructor(name) {
    this.name = name;
    this.stripes = [];
    this.left = [];
    this.right = [];
    for (let i = -1; i < Road.h / Road.stripeHeight; i++) {
      this.stripes.push({
        y: i * Road.stripeHeight,
        color: Math.abs(i % 2) ? "white" : "gray",
      });

      this.left.push({
        y: i * Road.stripeHeight,
        color: Math.abs(i % 2) ? "red" : "white",
      });

      this.right.push({
        y: i * Road.stripeHeight,
        color: Math.abs(i % 2) ? "red" : "white",
      });
    }
  }

  draw(timestamp) {
    const { x, y, w, h } = Road;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
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

  update(timestamp) {
    this.stripes.forEach((stripe) => {
      stripe.y += Road.speed;
      if (stripe.y > Road.h) {
        stripe.y = -Road.stripeHeight;
      }
    });
    this.left.forEach((stripe) => {
      stripe.y += Road.speed;
      if (stripe.y > Road.h) {
        stripe.y = -Road.stripeHeight;
      }
    });
    this.right.forEach((stripe) => {
      stripe.y += Road.speed;
      if (stripe.y > Road.h) {
        stripe.y = -Road.stripeHeight;
      }
    });
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
      return;
    }

    if (this.object.pos.y < 0) {
      actors = actors.filter((actor) => actor !== this);
      return;
    }

    this.object.pos.add(new V(0, -8));
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

    console.log("asd");
  }

  randomPlaceX() {
    let x = randomX();
    if (x - 15 < Road.x) x = Road.x + 15;
    if (x + 15 > Road.x + Road.w) x = Road.x + Road.w - 15;

    return x;
  }

  update() {
    if (this.object.calcPoints[0].y > height + 15) {
      actors = actors.filter((actor) => actor !== this);
      return;
    }

    this.object.translate(0, 5);
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
  constructor(name, color) {
    if (name === "plr") {
      this.color = color;
      this.name = name;
      this.object = new P(new V(), [
        new V(),
        new V(40, 0),
        new V(40, 60),
        new V(0, 60),
      ]);

      this.object.setOffset(new V(centerX - 20, height - 70));
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
    if (x + 40 < Road.x) x = Road.x + 40;
    if (x + 40 > Road.x + Road.w) x = Road.x + Road.w - 40;

    return x;
  }

  shoot() {
    const [{ x, y }] = this.object.calcPoints;
    actors.push(new Bullet(x + 20, y));
  }

  move(dir) {
    if (dir === "left") {
      if (this.object.calcPoints[0].x > Road.x) {
        this.object.translate(-7, 0);
      }
    } else if (dir === "right") {
      if (this.object.calcPoints[1].x < Road.x + Road.w) {
        this.object.translate(7, 0);
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
      this.object.translate(0, 5);
    }

    if (this.name === "plr") {
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

const randomTime = () => Math.floor(Math.random() * 1000) + 500;

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

randomCar();
randomBonus();
document.addEventListener("keydown", (e) => {
  if (gameConfig.gameOver) return;
  const a = actors.find((a) => a.name === "plr");
  if (e.key === "ArrowLeft") {
    a.move("left");
  }
  if (e.key === "ArrowRight") {
    a.move("right");
  }
  if (e.key === " ") {
    a.shoot();
  }
});
