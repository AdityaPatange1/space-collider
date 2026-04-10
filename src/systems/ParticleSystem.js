import { Particle } from '../entities/Particle.js';
import { COLORS, EXPLOSION_PARTICLE_COUNT, SHIP_EXPLOSION_PARTICLE_COUNT, PARTICLE_LIFETIME_MIN, PARTICLE_LIFETIME_MAX } from '../utils/constants.js';
import { randomRange, randomFromArray } from '../utils/math.js';

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.maxParticles = 400;
  }

  createExplosion(x, y, count = EXPLOSION_PARTICLE_COUNT) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) break;

      const angle = randomRange(0, Math.PI * 2);
      const speed = randomRange(40, 200);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const life = randomRange(PARTICLE_LIFETIME_MIN, PARTICLE_LIFETIME_MAX);
      const color = randomFromArray(COLORS.EXPLOSION);
      const radius = randomRange(2, 5);

      this.particles.push(new Particle(x, y, vx, vy, life, color, radius));
    }
  }

  createShipExplosion(x, y) {
    this.createExplosion(x, y, SHIP_EXPLOSION_PARTICLE_COUNT);

    // Extra ring of slower, larger particles
    for (let i = 0; i < 10; i++) {
      if (this.particles.length >= this.maxParticles) break;

      const angle = randomRange(0, Math.PI * 2);
      const speed = randomRange(20, 60);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const life = randomRange(0.5, 1.0);
      const color = randomFromArray(['#ff6600', '#ff3300', '#ffaa00']);
      const radius = randomRange(4, 8);

      this.particles.push(new Particle(x, y, vx, vy, life, color, radius));
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update(dt);
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }

  render(ctx) {
    for (const particle of this.particles) {
      particle.render(ctx);
    }
  }

  clear() {
    this.particles.length = 0;
  }
}
