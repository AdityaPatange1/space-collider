import { Renderer } from '../rendering/Renderer.js';
import { HUD } from '../rendering/HUD.js';
import { InputManager } from './InputManager.js';
import { checkCollisions } from './CollisionManager.js';
import { Starfield } from '../systems/Starfield.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';
import { WaveManager } from '../systems/WaveManager.js';
import { SoundManager } from '../systems/SoundManager.js';
import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';
import { Laser } from '../entities/Laser.js';
import { COLORS, PLAYER_LASER_SPEED, ENEMY_LASER_SPEED } from '../utils/constants.js';
import { angleBetween } from '../utils/math.js';

const STATE = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  GAME_OVER: 'GAME_OVER',
};

export class Game {
  constructor(canvas) {
    this.renderer = new Renderer(canvas);
    this.inputManager = new InputManager(canvas);
    this.hud = new HUD();
    this.starfield = new Starfield(this.renderer.getWidth(), this.renderer.getHeight());
    this.particleSystem = new ParticleSystem();
    this.waveManager = new WaveManager();
    this.soundManager = new SoundManager();

    this.player = null;
    this.enemies = [];
    this.playerLasers = [];
    this.enemyLasers = [];

    this.score = 0;
    this.state = STATE.MENU;
    this.lastTimestamp = 0;
    this.gameOverDebounce = 0;
    this.screenShake = 0;

    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
  }

