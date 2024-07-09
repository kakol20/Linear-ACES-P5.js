const LoadImageState = (function () {
  return {
    run() {
      ProcessImageState.x = 0;
      ProcessImageState.y = 0;
      ProcessImageState.i = 0;
      ProcessImageState.j = 0;

      ProcessManager.changeState('processImage');
      DOMManager.updateDOMValues();
    }
  }
})();