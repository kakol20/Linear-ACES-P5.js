const Timing = (function () {
  let startTime = 0;
  return {
    maxTime: 0,
    start() {
      startTime = new Date();
    },
    checkTime() {
      const elapseTime = (new Date()) - startTime;
      // if (elapseTime >= maxTime) break;
      return elapseTime >= this.maxTime;
    }

  }
})();