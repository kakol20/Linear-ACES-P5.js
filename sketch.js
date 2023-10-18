// https://www.toptal.com/developers/javascript-minifier

const Manager = (function () {
	let imgInput = false;
	let process = false;

	let input;
	let img;
	let fileImg;
	let imgIn;

	let x = 0;
	let y = 0;
	let maxSteps = 0;
	let maxTime = 0;

	let fps = 60;

	let ditherFactor = 31;
	let ditherFactorInput;
	let ditherFactorText;
	let ditherBool = true;
	let ditherCheckbox;
	let ditherSelect;

	let restartButton;
	let restarted;

	let acesBool = true;
	let acesCheckbox;

	let kelvinTint = true;
	let kelvinTemp = 5000;
	let kelvinCheckbox;
	let kelvinText;
	let kelvinTempInput;

	// -----

	function positionDom(startHeight) {
		// ----- INPUT -----
		input.position(5, startHeight);

		// ----- RESTART -----
		let domHeight = startHeight + input.height + 5;
		restartButton.position(5, domHeight);
		restartButton.mousePressed(restartChange);

		// ----- ACES ------
		domHeight += restartButton.height + 10;

		acesCheckbox.position(5, domHeight);

		// ----- KELVIN -----
		domHeight += acesCheckbox.height + 10;
		kelvinCheckbox.position(5, domHeight);

		domHeight += kelvinCheckbox.height + 5;
		kelvinText.position(5, domHeight);
		kelvinTempInput.position(kelvinText.width + 25, domHeight);

		// ----- DITHER -----
		domHeight += kelvinTempInput.height + 10;
		ditherCheckbox.position(5, domHeight);

		domHeight += ditherCheckbox.height + 5;
		ditherFactorText.position(5, domHeight);
		ditherFactorInput.position(ditherFactorText.width + 20, domHeight);
	}

	function updateDomValues() {
		ditherFactor = ditherFactorInput.value();
		ditherBool = ditherCheckbox.checked();

		acesBool = acesCheckbox.checked();

		kelvinTint = kelvinCheckbox.checked();
		kelvinTemp = kelvinTempInput.value();
	}

	function GetIndex(x, y, imgWidth) {
		return (x + y * imgWidth) * 4;
	}

	// -----

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
	
		// loadPixels();
		// console.log(pixels);
		// updatePixels();
	
		imgInput = true;
		process = false;
		imgIn = true;
		restarted = false;
	}
	
	function restartChange() {
		console.log("restart");
	
		if (imgIn) {
			imgInput = true;
			process = false;
			restarted = true;
	
			background(0, 0, 0, 0);
		}
	}
	return {
		preload: function () {
			input = createFileInput(handleFile);
			restartButton = createButton("Restart");

			ditherFactorText = createSpan("Dither Factor: ");
			ditherFactorInput = createInput(31, "number");

			ditherCheckbox = createCheckbox(" Toggle Dither", true);
			ditherCheckbox.changed(() => { console.log("Dither toggle: " + ditherCheckbox.checked()); });

			acesCheckbox = createCheckbox(" Toggle ACES", true);
			acesCheckbox.changed(() => { console.log("ACES toggle: " + acesCheckbox.checked()); });

			kelvinCheckbox = createCheckbox(" Toggle Kelvin Tint", false);
			kelvinCheckbox.changed(() => { console.log("Kelvin Tint toggle: " + kelvinCheckbox.checked()); });
			kelvinText = createSpan("Kelvin Temperature: ");
			kelvinTempInput = createInput(5000, "number");

			positionDom(5);
		},

		setup: function () {
			createCanvas(windowWidth, windowHeight);

			// setAttributes('premultipliedAlpha', false);

			loop();
			// noLoop();
		},

		draw: function () {
			if (imgInput === true) {
				// console.log(file);

				if (imgIn) {
					// console.log("----- IMAGE IN -----");

					maxSteps = width * height;
					maxTime = (1 / fps) * 1000;

					updateDomValues();

					positionDom(height + 5);

					loadPixels();

					// img.loadPixels(pixels);
					if (!restarted) {
						img.loadPixels(pixels);
					} else {
						restarted = false;
					}

					for (let x_i = 0; x_i < width; x_i++) {
						for (let y_i = 0; y_i < height; y_i++) {
							const index = img.index(x_i, y_i);

							for (let i = 0; i < 4; i++) {
								let data = img.forOutput(index + i);
								// data = ditherBool ? Dither.bayerSingle(x_i, y_i, data, ditherFactor) : data;

								pixels[index + i] = data * 255;
							}
						}
					}

					updatePixels();

					process = true;
					x = 0;
					y = 0;
				} else {
					alert("Try choosing image again");
				}

				imgInput = false;
			} else if (process && !imgInput) {
				loadPixels();

				const startTime = new Date();
				for (let step = 0; step < maxSteps; step++) {
					const index = GetIndex(x, y, width);

					let col = [img.data[index + 0],
					img.data[index + 1],
					img.data[index + 2],
					img.data[index + 3]];

					if (acesBool) {
						col = LinearACES.ToneMap(col[0], col[1], col[2], col[3]);
					}

					// col.push(img.data[index + 3]); // add alpha

					for (let i = 0; i < 4; i++) {
						if (i < 3) {
							col[i] = sRGB.toSRGB(col[i]);
						}
					}

					if (kelvinTint) {
						col = Kelvin.Tint(col, kelvinTemp);
					}

					if (ditherBool) {
						// col = Dither.bayerArray(x, y, col, ditherFactor);

						// test CMYK
						let cmyk = CMYK.fromRGB(col);
						cmyk = Dither.bayerArray(x, y, cmyk, ditherFactor);

						col = CMYK.toRGB(cmyk);
					}

					for (let i = 0; i < 4; i++) {
						// if (ditherBool) col[i] = Dither.bayerSingle(x, y, col[i], ditherFactor);

						pixels[index + i] = Math.round(col[i] * 255) >>> 0;
					}

					x++;
					if (x >= width) {
						x = 0;
						y++;
					}

					if (y >= height) {
						// console.log("----- PROCESS -----");

						process = false;

						// console.log(pixels);
						// console.log(img);

						console.log("-----PROCESS DONE -----");
						alert("Process Done");
						break;
					}

					const currTime = new Date();
					const elapseTime = currTime - startTime;
					if (elapseTime >= maxTime) break;
				}

				updatePixels();
			}
		}
	}
})();

function preload() {
	Manager.preload();
}

function setup() {
	Manager.setup();
}

function draw() {
	Manager.draw();
}