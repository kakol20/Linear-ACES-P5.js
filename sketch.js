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

function setup() {
  input = createFileInput(handleFile);
  input.position(0, 0);

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
        loadPixels();

        img.loadPixels(pixels);

        updatePixels();

        console.log(img);
      }

      
    } else {
      fileImg = null;
    }

    process = true;
    imgInput = false;
  } else if (process && !imgInput) {
    
  }
}

function handleFile(f) {

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