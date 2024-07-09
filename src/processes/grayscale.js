const Grayscale = (function () {
  return {
    run(index) {
      let r = pixels[index + 0];
      let g = pixels[index + 1];
      let b = pixels[index + 2];

      let rgb = new sRGB(r / 255, g / 255, b / 255);
      let lab = OkLab.sRGBtoOkLab(rgb);
      lab.a = 0;
      lab.b = 0;

      rgb = OkLab.OkLabtosRGB(lab);
      rgb.clamp();

      pixels[index + 0] = rgb.r * 255;
      pixels[index + 1] = rgb.g * 255;
      pixels[index + 2] = rgb.b * 255;
    }
  }
})();