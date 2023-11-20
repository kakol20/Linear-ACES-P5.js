const ProcessManager = (function () {
  let state = 'nothing';

  const maxFPS = 60;
  const maxTime = 1000 / maxFPS;

  let x, y, p;

  let constData = [];
  let processData = [];
  let processOrder = [];

  const debugStates = true;

  function GetIndex(x, y, w, c) {
    return (x + y * w) * c;
  }

  const Timing = (function () {
    let startTime = 0;
    return {
      start() {
        startTime = new Date();
      },
      checkTime() {
        const elapseTime = (new Date()) - startTime;
        // if (elapseTime >= maxTime) break;
        return elapseTime >= maxTime;
      }

    }
  })();

  // ----- STATES -----

  function loadImageState() {
    x = 0;
    y = 0;

    constData = [];
    processData = [];
    processOrder = [];

    ProcessManager.changeState('saveImage');

    DOMManager.updateDOMValues();
  }

  function saveImageState() {
    Timing.start();

    loadPixels();
    while (true) {
      const index = GetIndex(x, y, width, 4);

      processOrder.push({ index: index, x: x, y: y });

      for (let i = 0; i < 4; i++) {
        // Normalize to 0-1
        let c = pixels[index + i] / 255.0;
        if (i != 3) {
          c = sRGB.toLinear(c);
        }

        constData.push(c);
        processData.push(c);
      }

      x++;
      if (x >= width) {
        x = 0;
        y++;
      }
      if (y >= height) {
        ProcessManager.changeState('processImage');
        break;
      }

      if (Timing.checkTime()) break;
    }
    DOMManager.updateProgress('Loading', (GetIndex(x, y, width, 4) / GetIndex(width - 1, height - 1, width, 4)) * 100);

    if (state != 'saveImage') {
      x = 0;
      y = 0;
      p = 0;

      DOMManager.updateDOMValues();
    }

    // updatePixels();
  }

  function processImageState() {
    Timing.start();

    loadPixels();
    while (true) {
      const index = processOrder[p].index;

      x = processOrder[p].x, y = processOrder[p].y;

      // ----- START PROCESS -----

      // Copy to local
      let c = [];
      for (let i = 0; i < 4; i++) {
        c.push(processData[index + i]);
      }

      // ACES Tonemapping
      if (DOMManager.acesBool) {
        c = LinearACES.ToneMap(c);
      }

      // Convert to sRGB
      for (let i = 0; i < 3; i++) {
        c[i] = sRGB.tosRGB(c[i]);
      }

      // Show changes
      for (let i = 0; i < 4; i++) {
        processData[index + i] = c[i];
        pixels[index + i] = c[i] * 255;
      }

      // ----- END PROCESS -----

      p++;
      if (p >= processOrder.length) {
        ProcessManager.changeState('end');
        break;
      }

      if (Timing.checkTime()) break;
    }
    updatePixels();

    DOMManager.updateProgress('Processing', (p / processOrder.length) * 100);

    if (state != 'processImage') {
      p = 0;
    }
  }

  function restartState() {
    Timing.start();

    loadPixels();
    while (true) {
      const index = processOrder[p].index;

      for (let i = 0; i < 4; i++) {
        const c = constData[index + i];
        processData[index + i] = c;
        pixels[index + i] = sRGB.tosRGB(c) * 255;
      }

      p++;
      if (p >= processOrder.length) {
        ProcessManager.changeState('processImage');
        break;
      }

      if (Timing.checkTime()) break;
    }
    updatePixels();

    DOMManager.updateProgress('Restarting', (p / processOrder.length) * 100);

    if (state != 'restart') {
      p = 0;
      DOMManager.updateDOMValues();
    }
  }

  return {
    changeState(s) {
      state = s;

      if (debugStates) console.log('State Change: ' + s);
    },

    draw() {
      switch (state) {
        case 'loadImage':
          loadImageState();
          break;
        case 'saveImage':
          saveImageState();
          break;
        case 'processImage':
          processImageState();
          break;
        case 'restart':
          restartState();
          break;
        default:
          // do nothing
          break;
      }
    }
  }
})()