const HSV = (function() {
  return {
    toRGB: function(h, s, v) {
      const H = (((h * 360) % 360) + 360) % 360;
      const C = v * s;
      const X = C * (1 - Math.abs(((H / 60.0) % 2) - 1));
      const m = v - C;
      
      let out = [];
      if (H < 60) {
        out = [C, X, 0];
      } else if (H < 120) {
        out = [X, C, 0];
      } else if (H < 180) {
        out = [0, C, X];
      } else if (H < 240) {
        out = [0, X, C];
      } else if (H < 300) {
        out = [X, 0, C];
      } else {
        out = [C, 0, X];
      }
      
      out[0] += m;
      out[1] += m;
      out[2] += m;
      return out;
    }
  }
})();