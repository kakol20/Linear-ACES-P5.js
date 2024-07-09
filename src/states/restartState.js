const RestartState = (function () {
  return {
    run() {
      background(28, 28, 28, 0);
      image(DOMManager.imageInput, 0, 0, width, height);

      ProcessImageState.x = 0;
      ProcessImageState.y = 0;
      ProcessImageState.i = 0;
      ProcessImageState.j = 0;

      ProcessManager.changeState('processImage');
      DOMManager.updateDOMValues();
    }
  }
})();