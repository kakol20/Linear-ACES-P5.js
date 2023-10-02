let imgInput = false;
let process = false;

let input;
let img;
var fileImg;
// let file;

let x = 0;
let y = 0;
let steps = 0;

let factor = 31;
let factorInput;
let factorText;

function preload() {
    input = createFileInput(handleFile);
    input.position(5, 5);

    factorText = createSpan("Factor: ");
    factorInput = createInput(31, "number");

    factorText.position(5, 5 + input.height + 5);
    factorInput.position(5 + factorText.width + 10, 5 + input.height + 5);
}

function GetIndex(x, y, imgWidth) {
    return (x + y * imgWidth) * 4;
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    loop();
    // noLoop();
}

function draw() {
    if (imgInput === true) {
        // console.log(file);

        if (imgInput) {
            if (width > 0 && height > 0) {
                console.log("----- IMAGE IN -----");

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

                        pixels[index + 3] = Dither.bayerSingle(x_i, y_i, img.data[index + 3], factor) * 255;
                    }
                }

                updatePixels();

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
                if (i < 3) {
                    col[i] = sRGB.toSRGB(col[i]);
                }

                col[i] = Dither.bayerSingle(x, y, col[i], factor);

                pixels[index + i] = col[i] * 255;
            }

            pixels[index + 3] = Dither.bayerSingle(x, y, img.data[index + 3], factor) * 255;

            x++;
            if (x >= width) {
                x = 0;
                y++;
            }

            if (y >= height) {
                console.log("----- PROCESS -----");

                process = false;

                console.log(pixels);
                console.log(img);
                break;
            }
        }

        updatePixels();
    }
}

function handleFile(f) {
    // console.log(f);
    if (f.type == 'image') {
        fileImg = createImg(f.data, '', 'anonymous', imgReadSuccess);

        fileImg.hide();
    }
}

function imgReadSuccess() {
    resizeCanvas(fileImg.width, fileImg.height);

    img = new ImgWrap(width, height, ColorSpace.sRGB);

    background(28, 28, 28, 0);
    image(fileImg, 0, 0);

    loadPixels();
    console.log(pixels);
    updatePixels();

    imgInput = true;
    process = false;
}

// function factorHandle() {
//   factor = this.value();
// }