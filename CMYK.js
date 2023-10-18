const CMYK = (function() {
    return {
        fromRGB(rgb) {
            let out = rgb;
            out[3] = 1 - Math.max(rgb[0], rgb[1], rgb[2]);
            const inverseK = 1 - out[3];
            for (let i = 0; i < 3; i++) {
                out[i] = (1 - rgb[i] - out[3]) / inverseK;
            }
            return out;
        },

        toRGB(cmyk) {
            const inverseK = 1 - cmyk[3];
            let out = [0, 0, 0, 1];

            for (let i = 0; i < 3; i++) {
                out[i] = (1 - cmyk[i]) * inverseK;
            }
            return out;
        }
    }
})();