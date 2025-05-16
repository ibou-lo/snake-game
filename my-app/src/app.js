// This file contains the JavaScript code for the Snake game application.

// Wait for the DOM to load before running any code
document.addEventListener('DOMContentLoaded', () => {
    // Example welcome message and button (not part of the Snake game)
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = '<h1>Welcome to My App</h1>';

    const button = document.createElement('button');
    button.textContent = 'Click Me';
    appContainer.appendChild(button);

    button.addEventListener('click', () => {
        alert('Button was clicked!');
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

// Listen for arrow key presses to change the snake's direction
document.addEventListener('keydown', changeDirection);

// Change the direction of the snake based on user input
function changeDirection(event) {
  if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  else if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  else if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  else if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
}

// Main game loop: draws everything and updates the game state
function draw() {
  // Clear the canvas for the new frame
  ctx.clearRect(0, 0, canvasSize, canvasSize);

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

  // Check if the snake eats the food
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById('score').innerText = 'Score: ' + score;
    // Place new food at a random position
    food = {
      x: Math.floor(Math.random() * (canvasSize / box)) * box,
      y: Math.floor(Math.random() * (canvasSize / box)) * box
    };
    // Do not remove the tail (snake grows)
  } else {
    // Remove the tail (snake moves forward)
    snake.pop();
  }

  // Check for collisions with walls or self
  if (
    head.x < 0 || head.x >= canvasSize || // Wall collision (left/right)
    head.y < 0 || head.y >= canvasSize || // Wall collision (top/bottom)
    snake.some(segment => segment.x === head.x && segment.y === head.y) // Self collision
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

// Start the game when the script loads
startGame();