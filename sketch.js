function preload() {
}

function GetIndex(x, y, imgWidth) {
  return (x + y * imgWidth) * 4;
}

let imgInput = false;

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


      background(28);
      image(fileImg, 0, 0);
    } else {
      fileImg = null;
    }

    imgInput = false;
  }
}

function handleFile(f) {

  imgInput = true;
  // console.log(file);

  file = f;
  fileImg = createImg(file.data, '');

  // console.log(fileImg);
  // console.log(fileImg.width);

  fileImg.hide();

  file = f;
}