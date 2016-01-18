var netUtils = (function () {
  var utils;
  
  function clickHadlerDiv(canvas, matrix, log, cb) {
    canvas.addEventListener('click', function (e) {
      var target = e.srcElement;
      
      if (target.tagName === 'DIV') {
        matrix.update(target);
        cb(matrix, log);
      }
    });
  }
  
  function createFieldsFromPatterns(elements, bytesList, row, columns) {
    var matrices = {},
      updateLog = function (matrix, log) {
        if (log) {
          log.innerHTML = matrix.toString();
        }
      },
      currentMatrix, i, max, field, log, bytes;
   
    for (i = 0, max = elements.length; i < max; i++) {
      field = document.querySelector(elements[i][0]);
      log = document.querySelector(elements[i][1]);
      bytes = bytesList && bytesList[i];
      
      currentMatrix = matrices['m' + i] = new CreateMatrix(row, columns, bytes);
      
      if (field) {
        currentMatrix.paintDivs(field);
        clickHadlerDiv(field, currentMatrix, log, updateLog);
      }
      updateLog(currentMatrix, log);
    }
    
    return matrices;
  }
  
  function createMatricesFromPatterns(rows, columns, patterns) {
    var matrices = [], 
    i, max = patterns.length;
    
    for (i = 0; i < max; i++) {
      matrices.push(new CreateMatrix(rows, columns, patterns[i]));
    }
    
    return matrices;
  }
  
  return {
    createFieldsFromPatterns: createFieldsFromPatterns,
    createMatricesFromPatterns: createMatricesFromPatterns
  };
}());
