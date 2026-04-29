// 工具函数模块
export const Utils = {
    random(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    randomInt(min, max) {
        return Math.floor(this.random(min, max + 1));
    },
    
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    },
    
    lerp(start, end, t) {
        return start + (end - start) * t;
    },
    
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },
    
    map(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    },
    
    degToRad(deg) {
        return deg * Math.PI / 180;
    },
    
    radToDeg(rad) {
        return rad * 180 / Math.PI;
    },
    
    circleCollision(x1, y1, r1, x2, y2, r2) {
        return this.distance(x1, y1, x2, y2) < r1 + r2;
    },
    
    pointInCircle(px, py, cx, cy, r) {
        return this.distance(px, py, cx, cy) <= r;
    },
    
    lineCircleCollision(x1, y1, x2, y2, cx, cy, r) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const fx = x1 - cx;
        const fy = y1 - cy;
        
        const a = dx * dx + dy * dy;
        const b = 2 * (fx * dx + fy * dy);
        const c = fx * fx + fy * fy - r * r;
        
        let discriminant = b * b - 4 * a * c;
        if (discriminant < 0) return false;
        
        discriminant = Math.sqrt(discriminant);
        const t1 = (-b - discriminant) / (2 * a);
        const t2 = (-b + discriminant) / (2 * a);
        
        return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
    },
    
    getAngle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },
    
    easeOutQuad(t) {
        return t * (2 - t);
    },
    
    easeInQuad(t) {
        return t * t;
    },
    
    easeOutCubic(t) {
        return (--t) * t * t + 1;
    }
};
