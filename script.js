'use strict'

alert("start game");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 500;

function getRand(min, max) {
    return Math.random() * (max - min) + min;
}
// Объект щара
function Ball(x, y, radius, startAngle, endAngle) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.startAngle = startAngle;
  this.endAngle = endAngle;
  this.draw = function () {
    ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle);
    ctx.stroke();
  };
}
// Объект прямоугольника
function Enemy(color, x, y, width, height) {
  this.color = color;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.draw = function () // Отрисовка
  {
    ctx.beginPath();
    ctx.clearRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.closePath();
  };
}

let speed = 3; // speed of shar
const enemy_max_width = 100; // максимальная ширина прямоугольника, уменьшить в случае дисбаланса
const enemy_max_height = 50; // максимальная высота прямоугольника, тоже
let x = canvas.width + enemy_max_width + 20; // чтобы появлялся за стеночкой
let y = canvas.height - enemy_max_height; // чтобы появлялся близко к полу
let level = 1; // начальный уровень
let counter = 0; // счетчик для врагов, всегда 0
let level_done = false; // для конца уровня, ложь
let bY = canvas.height - 50; // Игрээк шара, для прыжка 
let jump = false; // прыжок, ложь
const jumpSpeed = 4; // скорость прыжка
let us =  getRand(30, enemy_max_width); // рандомайзер ширины прямоугольника
let tal =  getRand(30, enemy_max_height); // рандомайзер высоты прямоугольника

// Окошко открывает, когда уровень пройден
function levelDoneWindow() {
  const win = document.getElementById("lvl");
  win.style.display = "block";
}
// Рисовалка
function drawGame() {
  let enemy_count = level * 2; // скейлинг количества прямоугольников от уровня
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let ball = new Ball(canvas.width / 2, bY, 50, 0, Math.PI * 2);

  // операция - прыжок
  if (jump) {
    if (bY >= canvas.height - 200) {
      bY -= jumpSpeed;
    } else {
      jump = false;
    }
  } else if (bY != canvas.height - 50) {
    bY += jumpSpeed;
  }
  // закончена

  let menemy = new Enemy("#000", x, y, us, tal);
  //когда прямоугольник уходит за стену
  if (menemy.x <= 0 - enemy_max_width) {
    x = canvas.width + getRand(10, 230);
    us =  getRand(10, enemy_max_width);
    tal =  getRand(10, enemy_max_height);
    counter++;
    //если враги кончились - уровень все.
    if (counter == enemy_count) {
      level_done = true;
      levelDoneWindow();
    }
  }
  menemy.draw();
  ball.draw();

  x -= speed;
  if (!level_done) {
    window.requestAnimationFrame(drawGame);
  }
  // проверяет соприкосновение шара и прямоугольника
  let testX = ball.x;
  let testY = ball.y;

  if (ball.x < menemy.x) {
    testX = menemy.x;
  } 
  else if (ball.x > menemy.x + menemy.width) {
    testX = menemy.x + menemy.width;
  } 
  if (ball.y < menemy.y) {
    testY = menemy.y;
  } 
  else if (ball.y > menemy.y + menemy.height) {
    testY = menemy.y + menemy.height;
  } 

  let distX = ball.x - testX;
  let distY = ball.y - testY;
  let distance = Math.sqrt(distX * distX + distY * distY);

  if (distance <= ball.radius) {
    alert("ВЫ ПРОИГРАЛИ");
    location.reload();
  }
  // перестал проверять
}

// хватает нажатие пробела
document.addEventListener("keydown", (event) => {
  const keyCode = event.code;
  if (keyCode === "Space") {
    if (bY != canvas.height - 50 && !jump) {
      jump = false;
    } else {
      jump = true;
    }
  }
});
// вызов риосвалки
drawGame();

// Кнопка "след уровень", увеличивает скорость, обнуляет счетчик,
//увеличивает лвл, ставит прямоугольничек в позицию старта
function cloz() {
  const win = document.getElementById("lvl");
  level++;
  counter = 0;
  speed++;
  x = canvas.width + enemy_max_width + 20;
  level_done = false;
  win.style.display = "none";
  drawGame();
}
