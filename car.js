/**
 * Car class represents a car entity in the simulation.
 * Handles the car's position, dimensions, and rendering to the canvas.
 * 
 * Purpose: Encapsulates all car-related data and drawing logic, separating
 * concerns between input handling (Controls) and visual representation (Car).
 */
class Car {
    /**
     * Constructor initializes a car with position and size.
     * 
     * @param {number} x - Initial x-coordinate (center of car)
     * @param {number} y - Initial y-coordinate (center of car)
     * @param {number} width - Car width in pixels
     * @param {number} height - Car height in pixels
     */
    constructor(x, y, width, height) {
        // Position: store center coordinates for easier rotation later
        this.x = x;
        this.y = y;
        
        // Dimensions: width and height define the car's visual bounding box
        this.width = width;
        this.height = height;

        //Physics properties
        this.speed = 0;
        this.angle = 0;
        this.acceleration = 0.3;
        this.maxSpeed = 5;
        this.maxReverseSpeed = -2.5;
        this.friction = 0.05;

        // Controls: instantiate Controls to listen for keyboard input
        // This connects the car to user input (arrow keys and WASD)
        this.controls = new Controls();
    }

    /**
     * Draws the car on the canvas as a filled rectangle.
     * 
     * How it works:
     * 1. Create a rectangular path centered at (this.x, this.y)
     * 2. Offset the rect by half width/height so rotation center is correct
     * 3. Fill the path with the current fillStyle (default: black)
     * 
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context
     */
   

    update() {
        // Handle acceleration based on controls
        if(this.controls.forward){
            this.speed += this.acceleration;
        }
        if(this.controls.reverse){
            this.speed -= this.acceleration;
        }

        // friction (always applied - brings the car to a stop when not accelerating)
        if (this.speed > 0) {
            this.speed -= this.friction;
            if (this.speed < 0) this.speed = 0;
        } else if (this.speed < 0) {
            this.speed += this.friction;
            if (this.speed > 0) this.speed = 0;
        }

        // Clamp speed to max forward and reverse speeds
        if(this.speed > this.maxSpeed) this.speed = this.maxSpeed;
        if(this.speed < this.maxReverseSpeed) this.speed = this.maxReverseSpeed;

        //steering(only when moving)
        if (this.speed !== 0) {
            const flip = this.speed < 0 ? -1 : 1; // reverse steering when reversing

            if(this.controls.left){
                this.angle -= 0.03 * flip;
            }
            if (this.controls.right){
                this.angle += 0.03 * flip;
            }
        }

        //actually moving the car
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
    }

     draw(ctx) {
        ctx.save(); // Save the current state of the canvas (before transformations)
        ctx.translate(this.x, this.y); // Move the origin to the car's position
        ctx.rotate(this.angle); // Rotate the canvas by the car's angle (so the car points in the direction it's facing)
        // Begin a new path (clear any previous path data)
        ctx.beginPath();
        
        // Draw in local space after translate(), so the rectangle stays centered
        // around the local origin (0, 0) and rotates correctly.
        ctx.rect(
            -this.width / 2,   // Offset left by half width
            -this.height / 2,  // Offset up by half height
            this.width,                 // Rectangle width
            this.height                 // Rectangle height
        );
        
        // Fill the rectangle path with current fill color (black by default)
        ctx.fillStyle = "#111";
        ctx.fill();
        ctx.restore(); // Restore the canvas state (undo transformations)
    }


}