  start() {
    this.inputManager.attach();
    this.lastTimestamp = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  loop(timestamp) {
    let dt = (timestamp - this.lastTimestamp) / 1000;
    dt = Math.min(dt, 0.05); // Cap to prevent physics explosion
    this.lastTimestamp = timestamp;

    this.update(dt);
    this.render();
    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    this.hud.update(dt);
    this.starfield.update(dt);
    this.particleSystem.update(dt);

    if (this.screenShake > 0) this.screenShake -= dt;

    switch (this.state) {
      case STATE.MENU:
        this.updateMenu(dt);
        break;
      case STATE.PLAYING:
        this.updatePlaying(dt);
        break;
      case STATE.GAME_OVER:
        this.updateGameOver(dt);
        break;
    }
  }

  updateMenu() {
    if (this.inputManager.consumeClick()) {
      this.soundManager.init();
      this.startGame();
    }
  }

  updatePlaying(dt) {
    const w = this.renderer.getWidth();
    const h = this.renderer.getHeight();

    // Player
    this.player.update(dt, this.inputManager, w, h);

    // Player shooting
    if (this.inputManager.isMouseDown() && this.player.canShoot()) {
      const mouse = this.inputManager.getMousePosition();
      const angle = angleBetween(this.player.x, this.player.y, mouse.x, mouse.y);
      this.playerLasers.push(
        new Laser(this.player.x, this.player.y, angle, PLAYER_LASER_SPEED, COLORS.PLAYER_LASER)
      );
      this.player.resetFireCooldown();
      this.soundManager.playLaserSound(true);
    }

    // Wave management
    this.waveManager.update(dt, w, (x, y, type) => {
      this.enemies.push(new Enemy(x, y, type));
    });

    // Enemies
    for (const enemy of this.enemies) {
      enemy.update(dt, this.player.x, this.player.y, h);

      if (enemy.wantsToShoot) {
        const angle = angleBetween(enemy.x, enemy.y, this.player.x, this.player.y);
        this.enemyLasers.push(
          new Laser(enemy.x, enemy.y, angle, ENEMY_LASER_SPEED, COLORS.ENEMY_LASER)
        );
        this.soundManager.playLaserSound(false);
      }
    }

    // Lasers
    for (const laser of this.playerLasers) laser.update(dt, w, h);
    for (const laser of this.enemyLasers) laser.update(dt, w, h);

    // Collisions
    const collisions = checkCollisions(this.playerLasers, this.enemies, this.enemyLasers, this.player);

    for (const { enemy, laser } of collisions.hitEnemies) {
      enemy.takeDamage(laser.damage);
      if (enemy.destroyed) {
        this.score += enemy.scoreValue;
        this.particleSystem.createShipExplosion(enemy.x, enemy.y);
        this.soundManager.playExplosionSound(enemy.type === 'BOMBER');
        this.waveManager.onEnemyDestroyed();
      } else {
        this.particleSystem.createExplosion(laser.x, laser.y, 5);
        this.soundManager.playHitSound();
      }
    }

    for (const { laser } of collisions.hitPlayer) {
      if (this.player.takeDamage(laser.damage)) {
        this.particleSystem.createExplosion(this.player.x, this.player.y, 8);
        this.soundManager.playExplosionSound(false);
        this.screenShake = 0.2;
      }
    }

    // Clean up destroyed entities
    this.playerLasers = this.playerLasers.filter(l => !l.destroyed);
    this.enemyLasers = this.enemyLasers.filter(l => !l.destroyed);

    // Count enemies that left screen (destroyed=true but not from collision scoring)
    // Collision-destroyed enemies already called onEnemyDestroyed above
    for (const enemy of this.enemies) {
      if (enemy.destroyed && enemy.health > 0) {
        // Fell off screen without being killed
        this.waveManager.onEnemyDestroyed();
      }
    }
    this.enemies = this.enemies.filter(e => !e.destroyed);

    // Check player death
    if (!this.player.isAlive()) {
      this.particleSystem.createShipExplosion(this.player.x, this.player.y);
      this.soundManager.playExplosionSound(true);
      this.state = STATE.GAME_OVER;
      this.gameOverDebounce = 1.0;
    }
  }

  updateGameOver(dt) {
    this.gameOverDebounce -= dt;
    if (this.gameOverDebounce <= 0 && this.inputManager.consumeClick()) {
      this.startGame();
    }
  }

  startGame() {
    const w = this.renderer.getWidth();
    const h = this.renderer.getHeight();
    this.player = new Player(w / 2, h * 0.75);
    this.enemies = [];
    this.playerLasers = [];
    this.enemyLasers = [];
    this.score = 0;
    this.particleSystem.clear();
    this.waveManager.reset();
    this.state = STATE.PLAYING;
    this.screenShake = 0;
  }

  render() {
    const ctx = this.renderer.getContext();
    const w = this.renderer.getWidth();
    const h = this.renderer.getHeight();

    // Screen shake
    ctx.save();
    if (this.screenShake > 0) {
      const intensity = this.screenShake * 10;
      ctx.translate(
        (Math.random() - 0.5) * intensity,
        (Math.random() - 0.5) * intensity
      );
    }

    this.renderer.clear();
    this.starfield.render(ctx);

    switch (this.state) {
      case STATE.MENU:
        this.hud.renderMenuScreen(ctx, w, h);
        break;

      case STATE.PLAYING:
        this.renderGameEntities(ctx);
        this.particleSystem.render(ctx);
        this.hud.renderPlayingHUD(ctx, this.score, this.player.health, this.waveManager.waveNumber, w, h);
        if (this.waveManager.isShowingWaveBanner()) {
          this.hud.renderWaveBanner(ctx, this.waveManager.waveNumber + 1, w, h, this.waveManager.getBannerProgress());
        }
        break;

      case STATE.GAME_OVER:
        this.renderGameEntities(ctx);
        this.particleSystem.render(ctx);
        this.hud.renderGameOverScreen(ctx, this.score, w, h);
        break;
    }

    ctx.restore();
  }

  renderGameEntities(ctx) {
    for (const laser of this.enemyLasers) laser.render(ctx);
    for (const enemy of this.enemies) enemy.render(ctx);
    for (const laser of this.playerLasers) laser.render(ctx);
    if (this.player && this.player.isAlive()) this.player.render(ctx);
  }

  _onResize() {
    this.renderer.resize();
    this.starfield.resize(this.renderer.getWidth(), this.renderer.getHeight());
  }
}
