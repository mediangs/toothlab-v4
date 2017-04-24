/**
 * Created by Lee Jongki on 2017-03-12.
 */

export const namedlist = function(fields) {
  return function(arr) {
    var obj = { };
    for(var i = 0; i < arr.length; i++) {
      obj[fields[i]] = arr[i];
    }
    return obj;
  };
};

const flatten = (ary) => ary.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

const hexToRgb = function(hex) {
  var bigint = parseInt(hex.replace(/[^0-9A-F]/gi, ''), 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return [Math.round((r/255.0)*100)/100,
    Math.round((g/255.0)*100)/100,
    Math.round((b/255.0)*100)/100];
};

export const repeatedColor = function (hex, times) {
  let color =hexToRgb(hex);
  return flatten(Array.apply(null, Array(times)).map(function(){return color;}));
};




