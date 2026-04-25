/**
 * Obstacle class - Rectangular obstacles for the car to avoid
 * 
 * Purpose: Creates static rectangular obstacles that the car must detect
 * and avoid using its sensors.
 */
class Obstacle {
    /**
     * @param {number} x - Center x position
     * @param {number} y - Center y position  
     * @param {number} width - Width of obstacle
     * @param {number} height - Height of obstacle
     */
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * Get the four corner points of the obstacle (for ray intersection)
     * @returns {Array} Array of {x, y} corner points
     */
    getBounds() {
        return [
            { x: this.x - this.width / 2, y: this.y - this.height / 2 }, // top-left
            { x: this.x + this.width / 2, y: this.y - this.height / 2 }, // top-right
            { x: this.x + this.width / 2, y: this.y + this.height / 2 }, // bottom-right
            { x: this.x - this.width / 2, y: this.y + this.height / 2 }  // bottom-left
        ];
    }

    /**
     * Draw the obstacle on canvas
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        ctx.beginPath();
        ctx.rect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
        
        ctx.fillStyle = "#c44"; // reddish color
        ctx.fill();
        ctx.strokeStyle = "#a33";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
    }
}