const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 70;

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

let lastColor = "green";

function paintCircle(color) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

paintCircle(lastColor);

setInterval(() => {
  const currentColor = lastColor === "green" ? "blue" : "green";
  paintCircle(currentColor);
  lastColor = currentColor;
}, 1000);
