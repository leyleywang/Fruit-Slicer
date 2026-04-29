import { CONSTANTS } from './constants.js';
import { Utils } from './utils.js';

export class Entity {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocityX = 0;
        this.velocityY = 0;
        this.rotation = 0;
        this.rotationSpeed = Utils.random(-0.1, 0.1);
        this.isActive = true;
        this.isSliced = false;
    }
    
    update(gravity, deltaTime, isFrozen = false) {
        if (!this.isActive || isFrozen) return;
        
        this.velocityY += gravity * deltaTime;
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
        this.rotation += this.rotationSpeed;
    }
    
    render(ctx) {
        if (!this.isActive) return;
    }
    
    isOffScreen(canvasWidth, canvasHeight) {
        const margin = this.radius * 2;
        return this.y > canvasHeight + margin || 
               this.x < -margin || 
               this.x > canvasWidth + margin;
    }
}

export class Fruit extends Entity {
    constructor(x, y, fruitType, radius = 35) {
        super(x, y, radius);
        this.fruitType = fruitType;
        this.isSpecial = false;
        this.specialEffect = null;
        this.specialDuration = 0;
    }
    
    static createRandom(canvasWidth, canvasHeight, baseVelocity, level) {
        const config = CONSTANTS.LEVEL_CONFIG;
        let fruitType;
        let isSpecial = false;
        
        if (level > 1 && Math.random() < config.specialFruitChance) {
            fruitType = Utils.randomChoice(CONSTANTS.SPECIAL_FRUIT_TYPES);
            isSpecial = true;
        } else {
            fruitType = Utils.randomChoice(CONSTANTS.FRUIT_TYPES);
        }
        
        const spawnSide = Math.random();
        let x, y, vx, vy;
        
        const margin = 50;
        const velocityMultiplier = Utils.random(0.9, 1.3);
        const velocity = baseVelocity * velocityMultiplier;
        
        if (spawnSide < 0.65) {
            x = Utils.random(canvasWidth * 0.2, canvasWidth * 0.8);
            y = Utils.random(canvasHeight * 0.1, canvasHeight * 0.25);
            vx = Utils.random(-2.5, 2.5);
            vy = -velocity * Utils.random(0.3, 0.6);
        } else if (spawnSide < 0.82) {
            x = -margin;
            y = Utils.random(canvasHeight * 0.2, canvasHeight * 0.45);
            vx = velocity * Utils.random(0.7, 1.1);
            vy = -velocity * Utils.random(0.2, 0.5);
        } else {
            x = canvasWidth + margin;
            y = Utils.random(canvasHeight * 0.2, canvasHeight * 0.45);
            vx = -velocity * Utils.random(0.7, 1.1);
            vy = -velocity * Utils.random(0.2, 0.5);
        }
        
        const fruit = new Fruit(x, y, fruitType, isSpecial ? 45 : 35);
        fruit.velocityX = vx;
        fruit.velocityY = vy;
        fruit.isSpecial = isSpecial;
        
        if (isSpecial) {
            fruit.specialEffect = fruitType.effect;
            fruit.specialDuration = fruitType.duration;
        }
        
        return fruit;
    }
    
    render(ctx) {
        if (!this.isActive) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.font = `${this.radius * 1.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (this.isSpecial) {
            ctx.shadowColor = this.fruitType.color;
            ctx.shadowBlur = 20;
        }
        
        ctx.fillText(this.fruitType.emoji, 0, 0);
        
        ctx.restore();
        
        if (this.isSpecial && !this.isSliced) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 10, 0, Math.PI * 2);
            ctx.strokeStyle = this.fruitType.color;
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 200) * 0.3;
            ctx.stroke();
            ctx.restore();
        }
    }
}

export class Bomb extends Entity {
    constructor(x, y, radius = 40) {
        super(x, y, radius);
        this.hasExploded = false;
    }
    
    static createRandom(canvasWidth, canvasHeight, baseVelocity) {
        const bomb = new Bomb(0, 0, 40);
        
        const margin = 50;
        const velocityMultiplier = Utils.random(0.8, 1.1);
        const velocity = baseVelocity * velocityMultiplier;
        
        const spawnSide = Math.random();
        
        if (spawnSide < 0.65) {
            bomb.x = Utils.random(canvasWidth * 0.25, canvasWidth * 0.75);
            bomb.y = Utils.random(canvasHeight * 0.08, canvasHeight * 0.2);
            bomb.velocityX = Utils.random(-2, 2);
            bomb.velocityY = -velocity * Utils.random(0.2, 0.5);
        } else if (spawnSide < 0.82) {
            bomb.x = -margin;
            bomb.y = Utils.random(canvasHeight * 0.15, canvasHeight * 0.4);
            bomb.velocityX = velocity * Utils.random(0.6, 1.0);
            bomb.velocityY = -velocity * Utils.random(0.15, 0.4);
        } else {
            bomb.x = canvasWidth + margin;
            bomb.y = Utils.random(canvasHeight * 0.15, canvasHeight * 0.4);
            bomb.velocityX = -velocity * Utils.random(0.6, 1.0);
            bomb.velocityY = -velocity * Utils.random(0.15, 0.4);
        }
        
        return bomb;
    }
    
    render(ctx) {
        if (!this.isActive) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.font = `${this.radius * 1.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.shadowColor = '#ff4444';
        ctx.shadowBlur = 10 + Math.sin(Date.now() / 150) * 5;
        
        ctx.fillText(CONSTANTS.BOMB.emoji, 0, 0);
        
        ctx.restore();
    }
}
