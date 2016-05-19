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
