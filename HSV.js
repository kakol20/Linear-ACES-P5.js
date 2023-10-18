const HSV = (function () {
	return {
		toRGB(hsv) {
			const H = (((hsv[0] * 360) % 360) + 360) % 360;
			const C = hsv[2] * hsv[1];
			const X = C * (1 - Math.abs(((H / 60.0) % 2) - 1));
			const m = hsv[2] - C;

			let out;
			if (H < 60) {
				out = [C, X, 0, hsv[3]];
			} else if (H < 120) {
				out = [X, C, 0, hsv[3]];
			} else if (H < 180) {
				out = [0, C, X, hsv[3]];
			} else if (H < 240) {
				out = [0, X, C, hsv[3]];
			} else if (H < 300) {
				out = [X, 0, C, hsv[3]];
			} else {
				out = [C, 0, X, hsv[3]];
			}

			out[0] += m;
			out[1] += m;
			out[2] += m;
			return out;
		},

		fromRGB(rgb) {
			let out = [0, 0, 0, rgb[3]];
			const cMax = Math.max(rgb[0], rgb[1], rgb[2]);
			const cMin = Math.min(rgb[0], rgb[1], rgb[2]);
			const delta = cMax - cMin;

			if (delta === 0) {
				out[0] = 0;
			} else if (cMax === rgb[0]) {
				out[0] = 60 * (((rgb[1] - rgb[2]) / delta) % 6);
			} else if (cMax === rgb[1]) {
				out[0] = 60 * (((rgb[2] - rgb[0]) / delta) + 2);
			} else if (cMax === rgb[2]) {
				out[0] = 60 * (((rgb[0] - rgb[1]) / delta) + 4);
			}
			out[0] /= 360;

			if (cMax === 0) {
				out[1] = 0;
			} else {
				out[1] = delta / cMax;
			}

			out[2] = cMax;
			return out;
		}
	}
})();