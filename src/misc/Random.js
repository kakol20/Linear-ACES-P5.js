const Random = (function () {
  return {
    Seed: BigInt(0xACE1),

    Rand_Max: 32767,

    UInt() {
      this.Seed = this.Seed * 1103515245n + 12345n;
      return (this.Seed / 65536n) % 32768n;
    },

    Int(min, max) {
      const distance = BigInt((max - min) + 1);
      return Number(this.UInt() % distance) + min;
    },

    Float(min, max) {
      let out = Number(this.UInt());
      out /= this.Rand_Max;
      return (max - min) * out;
    }
  }
})();