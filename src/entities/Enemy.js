import { ENEMY_TYPES } from '../utils/constants.js';
import { angleBetween, randomRange } from '../utils/math.js';
import { drawSithShip } from '../rendering/ShipRenderer.js';

export class Enemy {
  constructor(x, y, type = 'FIGHTER') {
    const config = ENEMY_TYPES[type];
    this.x = x;
    this.y = y;
    this.type = type;
    this.health = config.health;
    this.maxHealth = config.health;
    this.speed = config.speed;
    this.radius = config.radius;
    this.fireCooldown = config.fireCooldown;
    this.fireCooldownTimer = randomRange(0.5, config.fireCooldown);
    this.scoreValue = config.score;
    this.destroyed = false;
    this.wantsToShoot = false;
    this.angle = Math.PI / 2; // facing down
    this.flashTimer = 0;
  }

  update(dt, playerX, playerY, canvasHeight) {
    this.wantsToShoot = false;
    this.flashTimer = Math.max(0, this.flashTimer - dt);

    const angleToPlayer = angleBetween(this.x, this.y, playerX, playerY);

    switch (this.type) {
      case 'FIGHTER':
        // Move mostly downward, slight horizontal drift toward player
        this.y += this.speed * dt;
        this.x += Math.cos(angleToPlayer) * this.speed * 0.3 * dt;
        this.angle = Math.PI * 0.5 + Math.cos(angleToPlayer) * 0.3;
        break;

      case 'INTERCEPTOR':
        // Actively steer toward player
        this.x += Math.cos(angleToPlayer) * this.speed * dt;
        this.y += Math.sin(angleToPlayer) * this.speed * dt;
        this.angle = angleToPlayer;
        break;

      case 'BOMBER':
        // Straight down, very slow
        this.y += this.speed * dt;
        this.angle = Math.PI / 2;
        break;
    }

    // Firing
    this.fireCooldownTimer -= dt;
    if (this.fireCooldownTimer <= 0) {
      this.wantsToShoot = true;
      this.fireCooldownTimer = this.fireCooldown;
    }

    // Off screen
    if (this.y > canvasHeight + this.radius + 50) {
      this.destroyed = true;
    }
  }

  render(ctx) {
    drawSithShip(ctx, this.x, this.y, this.angle, 1.0, this.type, this.flashTimer > 0);
  }

  takeDamage(amount) {
    this.health -= amount;
    this.flashTimer = 0.1;
    if (this.health <= 0) {
      this.destroyed = true;
    }
  }
}
