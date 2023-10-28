const sRGB = (function () {
    return {
        tosRGB(v) { return Math.pow(v, 1 / 2.2) },
        toLinear(v) { return Math.pow(v, 2.2) }
    }
})()