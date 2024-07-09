const ProcessManager = (function () {
  const maxFPS = 60;
  Timing.maxTime = 1000 / maxFPS;

  const debugStates = true;

  return {
    state: 'nothing',

    changeState(s) {
      this.state = s;

      if (debugStates) console.log('State Change: ' + s);
    },

    setup() {

    },

    draw(dt) {
      switch (this.state) {
        case 'loadImage':
          LoadImageState.run();
          break;
        case 'processImage':
          ProcessImageState.run();
          break;
        default:
          // do nothing
          break;
      }
    }
  }
})()