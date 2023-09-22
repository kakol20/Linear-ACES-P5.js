function preload() {
}

function GetIndex(x, y, imgWidth) {
  return (x + y * imgWidth) * 4;
}

let imgInput = false;
let process = false;

let input;
let img;
let file;

let x = 0;
let y = 0;
let steps = 0;

let factor = 31;
let factorInput;
let factorText;

function setup() {
  input = createFileInput(handleFile);
  input.position(5, 5);

  factorText = createSpan("Factor: ");
  factorInput = createInput(31, "number");

  factorText.position(5, 5 + input.height + 5);
  factorInput.position(5 + factorText.width + 10, 5 + input.height + 5);

  loop();
  // noLoop();

  createCanvas(windowWidth, windowHeight);
}

function draw() {
  if (imgInput === true) {
    console.log("Image in");
    // console.log(file);

    if (file.type === "image") {
      resizeCanvas(fileImg.width, fileImg.height);

      img = new ImgWrap(width, height, ColorSpace.sRGB);

      background(28);
      image(fileImg, 0, 0);

      // loadPixels();

      if (width > 0 && height > 0) {
        steps = width;

        input.position(5, height + 5);
        // factorInput.position(5, height + 5 + input.height + 5);
        factorText.position(5, height + 5 + input.height + 5);
        factorInput.position(5 + factorText.width + 10, height + 5 + input.height + 5);

        factor = factorInput.value();

        loadPixels();

        img.loadPixels(pixels);

        for (let x_i = 0; x_i < width; x_i++) {
          for (let y_i = 0; y_i < height; y_i++) {
            const index = img.index(x_i, y_i);

            for (let i = 0; i < 3; i++) {
              let data = img.data[index + i];
              data = sRGB.toSRGB(data);
              data = Dither.bayerSingle(x_i, y_i, data, factor);

              pixels[index + i] = data * 255;
            }
          }
        }

        updatePixels();

        console.log(img);

        process = true;
        x = 0;
        y = 0;
      } else {
        alert("Try choosing image again");
      }
    }

    imgInput = false;
  } else if (process && !imgInput) {
    loadPixels();
    for (let step = 0; step < steps; step++) {
      const index = GetIndex(x, y, width);

      let col = LinearACES.ToneMap(
        img.data[index + 0],
        img.data[index + 1],
        img.data[index + 2]
      );

      for (let i = 0; i < 3; i++) {
        col[i] = sRGB.toSRGB(col[i]);
        col[i] = Dither.bayerSingle(x, y, col[i], factor);

        pixels[index + i] = col[i] * 255;
      }

      x++;
      if (x >= width) {
        x = 0;
        y++;
      }

      if (y >= height) {
        process = false;
        break;
      }
    }

    updatePixels();
  }
}

function handleFile(f) {
  if (f.type == 'image') {
    imgInput = true;
    process = false
    // console.log(file);

    file = f;
    fileImg = createImg(file.data, '');

    // console.log(fileImg);
    // console.log(fileImg.width);

    fileImg.hide();

    file = f;
  }
}

// function factorHandle() {
//   factor = this.value();
// }