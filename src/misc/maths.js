class MathCustom {
  static NRoot(v, n) {
    let out = v;
    const exp = 1 / n;
    if (n % 1. === 0.) {
      out = Math.pow(out, exp);
    }
    else {
      let absroot = Math.pow(Math.abs(out), exp);
      if (out < 0.) absroot *= -1.;
      out = absroot;
    }
    return out;
  }

  static UnsignedMod(numer, denom) {
    return ((numer % denom) + denom) % denom;
  }

  static Round(numer, places = 0) {
    const mult = Math.max(places, 0) === 0 ? 1 : Math.pow(10, places);
    return Math.round((numer + Number.EPSILON) * mult) / mult;
  }

  static Lerp(a, b, t) {
    return ((b - a) * t) + a;
  }

  static TAU = Math.PI * 2;
  static DegToRad = Math.PI / 180;
  static RadToDeg = 180 / Math.PI;
}