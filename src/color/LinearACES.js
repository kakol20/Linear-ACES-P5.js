const LinearACES = (function () {
  function inputMat(rgba) {
    let v = createVector(rgba[0], rgba[1], rgba[2]);

    let r_m = createVector(0.59719, 0.35458, 0.04823);
    let g_m = createVector(0.07600, 0.90834, 0.01566);
    let b_m = createVector(0.02840, 0.13383, 0.83777);

    return [
      r_m.dot(v),
      g_m.dot(v),
      b_m.dot(v),
      rgba[3]
    ];
  };

  function outputMat(rgba) {
    let v = createVector(rgba[0], rgba[1], rgba[2]);

    let r_m = createVector(1.60475, -0.53108, -0.0736);
		let g_m = createVector(-0.10208, 1.10813, -0.00605);
		let b_m = createVector(-0.00327, -0.07276, 1.07602);

    return [
      r_m.dot(v),
      g_m.dot(v),
      b_m.dot(v),
      rgba[3]
    ];
  };

  function RRT_ODT(v) {
		let a = v * (v + 0.0245786) - 0.000090537;
		let b = v * (0.983729 * v + 0.4329510) + 0.238081;
		return a / b;
	}

  return {
    ToneMap(rgba) {
      let out = inputMat(rgba);

      for (let i = 0; i < 3; i++) {
        out[i] = RRT_ODT(out[i]);
      }

      out = outputMat(out);

      for (let i = 0; i < 3; i++) {
        out[i] = out[i] < 0 ? 0 : out[i];
        out[i] = out[i] > 1 ? 1 : out[i];
      }

      return out;
    }
  }
})()