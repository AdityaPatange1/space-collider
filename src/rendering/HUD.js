import { COLORS, PLAYER_MAX_HEALTH } from '../utils/constants.js';

export class HUD {
  constructor() {
    this.blinkTimer = 0;
    this.blinkVisible = true;
    this.waveBannerTimer = 0;
  }

  update(dt) {
    this.blinkTimer += dt;
    if (this.blinkTimer >= 0.5) {
      this.blinkTimer -= 0.5;
      this.blinkVisible = !this.blinkVisible;
    }
  }

  renderPlayingHUD(ctx, score, health, waveNumber, width, height) {
    ctx.save();
    ctx.shadowBlur = 0;

    // Score
    ctx.font = '20px "Courier New", monospace';
    ctx.fillStyle = COLORS.HUD_TEXT;
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${String(score).padStart(6, '0')}`, 20, 35);

    // Health bar
    const barX = 20;
    const barY = 48;
    const barW = 160;
    const barH = 14;
    const healthRatio = health / PLAYER_MAX_HEALTH;

    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);

    let barColor = COLORS.HEALTH_HIGH;
    if (healthRatio <= 0.3) barColor = COLORS.HEALTH_LOW;
    else if (healthRatio <= 0.6) barColor = COLORS.HEALTH_MID;

    ctx.fillStyle = barColor;
    ctx.fillRect(barX + 1, barY + 1, (barW - 2) * healthRatio, barH - 2);

    // Health text
    ctx.font = '11px "Courier New", monospace';
    ctx.fillStyle = '#ccc';
    ctx.fillText(`HP: ${health}/${PLAYER_MAX_HEALTH}`, barX + barW + 8, barY + 12);

    // Wave indicator
    ctx.font = '18px "Courier New", monospace';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffcc44';
    ctx.fillText(`WAVE ${waveNumber}`, width - 20, 35);

    ctx.restore();
  }

  renderWaveBanner(ctx, waveNumber, width, height, progress) {
    ctx.save();
    const alpha = progress < 0.2 ? progress / 0.2
      : progress > 0.8 ? (1 - progress) / 0.2
      : 1;

    ctx.globalAlpha = alpha;
    ctx.font = 'bold 56px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.shadowColor = '#ffcc00';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#ffcc00';
    ctx.fillText(`WAVE ${waveNumber}`, width / 2, height / 2 - 30);

    ctx.shadowBlur = 0;
    ctx.font = '20px "Courier New", monospace';
    ctx.fillStyle = '#aaa';
    ctx.fillText('GET READY', width / 2, height / 2 + 20);

    ctx.restore();
  }

  renderMenuScreen(ctx, width, height) {
    ctx.save();

    // Title glow
    ctx.shadowColor = '#4488ff';
    ctx.shadowBlur = 30;
    ctx.font = 'bold 64px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#4488ff';
    ctx.fillText('SPACE', width / 2, height / 2 - 80);
    ctx.fillStyle = '#ff4444';
    ctx.shadowColor = '#ff4444';
    ctx.fillText('COLLIDER', width / 2, height / 2 - 20);

    // Subtitle
    ctx.shadowBlur = 0;
    ctx.font = '18px "Courier New", monospace';
    ctx.fillStyle = '#888';
    ctx.fillText('Destroy the Sith Fleet', width / 2, height / 2 + 30);

    // Click to start
    if (this.blinkVisible) {
      ctx.font = '24px "Courier New", monospace';
      ctx.fillStyle = '#fff';
      ctx.fillText('CLICK TO START', width / 2, height / 2 + 90);
    }

    // Controls
    ctx.font = '14px "Courier New", monospace';
    ctx.fillStyle = '#666';
    ctx.fillText('WASD / Arrows to move  |  Mouse to aim & shoot', width / 2, height / 2 + 140);

    ctx.restore();
  }

  renderGameOverScreen(ctx, score, width, height) {
    ctx.save();

    // Dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, width, height);

    // Game Over text
    ctx.shadowColor = '#ff2200';
    ctx.shadowBlur = 25;
    ctx.font = 'bold 64px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ff2200';
    ctx.fillText('GAME OVER', width / 2, height / 2 - 50);

    // Final score
    ctx.shadowBlur = 0;
    ctx.font = '28px "Courier New", monospace';
    ctx.fillStyle = '#ffcc44';
    ctx.fillText(`FINAL SCORE: ${String(score).padStart(6, '0')}`, width / 2, height / 2 + 10);

    // Restart prompt
    if (this.blinkVisible) {
      ctx.font = '22px "Courier New", monospace';
      ctx.fillStyle = '#fff';
      ctx.fillText('CLICK TO RESTART', width / 2, height / 2 + 70);
    }

    ctx.restore();
  }
}
