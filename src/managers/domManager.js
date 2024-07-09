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
      progressSpan = createSpan('Progress:');

      // ----- IMAGE INPUT -----
      haveImage = false;
      input = createFileInput((f) => {
        if (f.type === 'image') {
          fileImage = createImg(f.data, '', 'anonymous', () => {
            const selectedFile = document.getElementById('upload');
            const imageFile = selectedFile.files[0];
            let imageURL = URL.createObjectURL(imageFile);

            loadImage(imageURL, (loaded) => {
              this.domWidth = positionDOM();

              // Resize
              if (windowWidth > windowHeight) {
                // landscape orientation
                this.domWidth = positionDOM();
                MainManager.canvas.position(this.domWidth, 0);

                if (loaded.width > windowWidth - this.domWidth || loaded.height > windowHeight) {
                  let arI = loaded.width / loaded.height;
                  let arW = (windowWidth - this.domWidth) / windowHeight;

                  if (arI > arW) {
                    loaded.resize((windowWidth - this.domWidth) * pixelDensity(), 0);
                  } else if (arI < arW) {
                    loaded.resize(0, windowHeight * pixelDensity());
                  } else {
                    loaded.resize((windowWidth - this.domWidth) * pixelDensity(), 0);
                  }
                } else {
                  // potrait orientation

                  if (loaded.width > windowWidth || loaded.height > windowHeight) {
                    let arI = loaded.width / loaded.height;
                    let arW = (windowWidth) / windowHeight;

                    if (arI > arW) {
                      loaded.resize(windowWidth * pixelDensity(), 0);
                    } else if (arI < arW) {
                      loaded.resize(0, windowHeight * pixelDensity());
                    } else {
                      loaded.resize(windowWidth * pixelDensity(), 0);
                    }
                  }

                  MainManager.canvas.position(0, 0);
                  this.domWidth = positionDOM((loaded.height / pixelDensity()) + 5);
                }

                resizeCanvas(loaded.width / pixelDensity(), loaded.height / pixelDensity());
                this.imageInput = loaded;

                background(28, 28, 28, 0);
                image(loaded, 0, 0, loaded.width / pixelDensity(), loaded.height / pixelDensity());

                ProcessManager.changeState('loadImage');
                haveImage = true;

                // console.log('Loaded Image', loaded);
              }
            });
          });
          fileImage.hide();
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