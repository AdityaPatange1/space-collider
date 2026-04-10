import { PLAYER_SPEED, PLAYER_MAX_HEALTH, PLAYER_FIRE_COOLDOWN, PLAYER_RADIUS, PLAYER_INVULN_TIME } from '../utils/constants.js';
import { normalize, angleBetween, clamp } from '../utils/math.js';
import { drawRebelShip } from '../rendering/ShipRenderer.js';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.speed = PLAYER_SPEED;
    this.health = PLAYER_MAX_HEALTH;
    this.maxHealth = PLAYER_MAX_HEALTH;
    this.radius = PLAYER_RADIUS;
    this.fireCooldown = PLAYER_FIRE_COOLDOWN;
    this.fireCooldownTimer = 0;
    this.invulnerableTimer = 0;
    this.angle = -Math.PI / 2; // facing up
  }

  update(dt, inputManager, canvasWidth, canvasHeight) {
    // Movement input
    let dx = 0;
    let dy = 0;
    if (inputManager.isKeyDown('w') || inputManager.isKeyDown('arrowup')) dy -= 1;
    if (inputManager.isKeyDown('s') || inputManager.isKeyDown('arrowdown')) dy += 1;
    if (inputManager.isKeyDown('a') || inputManager.isKeyDown('arrowleft')) dx -= 1;
    if (inputManager.isKeyDown('d') || inputManager.isKeyDown('arrowright')) dx += 1;

    if (dx !== 0 || dy !== 0) {
      const norm = normalize(dx, dy);
      this.vx = norm.x * this.speed;
      this.vy = norm.y * this.speed;
    } else {
      this.vx = 0;
      this.vy = 0;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Clamp to canvas bounds
    this.x = clamp(this.x, this.radius, canvasWidth - this.radius);
    this.y = clamp(this.y, this.radius, canvasHeight - this.radius);

    // Aim toward mouse
    const mouse = inputManager.getMousePosition();
    this.angle = angleBetween(this.x, this.y, mouse.x, mouse.y);

    // Cooldowns
    if (this.fireCooldownTimer > 0) this.fireCooldownTimer -= dt;
    if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;
  }

  render(ctx) {
    // Invulnerability flash
    let flash = false;
    if (this.invulnerableTimer > 0) {
      flash = Math.floor(this.invulnerableTimer * 10) % 2 === 0;
      if (flash) {
        ctx.save();
        ctx.globalAlpha = 0.4;
      }
    }

    drawRebelShip(ctx, this.x, this.y, this.angle, 1.0, flash);

    if (this.invulnerableTimer > 0 && flash) {
      ctx.restore();
    }
  }

  canShoot() {
    return this.fireCooldownTimer <= 0;
  }

  resetFireCooldown() {
    this.fireCooldownTimer = this.fireCooldown;
  }

  takeDamage(amount) {
    if (this.invulnerableTimer > 0) return false;
    this.health -= amount;
    this.invulnerableTimer = PLAYER_INVULN_TIME;
    return true;
  }

  isAlive() {
    return this.health > 0;
  }
}
