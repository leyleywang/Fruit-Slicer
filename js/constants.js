// 游戏常量配置
export const CONSTANTS = {
    INITIAL_LIVES: 3,
    BASE_SCORE: 10,
    COMBO_MULTIPLIER: 1.5,
    MAX_COMBO_TIME: 1000,
    
    FRUIT_TYPES: [
        { name: 'watermelon', emoji: '🍉', color: '#ff4444', juiceColor: '#ff6b6b' },
        { name: 'apple', emoji: '🍎', color: '#e74c3c', juiceColor: '#ff7675' },
        { name: 'orange', emoji: '🍊', color: '#e67e22', juiceColor: '#fab1a0' },
        { name: 'lemon', emoji: '🍋', color: '#f39c12', juiceColor: '#ffeaa7' },
        { name: 'grape', emoji: '🍇', color: '#9b59b6', juiceColor: '#a29bfe' },
        { name: 'strawberry', emoji: '🍓', color: '#e84393', juiceColor: '#fd79a8' },
        { name: 'peach', emoji: '🍑', color: '#ff6b81', juiceColor: '#ffcccc' },
        { name: 'cherry', emoji: '🍒', color: '#d63031', juiceColor: '#ff7675' }
    ],
    
    SPECIAL_FRUIT_TYPES: [
        { name: 'double', emoji: '✨', color: '#ffd700', juiceColor: '#ffeb3b', effect: 'double', duration: 5000 },
        { name: 'freeze', emoji: '❄️', color: '#00ffff', juiceColor: '#b2ebf2', effect: 'freeze', duration: 3000 }
    ],
    
    BOMB: {
        emoji: '💣',
        color: '#333',
        explosionColor: '#ff4444'
    },
    
    LEVEL_CONFIG: {
        baseSpawnRate: 1500,
        minSpawnRate: 400,
        spawnRateDecrement: 100,
        baseFruitsPerWave: 3,
        maxFruitsPerWave: 8,
        fruitsPerWaveIncrement: 1,
        bombChance: 0.15,
        specialFruitChance: 0.1,
        levelUpScore: 500,
        baseVelocity: 5,
        velocityIncrement: 0.5,
        maxVelocity: 12
    },
    
    PARTICLE_COUNT: 8,
    JUICE_PARTICLE_COUNT: 15,
    EXPLOSION_PARTICLE_COUNT: 30,
    
    SLICER_TRAIL_LENGTH: 10,
    SLICER_WIDTH: 4,
    SLICER_COLOR: '#ffffff'
};
