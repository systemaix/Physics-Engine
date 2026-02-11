const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');
const gravityInput = document.getElementById('gravity');
const frictionInput = document.getElementById('friction');
const countEl = document.getElementById('ball-count');

let width, height;
let balls = [];

// 1. Setup Canvas
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resize);
resize();

// 2. The Ball Class (Object Template)
class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 20 + 10; // Random size 10-30px
        this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
        
        // Random Horizontal Speed (-5 to +5)
        this.dx = (Math.random() - 0.5) * 10;
        // Start with 0 Vertical Speed
        this.dy = 0;
    }

    update() {
        // A. Apply Gravity
        const gravity = parseFloat(gravityInput.value);
        const bounce = parseFloat(frictionInput.value);

        // Increase downward speed
        this.dy += gravity;

        // Move Position
        this.x += this.dx;
        this.y += this.dy;

        // B. Floor Collision
        if (this.y + this.radius > height) {
            // Reverse direction (Bounce)
            this.dy = -this.dy * bounce; 
            
            // Prevent sticking: Reset position exactly to floor
            this.y = height - this.radius;
            
            // Apply Horizontal Friction (Slow down rolling)
            this.dx *= 0.95;
        }

        // C. Wall Collision
        if (this.x + this.radius > width || this.x - this.radius < 0) {
            this.dx = -this.dx * 0.8; // Bounce off walls with energy loss
            
            // Prevent sticking
            if (this.x + this.radius > width) this.x = width - this.radius;
            if (this.x - this.radius < 0) this.x = this.radius;
        }

        this.draw();
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.stroke();
        ctx.closePath();
    }
}

// 3. Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Clear screen with trail effect
    // Instead of clearRect, we draw a semi-transparent black rect
    // This creates the "motion blur" trail effect!
    ctx.fillStyle = 'rgba(15, 15, 19, 0.4)'; 
    ctx.fillRect(0, 0, width, height);

    // Update all balls
    balls.forEach(ball => ball.update());
    
    // Remove balls that stop moving (Optimization)
    // Optional: Keeps array clean if you want
}

// 4. Interaction
canvas.addEventListener('mousedown', (e) => {
    spawnBall(e.clientX, e.clientY);
});

// Touch support for mobile
canvas.addEventListener('touchstart', (e) => {
    // Prevent scrolling
    e.preventDefault();
    const touch = e.touches[0];
    spawnBall(touch.clientX, touch.clientY);
});

function spawnBall(x, y) {
    balls.push(new Ball(x, y));
    countEl.innerText = `${balls.length} Objects`;
}

function clearCanvas() {
    balls = [];
    countEl.innerText = "0 Objects";
}

// Start
animate();
