import $ from 'jquery';
import converters from './utils/converters';
import { inputVal, capitalize } from './utils/helpers';

export default (function () {

  const UP_ARROW = 38;
  const DOWN_ARROW = 40;
  const letterRegex = /[a-zA-Z]/;

  function _keyPressHandle({ keyCode:charCode, ctrlKey, metaKey }) {
    const char = String.fromCharCode(charCode);
    const isCtrl = ctrlKey || metaKey;

    if ( !isCtrl && letterRegex.test(char) ) return false;
  };

  function _keyDownHandle({ keyCode:charCode, target }) {
    const $input = $(target);
    let value  = inputVal($input);

    if ( charCode === UP_ARROW ) {
      value += _getInputStep.call(this, $input);
      $input.val(value).trigger('input');
      return false;
    }

    if ( charCode === DOWN_ARROW ) {
      value -= _getInputStep.call(this, $input);
      $input.val(value).trigger('input');
      return false;
    }
  };

  function _inputHandle({ target }) {
    const { unit } = this.opts;
    const values   = this.renderer.getValues();
    const value = converters[`to${capitalize(unit)}`](values);

    this.val(value);
  };

  function _blurHandle({ target }) {
    const $input = $(target);
    const step = _getInputStep.call(this, $input);
    const value = inputVal($input);

    if ( value % step > 0 ) {
      $input.val(value + (step - (value % step)));

      const { unit } = this.opts;
      const values   = this.renderer.getValues();
      this.val(converters[`to${capitalize(unit)}`](values));
    }

    this.forceMin();
  };

  function _getInputStep($input) {
    const { unit, step } = this.opts;

    return unit === $input.data('unit') ? step : 1;
  };

  return {
    keyPressHandle: _keyPressHandle,
    keyDownHandle: _keyDownHandle,
    inputHandle: _inputHandle,
    blurHandle: _blurHandle
  };
})();
