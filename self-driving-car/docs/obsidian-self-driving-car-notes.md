---
title: Self‑Driving Car (No Libraries) — Review & Notes
date: 2025-10-14
tags: [project-notes, javascript, canvas, self-driving-car]
author: Obrien TG
portfolio: Made by Obrien-tg
---

## Overview

A minimal JavaScript + HTML5 Canvas project that draws a car and wires up keyboard controls (Arrow keys + WASD). The goal is to evolve this into a self-driving car simulation without external libraries.

**Learning focus:** Understand object-oriented design patterns, event handling, canvas rendering, and game-loop architecture as we build layer by layer.

## Architecture & Design

This project uses **Object-Oriented Design** with three main classes:

### 1. **Controls** class (`controls.js`)

- **Purpose:** Manages keyboard input and converts it into boolean state flags.
- **What it does:** Listens to keydown/keyup events and maintains four flags: `forward`, `reverse`, `left`, `right`.
- **Why separate it:** This isolates input logic from car logic, making both easier to test and reuse.
- **Key mapping:**
  - Forward: W or ArrowUp
  - Reverse: S or ArrowDown
  - Left: A or ArrowLeft
  - Right: D or ArrowRight
- **Implementation detail:** Uses private method `#addKeyBoardListeners()` (private because only Controls should set up its own listeners).

### 2. **Car** class (`car.js`)

- **Purpose:** Represents the car entity and handles rendering.
- **Properties:**
  - `x, y` — center coordinates of the car
  - `width, height` — visual dimensions
  - `controls` — reference to Controls instance (input state)
- **Methods:**
  - `constructor(x, y, width, height)` — Initialize position and size, create Controls
  - `draw(ctx)` — Render car as a filled rectangle centered at (x, y)
- **Why centered coordinates:** Makes rotation calculations trivial when physics are added later.
- **Current limitation:** Draw is static; no update/movement logic yet.

### 3. **Entry point** (`main.js`)

- **What it does:** Wires everything together—gets canvas, creates Car, draws once.
- **Step-by-step:**
  1.  Grab canvas element and set dimensions
  2.  Get 2D rendering context (used for all drawing)
  3.  Create Car instance at (100, 100) with size 30×50
  4.  Call `car.draw(ctx)` to render initial frame
- **What's missing:** Animation loop to redraw every frame.

### 4. **HTML & CSS** (`index.html`, `style.css`)

- `index.html` — Document structure, canvas element, script loading order (important: car.js → controls.js → main.js).
- `style.css` — Dark gray background, light gray canvas, overflow hidden to prevent scrolling.
- Added `overscroll-behavior: none` to prevent browser scroll on arrow keys.

## Files at a glance

- `index.html` — HTML structure and canvas bootstrap
- `style.css` — Page layout and canvas styling
- `car.js` — Car class with drawing logic
- `controls.js` — Controls class with keyboard event handling
- `main.js` — Initialization and wiring

## What changed (today)

- Implemented keyboard listeners in `controls.js`
  - Keys supported: Arrow keys and WASD (both lowercase and uppercase).
  - Sets these flags on press/release: `forward`, `reverse`, `left`, `right`.
- Improved document structure in `index.html`
  - Added `<html lang="en">`, `<meta charset>`, and `<meta name="viewport">`.
  - Added a tiny inline style to reduce page scrolling while controlling the car.

## How controls work — detailed flow

1. **User presses key** → Browser fires `keydown` event
2. **Controls listener** catches it, identifies which key (W, A, S, D, or arrows)
3. **Flag is set to true** → e.g., `this.forward = true`
4. **User releases key** → Browser fires `keyup` event
5. **Flag is set to false** → e.g., `this.forward = false`
6. **Car reads flags** each frame (not implemented yet) to decide acceleration and rotation

**Why this design:**

- Controls is a pure input manager—doesn't care about the car, physics, or rendering.
- Car can read `this.controls.forward` or `this.controls.left` any time during its `update()` method.
- Easy to test: mock the Controls flags without touching DOM events.
- Easy to switch input method later (gamepad, AI, etc.) by swapping Controls implementation.

## How rendering works — current state

1. **Canvas setup** — `main.js` creates a canvas element and gets its 2D context
2. **Car drawing** — `car.draw(ctx)` renders a black rectangle:
   - Calculates top-left corner by offsetting center (x, y) by half-width and half-height
   - Uses `ctx.rect()` to define shape and `ctx.fill()` to fill it
3. **Static frame** — Currently drawn once; nothing updates after page load
4. **Next step** — Animation loop via `requestAnimationFrame` will call `car.draw()` repeatedly (60 FPS ideally)

## Quick start

- Open `index.html` in a browser.
- You should see a light gray canvas with a black rectangle (the car). The keys won’t move it yet because there’s no update/physics loop—see Next Steps.

## Next steps (recommended learning sequence)

### Phase 1: Animation Loop

**Goal:** Make something move every frame.

1. Add animation loop in `main.js`
   - Use `requestAnimationFrame(animate)` to create a recursive loop
   - Each frame: clear canvas → update car → draw car
   - Target ~60 FPS (though browser will throttle naturally)

**What to learn:** How `requestAnimationFrame` works, event loop, frame timing.

