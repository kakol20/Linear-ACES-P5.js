const DOMManager = (function () {
  let progressSpan;

  let input;
  let fileImage;

  let restartButton;

  let acesCheckbox;

  let skewRotationCheckbox;
  let skewRotationInput;

  let haveImage = false;

  function positionDOM(startHeight = 5) {
    function queryWidth(w, qw) {
      return w < qw ? qw : w;
    }

    let domHeight = startHeight;
    let _width = 5;

    // ----- PROGRESS -----
    progressSpan.size(200);
    progressSpan.position(5, domHeight);
    domHeight += progressSpan.height + 10;
    _width = queryWidth(_width, progressSpan.width);

    // ----- IMAGE INPUT -----
    input.size(200);
    input.position(5, domHeight);
    domHeight += input.height + 5;
    _width = queryWidth(_width, input.width);

    // ----- RESTART BUTTON -----
    restartButton.position(5, domHeight);
    domHeight += restartButton.height + 10;
    _width = queryWidth(_width, restartButton.width);

    // ----- LINEAR ACES TOGGLE -----
    acesCheckbox.size(_width);
    acesCheckbox.position(5, domHeight);
    domHeight += acesCheckbox.height + 10;
    _width = queryWidth(_width, acesCheckbox.width);

    // ----- SKEW ROTATION -----
    skewRotationCheckbox.size(_width);
    skewRotationCheckbox.position(5, domHeight);
    domHeight += skewRotationCheckbox.height + 5;
    _width = queryWidth(_width, skewRotationCheckbox.width);

    skewRotationInput.position(5, domHeight);
    domHeight += skewRotationInput.height + 10;
    _width = queryWidth(_width, skewRotationInput.width);

    // console.log(restartButton.width);

    return _width;
  }
  return {
    acesBool: false,

    skewRotationBool: false,
    skewRotationAngle: 45,

    updateDOMValues() {
      this.acesBool = acesCheckbox.checked();

      this.skewRotationBool = skewRotationCheckbox.checked();
      this.skewRotationAngle = skewRotationInput.value() * (Math.PI / 180 * -1);
    },

    updateProgress(s, p) {
      progressSpan.html(s + ": " + Math.round(p) + "%");
    },

    preload() {
      haveImage = false

      // ----- PROGRESS -----
      progressSpan = createSpan("Progress: ");

      // ----- IMAGE INPUT -----
      input = createFileInput((f) => {
        if (f.type == "image") {
          fileImage = createImg(f.data, "", "anonymous", () => {
            const selectedFile = document.getElementById("upload");
            const imageFile = selectedFile.files[0];
            let imageURL = URL.createObjectURL(imageFile);

            loadImage(imageURL, (loaded) => {
              this.domWidth = positionDOM();

              // Resize
              if (windowWidth > windowHeight) {
                // landscape orientation
                this.domWidth = positionDOM();
                MainManager.canvas.position(DOMManager.domWidth, 0);

                if (loaded.width > windowWidth - this.domWidth || loaded.height > windowHeight) {
                  let arI = loaded.width / loaded.height;
                  let arW = (windowWidth - this.domWidth) / windowHeight;

                  if (arI > arW) {
                    loaded.resize(windowWidth - this.domWidth, 0);
                  } else if (arI < arW) {
                    loaded.resize(0, windowHeight);
                  } else {
                    loaded.resize(windowWidth - this.domWidth, 0);
                  }
                }
              } else {
                // potrait orientation

                if (loaded.width > windowWidth || loaded.height > windowHeight) {
                  let arI = loaded.width / loaded.height;
                  let arW = (windowWidth) / windowHeight;

                  if (arI > arW) {
                    loaded.resize(windowWidth, 0);
                  } else if (arI < arW) {
                    loaded.resize(0, windowHeight);
                  } else {
                    loaded.resize(windowWidth, 0);
                  }
                }

                MainManager.canvas.position(0, 0);
                this.domWidth = positionDOM(loaded.height + 5);
              }

              resizeCanvas(loaded.width, loaded.height);
              this.imageInput = loaded;

              background(28, 28, 28, 0);
              image(loaded, 0, 0);

              ProcessManager.changeState("loadImage");

              haveImage = true;
            });
          });

          fileImage.hide();
        }
      });
      input.id("upload");

      // ----- RESTART BUTTON -----
      restartButton = createButton("Restart");
      restartButton.mousePressed(() => {
        if (haveImage) {
          ProcessManager.changeState("restart");
        }
      });

      // ----- ACES TONEMAP -----
      acesCheckbox = createCheckbox(" Toggle ACES", true);
      acesCheckbox.changed(() => { console.log("ACES toggle: " + acesCheckbox.checked()) });

      // ----- SKEW ROTATION -----
      skewRotationCheckbox = createCheckbox(" Toggle Skew Rotation", true);
      skewRotationCheckbox.changed(() => {
        console.log("ACES toggle: " + skewRotationCheckbox.checked());
      });
      skewRotationInput = createInput(45, "number");

      this.domWidth = positionDOM();
    },

    imageInput: 0,

    domWidth: 0,
  }
})()