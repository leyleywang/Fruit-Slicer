import { CONSTANTS } from './constants.js';

export class GameState {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.score = 0;
        this.combo = 0;
        this.lives = CONSTANTS.INITIAL_LIVES;
        this.level = 1;
        this.lastSlicedTime = 0;
        this.levelUpScoreThreshold = CONSTANTS.LEVEL_CONFIG.levelUpScore;
        
        this.isPlaying = false;
        this.isPaused = false;
        this.isGameOver = false;
        this.isLevelUp = false;
        
        this.freezeActive = false;
        this.freezeEndTime = 0;
        this.doubleScoreActive = false;
        this.doubleScoreEndTime = 0;
    }
    
    start() {
        this.reset();
        this.isPlaying = true;
    }
    
    gameOver() {
        this.isPlaying = false;
        this.isGameOver = true;
    }
    
    levelUp() {
        this.level++;
        this.levelUpScoreThreshold = this.level * CONSTANTS.LEVEL_CONFIG.levelUpScore;
        this.isLevelUp = true;
    }
    
    addScore(baseScore) {
        const comboMultiplier = Math.pow(CONSTANTS.COMBO_MULTIPLIER, this.combo - 1);
        const doubleMultiplier = this.doubleScoreActive ? 2 : 1;
        const finalScore = Math.floor(baseScore * comboMultiplier * doubleMultiplier);
        
        this.score += finalScore;
        this.lastSlicedTime = Date.now();
        
        if (this.score >= this.levelUpScoreThreshold) {
            this.levelUp();
        }
        
        return finalScore;
    }
    
    incrementCombo() {
        const now = Date.now();
        if (now - this.lastSlicedTime < CONSTANTS.MAX_COMBO_TIME || this.combo === 0) {
            this.combo++;
        } else {
            this.combo = 1;
        }
        this.lastSlicedTime = now;
    }
    
    resetCombo() {
        this.combo = 0;
    }
    
    loseLife() {
        this.lives--;
        this.resetCombo();
        if (this.lives <= 0) {
            this.gameOver();
        }
    }
    
    activateFreeze(duration) {
        this.freezeActive = true;
        this.freezeEndTime = Date.now() + duration;
    }
    
    activateDoubleScore(duration) {
        this.doubleScoreActive = true;
        this.doubleScoreEndTime = Date.now() + duration;
    }
    
    updateEffects() {
        const now = Date.now();
        
        if (this.freezeActive && now >= this.freezeEndTime) {
            this.freezeActive = false;
        }
        
        if (this.doubleScoreActive && now >= this.doubleScoreEndTime) {
            this.doubleScoreActive = false;
        }
        
        if (this.combo > 0 && now - this.lastSlicedTime > CONSTANTS.MAX_COMBO_TIME) {
            this.resetCombo();
        }
    }
    
    getFreezeRemaining() {
        if (!this.freezeActive) return 0;
        return Math.ceil((this.freezeEndTime - Date.now()) / 1000);
    }
    
    getDoubleScoreRemaining() {
        if (!this.doubleScoreActive) return 0;
        return Math.ceil((this.doubleScoreEndTime - Date.now()) / 1000);
    }
    
    getSpawnRate() {
        const config = CONSTANTS.LEVEL_CONFIG;
        const rate = config.baseSpawnRate - (this.level - 1) * config.spawnRateDecrement;
        return Math.max(rate, config.minSpawnRate);
    }
    
    getFruitsPerWave() {
        const config = CONSTANTS.LEVEL_CONFIG;
        const count = config.baseFruitsPerWave + (this.level - 1) * config.fruitsPerWaveIncrement;
        return Math.min(count, config.maxFruitsPerWave);
    }
    
    getBaseVelocity() {
        const config = CONSTANTS.LEVEL_CONFIG;
        const velocity = config.baseVelocity + (this.level - 1) * config.velocityIncrement;
        return Math.min(velocity, config.maxVelocity);
    }
}
