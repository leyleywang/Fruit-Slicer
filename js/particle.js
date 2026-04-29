import { Utils } from './utils.js';

export class Particle {
    constructor(x, y, velocityX, velocityY, color, size, lifeTime) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.color = color;
        this.size = size;
        this.lifeTime = lifeTime;
        this.remainingLife = lifeTime;
        this.isActive = true;
    }
    
    update(gravity, deltaTime) {
        if (!this.isActive) return;
        
        this.velocityY += gravity * deltaTime;
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
        this.remainingLife -= deltaTime;
        
        if (this.remainingLife <= 0) {
            this.isActive = false;
        }
    }
    
    render(ctx) {
        if (!this.isActive) return;
        
        const alpha = this.remainingLife / this.lifeTime;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

export class ParticleSystem {
    constructor() {
        this.particles = [];
    }
    
    createJuiceSplash(x, y, color, count = 15) {
        for (let i = 0; i < count; i++) {
            const angle = Utils.random(0, Math.PI * 2);
            const speed = Utils.random(2, 8);
            const velocityX = Math.cos(angle) * speed;
            const velocityY = Math.sin(angle) * speed - Utils.random(2, 5);
            
            this.particles.push(new Particle(
                x,
                y,
                velocityX,
                velocityY,
                color,
                Utils.random(3, 8),
                Utils.random(0.8, 1.5)
            ));
        }
    }
    
    createExplosion(x, y, count = 30) {
        const colors = ['#ff4444', '#ff8844', '#ffcc44', '#ffff44', '#ffffff'];
        
        for (let i = 0; i < count; i++) {
            const angle = Utils.random(0, Math.PI * 2);
            const speed = Utils.random(3, 12);
            const velocityX = Math.cos(angle) * speed;
            const velocityY = Math.sin(angle) * speed;
            
            this.particles.push(new Particle(
                x,
                y,
                velocityX,
                velocityY,
                Utils.randomChoice(colors),
                Utils.random(5, 15),
                Utils.random(0.5, 1.2)
            ));
        }
    }
    
    createSliceParticles(x, y, color, count = 8) {
        for (let i = 0; i < count; i++) {
            const angle = Utils.random(0, Math.PI * 2);
            const speed = Utils.random(1, 4);
            const velocityX = Math.cos(angle) * speed;
            const velocityY = Math.sin(angle) * speed;
            
            this.particles.push(new Particle(
                x,
                y,
                velocityX,
                velocityY,
                color,
                Utils.random(2, 5),
                Utils.random(0.3, 0.8)
            ));
        }
    }
    
    createFreezeEffect(x, y, count = 20) {
        for (let i = 0; i < count; i++) {
            const angle = Utils.random(0, Math.PI * 2);
            const speed = Utils.random(1, 3);
            const velocityX = Math.cos(angle) * speed;
            const velocityY = Math.sin(angle) * speed;
            
            this.particles.push(new Particle(
                x,
                y,
                velocityX,
                velocityY,
                '#00ffff',
                Utils.random(3, 8),
                Utils.random(1.0, 2.0)
            ));
        }
    }
    
    update(gravity, deltaTime) {
        this.particles.forEach(particle => {
            particle.update(gravity, deltaTime);
        });
        
        this.particles = this.particles.filter(particle => particle.isActive);
    }
    
    render(ctx) {
        this.particles.forEach(particle => {
            particle.render(ctx);
        });
    }
    
    clear() {
        this.particles = [];
    }
}
