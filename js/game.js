import { CONSTANTS } from './constants.js';
import { Utils } from './utils.js';
import { GameState } from './gameState.js';
import { Fruit, Bomb } from './entity.js';
import { ParticleSystem } from './particle.js';
import { Slicer } from './slicer.js';
import { UI } from './ui.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.gameState = new GameState();
        this.particleSystem = new ParticleSystem();
        this.slicer = new Slicer(this.canvas);
        this.ui = new UI();
        
        this.fruits = [];
        this.bombs = [];
        
        this.lastTime = 0;
        this.lastSpawnTime = 0;
        this.animationId = null;
        
        this.gravity = 0.5;
        
        this.resizeCanvas();
        this.setupEventListeners();
        this.init();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('continue-btn').addEventListener('click', () => this.continueGame());
    }
    
    init() {
        this.ui.showStartScreen();
    }
    
    startGame() {
        this.ui.hideStartScreen();
        this.gameState.start();
        this.resetGameObjects();
        this.lastSpawnTime = Date.now();
        this.gameLoop(0);
    }
    
    restartGame() {
        this.ui.hideGameOverScreen();
        this.gameState.start();
        this.resetGameObjects();
        this.lastSpawnTime = Date.now();
    }
    
    continueGame() {
        this.ui.hideLevelUpScreen();
        this.gameState.isLevelUp = false;
        this.resetGameObjects();
        this.lastSpawnTime = Date.now();
    }
    
    resetGameObjects() {
        this.fruits = [];
        this.bombs = [];
        this.particleSystem.clear();
        this.slicer.reset();
    }
    
    spawnWave() {
        const now = Date.now();
        const spawnRate = this.gameState.getSpawnRate();
        
        if (now - this.lastSpawnTime < spawnRate) return;
        
        this.lastSpawnTime = now;
        
        const fruitsPerWave = this.gameState.getFruitsPerWave();
        const baseVelocity = this.gameState.getBaseVelocity();
        const config = CONSTANTS.LEVEL_CONFIG;
        
        const count = Utils.randomInt(Math.max(1, fruitsPerWave - 1), fruitsPerWave + 1);
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                if (!this.gameState.isPlaying) return;
                
                if (Math.random() < config.bombChance) {
                    const bomb = Bomb.createRandom(
                        this.canvas.width, 
                        this.canvas.height, 
                        baseVelocity
                    );
                    this.bombs.push(bomb);
                } else {
                    const fruit = Fruit.createRandom(
                        this.canvas.width, 
                        this.canvas.height, 
                        baseVelocity,
                        this.gameState.level
                    );
                    this.fruits.push(fruit);
                }
            }, i * Utils.random(100, 300));
        }
    }
    
    update(deltaTime) {
        if (!this.gameState.isPlaying || this.gameState.isLevelUp) return;
        
        this.gameState.updateEffects();
        this.spawnWave();
        
        const isFrozen = this.gameState.freezeActive;
        
        this.fruits.forEach(fruit => {
            fruit.update(this.gravity, deltaTime, isFrozen);
        });
        
        this.bombs.forEach(bomb => {
            bomb.update(this.gravity, deltaTime, isFrozen);
        });
        
        this.particleSystem.update(this.gravity, deltaTime);
        
        this.checkCollisions();
        
        this.fruits = this.fruits.filter(fruit => {
            if (fruit.isOffScreen(this.canvas.width, this.canvas.height)) {
                if (!fruit.isSliced) {
                    this.gameState.resetCombo();
                }
                return false;
            }
            return fruit.isActive;
        });
        
        this.bombs = this.bombs.filter(bomb => {
            return !bomb.isOffScreen(this.canvas.width, this.canvas.height) && bomb.isActive;
        });
        
        this.ui.update(this.gameState);
        
        if (this.gameState.isLevelUp) {
            this.ui.showLevelUpScreen(this.gameState.level);
        }
        
        if (this.gameState.isGameOver) {
            this.ui.showGameOverScreen(this.gameState.score, this.gameState.level);
        }
    }
    
    checkCollisions() {
        for (const fruit of this.fruits) {
            if (!fruit.isActive || fruit.isSliced) continue;
            
            const collision = this.slicer.checkCollision(fruit);
            if (collision) {
                this.sliceFruit(fruit, collision);
            }
        }
        
        for (const bomb of this.bombs) {
            if (!bomb.isActive) continue;
            
            const collision = this.slicer.checkCollision(bomb);
            if (collision) {
                this.sliceBomb(bomb, collision);
            }
        }
    }
    
    sliceFruit(fruit, collision) {
        fruit.isSliced = true;
        fruit.isActive = false;
        
        this.gameState.incrementCombo();
        const finalScore = this.gameState.addScore(CONSTANTS.BASE_SCORE);
        
        this.particleSystem.createJuiceSplash(
            fruit.x, 
            fruit.y, 
            fruit.fruitType.juiceColor,
            CONSTANTS.JUICE_PARTICLE_COUNT
        );
        
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = rect.width / this.canvas.width;
        const scaleY = rect.height / this.canvas.height;
        
        this.ui.showScorePopup(
            finalScore, 
            fruit.x * scaleX, 
            fruit.y * scaleY
        );
        
        if (this.gameState.combo >= 2) {
            this.ui.showComboPopup(
                this.gameState.combo,
                fruit.x * scaleX - 50,
                fruit.y * scaleY - 50
            );
        }
        
        if (fruit.isSpecial) {
            this.handleSpecialFruit(fruit);
        }
    }
    
    handleSpecialFruit(fruit) {
        if (fruit.specialEffect === 'double') {
            this.gameState.activateDoubleScore(fruit.specialDuration);
        } else if (fruit.specialEffect === 'freeze') {
            this.gameState.activateFreeze(fruit.specialDuration);
            this.particleSystem.createFreezeEffect(
                this.canvas.width / 2,
                this.canvas.height / 2,
                50
            );
        }
    }
    
    sliceBomb(bomb, collision) {
        bomb.isActive = false;
        
        this.particleSystem.createExplosion(
            bomb.x,
            bomb.y,
            CONSTANTS.EXPLOSION_PARTICLE_COUNT
        );
        
        this.gameState.loseLife();
        
        this.ui.screenShake(15, 400);
        this.ui.flashScreen('#ff0000', 200);
    }
    
    render() {
        this.ctx.fillStyle = this.gameState.freezeActive ? '#1a3a4a' : '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawBackground();
        
        this.particleSystem.render(this.ctx);
        
        this.fruits.forEach(fruit => fruit.render(this.ctx));
        this.bombs.forEach(bomb => bomb.render(this.ctx));
        
        this.slicer.render(this.ctx);
    }
    
    drawBackground() {
        const gradient = this.ctx.createLinearGradient(
            0, 
            this.canvas.height, 
            this.canvas.width, 
            0
        );
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.save();
        this.ctx.globalAlpha = 0.05;
        this.ctx.font = '80px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#ffffff';
        
        const decorations = ['🍉', '🍎', '🍊', '🍋', '🍇', '🍓'];
        for (let i = 0; i < 5; i++) {
            const x = (this.canvas.width / 6) * (i + 1);
            const y = this.canvas.height - 100;
            const emoji = decorations[i % decorations.length];
            this.ctx.fillText(emoji, x, y);
        }
        
        this.ctx.restore();
    }
    
    gameLoop(timestamp) {
        if (!this.animationId) {
            this.animationId = requestAnimationFrame((t) => this.gameLoop(t));
            return;
        }
        
        const deltaTime = Math.min((timestamp - this.lastTime) / 16.67, 2);
        this.lastTime = timestamp;
        
        this.update(deltaTime);
        this.render();
        
        if (this.gameState.isPlaying || 
            this.gameState.isLevelUp || 
            this.particleSystem.particles.length > 0) {
            this.animationId = requestAnimationFrame((t) => this.gameLoop(t));
        }
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}
