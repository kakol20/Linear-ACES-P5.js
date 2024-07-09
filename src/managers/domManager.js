const DOMManager = (function () {
  let progressSpan = 0;

  let input = 0;
  let fileImage = 0;
  let haveImage = false;

  let grayChecker = 0;

  let restartButton = 0;

  function positionDOM(startHeight = 5) {
    function queryWidth(w, qw) {
      return w < qw ? qw : w;
    }

    let domHeight = startHeight;
    let _width = 5;

    // ----- PROGRESS -----
    progressSpan.size(200, progressSpan.height);
    progressSpan.position(5, domHeight);
    // console.log(progressSpan.height);
    domHeight += progressSpan.height + 10;
    _width = queryWidth(_width, progressSpan.width);

    // ----- IMAGE INPUT -----
    input.size(200, input.height);
    input.position(5, domHeight);
    domHeight += input.height + 5;
    _width = queryWidth(_width, input.width);

    // ----- GRAYSCALE CHECKBOX -----
    grayChecker.size(200, grayChecker.height);
    grayChecker.position(5, domHeight);
    domHeight += grayChecker.height + 5;
    _width = queryWidth(_width, grayChecker.width);

    // ----- RESTART BUTTON -----
    // console.log(restartButton);
    // restartButton.size(200, restartButton.height);
    restartButton.position(5, domHeight);
    domHeight += restartButton.height + 5;
    _width = queryWidth(_width, restartButton.width);

    // console.log(_width, domHeight);

    return _width;
  }
  return {
    domWidth: 0,
    imageInput: 0,

    grayscaleBool: false,

    updateDOMValues() {
      this.grayscaleBool = grayChecker.checked();
    },

    updateProgress(s, p) {
      progressSpan.html(s + ": " + Math.round(p) + "%");
    },

    preload() {
      progressSpan = createSpan('Progress');

      // ----- IMAGE INPUT -----
      haveImage = false;
      // https://editor.p5js.org/creativecoding/sketches/-Ut0EeXZj
      input = createFileInput((file) => {
        haveImage = false;
        if (file.type === 'image') {
          this.imageInput = createImg(file.data, 'Alt text', 'anonymous', () => {
            // ----- LOAD IMAGE -----
            this.imageInput.hide();
            let g = createGraphics(this.imageInput.elt.width, this.imageInput.elt.height);
            g.image(this.imageInput, 0, 0);
            this.imageInput.remove();
            this.imageInput = g.get(0, 0, g.width, g.height);

            // ----- RESIZE IMAGE -----
            this.domWidth = positionDOM();
            if (windowWidth > windowHeight) {
              // landscape orientation
              if (this.imageInput.width > windowWidth - this.domWidth || this.imageInput.height > windowHeight) {
                const arI = this.imageInput.width / this.imageInput.height;
                const arW = (windowWidth - this.domWidth) / windowHeight;

                if (arI > arW) {
                  this.imageInput.resize((windowWidth - this.domWidth) * pixelDensity(), 0);
                } else if (arI < arW) {
                  this.imageInput.resize(0, windowHeight * pixelDensity());
                } else {
                  this.imageInput.resize((windowWidth - this.domWidth) * pixelDensity(), 0);
                }
              } else {
                this.imageInput.resize(this.imageInput.width * pixelDensity(), this.imageInput.height * pixelDensity());
              }

              MainManager.canvas.position(this.domWidth, 0);
              // this.domWidth = positionDOM((this.imageInput.height / pixelDensity()) + 5);
            } else {
              // portrait orientation
              if (this.imageInput.width > windowWidth || this.imageInput.height > windowHeight) {
                const arI = this.imageInput.width / this.imageInput.height;
                const arW = windowWidth / windowHeight;

                if (arI > arW) {
                  this.imageInput.resize(windowWidth * pixelDensity(), 0);
                } else if (arI < arW) {
                  this.imageInput.resize(0, windowHeight * pixelDensity());
                } else {
                  this.imageInput.resize(windowWidth * pixelDensity(), 0);
                }
              } else {
                this.imageInput.resize(this.imageInput.width * pixelDensity(), this.imageInput.height * pixelDensity());
              }

              MainManager.canvas.position(0, 0);
              this.domWidth = positionDOM((this.imageInput.height / pixelDensity()) + 5);
            }

            resizeCanvas(this.imageInput.width / pixelDensity(), this.imageInput.height / pixelDensity());

            background(28, 28, 28, 0);
            image(this.imageInput, 0, 0, width, height);

            ProcessManager.changeState('loadImage');
            haveImage = true;
          });
          this.imageInput.hide();
        } else {
          this.imageInput = null;
        }
      });
      input.id('upload');

      // ----- GRAYSCALE CHECKBOX -----
      grayChecker = createCheckbox(' Toggle Grayscale', false);
      grayChecker.changed(() => { console.log('Grayscale toggle', grayChecker.checked()); });


      // ----- RESTART BUTTON -----
      restartButton = createButton('Restart');
      restartButton.mousePressed(() => { if (haveImage) ProcessManager.changeState('restart'); });
    },

    setup() {
      this.domWidth = positionDOM();
    }
  }
})()