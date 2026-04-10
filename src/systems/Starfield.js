import { STAR_LAYERS } from '../utils/constants.js';
import { randomRange } from '../utils/math.js';

export class Starfield {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.layers = [];
    this.init();
  }

  init() {
    this.layers = STAR_LAYERS.map(config => {
      const stars = [];
      for (let i = 0; i < config.count; i++) {
        stars.push(this.createStar(config, true));
      }
      return { stars, config };
    });
  }

  createStar(config, randomY = false) {
    return {
      x: randomRange(0, this.width),
      y: randomY ? randomRange(0, this.height) : randomRange(-10, 0),
      size: randomRange(config.sizeRange[0], config.sizeRange[1]),
      speed: config.speed + randomRange(-5, 5),
      brightness: randomRange(config.brightnessRange[0], config.brightnessRange[1]),
    };
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.init();
  }

  update(dt) {
    for (const layer of this.layers) {
      for (let i = 0; i < layer.stars.length; i++) {
        const star = layer.stars[i];
        star.y += star.speed * dt;
        if (star.y > this.height + 5) {
          layer.stars[i] = this.createStar(layer.config, false);
        }
      }
    }
  }

  render(ctx) {
    for (const layer of this.layers) {
      for (const star of layer.stars) {
        ctx.fillStyle = `rgba(200, 220, 255, ${star.brightness})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      }
    }
  }
}
