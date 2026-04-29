import { CONSTANTS } from './constants.js';
import { Utils } from './utils.js';

export class Slicer {
    constructor(canvas) {
        this.canvas = canvas;
        this.trail = [];
        this.maxTrailLength = CONSTANTS.SLICER_TRAIL_LENGTH;
        this.isSlicing = false;
        this.lastPosition = { x: 0, y: 0 };
        this.currentPosition = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.startSlice(e.clientX, e.clientY));
        this.canvas.addEventListener('mousemove', (e) => this.moveSlice(e.clientX, e.clientY));
        this.canvas.addEventListener('mouseup', () => this.endSlice());
        this.canvas.addEventListener('mouseleave', () => this.endSlice());
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.startSlice(touch.clientX, touch.clientY);
        }, { passive: false });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.moveSlice(touch.clientX, touch.clientY);
        }, { passive: false });
        
        this.canvas.addEventListener('touchend', () => this.endSlice());
    }
    
    getCanvasPosition(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }
    
    startSlice(clientX, clientY) {
        this.isSlicing = true;
        const pos = this.getCanvasPosition(clientX, clientY);
        this.trail = [pos];
        this.lastPosition = pos;
        this.currentPosition = pos;
    }
    
    moveSlice(clientX, clientY) {
        const pos = this.getCanvasPosition(clientX, clientY);
        this.lastPosition = { ...this.currentPosition };
        this.currentPosition = pos;
        
        this.velocity.x = this.currentPosition.x - this.lastPosition.x;
        this.velocity.y = this.currentPosition.y - this.lastPosition.y;
        
        if (this.isSlicing) {
            this.trail.push({ ...pos });
            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }
        }
    }
    
    endSlice() {
        this.isSlicing = false;
        this.trail = [];
    }
    
    getSliceSpeed() {
        return Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
    }
    
    checkCollision(entity) {
        if (!this.isSlicing || this.trail.length < 2) return null;
        
        const recentTrail = this.trail.slice(-4);
        for (let i = 0; i < recentTrail.length - 1; i++) {
            const p1 = recentTrail[i];
            const p2 = recentTrail[i + 1];
            
            if (Utils.lineCircleCollision(
                p1.x, p1.y,
                p2.x, p2.y,
                entity.x, entity.y,
                entity.radius
            )) {
                return {
                    hit: true,
                    position: { x: entity.x, y: entity.y },
                    direction: this.velocity
                };
            }
        }
        
        return null;
    }
    
    render(ctx) {
        if (!this.isSlicing || this.trail.length < 2) return;
        
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        for (let i = 0; i < this.trail.length - 1; i++) {
            const alpha = (i + 1) / this.trail.length;
            const width = CONSTANTS.SLICER_WIDTH * alpha;
            
            ctx.beginPath();
            ctx.moveTo(this.trail[i].x, this.trail[i].y);
            ctx.lineTo(this.trail[i + 1].x, this.trail[i + 1].y);
            ctx.strokeStyle = CONSTANTS.SLICER_COLOR;
            ctx.globalAlpha = alpha * 0.8;
            ctx.lineWidth = width;
            ctx.stroke();
        }
        
        if (this.trail.length > 0) {
            const lastPoint = this.trail[this.trail.length - 1];
            ctx.beginPath();
            ctx.arc(lastPoint.x, lastPoint.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 0.9;
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    reset() {
        this.trail = [];
        this.isSlicing = false;
    }
}
