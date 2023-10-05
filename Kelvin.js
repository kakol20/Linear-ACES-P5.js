const Kelvin = (function() {
    return {
        ToRGB(temp) { // https://tannerhelland.com/2012/09/18/convert-temperature-rgb-algorithm-code.html
            const _temp = temp / 100;
            // Red value
            let r = 0;

            if (_temp < 66) {
                r = 1;
            } else {
                r = _temp - 60;
                r = 329.698727446 * Math.pow(r, -0.1332047592);
                r = constrain(r, 0, 255) / 255;
            }

            // Green value
            let g = 0;

            if (_temp < 66) {
                g = _temp;
                g = 99.4708025861 * Math.log(g) - 161.1195681661;
            } else {
                g = _temp - 60;
                g = 288.1221695283 * Math.pow(g, -0.0755148492);
            }
            g = constrain(g, 0, 255) / 255;

            // Blue value
            let b = 0;
            if (_temp >= 66) {
                b = 1;
            } else if (_temp <= 19) {
                b = 0;
            } else {
                b = _temp - 10;
                b = 138.5177312231 * Math.log(b) - 305.0447927307;
                b = constrain(b, 0, 255) / 255;
            }

            return [r, g, b, 1];
        },

        Tint(col, temp) {
            const k = this.ToRGB(temp);
            return [col[0] * k[0], 
            col[1] * k[1], 
            col[2] * k[2], 
            col[3]];
        }
    };
})();