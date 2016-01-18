;(function () {
  var weight, canvasList, canvas;
  
  window.addEventListener('DOMContentLoaded', handler);

  function handler() {
    var selectors = [], 
      rows = 5,
      columns = 4,
      net = new CreateHemmingNet(),
      resBtn = document.getElementById('button-result'),
      switcher = document.getElementById('canvasSwitcher'),
      patterns = ['11111001111110011001', 
                  '11111000111110011111', 
                  '11111001111110011111'],
      i, mmxs, Sin;
    
    for (i = 1; i < 4; i++) {
      selectors.push(['.c' + i, '.l' + i]);
    }
    
    mmxs = netUtils.createFieldsFromPatterns(selectors, patterns, rows, columns);
    Sin = netUtils.createFieldsFromPatterns([['.c4']], ['11111001111110010111'], rows, columns);
    
    canvasList = new CreateCanvasContext('.canvas-box');
    canvas = new CreateCanvasContext('.canvas-incoming');
    
    document.getElementById('button-train').addEventListener('click', function () {
      var isCanvas = switcher.checked,
        matrices;
      
      if (isCanvas) {
        matrices = netUtils.createMatricesFromPatterns(50, 50, canvasList.getMatricesFromCanvas());
      } else {
        matrices = mmxs;
      }
      
      weight = net.trainNet(matrices);
      
      if (weight.length) {
        resBtn.style.display="inline-block";
      }
    });
    
    document.getElementById('button-result').addEventListener('click', function () {
      var isCanvas = switcher.checked,
      incPattern;
      
      if (isCanvas) {
        incPattern = netUtils.createMatricesFromPatterns(50, 50, canvas.getMatricesFromCanvas());
      } else {
        incPattern = Sin;
      }
      document.getElementById('result').innerHTML = net.getPatternFromMatrix(incPattern);
    });
  }
}());
