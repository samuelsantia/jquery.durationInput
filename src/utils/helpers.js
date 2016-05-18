import $ from 'jquery';

export function inputVal($input) {
  return parseInt($input.val() || 0);
};

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function optsFromAttrs($input, extract = ['min', 'max', 'step', 'format']) {
  const map = {};
  extract.forEach(_mapAttr);

  return map;

  function _mapAttr(attr) {
    const isNumber = /^\d+$/;
    const value = $input.attr(attr);

    return map[attr] = isNumber.test(value) ? parseInt(value) : value;
  };
};

export function debounce(fn, wait, inmediate) {
  let tmo;

  return function () {
    const context = this;
    const args = arguments;
    const callNow = inmediate && !tmo;

    clearTimeout(tmo);
    tmo = setTimeout(_later, wait);
    if ( callNow ) fn.apply(context, args);

    function _later(){
      tmo = null;
      if ( !inmediate ) fn.apply(context, arguments);
    }
  }
};
