var CreateHemmingNet = (function () {
  var k = 0.0005,
  addIterations = 100,
  Un, e, Wik,
  matriсes, Sin, s, n, m, offsetNet;
  
  function CreateHemmingNet (mm, s) {
    if (!(this instanceof CreateHemmingNet)) {
          return new CreateHemmingNet(matriсes, Sin);
      }
      
      matriсes = mm;
      Sin = s;
  }
  
  CreateHemmingNet.prototype = {
    constructor: CreateHemmingNet,
    getPatternFromMatrix: getPatternFromMatrix,
    trainNet: trainNet
  };
  
  function mapExt(object, cb) {
    var isArray = object instanceof Array,
    key, max;
    
    if (isArray) {
     for (key = 0, max = object.length; key < max; key++) {
       cb(object[key], key);
     } 
    } else {
      for (key in object) {
        cb(object[key], key);
      }
    }
  }
  
  function mapDoubleArray(d_array, cb) {
    var result = [],
      maxDArray = d_array.length,
      list, i, j, max, secondArray;
    
    for (i = 0; i < maxDArray; i++) {
      secondArray = d_array[i];
      max = secondArray.length;
      list = [];
      for (j = 0; j < max; j++) {
        list.push(cb(secondArray[j], i, j));
      }
      result.push(list);
    }
    
    return result;

  }
  
  function getBipolarVector(matriсes) {
    var s = [];
    
    mapExt(matriсes, function (object) {
      var listHandler = function (value) {
          return 2*value - 1;
      }, 
      newValue = object.getRowFromMatrix().map(listHandler);
      
      s.push(newValue);
    });
    
    return s;
  }
  
  function getMatriсesWeight(vectors) {
    return mapDoubleArray(vectors, function (value) {
        return value / 2;
      });
  }
  
  function getIncomingZ(Wik, s, offset) {
    var result = 0, 
    list = [];
    
    mapDoubleArray(Wik, function (value, firstIndex, secondIndex) {
      var Si = s[0][secondIndex],
      index = list.length - 1;
      
      if (secondIndex === 0) {
        list.push(result);
        result = value * Si;
      } else {
        result += value * Si;
        list[index] = result;
      }
    });
    
    return list;
  }
  
  function getOutcomingZ(Ulist, k, Un) {
    var results = [],
    result,
    max = Ulist.length,
    i, Uin;
    
    for (i = 0; i < max; i++) {
      Uin = Ulist[i];
      
      if (Uin < 0) {
        result = 0;
      }
      
      if (Uin >= 0 && Uin <= Un) {
        result = k * Uin;
      }
      
      if (Uin > Un) {
        result = Un;
      }
      
      results.push(result);
    }
    
    return results;
  }
  
  function getSumExludeIndex(list, index) {
    var sum = 0,
    i = list.length;
    
    while (i--) {
      if (i !== index) {
        sum += list[i];
      }
    }
    
    return sum;
  }
  
  function checkZeroResults(list) {
    var index = list.length,
    nonZero = 0, 
    value;
    
    while (index--) {
      value = list[index];
      if (value !== 0) {
        nonZero++;
      }
    }
    
    return  nonZero === 1;
  }
  
  function maxnetIteration(Gz, e) {
    var results = [],
    max = Gz.length,
    isFoundValue,
    i, j, result;
    
    for (i = 0; i < max + addIterations && !isFoundValue; i++) {
      list = [];
      for (j = 0; j < max; j++) {
        result = Gz[j] - e * getSumExludeIndex(Gz, j);
        list.push(result > 0 ? result : 0);
      }
      Gz = list;
      isFoundValue = checkZeroResults(list);
      
      console.info(list, isFoundValue);
      
      if (isFoundValue) {
        return list.indexOf(Math.max.apply(null, list))
      }
    }
    
    
    return -1;
  }
  
  function trainNet(matriсes) {
    s = getBipolarVector(matriсes);
    m = s[0].length;
    n = Object.keys(matriсes).length;
    offsetNet = m / 2;
    Un = 1 / k;
    e = 1 / n;
    Wik = getMatriсesWeight(s);
    
    return Wik;
  }
  
  function getPatternFromMatrix(Sin) {
    if (!Wik) {
      throw new Error('First define and train net!');
    }
    
    var Sinc = getBipolarVector(Sin),
    Ulist = getIncomingZ(Wik, Sinc, offsetNet),
    Gz = getOutcomingZ(Ulist, k, Un),
    Ga = maxnetIteration(Gz, e);
    
    console.info(Wik, Ulist, Gz, Ga)
    
    return Ga;
  }
  
  
  return CreateHemmingNet;
}());
