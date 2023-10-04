const sRGB = (function () {
	return {
		toSRGB: (v) => Math.pow(v, 1 / 2.2),
		toLinear: (v) => Math.pow(v, 2.2)
	}
})();