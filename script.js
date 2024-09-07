const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const grid = 20;
let snake = [{ x: 160, y: 160 }];
let apple = { x: 80, y: 80 };
let dx = grid;
let dy = 0;
let changingDirection = false;
let score = 0;

// Thirdweb SDK setup
const { ThirdwebSDK } = window;
const sdk = new ThirdwebSDK('goerli'); // Use appropriate network

// Contract address (Replace with your deployed contract address)
const contractAddress = '0xacbf8ad413947c93a81ead9eaa752aa27c4eab3a';
const contract = sdk.getContract(contractAddress);

// Draw game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawApple();
    moveSnake();
    checkCollision();
    changingDirection = false;
    setTimeout(draw, 100);
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, grid, grid));
}

function drawApple() {
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x, apple.y, grid, grid);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (head.x === apple.x && head.y === apple.y) {
        apple = { x: Math.floor(Math.random() * canvas.width / grid) * grid, y: Math.floor(Math.random() * canvas.height / grid) * grid };
        score++;
    } else {
        snake.pop();
    }
}

function checkCollision() {
    if (snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height ||
        snake.slice(1).some(segment => segment.x === snake[0].x && segment.y === snake[0].y)) {
        alert(`Game Over. Score: ${score}`);
        saveScore(score);
        snake = [{ x: 160, y: 160 }];
        dx = grid;
        dy = 0;
        score = 0;
    }
}

document.addEventListener('keydown', (event) => {
    if (changingDirection) return;
    changingDirection = true;
    if (event.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -grid; }
    if (event.key === 'ArrowDown' && dy === 0) { dx = 0; dy = grid; }
    if (event.key === 'ArrowLeft' && dx === 0) { dx = -grid; dy = 0; }
    if (event.key === 'ArrowRight' && dx === 0) { dx = grid; dy = 0; }
});

function saveScore(score) {
    if (contract) {
        contract.call('saveScore', score).then((result) => {
            console.log('Score saved:', result);
        }).catch((error) => {
            console.error('Error saving score:', error);
        });
    }
}

document.getElementById('saveScoreButton').addEventListener('click', () => {
    saveScore(score);
});

draw();
