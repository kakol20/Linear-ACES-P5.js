const DOMManager = (function () {
  let progressSpan;

  let input;
  let fileImage;

  function positionDOM() {
    function queryWidth(w, qw) {
      return w < qw ? qw : w;
    }

    let domHeight = 5;
    let _width = 5;
    
    // ----- PROGRESS -----
    progressSpan.position(5, domHeight);
    domHeight += progressSpan.height + 10;

    _width = queryWidth(_width, progressSpan.width + 5);

    // ----- IMAGE INPUT -----
    input.position(5, domHeight);
    domHeight += input.height + 5;

    _width = queryWidth(_width, input.width + 5);

    return _width;
  }
  return {
    updateProgress(s, p) {
      progressSpan.html(s + ": " + Math.round(p) + "%");
    },

    preload() {
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

              resizeCanvas(loaded.width, loaded.height);
              this.imageInput = loaded;

              background(28, 28, 28, 0);
              image(loaded, 0, 0);

              ProcessManager.changeState("loadImage");
            });
          });

          fileImage.hide();
        }
      });
      input.id("upload");

      this.domWidth = positionDOM();
    },

    imageInput: 0,

    domWidth: 0,
  }
})()