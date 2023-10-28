const DOMManager = (function () {
  let input;
  let fileImage;

  function positionDOM() {
    let domHeight = 5;
    let width = 5;
    let queryWidth = 5;

    // ----- IMAGE INPUT -----
    input.position(5, domHeight);
    queryWidth = input.width + 5;
    width = width < queryWidth ? queryWidth : width;

    return width;
  }
  return {
    preload() {
      // ----- IMAGE INPUT -----
      input = createFileInput((f) => {
        if (f.type == 'image') {
          fileImage = createImg(f.data, '', 'anonymous', () => {
            const selectedFile = document.getElementById('upload');
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

              ProcessManager.changeState('loadImage');
            });
          });

          fileImage.hide();
        }
      });
      input.id('upload');

      this.domWidth = positionDOM();
    },

    imageInput: 0,

    domWidth: 0,
  }
})()