const ProcessManager = (function () {
  let state = 'nothing';

  function GetIndex(x, y, w, c) {
    return (x + y * w) * c;
  }

  const maxFPS = 60;
  const maxTime = (1 / maxFPS) * 1000;

  let x, y;

  let constData = [];
  let processData = [];
  let processOrder = [];

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
        processData = [];
        processOrder = [];

        this.changeState('saveImage');
      } else if (state === 'saveImage') {
        loadPixels();
        const startTime = new Date();
        while (true) {
          const index = GetIndex(x, y, width, 4);

          processOrder.push({ index: index, x: x, y: y });

          for (let i = 0; i < 4; i++) {
            // Normalize to 0-1
            let c = pixels[index + i] / 255.0;

            constData.push(c);
            processData.push(c);
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
        DOMManager.updateProgress('Progress', (GetIndex(x, y, width, 4) / GetIndex(width - 1, height - 1, width, 4)) * 100);

        // updatePixels();
      } else if (state === 'processImage') {
        const startTime = new Date();
      }
    }
  }
})()