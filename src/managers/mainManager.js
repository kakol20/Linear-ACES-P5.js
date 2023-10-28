const MainManager = (function () {
  let canvas;

  return {
    preload() {
      // do nothing for now
    },

    setup() {
      canvas = createCanvas(windowWidth - 10, windowHeight);
      canvas.position(10, 0);
    },

    draw() {
      background(255, 255, 255, 255);
      ellipse(50, 50, 80, 80);
    }
  }
})();