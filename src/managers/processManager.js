const ProcessManager = (function () {
  let state = 'nothing';

  const maxFPS = 60;
  const maxTime = 1000 / maxFPS;

  let x, y;

  let constData = [];
  let interData = [];
  let processData = [];
  // let processOrder = [];

  const debugStates = true;

  function GetIndex(x, y, w, c) {
    return (x + y * w) * c;
  }

  function GetImageSize(w, h, c) {
    return w * h * c;
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

      // processOrder.push({ index: index, x: x, y: y });

      for (let i = 0; i < 4; i++) {
        // Normalize to 0-1
        let c = pixels[index + i] / 255.0;
        if (i != 3) {
          c = sRGB.toLinear(c);
        }

        constData.push(c);
        processData.push(c);
        interData.push(c);
      }

      x++;
      if (x >= width) {
        x = 0;
        y++;
      }
      if (y >= height) {
        ProcessManager.changeState('processImage');
        x = 0;
        y = 0;
        break;
      }

      if (Timing.checkTime()) break;
    }
    DOMManager.updateProgress('Loading', (GetIndex(x, y, width, 4) / GetImageSize(width, height, 4)) * 100);

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
      const index = GetIndex(x, y, width, 4);

      // x = processOrder[p].x, y = processOrder[p].y;

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
        interData[index + i] = c[i];
        pixels[index + i] = c[i] * 255;
      }

      // ----- END PROCESS -----

      // p++;
      // if (p >= processOrder.length) {
      //   ProcessManager.changeState('end');
      //   break;
      // }

      x++;
      if (x >= width) {
        x = 0;
        y++;
      }
      if (y >= height) {
        if (DOMManager.skewRotationBool) {
          SkewRotation.calculateValues();

          ProcessManager.internalState = 0;
          ProcessManager.changeState('skew');
        } else {
          ProcessManager.changeState('end');
        }

        break;
      }

      if (Timing.checkTime()) break;
    }
    updatePixels();

    DOMManager.updateProgress('Processing', (GetIndex(x, y, width, 4) / GetImageSize(width, height, 4)) * 100);

    if (state != 'processImage') {
      x = 0;
      y = 0;
    }
  }

  function restartState() {
    Timing.start();

    loadPixels();
    while (true) {
      const index = GetIndex(x, y, width, 4);

      for (let i = 0; i < 4; i++) {
        const c = constData[index + i];
        processData[index + i] = c;
        interData[index + i] = c;
        pixels[index + i] = sRGB.tosRGB(c) * 255;
      }

      x++;
      if (x >= width) {
        x = 0;
        y++;
      }
      if (y >= height) {
        x = 0;
        y = 0;

        ProcessManager.changeState('processImage');
        break;
      }


      if (Timing.checkTime()) break;
    }
    updatePixels();

    DOMManager.updateProgress('Processing', (GetIndex(x, y, width, 4) / GetImageSize(width, height, 4)) * 100);

    if (state != 'restart') {
      x = 0;
      y = 0;
      DOMManager.updateDOMValues();
    }
  }

  const SkewRotation = (function () {
    let AC = 0;
    let B = 0;

    function customMod(a, b) {
      return ((a % b) + b) % b;
    }

    function movePixels(oldI, newI) {
      for (let i = 0; i < 4; i++) {
        const c = interData[newI + i];
        processData[oldI + i] = c;
        pixels[oldI + i] = c * 255;
      }
    }

    function skewX() {
      Timing.start();

      loadPixels();
      while (true) {
        const index = GetIndex(x, y, width, 4);

        let newX = x - Math.round(width / 2);
        const newY = y - Math.round(height / 2);

        newX += Math.round(AC * newY);
        newX += Math.round(width / 2);
        newX = customMod(newX, width);

        const newIndex = GetIndex(newX, y, width, 4);
        movePixels(index, newIndex);

        x++;
        if (x >= width) {
          x = 0;
          y++;
        }
        if (y >= height) {
          x = 0;
          y = 0;
          this.internalState++;
          // ProcessManager.changeState('end');
          break;
        }

        if (Timing.checkTime()) break;
      }
      updatePixels();

      DOMManager.updateProgress('Processing', (GetIndex(x, y, width, 4) / GetImageSize(width, height, 4)) * 100);
    }

    function skewY() {
      Timing.start();
      loadPixels();
      while (true) {
        const index = GetIndex(x, y, width, 4);

        const newX = x - Math.round(width / 2);
        let newY = y - Math.round(height / 2);

        newY += Math.round(B * newX);
        newY += Math.round(height / 2);
        newY = customMod(newY, height);

        const newIndex = GetIndex(x, newY, width, 4);
        movePixels(index, newIndex);

        y++;
        if (y >= height) {
          y = 0;
          x++;
        }
        if (x >= width) {
          x = 0;
          y = 0;
          this.internalState++;
          break;
        }

        if (Timing.checkTime()) break;
      }
      updatePixels();

      DOMManager.updateProgress('Processing', (GetIndex(y, x, height, 4) / GetImageSize(height, width, 4)) * 100);
    }

    function updateInter() {
      Timing.start();
      while (true) {
        const index = GetIndex(x, y, width, 4);
        for (let i = 0; i < 4; i++) {
          interData[index + i] = processData[index + i];
        }

        x++;
        if (x >= width) {
          x = 0;
          y++;
        }
        if (y >= height) {
          x = 0;
          y = 0;
          this.internalState++;
          // ProcessManager.changeState('end');
          break;
        }

        if (Timing.checkTime()) break;
      }
    }

    return {
      internalState: 0,
      calculateValues() {
        AC = -1 * Math.tan(DOMManager.skewRotationAngle / 2);
        B = Math.sin(DOMManager.skewRotationAngle);

        // this.internalState = 0;
      },

      skew() {
        // states
        // 0 skew x
        // 1 update interData
        // 2 skew y
        // 3 update interData
        // 4 skew X

        switch (this.internalState) {
          case 1:
          case 3:
            updateInter();
            break;
          case 0:
          case 4:
            skewX();
            break;
          case 2:
            skewY();
            break;
          case 5:
          default:
            ProcessManager.changeState('end');
            x = 0;
            y = 0;
            break;
        }

      }
    }
  })();

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
        case 'skew':
          SkewRotation.skew();
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