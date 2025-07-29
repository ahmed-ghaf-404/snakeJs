
const canvas = document.getElementById("game-canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d")

ctx.imageSmoothingEnabled = false;

const tileSize = 20

const tileCountX = canvas.width / tileSize;
const tileCountY = canvas.height / tileSize;

let snake = [ {x:0, y:0} ]
let food = {x: 10, y: 10}
let dx = 1, dy =0;

function gameLoop(){
    const head = getHead()
    
    snake.unshift(head)
    
    checkCollision(head) ? handleCollision(head) : snake.pop()

    checkResetGame(head) ? resetGame(): drawGame()
}

function getHead(){
    let x = snake[0].x + dx;
    let y = snake[0].y + dy;

    x = (x + tileCountX) % tileCountX;
    y = (y + tileCountY) % tileCountY;

    return { x, y };
}

function checkCollision(head) {
    return head.x === food.x && head.y === food.y;
}

function handleCollision(head){
    food = {
      x: Math.floor(Math.random() * tileCountX),
      y: Math.floor(Math.random() * tileCountY),
    };

    snake.push({x:head.x * tileSize , y:head.y * tileSize})
}

function drawGame() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake with gradient scale
    const maxScale = 1.25;
    const minScale = 1.0;
    const length = snake.length;

    for (let i = 0; i < length; i++) {
        const segment = snake[i];
        
        // Interpolated scale factor (head = maxScale, tail = minScale)
        const t = i / (length - 1 || 1);  // Avoid divide-by-zero
        const scale = maxScale - (maxScale - minScale) * t;

        const size = tileSize * scale;
        const offset = (tileSize - size) / 2;

        ctx.fillStyle = 'lime';
        ctx.beginPath();
        ctx.roundRect(
            segment.x * tileSize + offset,
            segment.y * tileSize + offset,
            size,
            size,
            size / 3 // roundness
        );
        ctx.fill();
        
        // Border
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#003300'; // dark green outline
        ctx.stroke();
    }

    // Draw apple
    ctx.fillStyle = "pink";
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

function checkResetGame(head){
    return snake.slice(1).some(p => p.x === head.x && p.y === head.y)
}

function resetGame() {
  snake = [{ x: 0, y: 0 }];
  dx = 1;
  dy = 0;
}

document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp":
    case "SoftLeft":
      if (dy === 0) dx = 0, dy = -1;
      break;
    case "ArrowDown":
    case "SoftRight":
      if (dy === 0) dx = 0, dy = 1;
      break;
    case "ArrowLeft":
      if (dx === 0) dx = -1, dy = 0;
      break;
    case "ArrowRight":
      if (dx === 0) dx = 1, dy = 0;
      break;
  }
});

setInterval(gameLoop, 1000/10)