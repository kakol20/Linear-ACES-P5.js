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
	let ditherSelectValue;

	let restartButton;
	let restarted;

	let acesBool = true;
	let acesCheckbox;

	let kelvinTint = true;
	let kelvinTemp = 5000;
	let kelvinCheckbox;
	let kelvinText;
	let kelvinTempInput;

	let progressSpan;

	let resizeCheckbox;
	let resizeBool;
	let resizeMethodSelect;
	let resizeMethodValue;

	// -----

	function positionDom(startHeight) {
		let domHeight = startHeight;

		// ----- PROGRESS ------
		progressSpan.position(5, domHeight);

		// ----- INPUT -----
		domHeight += progressSpan.height + 10;
		input.position(4, domHeight);

		// ----- RESTART -----
		domHeight += input.height + 5;
		restartButton.position(5, domHeight);

		// ----- RESIZE -----
		domHeight += restartButton.height + 10;
		resizeCheckbox.position(5, domHeight);

		domHeight += resizeCheckbox.height + 5;
		resizeMethodSelect.position(6, domHeight);

		// ----- ACES ------
		domHeight += restartButton.height + 15;
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

		domHeight += ditherFactorInput.height + 5;
		ditherSelect.position(5, domHeight);
	}

	function updateDomValues() {
		ditherFactor = ditherFactorInput.value();
		ditherBool = ditherCheckbox.checked();

		acesBool = acesCheckbox.checked();

		kelvinTint = kelvinCheckbox.checked();
		kelvinTemp = kelvinTempInput.value();

		ditherSelectValue = ditherSelect.value();

		resizeBool = resizeCheckbox.checked();
		resizeMethodValue = resizeMethodSelect.value();
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
		updateDomValues();

		const selectedFile = document.getElementById("upload");
		const imageFile = selectedFile.files[0];
		let imgURL = URL.createObjectURL(imageFile);

		loadImage(imgURL, loaded => {
			if (resizeBool) {
				if (resizeMethodValue === "Fit Width") {
					loaded.resize(windowWidth, 0);
				} else if (resizeMethodValue === "Fit Height") {
					loaded.resize(0, windowHeight);
				} else if (resizeMethodValue === "Fit If Large") {
					if (loaded.width > windowWidth || loaded.height > windowHeight) {
						let arI = loaded.width / loaded.height;
						let arW = windowWidth / windowHeight;

						if (arI > arW) {
							loaded.resize(windowWidth, 0);
						} else if (arI < arW) {
							loaded.resize(0, windowHeight);
						} else {
							loaded.resize(windowWidth, 0);
						}
					}
				} else if (resizeMethodValue === "Fit Window") {
					let arI = loaded.width / loaded.height;
					let arW = windowWidth / windowHeight;

					if (arI > arW) {
						loaded.resize(windowWidth, 0);
					} else if (arI < arW) {
						loaded.resize(0, windowHeight);
					} else {
						loaded.resize(windowWidth, 0);
					}
				}
			}

			resizeCanvas(loaded.width, loaded.height);

			img = new ImgWrap(width, height, ColorSpace.sRGB);

			background(28, 28, 28, 0);
			image(loaded, 0, 0);

			imgInput = true;
			process = false;
			imgIn = true;
			restarted = false;
		});
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

	function GetProgress() {
		const currIndex = GetIndex(x, y, width) + 3;
		return "Progress: " + Math.floor((currIndex / img.size) * 100) + "%";
	}

	return {
		preload() {
			input = createFileInput(handleFile);
			input.id("upload");

			restartButton = createButton("Restart");
			restartButton.mousePressed(restartChange);

			ditherFactorText = createSpan("Dither Factor: ");
			ditherFactorInput = createInput(31, "number");

			ditherCheckbox = createCheckbox(" Toggle Dither", true);
			ditherCheckbox.changed(() => { console.log("Dither toggle: " + ditherCheckbox.checked()); });

			ditherSelect = createSelect();
			ditherSelect.option("RGB");
			ditherSelect.option("HSV");
			ditherSelect.option("CMYK");
			ditherSelect.selected("RGB");
			ditherSelect.changed(() => { console.log("Dither Select: " + ditherSelect.value()); });

			acesCheckbox = createCheckbox(" Toggle ACES", true);
			acesCheckbox.changed(() => { console.log("ACES toggle: " + acesCheckbox.checked()); });

			kelvinCheckbox = createCheckbox(" Toggle Kelvin Tint", false);
			kelvinCheckbox.changed(() => { console.log("Kelvin Tint toggle: " + kelvinCheckbox.checked()); });
			kelvinText = createSpan("Kelvin Temperature: ");
			kelvinTempInput = createInput(5000, "number");

			progressSpan = createSpan("Progress: ");

			resizeCheckbox = createCheckbox(" Toggle Resize", true);
			resizeCheckbox.changed(() => { console.log("Resize Toggle: " + resizeCheckbox.checked()); });

			resizeMethodSelect = createSelect();
			resizeMethodSelect.option("Fit If Large");
			resizeMethodSelect.option("Fit Window");
			resizeMethodSelect.option("Fit Width");
			resizeMethodSelect.option("Fit Height");
			resizeMethodSelect.selected("Fit If Large");
			resizeMethodSelect.changed(() => { console.log("Resize Method: " + resizeMethodSelect.value()); });

			positionDom(5);
		},

		setup() {
			pixelDensity(1);
			createCanvas(windowWidth, windowHeight);

			// setAttributes('premultipliedAlpha', false);

			loop();
			// noLoop();
		},

		draw() {
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

				// load progress
				progressSpan.html(GetProgress());

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

						if (ditherSelectValue === "CMYK") {
							let cmyk = CMYK.fromRGB(col);
							cmyk = Dither.bayerArray(x, y, cmyk, ditherFactor);
							col = CMYK.toRGB(cmyk);
						} else if (ditherSelectValue === "HSV") {
							let hsv = HSV.fromRGB(col);
							hsv = Dither.bayerArray(x, y, hsv, ditherFactor);
							col = HSV.toRGB(hsv);
						} else {
							col = Dither.bayerArray(x, y, col, ditherFactor);
						}
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

						progressSpan.html(GetProgress());

						console.log("-----PROCESS DONE -----");
						// alert("Process Done");
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