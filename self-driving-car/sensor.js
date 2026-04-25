/**
 * Sensor class - Raycasting for obstacle detection
 * 
 * Purpose: Gives the car "perception" by casting rays in different directions
 * and detecting distances to obstacles. This is the input for the neural network.
 */
class Sensor {
    /**
     * @param {Car} car - The car this sensor belongs to
     */
    constructor(car) {
        this.car = car;
        this.rayCount = 5;        // Number of rays to cast
        this.rayLength = 150;     // Max distance rays can see
        this.raySpread = Math.PI / 2; // Total spread angle (90 degrees)
        
        this.readings = [];       // Stores distance readings [0...1]
    }

    /**
     * Cast rays and detect intersections with obstacles
     * @param {Obstacle[]} obstacles - Array of obstacles to detect
     */
    update(obstacles) {
        this.#castRays(obstacles);
    }

    /**
     * Cast rays in a spread around the car
     * @private
     */
    #castRays(obstacles) {
        this.readings = [];
        
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = this.#lerp(
                -this.raySpread / 2,
                this.raySpread / 2,
                this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
            ) + this.car.angle;

            const start = { x: this.car.x, y: this.car.y };
            const end = {
                x: this.car.x + Math.cos(rayAngle) * this.rayLength,
                y: this.car.y + Math.sin(rayAngle) * this.rayLength
            };

            const reading = this.#getReading(start, end, obstacles);
            this.readings.push(reading);
        }
    }

    /**
     * Find the closest intersection point
     * @private
     */
    #getReading(start, end, obstacles) {
        let closest = null;
        
        for (const obstacle of obstacles) {
            const touch = this.#getIntersection(
                start, end,
                obstacle.getBounds()
            );
            
            if (!touch) continue;
            
            if (!closest || touch.offset < closest.offset) {
                closest = touch;
            }
        }

        // Return normalized distance (0-1) or null if no obstacle
        return closest ? closest.offset : null;
    }

    /**
     * Line segment intersection math
     * @private
     */
    #getIntersection(A, B, C, D) {
        const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
        const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
        const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

        if (bottom !== 0) {
            const t = tTop / bottom;
            const u = uTop / bottom;

            if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
                return {
                    x: this.#lerp(A.x, B.x, t),
                    y: this.#lerp(A.y, B.y, t),
                    offset: t
                };
            }
        }

        return null;
    }

    /**
     * Linear interpolation helper
     * @private
     */
    #lerp(A, B, t) {
        return A + (B - A) * t;
    }

    /**
     * Draw sensor rays on canvas (for debugging)
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = this.#lerp(
                -this.raySpread / 2,
                this.raySpread / 2,
                this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
            ) + this.car.angle;

            const start = { x: this.car.x, y: this.car.y };
            const end = {
                x: this.car.x + Math.cos(rayAngle) * this.rayLength,
                y: this.car.y + Math.sin(rayAngle) * this.rayLength
            };

            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            
            // If we have a reading, draw to the obstacle
            if (this.readings[i]) {
                const touchX = start.x + (end.x - start.x) * this.readings[i];
                const touchY = start.y + (end.y - start.y) * this.readings[i];
                ctx.lineTo(touchX, touchY);
                ctx.strokeStyle = "red";
            } else {
                ctx.lineTo(end.x, end.y);
                ctx.strokeStyle = "yellow";
            }
            
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
}