### Phase 2: Physics & Movement

**Goal:** Keyboard input controls car movement.

## Development checklist (Phase 1 + 2)

### Animation loop setup

- [ ] Add `animate()` function in `main.js`
- [ ] Call `requestAnimationFrame(animate)` at end to loop
- [ ] Clear canvas each frame: `ctx.clearRect(0, 0, canvas.width, canvas.height)`
- [ ] Call `car.update()` (not implemented yet)
- [ ] Call `car.draw(ctx)`

### Car movement implementation

- [ ] Add physics properties to Car constructor: `speed`, `angle`, `acceleration`, `maxSpeed`, `friction`, `maxReverseSpeed`
- [ ] Implement `car.update()` method with:
  - [ ] Acceleration logic: if `forward`, increase speed by `acceleration`
  - [ ] Brake/reverse logic: if `reverse`, decrease speed (or go negative)
  - [ ] Speed clamping: ensure speed doesn't exceed `maxSpeed` or `maxReverseSpeed`
  - [ ] Friction: apply natural deceleration each frame
  - [ ] Steering: if `left` and moving, turn left; if `right` and moving, turn right
  - [ ] Position update: `x += Math.cos(angle) * speed`, `y += Math.sin(angle) * speed`

### Testing & refinement

- [ ] Test forward/reverse acceleration feels responsive
- [ ] Test steering angle rate feels natural (not too slow, not twitchy)
- [ ] Test friction makes car coast to stop smoothly
- [ ] Refine constants (`acceleration`, `friction`, `maxSpeed`) for feel
      **What to learn:** Vector math, physics simulation, separating update from render.

### Phase 3: Rendering Polish

1. Rotate car in direction of movement (not just move as a rect)
   - Use `ctx.save()`, `ctx.translate()`, `ctx.rotate()`, draw, `ctx.restore()`
2. Draw road/lanes for visual context
3. Handle window resize to keep canvas responsive

**What to learn:** Canvas transformations, coordinate systems, responsive design.

### Phase 4: Self-Driving (Future)

1. Add sensors (raycasting or distance detection)
2. Implement decision logic or neural network
3. Autonomous navigation without player input

## Mini checklist for adding movement

- [ ] In `car.js`, add properties: `speed`, `acceleration`, `maxSpeed`, `friction`, `angle`.
- [ ] Implement `update()` that:
  - Applies acceleration/braking based on `controls.forward`/`controls.reverse`.
  - Applies friction each frame so the car coasts to a stop.
  - Turns left/right proportionally when there’s forward or reverse motion (reverse turning direction if going backwards).
  - Updates `x`/`y` using `angle` and `speed`.
- [ ] In `main.js`, create an animation loop:
  - `ctx.clearRect(0, 0, canvas.width, canvas.height)`
  - `car.update()`
  - `car.draw(ctx)`
- [ ] Test Arrow keys / WASD; ensure steering feels natural.

## Notes & tips

- Keep the car’s drawing centered on its `(x, y)` so rotation around center is straightforward.
- Apply friction even when not accelerating to avoid perpetual motion.
- Limit `maxSpeed` and consider a slightly lower `maxReverseSpeed`.
- For visuals, start simple. Add rotation-aware drawing (translate → rotate → draw) before adding sprites.

## References (conceptual)

- HTML5 Canvas 2D API: `canvas.getContext('2d')`, `beginPath`, `rect`, `fill`, `translate`, `rotate`, `save`/`restore`.
- Animation: `requestAnimationFrame` loop pattern.

## Current code health & documentation

- **Syntax:** No errors across all files.
- **Documentation:** Added JSDoc comments and detailed inline explanations to all classes and methods (car.js, controls.js, main.js).
- **Design:** Clean separation of concerns:
  - `Controls` handles input only
  - `Car` handles state and rendering only
  - `main.js` wires them together
- **Code quality:** Readable, well-structured, ready for physics layer.
- **Next major step:** Add `car.update()` method for movement logic + animation loop in `main.js`.

## Key concepts explained

### Canvas 2D context (`ctx`)

- The object returned by `canvas.getContext('2d')`
- Provides methods for drawing: `rect()`, `fill()`, `stroke()`, `beginPath()`, etc.
- All visual rendering happens through this context

### Event listeners and keyboard input

- Browser fires events (`keydown`, `keyup`) when user interacts
- Our code "listens" with `addEventListener()`
- We capture these events and set boolean flags (good for frame-based input)
- Alternative: polling `navigator.keyboard` (not standard; event-based is preferred)

### Centered rectangles and rotation prep

- Storing `(x, y)` as the **center** of the car (not top-left) is deliberate
- When we rotate the car later using `ctx.rotate()`, rotation is around the origin
- By translating to the center first, rotation happens around the car's center, not top-left
- This is why we draw the rect offset by `-width/2` and `-height/2`

### Object-oriented design pattern

- `Controls` and `Car` are separate concerns (Single Responsibility Principle)
- Both are instantiated once and reused; their state persists between frames
- `Car` has a reference to `Controls`, not the other way (proper dependency direction)

## Resources & references

- [MDN: Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [MDN: requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [MDN: KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)
- Game loop pattern: Update → Render, every frame
