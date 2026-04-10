import { COLORS } from '../utils/constants.js';

export function drawRebelShip(ctx, x, y, angle, scale = 1.0, flash = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle - Math.PI / 2);
  ctx.scale(scale, scale);

  // Engine glow
  const engineGlow = ctx.createRadialGradient(0, 16, 0, 0, 16, 12);
  engineGlow.addColorStop(0, 'rgba(0, 200, 255, 0.8)');
  engineGlow.addColorStop(0.5, 'rgba(0, 100, 255, 0.3)');
  engineGlow.addColorStop(1, 'rgba(0, 50, 255, 0)');
  ctx.fillStyle = engineGlow;
  ctx.beginPath();
  ctx.arc(0, 16, 12, 0, Math.PI * 2);
  ctx.fill();

  // Wings — X-wing configuration
  const wingColor = '#778899';
  ctx.fillStyle = wingColor;
  ctx.strokeStyle = '#556677';
  ctx.lineWidth = 1;

  // Top-left wing
  ctx.beginPath();
  ctx.moveTo(-4, -4);
  ctx.lineTo(-20, -18);
  ctx.lineTo(-18, -14);
  ctx.lineTo(-4, 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Top-right wing
  ctx.beginPath();
  ctx.moveTo(4, -4);
  ctx.lineTo(20, -18);
  ctx.lineTo(18, -14);
  ctx.lineTo(4, 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Bottom-left wing
  ctx.beginPath();
  ctx.moveTo(-4, 4);
  ctx.lineTo(-20, 18);
  ctx.lineTo(-18, 14);
  ctx.lineTo(-4, 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Bottom-right wing
  ctx.beginPath();
  ctx.moveTo(4, 4);
  ctx.lineTo(20, 18);
  ctx.lineTo(18, 14);
  ctx.lineTo(4, 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Wing-tip cannons
  ctx.fillStyle = '#ff6644';
  ctx.beginPath();
  ctx.arc(-20, -18, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(20, -18, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-20, 18, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(20, 18, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Main fuselage
  ctx.fillStyle = '#99aabb';
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(-6, -8);
  ctx.lineTo(-5, 14);
  ctx.lineTo(0, 18);
  ctx.lineTo(5, 14);
  ctx.lineTo(6, -8);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#667788';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Cockpit
  const cockpitGrad = ctx.createRadialGradient(0, -10, 0, 0, -10, 5);
  cockpitGrad.addColorStop(0, '#88ccff');
  cockpitGrad.addColorStop(1, '#3366aa');
  ctx.fillStyle = cockpitGrad;
  ctx.beginPath();
  ctx.ellipse(0, -10, 3.5, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Damage flash overlay
  if (flash) {
    ctx.fillStyle = 'rgba(255, 50, 50, 0.4)';
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function drawSithShip(ctx, x, y, angle, scale = 1.0, type = 'FIGHTER', flash = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle - Math.PI / 2);
  ctx.scale(scale, scale);

  if (type === 'FIGHTER') {
    drawTIEFighter(ctx);
  } else if (type === 'INTERCEPTOR') {
    drawTIEInterceptor(ctx);
  } else if (type === 'BOMBER') {
    drawTIEBomber(ctx);
  }

  // Damage flash
  if (flash) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawTIEFighter(ctx) {
  // Engine glow
  const engineGlow = ctx.createRadialGradient(0, -14, 0, 0, -14, 8);
  engineGlow.addColorStop(0, 'rgba(255, 80, 20, 0.6)');
  engineGlow.addColorStop(1, 'rgba(255, 40, 0, 0)');
  ctx.fillStyle = engineGlow;
  ctx.beginPath();
  ctx.arc(0, -14, 8, 0, Math.PI * 2);
  ctx.fill();

  // Solar panel wings — left
  ctx.fillStyle = '#334';
  ctx.strokeStyle = '#556';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-8, -16);
  ctx.lineTo(-18, -14);
  ctx.lineTo(-18, 14);
  ctx.lineTo(-8, 16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Wing struts — left
  ctx.strokeStyle = '#667';
  ctx.lineWidth = 0.5;
  for (let i = -12; i <= 12; i += 4) {
    ctx.beginPath();
    ctx.moveTo(-8, i);
    ctx.lineTo(-18, i);
    ctx.stroke();
  }

  // Solar panel wings — right
  ctx.fillStyle = '#334';
  ctx.strokeStyle = '#556';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(8, -16);
  ctx.lineTo(18, -14);
  ctx.lineTo(18, 14);
  ctx.lineTo(8, 16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Wing struts — right
  ctx.strokeStyle = '#667';
  ctx.lineWidth = 0.5;
  for (let i = -12; i <= 12; i += 4) {
    ctx.beginPath();
    ctx.moveTo(8, i);
    ctx.lineTo(18, i);
    ctx.stroke();
  }

  // Central cockpit sphere
  ctx.fillStyle = '#445';
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#667';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Cockpit viewport
  ctx.fillStyle = '#ff3333';
  ctx.beginPath();
  ctx.arc(0, 2, 3, 0, Math.PI * 2);
  ctx.fill();

  // Support struts connecting cockpit to wings
  ctx.strokeStyle = '#556';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-8, 0);
  ctx.lineTo(-8, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(8, 0);
  ctx.lineTo(8, 0);
  ctx.stroke();
}

function drawTIEInterceptor(ctx) {
  // Engine glow
  const engineGlow = ctx.createRadialGradient(0, -14, 0, 0, -14, 10);
  engineGlow.addColorStop(0, 'rgba(255, 60, 20, 0.7)');
  engineGlow.addColorStop(1, 'rgba(255, 30, 0, 0)');
  ctx.fillStyle = engineGlow;
  ctx.beginPath();
  ctx.arc(0, -14, 10, 0, Math.PI * 2);
  ctx.fill();

  // Arrow-shaped wings — left
  ctx.fillStyle = '#2a2a3a';
  ctx.strokeStyle = '#556';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-8, 0);
  ctx.lineTo(-22, -18);
  ctx.lineTo(-20, 0);
  ctx.lineTo(-22, 18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Arrow-shaped wings — right
  ctx.beginPath();
  ctx.moveTo(8, 0);
  ctx.lineTo(22, -18);
  ctx.lineTo(20, 0);
  ctx.lineTo(22, 18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Wing-tip cannons
  ctx.fillStyle = '#ff4444';
  ctx.beginPath();
  ctx.arc(-22, -18, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(22, -18, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-22, 18, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(22, 18, 2, 0, Math.PI * 2);
  ctx.fill();

  // Central cockpit
  ctx.fillStyle = '#3a3a4a';
  ctx.beginPath();
  ctx.arc(0, 0, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#667';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Viewport
  ctx.fillStyle = '#ff2222';
  ctx.beginPath();
  ctx.arc(0, 2, 3.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawTIEBomber(ctx) {
  // Engine glow
  const engineGlow = ctx.createRadialGradient(0, -18, 0, 0, -18, 10);
  engineGlow.addColorStop(0, 'rgba(255, 100, 20, 0.5)');
  engineGlow.addColorStop(1, 'rgba(255, 50, 0, 0)');
  ctx.fillStyle = engineGlow;
  ctx.beginPath();
  ctx.arc(0, -18, 10, 0, Math.PI * 2);
  ctx.fill();

  // Left wing panel (standard)
  ctx.fillStyle = '#334';
  ctx.strokeStyle = '#556';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-10, -20);
  ctx.lineTo(-22, -18);
  ctx.lineTo(-22, 18);
  ctx.lineTo(-10, 20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right ordnance pod (larger)
  ctx.fillStyle = '#3a3a44';
  ctx.beginPath();
  ctx.ellipse(14, 0, 10, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#556';
  ctx.stroke();

  // Pod detail
  ctx.fillStyle = '#ff3333';
  ctx.beginPath();
  ctx.arc(14, 6, 3, 0, Math.PI * 2);
  ctx.fill();

  // Central cockpit (elongated)
  ctx.fillStyle = '#445';
  ctx.beginPath();
  ctx.ellipse(-2, 0, 8, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#667';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Viewport
  ctx.fillStyle = '#ff3333';
  ctx.beginPath();
  ctx.arc(-2, 4, 3, 0, Math.PI * 2);
  ctx.fill();

  // Connecting strut
  ctx.strokeStyle = '#556';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(6, 0);
  ctx.lineTo(4, 0);
  ctx.stroke();
}
