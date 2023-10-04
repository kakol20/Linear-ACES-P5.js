const ColorSpace = {
	sRGB: "sRGB",
	Linear: "Linear"
}

class ImgWrap {
	constructor(w, h, colorSpace) {
		// this.img = createImage(w, h);

		this.width = w;
		this.height = h;
		this.size = this.width * this.height * 4;

		this.colorSpace = colorSpace;
	}

	loadPixels(pixels) {
		this.data = new Array(this.size);

		for (let i in pixels) {
			this.data[i] = pixels[i] / 255.0;

			if ((i + 1) % 4 > 0) {
				if (this.colorSpace == ColorSpace.sRGB) {
					this.data[i] = sRGB.toLinear(this.data[i]);
				}
			}
		}
	}

	index(x, y) {
		return (x + y * this.width) * 4;
	}

	indexToXY(index) {
		let pixelIndex = Math.floor(index / 4);
		let x = pixelIndex % this.width;
		let y = pixelIndex / this.width;

		return [x, y];
	}

	toBW() {
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				const i = this.index(x, y);

				const l = this.data[i + 0] * 0.2989 +
					this.data[i + 1] * 0.587 +
					this.data[i + 2] * 0.114;

				this.data[i + 0] = l;
				this.data[i + 1] = l;
				this.data[i + 2] = l;
			}
		}
	}

	forOutput(index) {
		let col = this.data[index];

		if (this.colorSpace === ColorSpace.sRGB) {
			if ((index + 1) % 4 > 0) {
				col = sRGB.toSRGB(col);
			}
		}

		return col;
	}
}