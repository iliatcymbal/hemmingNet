var CreateMatrix = (function () {
  function getMatrixFromRow(bits) {
    var rowMax = this.rows, 
    columnMax = this.columns,
    max = bits.length,
    result = [],
    i = 0,
    row, columns, list, bit;
    
    bits = bits instanceof Array ? bits : bits.split('');
    
    for (row = 0; row < rowMax; row++) {
      list = [];
      for (column = 0; column < columnMax; column++) {
        bit = bits[i] !== undefined ? bits[i] - 0 : 0;
        list.push(bit);
        i++;
      }
      result.push(list);
    }
    
    return result;
  }
  
  function CreateMatrix(x, y, bits) {
    var matrix = [],
    row = x, column;
    
    this.rows = x;
    this.columns = y;
    
    if (bits) {
      matrix = getMatrixFromRow.call(this, bits);
    } else {
      while (row--) {
        column = y;
        matrix[row] = [];
        while (column--) {
          matrix[row].push(0);
        }
      }
    }
    
    this.matrix = matrix;
  }
  
  CreateMatrix.prototype.traverse = function (cb) {
    var maxX = this.matrix.length,
      maxY, x, y, isNewRow;
    
    for (x= 0; x < maxX; x++) {
      isNewRow = x > 0;
      for (y = 0, maxY = this.matrix[x].length; y < maxY ;y++) {
        cb(isNewRow, x, y, this.matrix);
        isNewRow = false;
      }
    }
  };
  
  CreateMatrix.prototype.paintDivs = function (element) {
    this.traverse(function (isNewRow, x, y, m) {
      var cl = m[x][y] !== 0 ? 'active' : '';
      
      element.innerHTML += isNewRow ? '<div class="first ' + cl + '"></div>' : 
      '<div class="' + cl + '"></div>';
    });
    
    this.elements = element.children;
  };
  
  CreateMatrix.prototype.getCoords = function (index) {
    var row = index < this.columns ? 0 : Math.floor(index / this.columns),
        column =  this.columns - (row + 1)*this.columns + index;
      
      return {
        row: row,
        column: column
      };
  };
  
  CreateMatrix.prototype.update = function (target) {
    var nodeList = Array.prototype.slice.call(this.elements),
    index = nodeList.indexOf(target),
    coords = this.getCoords(index);
    currentValue = this.matrix[coords.row][coords.column],
    i = 0;
    
    this.matrix[coords.row][coords.column] = currentValue ? 0 : 1;
    this.traverse(function (isNewRow, x, y, matrix) {
      var value = matrix[x][y];
      if (value) {
        nodeList[i].classList.add('active');
      } else {
        nodeList[i].classList.remove('active');
      }
      i++;
    });
  };
  
  CreateMatrix.prototype.toString = function () {
    var string = '';
    
    this.traverse(function(isNewRow, x, y, matrix) {
      var value = matrix[x][y];
      string += isNewRow ? '<br>' + value : value;
    });
    
    return string;
  };
  
  CreateMatrix.prototype.getRowFromMatrix = function () {
    var row = [];
    
    this.traverse(function (isNewRow, x, y, matrix) {
      row.push(matrix[x][y]);
    });
    
    return row;
  };
  
  CreateMatrix.prototype.getMatrixFromRow = function (bytes) {
    this.matrix = this.traverse(function (isNewRow, x, y, matrix) {
    });
  }
  
  return CreateMatrix;
}());
