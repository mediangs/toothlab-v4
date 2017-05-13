/**
 * Created by Lee Jongki on 2017-03-12.
 */



const flatten = (ary) => ary.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
const hexToRgb = function(hex) {
  const bigint = parseInt(hex.replace(/[^0-9A-F]/gi, ''), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [Math.round((r/255.0)*100)/100,
    Math.round((g/255.0)*100)/100,
    Math.round((b/255.0)*100)/100];
};

export const repeatedColor = function (hex, times) {
  const color = hexToRgb(hex);
  return flatten(Array.apply(null, Array(times)).map(function(){return color;}));
};

export const namedlist = function(fields) {
  return function(arr) {
    const obj = { };
    for ( let i = 0; i < arr.length; i++) {
      obj[fields[i]] = arr[i];
    }
    return obj;
  };
};


// http://stackoverflow.com/questions/3080421/javascript-color-gradient

export const getGradientColor = function(start_color, end_color, percent) {
  // strip the leading # if it's there
  start_color = start_color.replace(/^\s*#|\s*$/g, '');
  end_color = end_color.replace(/^\s*#|\s*$/g, '');

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if (start_color.length === 3) {
    start_color = start_color.replace(/(.)/g, '$1$1');
  }

  if (end_color.length === 3) {
    end_color = end_color.replace(/(.)/g, '$1$1');
  }

  // get colors
  const start_red = parseInt(start_color.substr(0, 2), 16),
    start_green = parseInt(start_color.substr(2, 2), 16),
    start_blue = parseInt(start_color.substr(4, 2), 16);

  const end_red = parseInt(end_color.substr(0, 2), 16),
    end_green = parseInt(end_color.substr(2, 2), 16),
    end_blue = parseInt(end_color.substr(4, 2), 16);

  // calculate new color
  const diff_red = end_red - start_red;
  const diff_green = end_green - start_green;
  const diff_blue = end_blue - start_blue;

  let str_diff_red = ( (diff_red * percent) + start_red ).toString(16).split('.')[0];
  let str_diff_green = ( (diff_green * percent) + start_green ).toString(16).split('.')[0];
  let str_diff_blue = ( (diff_blue * percent) + start_blue ).toString(16).split('.')[0];

  // ensure 2 digits by color
  if ( str_diff_red.length === 1 ) {
    str_diff_red = '0' + str_diff_red;
  }
  if ( str_diff_green.length === 1 ) {
    str_diff_green = '0' + str_diff_green;
  }
  if ( str_diff_blue.length === 1 ) {
    str_diff_blue = '0' + str_diff_blue;
  }
  return '#' + str_diff_red + str_diff_green + str_diff_blue;
};


export const getGradientColorWithRange(
  startColor: string, endColor: string,
  startValue: number, endValue: number, evaluatingValue: number) {

  if (evaluatingValue < startValue) {
    return startColor;
  }
  if (evaluatingValue > endValue) {
    return endColor;
  }
   const percent =


}


