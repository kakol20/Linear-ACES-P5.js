const MainManager = (function () {

  return {
    canvas: 0,

    preload() {
      DOMManager.preload();
    },

    setup() {
      pixelDensity(1);

      this.canvas = createCanvas(10, 10);
      this.canvas.position(0, 0);
    },

    draw() {
      ProcessManager.draw();
    }
  }
})();