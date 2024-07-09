class sRGB {
  constructor(r = 0, g = 0, b = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  clamp() {
    this.r = Math.max(Math.min(this.r, 1), 0);
    this.g = Math.max(Math.min(this.g, 1), 0);
    this.b = Math.max(Math.min(this.b, 1), 0);
  }

  get isInside() {
    return this.r <= 1 && this.r >= 0 && this.g <= 1 && this.g >= 0 && this.b <= 1 && this.b >= 0
  }

  get p5Color() {
    const red = Math.min(Math.max(Math.round(this.r * 255), 0), 255);
    const green = Math.min(Math.max(Math.round(this.g * 255), 0), 255);
    const blue = Math.min(Math.max(Math.round(this.b * 255), 0), 255);
    return color(red, green, blue);
  }

  copy() {
    return new sRGB(this.r, this.g, this.b);
  }

  mult(s) {
    this.r *= s;
    this.g *= s;
    this.b *= s;
  }
  add(other) {
    this.r += other.r;
    this.g += other.g;
    this.b += other.b;
  }
  sub(other) {
    this.r -= other.r;
    this.g -= other.g;
    this.b -= other.b;
  }

  static mix(rgb1, rgb2, t) {
    let out = rgb2.copy();
    out.sub(rgb1);
    out.mult(t);
    out.add(rgb1);
    return out.copy();
  }

  get CSSColor() {
    let rVal = Math.round(Math.max(Math.min(this.r, 1), 0) * 255);
    let gVal = Math.round(Math.max(Math.min(this.g, 1), 0) * 255);
    let bVal = Math.round(Math.max(Math.min(this.b, 1), 0) * 255);
    return 'rgb(' + rVal + ',' + gVal + ',' + bVal + ')';
  }

  static HexTosRGB(hex) {
    const hexStr = hex.substring(1);
    const hexInt = Number('0x' + hexStr);

    const rMask = 0xFF0000;
    const gMask = 0x00FF00;
    const bMask = 0x0000FF;

    const rVal = ((hexInt & rMask) >> 16) / 255;
    const gVal = ((hexInt & gMask) >> 8) / 255;
    const bVal = (hexInt & bMask) / 255;

    return new sRGB(rVal, gVal, bVal);
  }
}

class OkLab {
  constructor(l = 0, a = 0, b = 0) {
    this.l = l;
    this.a = this.l <= 0 || this.l >= 1 ? 0 : a;
    this.b = this.l <= 0 || this.l >= 1 ? 0 : b;
  }

  scalar(s) {
    this.l *= s;
    this.a *= s;
    this.b *= s;
  }

  add(otherLab) {
    this.l += otherLab.l;
    this.a += otherLab.a;
    this.b += otherLab.b;
  }

  sub(otherLab) {
    this.l -= otherLab.l;
    this.a -= otherLab.a;
    this.b -= otherLab.b;
  }

  copy() {
    return new OkLab(this.l, this.a, this.b);
  }

  fallback(maxIter = 10) {
    let lch = OkLCh.LabToLCh(this);
    lch.fallback(maxIter);

    const lab = OkLCh.LChToLab(lch);
    this.l = lab.l;
    this.a = lab.a;
    this.b = lab.b;
  }

  get CSSColor() {
    const l = Math.max(Math.min(this.l, 1), 0);
    return 'oklab(' + MathCustom.Round(l, 3) + ', ' + MathCustom.Round(this.a, 3) + ', ' + MathCustom.Round(this.b, 3) + ')';
  }

  get p5Color() {
    let out = OkLab.OkLabtosRGB(this);
    return out.p5Color;
  }

  get isInside() {
    const rgb = OkLab.OkLabtosRGB(this);
    return rgb.isInside;
  }

  static mix(lab1, lab2, t) {
    let out = lab2.copy();
    out.sub(lab1);
    out.mult(t);
    out.add(lab1);

    return out.copy();
  }

  static lerp(a, b, t) {
    return new OkLab(MathCustom.Lerp(a.l, b.l, t), MathCustom.Lerp(a.a, b.a, t), MathCustom.Lerp(a.b, b.b, t))
  }

  static sRGBtoOkLab(srgb) {
    // to reduce floating point error
    if (srgb.r === 1 && srgb.g === 1 && srgb.b === 1) return new OkLab(1, 0, 0);
    if (srgb.r === 0 && srgb.g === 0 && srgb.b === 0) return new OkLab(0, 0, 0);

    if (srgb.r === srgb.g && srgb.r === srgb.b) {
      // if graycale - can skip some conversions

      // to Linear RGB
      let v = srgb.r <= 0.04045 ? srgb.r / 12.92 : Math.pow((srgb.r + 0.055) / 1.055, 2.4);

      // to LMS - can skip "to Linear LMS" conversion
      v = Math.cbrt(v);

      // can skip "to OkLab" conversion
      return new OkLab(v, 0, 0);
    } else {
      let l1 = srgb.r;
      let a1 = srgb.g;
      let b1 = srgb.b;

      // to Linear RGB
      l1 = l1 <= 0.04045 ? l1 / 12.92 : Math.pow((l1 + 0.055) / 1.055, 2.4);
      a1 = a1 <= 0.04045 ? a1 / 12.92 : Math.pow((a1 + 0.055) / 1.055, 2.4);
      b1 = b1 <= 0.04045 ? b1 / 12.92 : Math.pow((b1 + 0.055) / 1.055, 2.4);

      // to LMS
      let l2 = 0.4122214708 * l1 + 0.5363325363 * a1 + 0.0514459929 * b1;
      let a2 = 0.2119034982 * l1 + 0.6806995451 * a1 + 0.1073969566 * b1;
      let b2 = 0.0883024619 * l1 + 0.2817188376 * a1 + 0.6299787005 * b1;

      // to Linear LMS
      l1 = Math.cbrt(l2);
      a1 = Math.cbrt(a2);
      b1 = Math.cbrt(b2);

      // to OkLab
      l2 = 0.2104542553 * l1 + 0.7936177850 * a1 - 0.0040720468 * b1;
      a2 = 1.9779984951 * l1 - 2.4285922050 * a1 + 0.4505937099 * b1;
      b2 = 0.0259040371 * l1 + 0.7827717662 * a1 - 0.8086757660 * b1;

      return new OkLab(l2, a2, b2);
    }
  }

  static OkLabtosRGB(lab) {
    // to reduce floating point error
    if (lab.l === 1) return new sRGB(1, 1, 1);
    if (lab.l === 0) return new sRGB(0, 0, 0);

    if (lab.a === 0 && lab.b === 0) {
      // if graycale - can skip some conversions

      // to Linear LMS - can skip "to LMS" conversion
      let v = lab.l * lab.l * lab.l;

      // to sRGB - can skip "to Linear RGB" conversion
      v = v <= 0.00313058 ? 12.92 * v : (MathCustom.NRoot(v, 2.4) * 1.055) - 0.055;

      return new sRGB(v, v, v);
    } else {
      let r1 = lab.l;
      let g1 = lab.a;
      let b1 = lab.b

      // to Linear LMS
      let r2 = r1 + 0.3963377774 * g1 + 0.2158037573 * b1;
      let g2 = r1 - 0.1055613458 * g1 - 0.0638541728 * b1;
      let b2 = r1 - 0.0894841775 * g1 - 1.2914855480 * b1;

      // to LMS
      r1 = r2 * r2 * r2;
      g1 = g2 * g2 * g2;
      b1 = b2 * b2 * b2;

      // to Linear RGB
      r2 = 4.0767416621 * r1 - 3.3077115913 * g1 + 0.2309699292 * b1;
      g2 = -1.2684380046 * r1 + 2.6097574011 * g1 - 0.3413193965 * b1;
      b2 = -0.0041960863 * r1 - 0.7034186147 * g1 + 1.7076147010 * b1;

      // to sRGB
      r1 = r2 <= 0.00313058 ? 12.92 * r2 : (MathCustom.NRoot(r2, 2.4) * 1.055) - 0.055;
      g1 = g2 <= 0.00313058 ? 12.92 * g2 : (MathCustom.NRoot(g2, 2.4) * 1.055) - 0.055;
      b1 = b2 <= 0.00313058 ? 12.92 * b2 : (MathCustom.NRoot(b2, 2.4) * 1.055) - 0.055;

      return new sRGB(r1, g1, b1);
    }
  }
}

class OkLCh {
  constructor(l = 0, c = 0, h = 0) {
    this.l = l;
    this.c = this.l <= 0 || this.l >= 1 ? 0 : c;
    this.h = this.c <= 0 ? 0 : h;
  }

  static LabToLCh(lab) {
    // to reduce floating point error
    if (lab.l === 1) return new OkLCh(1, 0, 0);
    if (lab.l === 0) return new OkLCh(0, 0, 0);
    if (lab.a === 0 && lab.b === 0) return new OkLCh(lab.l, 0, 0);

    const l = lab.l;
    const c = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
    const h = MathCustom.UnsignedMod(Math.atan2(lab.b, lab.a), MathCustom.TAU);
    return new OkLCh(l, c, h);
  }

  static sRGBToOkLCh(srgb) {
    return OkLCh.LabToLCh(OkLab.sRGBtoOkLab(srgb));
  }

  static LChToLab(lch) {
    // to reduce floating point error
    if (lch.l === 1) return new OkLab(1, 0, 0);
    if (lch.l === 0) return new OkLab(0, 0, 0);
    if (lch.c === 0) return new OkLab(lch.l, 0, 0);

    const l = lch.l;
    const a = lch.c * Math.cos(lch.h);
    const b = lch.c * Math.sin(lch.h);
    return new OkLab(l, a, b);
  }

  static OkLChTosRGB(lch) {
    return OkLab.OkLabtosRGB(OkLCh.LChToLab(lch));
  }

  copy() {
    return new OkLCh(this.l, this.c, this.h);
  }

  get isInside() {
    return (OkLCh.OkLChTosRGB(this)).isInside;
  }

  get CSSColor() {
    const l = Math.max(Math.min(this.l, 1), 0);
    const h = this.h * MathCustom.RadToDeg;
    return 'oklch(' + MathCustom.Round(l, 3) + ', ' + MathCustom.Round(this.c, 3) + ', ' + MathCustom.Round(h, 3) + ')';
  }

  get p5Color() {
    let out = OkLCh.OkLChTosRGB(this.copy());
    return out.p5Color;
  }

  rgbClamp() {
    let rgb = OkLCh.OkLChTosRGB(this);
    rgb.clamp();
    let newLCh = OkLCh.sRGBToOkLCh(rgb);
    this.l = newLCh.l;
    this.c = newLCh.c;
    this.h = newLCh.h;
  }

  fallback(maxIterations = 5) {
    let iter = 0;
    let ogL = this.l;
    while (iter < maxIterations) {
      this.rgbClamp();

      this.l = ogL;

      iter++;

      if (this.isInside) break;
    }
  }
}