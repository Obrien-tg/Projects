/**
 * Controls class handles keyboard input for the car.
 * 
 * Purpose: Acts as an input manager that converts keyboard events into
 * boolean state flags (forward, reverse, left, right). The Car class
 * can then read these flags each frame to determine movement and rotation.
 * 
 * Design: This separates input handling from car logic, making the code
 * modular and testable. The Car doesn't need to know about keyboard details.
 */
class Controls {
    /**
     * Constructor initializes control state and sets up keyboard listeners.
     * 
     * Initial state: all movement flags are false (car is idle)
     * Side effect: Registers global keyboard event listeners
     */
    constructor() {
        // Movement flags: boolean states updated by keyboard events
        this.forward = false;  // True when accelerating forward (W or ArrowUp)
        this.left = false;     // True when turning left (A or ArrowLeft)
        this.right = false;    // True when turning right (D or ArrowRight)
        this.reverse = false;  // True when reversing (S or ArrowDown)
    
        // Set up keyboard event listeners when Controls is created
        this.#addKeyBoardListeners();
    }

    /**
     * Private method: sets up global keydown and keyup event listeners.
     * 
     * How it works:
     * - On keydown: user presses a key → set corresponding flag to true
     * - On keyup: user releases a key → set corresponding flag to false
     * 
     * Key mapping:
     *   Forward:  W / ArrowUp
     *   Reverse:  S / ArrowDown
     *   Left:     A / ArrowLeft
     *   Right:    D / ArrowRight
     * 
     * Note: This is a private method (starts with #) because only Controls
     * should manage event listeners. External code reads the flags, not setup.
     * 
     * @private
     */
    #addKeyBoardListeners() {
        const movementKeys = [
            "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
            "a", "A", "d", "D", "w", "W", "s", "S"
        ];

        // Register keydown listener: fires when user presses a key
        window.addEventListener("keydown", (event) => {
            if (movementKeys.includes(event.key)) {
                // Prevent page scrolling and native arrow-key behavior during gameplay.
                event.preventDefault();
            }

            switch (event.key) {
                case "ArrowLeft":
                case "a":
                case "A":
                    this.left = true;  // User pressed left
                    break;
                case "ArrowRight":
                case "d":
                case "D":
                    this.right = true;  // User pressed right
                    break;
                case "ArrowUp":
                case "w":
                case "W":
                    this.forward = true;  // User pressed forward
                    break;
                case "ArrowDown":
                case "s":
                case "S":
                    this.reverse = true;  // User pressed reverse
                    break;
            }
        });

        // Register keyup listener: fires when user releases a key
        window.addEventListener("keyup", (event) => {
            if (movementKeys.includes(event.key)) {
                event.preventDefault();
            }

            switch (event.key) {
                case "ArrowLeft":
                case "a":
                case "A":
                    this.left = false;  // User released left
                    break;
                case "ArrowRight":
                case "d":
                case "D":
                    this.right = false;  // User released right
                    break;
                case "ArrowUp":
                case "w":
                case "W":
                    this.forward = false;  // User released forward
                    break;
                case "ArrowDown":
                case "s":
                case "S":
                    this.reverse = false;  // User released reverse
                    break;
            }
        });
    }
}