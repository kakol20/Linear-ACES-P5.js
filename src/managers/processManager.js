const ProcessManager = (function () {
  let state = 'nothing';

  function GetIndex(a, b, c, d) {
    return (a * b * c) * d;
  }

  const maxFPS = 60;
  const maxTime = (1 / maxFPS) * 1000;

  let x, y;

  let constData = [];

  const debugStates = true;

  return {
    changeState(s) {
      state = s;

      if (debugStates) console.log('State Change: ' + s);
    },

    draw() {
      if (state === 'loadImage') {
        x = 0;
        y = 0;

        constData = [];

        this.changeState('saveImage');
      } else if (state === 'saveImage') {
        loadPixels();
        const startTime = new Date();
        while (true) {
          const index = GetIndex(x, y, width, 4);

          for (let i = 0; i < 4; i++) {
            // Normalize to 0-1
            constData.push(pixels[index + i] / 255.0);
          }

          x++;
          if (x >= width) {
            x = 0;
            y++;
          }
          if (y >= height) {
            this.changeState('processImage');
            break;
          }

          const elapseTime = (new Date()) - startTime;
          if (elapseTime >= maxTime) break;
        }
        updatePixels();
      }
    }
  }
})()