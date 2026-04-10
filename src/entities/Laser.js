export class Laser {
  constructor(x, y, angle, speed, color, damage = 1) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.speed = speed;
    this.color = color;
    this.damage = damage;
    this.radius = 4;
    this.destroyed = false;
    this.length = 14;
  }

  update(dt, canvasWidth, canvasHeight) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (this.x < -20 || this.x > canvasWidth + 20 ||
        this.y < -20 || this.y > canvasHeight + 20) {
      this.destroyed = true;
    }
  }

  render(ctx) {
    const angle = Math.atan2(this.vy, this.vx);
    const tailX = this.x - Math.cos(angle) * this.length;
    const tailY = this.y - Math.sin(angle) * this.length;

    ctx.save();

    // Glow
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;

    // Main bolt
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();

    // Bright core
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();

    ctx.restore();
  }
}
