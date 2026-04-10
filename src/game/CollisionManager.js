import { circlesOverlap } from '../utils/math.js';

export function checkCollisions(playerLasers, enemies, enemyLasers, player) {
  const hitEnemies = [];
  const hitPlayer = [];

  // Player lasers vs enemies
  for (let i = playerLasers.length - 1; i >= 0; i--) {
    const laser = playerLasers[i];
    if (laser.destroyed) continue;

    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];
      if (enemy.destroyed) continue;

      if (circlesOverlap(laser.x, laser.y, laser.radius, enemy.x, enemy.y, enemy.radius)) {
        laser.destroyed = true;
        hitEnemies.push({ enemy, laser });
        break;
      }
    }
  }

  // Enemy lasers vs player
  if (player.isAlive()) {
    for (let i = enemyLasers.length - 1; i >= 0; i--) {
      const laser = enemyLasers[i];
      if (laser.destroyed) continue;

      if (circlesOverlap(laser.x, laser.y, laser.radius, player.x, player.y, player.radius)) {
        laser.destroyed = true;
        hitPlayer.push({ laser });
      }
    }
  }

  return { hitEnemies, hitPlayer };
}
