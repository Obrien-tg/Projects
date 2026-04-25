/**
 * main.js - Application entry point and initialization script
 * 
 * Purpose: Sets up the canvas, creates the car instance, and draws the
 * initial frame. This is where all the components (HTML canvas, Car, Controls)
 * are wired together.
 * 
 * This file now contains the animation loop that continuously updates and
 * redraws the car each frame.
 */

// Step 1: Get the canvas element from HTML and set up rendering context
const canvas = document.getElementById("myCanvas");

// Set canvas height to fit the entire browser window (viewport height)
canvas.height = window.innerHeight;

// Set canvas width to 200 pixels (fixed for now; can be made responsive)
canvas.width = 200;

// Get the 2D rendering context: this is used to draw on the canvas
// All drawing commands (rect, fill, etc.) use this context
const ctx = canvas.getContext("2d");

// Step 2: Create obstacles
const obstacles = [
    new Obstacle(300, 200, 50, 50),
    new Obstacle(500, 400, 80, 40),
    new Obstacle(200, 500, 40, 100),
    new Obstacle(600, 150, 60, 60),
];

// Step 3: Create a Car instance at position (100, 100) with width 30, height 50
// Constructor also sets up keyboard input via Controls
const car = new Car(100, 100, 30, 50);

// Animation loop: update state, render frame, then schedule next frame.
function animate() {
    // Clear the canvas for the new frame (fill with white)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update the car's state based on controls (acceleration, speed, etc.)
    car.update(obstacles);


    // Draw the car every frame (ideally near 60 FPS depending on browser)
    car.draw(ctx);

    //keep looping
    requestAnimationFrame(animate);
}

animate();