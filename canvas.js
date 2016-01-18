var CreateCanvasContext = (function () {
  var canvasMouse = {
    isPushed: false,
    x: 0,
    y: 0,
    offset: 5,
    setCanvas: function (canvas) {
      this.canvas = getCanvas(canvas);
      this.canvas.fillStyle = "#FF0000";
    },
    drawPoint: function (x, y) {
      this.canvas.fillRect(x, y, this.offset, this.offset)
    },
    getPos: function (e) {
      var target = e.target;
      
      return {
        x: e.pageX - target.offsetLeft,
        y: e.pageY - target.offsetTop
      }
    },
    start: function (e) {
      var target = e.target,
        pos = this.getPos(e);
      
      this.setCanvas(target);
      this.drawPoint(pos.x, pos.y);
      this.isPushed = true;
      
      return false;
    }, 
    continue: function (e) {
      if (!this.isPushed) {
        return ;
      }
      
      var pos = this.getPos(e),
        rect = this.canvas.canvas.getClientRects()[0],
        outOfBorders = pos.x > this.canvas.canvas.width || 
                      e.pageX <= rect.left || 
                      pos.y > this.canvas.canvas.height ||
                      e.pageY <= rect.top;

      if (outOfBorders) {
        this.stop();
      } else {
        this.drawPoint(pos.x, pos.y);
      }
    },
    stop: function () {
      this.isPushed = false;
      this.x = 0;
      this.y = 0;
      this.matrix = undefined;
      
      return false;
    },
    clear: function () {
      var cEl = this.canvas;
      
      cEl.clearRect(0, 0, cEl.canvas.width, cEl.canvas.height);
      
      return false;
    }
  };
  
  Object.keys(canvasMouse).forEach(function (key) {
    var val = canvasMouse[key];
    
    if (val instanceof Function) {
      canvasMouse[key] = val.bind(canvasMouse);
    }
  });
  
  
  function getCanvas(element) {
    var canvas = element instanceof HTMLCanvasElement ? element : document.querySelector(element);
    return canvas && canvas.getContext('2d');
  }
  
  function traverseParent(holder, tagName, events) {
    var key;
    
    for (key in events) {
        (function (k) {
          holder.addEventListener(k, function (e) {
          if (e.target.tagName.toLowerCase() === tagName) {
             events[k](e);
          }
        });
        
        }(key));
      }
  }
  
  function handler(holder) {
    var events = {
      mousedown: canvasMouse.start,
      mousemove: canvasMouse.continue,
      mouseleave: canvasMouse.stop,
      mouseup: canvasMouse.stop,
      dblclick: canvasMouse.clear
    };
    
    traverseParent(holder, 'canvas', events);
  }
  
  function getMatrix(pixels) {
    var pixelValue = 4, 
      index = 0,
      length = pixels.length,
      matrix = [],
      color, offset;
      
    while (index < length) {
      offset = index + pixelValue
      color = pixels[index];
      index = offset;
      
      matrix.push(color > 0 ? 1 : 0);
    }  
    
    return matrix;
  }
  
  function CreateCanvasContext(holder) {
    holder = document.querySelector(holder) || document.body;
    
    this.canvasList = [].slice.call(holder.querySelectorAll('canvas'));
    
    handler(holder);
  }
  
  CreateCanvasContext.prototype.getMatricesFromCanvas = function () {
    var matrices = [],
      max = this.canvasList.length,
      pixels, i, canvas, canvasContext;
    
    for (i = 0; i < max; i++) {
      canvas = this.canvasList[i];
      canvasContext = getCanvas(canvas);
      pixels = canvasContext.getImageData(0, 0, canvas.width, canvas.height).data;
      matrices.push(getMatrix(pixels));
    }
    
    return matrices;
  }
    
  return CreateCanvasContext;
}());
