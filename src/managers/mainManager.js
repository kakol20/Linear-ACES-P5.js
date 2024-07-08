const MainManager = (function () {
  return {
    canvas: 0,

    preload() {
      DOMManager.preload();
    },

    setup() {
      // pixelDensity(1);

      this.canvas = createCanvas(windowWidth, windowHeight);
      this.canvas.position(0, 0);

      DOMManager.setup();
      ProcessManager.setup();
    },

    draw(dt) {
      ProcessManager.draw(dt);
    }
  }
})();