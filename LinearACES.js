// https://github.com/TheRealMJP/BakingLab/blob/master/BakingLab/ACES.hlsl
const LinearACES = (function () {
	const inputMat = function (r, g, b) {
		let rgb = createVector(r, g, b);

		let r_m = createVector(0.59719, 0.35458, 0.04823);
		let g_m = createVector(0.07600, 0.90834, 0.01566);
		let b_m = createVector(0.02840, 0.13383, 0.83777);

		return {
			r: r_m.dot(rgb),
			g: g_m.dot(rgb),
			b: b_m.dot(rgb)
		};
	}

	const outputMat = function (r, g, b) {
		let rgb = createVector(r, g, b);

		let r_m = createVector(1.60475, -0.53108, -0.0736);
		let g_m = createVector(-0.10208, 1.10813, -0.00605);
		let b_m = createVector(-0.00327, -0.07276, 1.07602);

		return {
			r: r_m.dot(rgb),
			g: g_m.dot(rgb),
			b: b_m.dot(rgb)
		};
	}

	const RRT_ODT = function (v) {
		let a = v * (v + 0.0245786) - 0.000090537;
		let b = v * (0.983729 * v + 0.4329510) + 0.238081;
		return a / b;
	}

	return {
		ToneMap: function (r, g, b) {

			const inputM = inputMat(r, g, b);

			r = inputM.r;
			g = inputM.g;
			b = inputM.b;

			r = RRT_ODT(r);
			g = RRT_ODT(g);
			b = RRT_ODT(b);

			const outputM = outputMat(r, g, b);

			r = outputM.r;
			g = outputM.g;
			b = outputM.b;

			r = r > 1 ? 1 : r;
			g = g > 1 ? 1 : g;
			b = b > 1 ? 1 : b;

			r = r < 0 ? 0 : r;
			g = g < 0 ? 0 : g;
			b = b < 0 ? 0 : b;

			return [r, g, b];
		}
	}
})();