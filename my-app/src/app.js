// This file contains the JavaScript code for the Snake game application.

// Wait for the DOM to load before running any code
document.addEventListener('DOMContentLoaded', () => {
    // Add a Start Game button below the canvas
    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start Game';
    startBtn.id = 'startBtn';
    document.body.insertBefore(startBtn, document.getElementById('score').nextSibling);

    // Disable arrow keys until game starts
    let gameStarted = false;

    // Listen for arrow key presses to change the snake's direction
    document.addEventListener('keydown', function(event) {
        if (gameStarted) changeDirection(event);
    });

    // Start the game when the button is clicked
    startBtn.addEventListener('click', () => {
        if (!gameStarted) {
            startGame();
            gameStarted = true;
            startBtn.disabled = true;
        }
    });
});

// Get the canvas and its drawing context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const box = 20;           // Size of each square (snake segment and food)
const canvasSize = 400;   // Width and height of the canvas

// Initialize the snake as an array of segments (starting with one segment)
let snake = [{ x: 9 * box, y: 10 * box }];

// Initial direction of the snake
let direction = 'RIGHT';

// Place the first food at a random position
let food = {
  x: Math.floor(Math.random() * (canvasSize / box)) * box,
  y: Math.floor(Math.random() * (canvasSize / box)) * box
};

// Initialize score and game interval variable
let score = 0;
let gameInterval;

// Change the direction of the snake based on user input
function changeDirection(event) {
  if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  else if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  else if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  else if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
}

// Function to generate random obstacles
function generateObstacles(count) {
  const obs = [];
  while (obs.length < count) {
    // Generate random position
    const x = Math.floor(Math.random() * (canvasSize / box)) * box;
    const y = Math.floor(Math.random() * (canvasSize / box)) * box;
    // Avoid placing on snake or food
    const onSnake = snake.some(segment => segment.x === x && segment.y === y);
    const onFood = (food.x === x && food.y === y);
    const onObstacle = obs.some(o => o.x === x && o.y === y);
    if (!onSnake && !onFood && !onObstacle) {
      obs.push({ x, y });
    }
  }
  return obs;
}

// Generate a set number of random obstacles at the start
const obstacleCount = 5;
let obstacles = generateObstacles(obstacleCount);

// Main game loop: draws everything and updates the game state
function draw() {
  // Clear the canvas for the new frame
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  // Draw obstacles
  ctx.fillStyle = '#888'; // Gray color for obstacles
  obstacles.forEach(obs => {
    ctx.fillRect(obs.x, obs.y, box, box);
  });

  // Draw the snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? '#0f0' : '#fff'; // Head is green, body is white
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw the food
  ctx.fillStyle = '#f00';
  ctx.fillRect(food.x, food.y, box, box);

  // Calculate new head position based on direction
  let head = { x: snake[0].x, y: snake[0].y };
  if (direction === 'LEFT') head.x -= box;
  if (direction === 'UP') head.y -= box;
  if (direction === 'RIGHT') head.x += box;
  if (direction === 'DOWN') head.y += box;

  // --- Replace wall collision check with wrap-around logic ---
  head.x = (head.x + canvasSize) % canvasSize;
  head.y = (head.y + canvasSize) % canvasSize;

  // Check if the snake eats the food
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById('score').innerText = 'Score: ' + score;
    // Place new food at a random position, avoiding obstacles and snake
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * (canvasSize / box)) * box,
        y: Math.floor(Math.random() * (canvasSize / box)) * box
      };
    } while (
      snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) ||
      obstacles.some(obs => obs.x === newFood.x && obs.y === newFood.y)
    );
    food = newFood;
    // Do not remove the tail (snake grows)
  } else {
    // Remove the tail (snake moves forward)
    snake.pop();
  }

  // Check for collisions with self or obstacles
  if (
    snake.some(segment => segment.x === head.x && segment.y === head.y) || // Self collision
    obstacles.some(obs => obs.x === head.x && obs.y === head.y) // Obstacle collision
  ) {
    clearInterval(gameInterval); // Stop the game loop
    alert('Game Over! Your score: ' + score); // Show game over message
    document.location.reload(); // Reload the page to restart
    return;
  }

  // Add the new head to the snake
  snake.unshift(head);
}

// Start the game loop, calling draw() every 100ms
function startGame() {
  gameInterval = setInterval(draw, 100);
}