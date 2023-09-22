const ColorSpace = {
  sRGB: "sRGB",
  Linear: "Linear"
}

class ImgWrap {
  constructor(path, colorSpace) {
    this.img = loadImage(path);
    
    this.width = 0;
    this.height = 0;
    this.size = 0;
    
    this.data = [0];
    this.colorSpace = colorSpace;
  }
  
  loadPixels() {
    this.img.loadPixels();
    
    this.width = this.img.width;
    this.height = this.img.height;
    this.size = this.width * this.height * 4;
    
    this.data = new Array(this.size);
    
    for (let i in this.img.pixels) {
      this.data[i] = this.img.pixels[i] / 255;
      
      if (this.colorSpace == ColorSpace.sRGB) {
        this.data[i] = sRGB.toLinear(this.data[i]);
      }
    }
    
    this.img.updatePixels();
  }
  
  index(x, y) {
    return (x + y * this.width) * 4;
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
}