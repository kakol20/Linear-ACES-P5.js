const ProcessImageState = (function () {
  function GetIndex(x, y, d = 1, i = 0, j = 0) {
    return Math.floor(4 * ((y * d + j) * width * d + (x * d + i)));
  };

  function GetImageSize() {
    return GetIndex(width - 1, height - 1, pixelDensity(), pixelDensity() - 1, pixelDensity() - 1);
  }

  return {
    x: 0, y: 0, i: 0, j: 0,

    run() {
      Timing.start();

      loadPixels();
      while (true) {
        const index = GetIndex(this.x, this.y, pixelDensity(), this.i, this.j);

        // ----- MAIN PROCESS -----

        if (DOMManager.grayscaleBool) {
          // temp for testing
          // let avg = pixels[index + 0] + pixels[index + 1] + pixels[index + 2];
          // avg /= 3;
          // pixels[index + 0] = avg;
          // pixels[index + 1] = avg;
          // pixels[index + 2] = avg;

          Grayscale.run(index);
        }

        // ----- ITERATE -----
        this.i++;
        if (this.i >= pixelDensity()) {
          this.i = 0;
          this.x++;
        }
        if (this.x >= width) {
          this.x = 0;
          this.j++;
        }
        if (this.j >= pixelDensity()) {
          this.j = 0;
          this.y++;
        }
        if (this.y >= height) {
          ProcessManager.changeState('end');

          break;
        }

        if (Timing.checkTime()) break;
      }
      updatePixels();

      DOMManager.updateProgress('Processing', (GetIndex(this.x, this.y, pixelDensity(), this.i, this.j) / GetImageSize()) * 100);

      if (ProcessManager.state != 'processImage') {
        this.x = 0;
        this.y = 0;
        this.i = 0;
        this.j = 0;
      }
    }
  }
})();