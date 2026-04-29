import { CONSTANTS } from './constants.js';

export class UI {
    constructor() {
        this.elements = {
            score: document.getElementById('score'),
            combo: document.getElementById('combo'),
            lives: document.getElementById('lives'),
            level: document.getElementById('level'),
            freezeTimer: document.getElementById('freeze-timer'),
            freezeTime: document.getElementById('freeze-time'),
            doubleTimer: document.getElementById('double-timer'),
            doubleTime: document.getElementById('double-time'),
            startScreen: document.getElementById('start-screen'),
            gameOverScreen: document.getElementById('game-over-screen'),
            levelUpScreen: document.getElementById('level-up-screen'),
            finalScore: document.getElementById('final-score'),
            finalLevel: document.getElementById('final-level'),
            nextLevel: document.getElementById('next-level')
        };
        
        this.gameContainer = document.getElementById('game-container');
    }
    
    update(gameState) {
        this.elements.score.textContent = gameState.score;
        this.elements.combo.textContent = gameState.combo;
        this.elements.level.textContent = gameState.level;
        
        this.updateLives(gameState.lives);
        this.updateEffectTimers(gameState);
    }
    
    updateLives(lives) {
        const hearts = this.elements.lives.querySelectorAll('.heart');
        hearts.forEach((heart, index) => {
            if (index < lives) {
                heart.classList.remove('empty');
            } else {
                heart.classList.add('empty');
            }
        });
    }
    
    updateEffectTimers(gameState) {
        const freezeRemaining = gameState.getFreezeRemaining();
        const doubleRemaining = gameState.getDoubleScoreRemaining();
        
        if (freezeRemaining > 0) {
            this.elements.freezeTimer.style.display = 'block';
            this.elements.freezeTime.textContent = freezeRemaining;
        } else {
            this.elements.freezeTimer.style.display = 'none';
        }
        
        if (doubleRemaining > 0) {
            this.elements.doubleTimer.style.display = 'block';
            this.elements.doubleTime.textContent = doubleRemaining;
        } else {
            this.elements.doubleTimer.style.display = 'none';
        }
    }
    
    showStartScreen() {
        this.elements.startScreen.style.display = 'flex';
        this.elements.gameOverScreen.style.display = 'none';
        this.elements.levelUpScreen.style.display = 'none';
    }
    
    hideStartScreen() {
        this.elements.startScreen.style.display = 'none';
    }
    
    showGameOverScreen(score, level) {
        this.elements.finalScore.textContent = score;
        this.elements.finalLevel.textContent = level;
        this.elements.gameOverScreen.style.display = 'flex';
    }
    
    hideGameOverScreen() {
        this.elements.gameOverScreen.style.display = 'none';
    }
    
    showLevelUpScreen(nextLevel) {
        this.elements.nextLevel.textContent = nextLevel;
        this.elements.levelUpScreen.style.display = 'flex';
    }
    
    hideLevelUpScreen() {
        this.elements.levelUpScreen.style.display = 'none';
    }
    
    showComboPopup(combo, x, y) {
        if (combo < 2) return;
        
        const popup = document.createElement('div');
        popup.className = 'combo-popup';
        popup.textContent = `${combo}连击!`;
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;
        
        this.gameContainer.appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, 1000);
    }
    
    showScorePopup(score, x, y) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = `+${score}`;
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;
        
        this.gameContainer.appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, 800);
    }
    
    screenShake(intensity = 10, duration = 300) {
        const startTime = Date.now();
        const container = this.gameContainer;
        
        function shake() {
            const elapsed = Date.now() - startTime;
            if (elapsed > duration) {
                container.style.transform = 'translate(0, 0)';
                return;
            }
            
            const progress = 1 - elapsed / duration;
            const currentIntensity = intensity * progress;
            
            const x = (Math.random() - 0.5) * currentIntensity * 2;
            const y = (Math.random() - 0.5) * currentIntensity * 2;
            
            container.style.transform = `translate(${x}px, ${y}px)`;
            
            requestAnimationFrame(shake);
        }
        
        shake();
    }
    
    flashScreen(color = '#ff0000', duration = 200) {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${color};
            opacity: 0.5;
            pointer-events: none;
            z-index: 9999;
            transition: opacity ${duration}ms;
        `;
        
        this.gameContainer.appendChild(flash);
        
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), duration);
        }, 50);
    }
}
