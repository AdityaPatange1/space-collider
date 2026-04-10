import {
  WAVE_BASE_ENEMY_COUNT, WAVE_ENEMY_INCREMENT,
  WAVE_BASE_SPAWN_INTERVAL, WAVE_SPAWN_INTERVAL_DECREMENT,
  WAVE_MIN_SPAWN_INTERVAL, WAVE_PAUSE_DURATION
} from '../utils/constants.js';
import { randomRange, randomFromArray } from '../utils/math.js';

export class WaveManager {
  constructor() {
    this.waveNumber = 0;
    this.spawnTimer = 0;
    this.enemiesRemainingToSpawn = 0;
    this.enemiesAliveInWave = 0;
    this.betweenWaves = true;
    this.betweenWaveTimer = 1.0; // Initial delay before wave 1
    this.waveComplete = false;
  }

  getSpawnInterval() {
    return Math.max(
      WAVE_MIN_SPAWN_INTERVAL,
      WAVE_BASE_SPAWN_INTERVAL - (this.waveNumber - 1) * WAVE_SPAWN_INTERVAL_DECREMENT
    );
  }

  getEnemyCount() {
    return WAVE_BASE_ENEMY_COUNT + (this.waveNumber - 1) * WAVE_ENEMY_INCREMENT;
  }

  getEnemyType() {
    if (this.waveNumber <= 3) {
      return 'FIGHTER';
    } else if (this.waveNumber <= 6) {
      return randomFromArray(['FIGHTER', 'FIGHTER', 'INTERCEPTOR']);
    } else {
      return randomFromArray(['FIGHTER', 'INTERCEPTOR', 'INTERCEPTOR', 'BOMBER']);
    }
  }

  startNextWave() {
    this.waveNumber++;
    this.enemiesRemainingToSpawn = this.getEnemyCount();
    this.enemiesAliveInWave = 0;
    this.spawnTimer = 0;
    this.betweenWaves = false;
    this.waveComplete = false;
  }

  onEnemyDestroyed() {
    this.enemiesAliveInWave--;
  }

  update(dt, canvasWidth, spawnCallback) {
    if (this.betweenWaves) {
      this.betweenWaveTimer -= dt;
      if (this.betweenWaveTimer <= 0) {
        this.startNextWave();
      }
      return;
    }

    // Spawn enemies
    if (this.enemiesRemainingToSpawn > 0) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        const type = this.getEnemyType();
        const margin = 40;
        const x = randomRange(margin, canvasWidth - margin);
        const y = -30;

        spawnCallback(x, y, type);
        this.enemiesAliveInWave++;
        this.enemiesRemainingToSpawn--;
        this.spawnTimer = this.getSpawnInterval();
      }
    }

    // Check wave completion
    if (this.enemiesRemainingToSpawn <= 0 && this.enemiesAliveInWave <= 0 && !this.waveComplete) {
      this.waveComplete = true;
      this.betweenWaves = true;
      this.betweenWaveTimer = WAVE_PAUSE_DURATION;
    }
  }

  isShowingWaveBanner() {
    return this.betweenWaves && this.waveNumber > 0;
  }

  getBannerProgress() {
    return 1 - (this.betweenWaveTimer / WAVE_PAUSE_DURATION);
  }

  reset() {
    this.waveNumber = 0;
    this.spawnTimer = 0;
    this.enemiesRemainingToSpawn = 0;
    this.enemiesAliveInWave = 0;
    this.betweenWaves = true;
    this.betweenWaveTimer = 1.0;
    this.waveComplete = false;
  }
}
