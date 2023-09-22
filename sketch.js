let img = 0;

function preload() {
  img = new ImgWrap("assets/cornellBox_bars.png", ColorSpace.sRGB);
}

function GetIndex(x, y, imgWidth) {
  return (x + y * imgWidth) * 4;
}

let x = 0;
let y = 0;
let pixelData = [0];

const factor = 32;
let steps = 0;

const nxtAlpha = 0.1;
const lineCol = [1, 0, 0];

const exposure = 0.534592;

function setup() {
  img.loadPixels();

  // img.toBW();

  const extraHeight = 32 + 32;

  createCanvas(img.width * 2, img.height + extraHeight);

  console.log(windowHeight);

  // frameRate(30);

  steps = width / 2;
  // console.log(steps);

  background(0);

  pixelData = new Array(width * height * 4);

  loadPixels();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const index = GetIndex(x, y, width);
      if (y < height - extraHeight) {
        const imgIndex = GetIndex(x % img.width, y % img.height, img.width);

        for (let i = 0; i < 4; i++) {
          if (i == 3) {
            pixelData[index + i] = 1;
          } else {
            // pixelData[index + i] = ((x % 255) + (y % 255)) / 255;
            // pixelData[index + i] = img.pixels[imgIndex + i] / 255;
            pixelData[index + i] = img.data[imgIndex + i];
          }

          // pixelData[index + i] *= Math.pow(2, ((3 * (x % steps)) / steps) - 0);

          let out = sRGB.toSRGB(pixelData[index + i]);
          out = out > 1 ? 1 : out;

          pixels[index + i] = Dither.bayerSingle(x, y, out, factor) * 255;
        }
      } else if (y < height - (1 * extraHeight) / 2) {
        for (let i = 0; i < 3; i++) {
          pixelData[index + i] = i < 3 ? (x % steps) / steps : 1;
          // pixelData[index + i] = 3 * (x % steps);
          // pixelData[index + i] = sRGB.toLinear(pixelData[index + i]);

          let out = pixelData[index + i];
          out = sRGB.toSRGB(out);
          out = out > 1 ? 1 : out;

          pixels[index + i] = Dither.bayerSingle(x, y, out, factor) * 255;
        }
      } else {
        let hsv = HSV.toRGB((x % steps) / steps, 1, 1);
        for (let i = 0; i < 3; i++) {
          pixelData[index + i] = hsv[i];
          pixelData[index + i] = sRGB.toLinear(pixelData[index + i]);

          let out = pixelData[index + i];
          out = sRGB.toSRGB(out);
          out = out > 1 ? 1 : out;

          pixels[index + i] = Dither.bayerSingle(x, y, out, factor) * 255;
        }
      }
    }
  }
  updatePixels();

  x = width / 2;

  loop();
}

function draw() {
  let stepCount = 0;

  loadPixels();
  for (let stepCount = 0; stepCount < steps; stepCount++) {
    const index = GetIndex(x, y, width);
    const nxtIndex = GetIndex(x, y + 1, width);

    let col = LinearACES.toneMap(
      pixelData[index],
      pixelData[index + 1],
      pixelData[index + 2]
    );

    for (let i = 0; i < 3; i++) {
      col[i] = sRGB.toSRGB(col[i]);
      col[i] = Dither.bayerSingle(x, y, col[i], factor);

      pixels[index + i] = col[i] * 255;

      if (y + 1 < height) {
        let lineC = lineCol[i] * nxtAlpha;
        lineC += sRGB.toSRGB(pixelData[index + i]) * (1 - nxtAlpha);

        pixels[nxtIndex + i] = lineC * 255;
      }
    }

    x++;
    let xStop = steps;
    // xStop /= 2.0;
    if (x >= xStop) {
      y++;
      x = 0;
    }
    if (y >= height) {
      noLoop();
      console.log("Done");
      break;
    }
  }
  updatePixels();
}
