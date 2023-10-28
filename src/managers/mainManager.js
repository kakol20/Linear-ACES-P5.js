const MainManager = (function () {
  let canvas;

  return {
    preload() {
      DOMManager.preload();
    },

    setup() {
      pixelDensity(1);

      canvas = createCanvas(windowWidth - DOMManager.domWidth, windowHeight);
      canvas.position(DOMManager.domWidth, 0);
    },

    draw() {
      ProcessManager.draw();
    }
  }
})();