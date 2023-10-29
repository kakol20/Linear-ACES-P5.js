const MainManager = (function () {

  return {
    canvas: 0,

    preload() {
      DOMManager.preload();
    },

    setup() {
      pixelDensity(1);

      this.canvas = createCanvas(windowWidth - DOMManager.domWidth, windowHeight);
      this.canvas.position(DOMManager.domWidth, 0);
    },

    draw() {
      ProcessManager.draw();
    }
  }
})();