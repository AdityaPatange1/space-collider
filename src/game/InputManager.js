export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Map();
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;
    this.mouseClicked = false;

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onContextMenu = this._onContextMenu.bind(this);
  }

  attach() {
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    this.canvas.addEventListener('mousemove', this._onMouseMove);
    this.canvas.addEventListener('mousedown', this._onMouseDown);
    this.canvas.addEventListener('mouseup', this._onMouseUp);
    this.canvas.addEventListener('contextmenu', this._onContextMenu);
  }

  detach() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    this.canvas.removeEventListener('mousemove', this._onMouseMove);
    this.canvas.removeEventListener('mousedown', this._onMouseDown);
    this.canvas.removeEventListener('mouseup', this._onMouseUp);
    this.canvas.removeEventListener('contextmenu', this._onContextMenu);
  }

  _onKeyDown(e) {
    this.keys.set(e.key.toLowerCase(), true);
  }

  _onKeyUp(e) {
    this.keys.set(e.key.toLowerCase(), false);
  }

  _onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
  }

  _onMouseDown(e) {
    if (e.button === 0) {
      this.mouseDown = true;
      this.mouseClicked = true;
    }
  }

  _onMouseUp(e) {
    if (e.button === 0) {
      this.mouseDown = false;
    }
  }

  _onContextMenu(e) {
    e.preventDefault();
  }

  isKeyDown(key) {
    return this.keys.get(key) === true;
  }

  getMousePosition() {
    return { x: this.mouseX, y: this.mouseY };
  }

  isMouseDown() {
    return this.mouseDown;
  }

  consumeClick() {
    if (this.mouseClicked) {
      this.mouseClicked = false;
      return true;
    }
    return false;
  }
}
