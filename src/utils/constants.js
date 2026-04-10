export const PLAYER_SPEED = 300;
export const PLAYER_MAX_HEALTH = 5;
export const PLAYER_FIRE_COOLDOWN = 0.15;
export const PLAYER_RADIUS = 18;
export const PLAYER_INVULN_TIME = 1.5;

export const ENEMY_TYPES = {
  FIGHTER:     { health: 1, speed: 150, radius: 15, fireCooldown: 2.0, score: 100 },
  INTERCEPTOR: { health: 2, speed: 200, radius: 18, fireCooldown: 1.2, score: 250 },
  BOMBER:      { health: 4, speed: 80,  radius: 25, fireCooldown: 3.0, score: 500 },
};

export const PLAYER_LASER_SPEED = 600;
export const ENEMY_LASER_SPEED = 300;
export const LASER_RADIUS = 4;

export const EXPLOSION_PARTICLE_COUNT = 15;
export const SHIP_EXPLOSION_PARTICLE_COUNT = 40;
export const PARTICLE_LIFETIME_MIN = 0.3;
export const PARTICLE_LIFETIME_MAX = 0.8;

export const STAR_LAYERS = [
  { count: 100, speed: 20,  sizeRange: [0.5, 1.0], brightnessRange: [0.3, 0.5] },
  { count: 60,  speed: 50,  sizeRange: [1.0, 2.0], brightnessRange: [0.5, 0.7] },
  { count: 30,  speed: 100, sizeRange: [2.0, 3.0], brightnessRange: [0.7, 1.0] },
];

export const WAVE_BASE_ENEMY_COUNT = 4;
export const WAVE_ENEMY_INCREMENT = 2;
export const WAVE_BASE_SPAWN_INTERVAL = 1.5;
export const WAVE_SPAWN_INTERVAL_DECREMENT = 0.1;
export const WAVE_MIN_SPAWN_INTERVAL = 0.4;
export const WAVE_PAUSE_DURATION = 2.0;

export const COLORS = {
  PLAYER_LASER: '#00ff88',
  ENEMY_LASER: '#ff2222',
  REBEL_ACCENT: '#4488ff',
  SITH_ACCENT: '#ff3333',
  EXPLOSION: ['#ff4400', '#ff8800', '#ffcc00', '#ffffff'],
  HUD_TEXT: '#ffffff',
  HEALTH_HIGH: '#00ff44',
  HEALTH_MID: '#ffcc00',
  HEALTH_LOW: '#ff2200',
};
