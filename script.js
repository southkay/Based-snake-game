const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scale = 20;
canvas.width = 400;
canvas.height = 400;

let snake = [{ x: 160, y: 160 }];
let food = { x: 80, y: 80 };

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, scale, scale);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, scale, scale);
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
}

setInterval(updateGame, 100);
