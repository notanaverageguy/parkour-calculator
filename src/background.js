class Dot {
    constructor(x, y, canvas) {
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = 2;
        this.connections = [];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
    }

    draw(ctx, color) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

class Background {
    constructor() {
        this.canvas = document.getElementById('background-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.dots = [];
        this.mouse = { x: 0, y: 0 };
        this.maxConnections = 3;
        this.connectionDistance = 200;
        this.dotCount = Math.floor((window.innerWidth * window.innerHeight) / 40000);
        this.isDark = document.documentElement.classList.contains('dark');

        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.resize();
        this.createDots();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createDots() {
        this.dots = [];
        for (let i = 0; i < this.dotCount; i++) {
            this.dots.push(new Dot(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                this.canvas
            ));
        }
    }

    getThemeColors() {
        if (this.isDark) {
            return {
                dot: 'rgba(255, 255, 255, 0.5)',
                line: 'rgba(255, 255, 255, 0.2)',
                mouseLine: 'rgba(255, 255, 255, 0.3)'
            };
        } else {
            return {
                dot: 'rgba(20, 20, 20, 0.5)',  // Blue with opacity
                line: 'rgba(59, 59, 59, 0.2)',
                mouseLine: 'rgba(59, 59, 59, 0.3)'
            };
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createDots();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Listen for theme changes
        const themeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    this.isDark = document.documentElement.classList.contains('dark');
                    // Force redraw with new colors
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                }
            });
        });

        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    drawConnections() {
        const colors = this.getThemeColors();

        // Draw connections between dots
        for (let i = 0; i < this.dots.length; i++) {
            for (let j = i + 1; j < this.dots.length; j++) {
                const dx = this.dots[i].x - this.dots[j].x;
                const dy = this.dots[i].y - this.dots[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    const opacity = 1 - (distance / this.connectionDistance);
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.dots[i].x, this.dots[i].y);
                    this.ctx.lineTo(this.dots[j].x, this.dots[j].y);
                    this.ctx.strokeStyle = colors.line;
                    this.ctx.globalAlpha = opacity;
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1;
                }
            }
        }

        // Draw connections to mouse
        for (const dot of this.dots) {
            const dx = this.mouse.x - dot.x;
            const dy = this.mouse.y - dot.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.connectionDistance) {
                const opacity = 1 - (distance / this.connectionDistance);
                this.ctx.beginPath();
                this.ctx.moveTo(this.mouse.x, this.mouse.y);
                this.ctx.lineTo(dot.x, dot.y);
                this.ctx.strokeStyle = colors.mouseLine;
                this.ctx.globalAlpha = opacity;
                this.ctx.stroke();
                this.ctx.globalAlpha = 1;
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const colors = this.getThemeColors();

        // Update and draw dots
        for (const dot of this.dots) {
            dot.update();
            dot.draw(this.ctx, colors.dot);
        }

        // Draw connections
        this.drawConnections();

        requestAnimationFrame(() => this.animate());
    }

    updateGraphColors() {
        // Implementation of updateGraphColors method
    }
}

// Initialize the background when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Background();
}); 