import $ from 'jquery';
import { inputVal } from './utils/helpers';

export default (function (){
  class R {
    constructor(container) {
      this.container = container;
    }

    render() {
      const { el, opts: {
        tpls,
        classes: { wrapper:wrapperClass }
      } } = this.container;

      this.wrapper = $(tpls.wrapper(wrapperClass));

      this.inputs = $(_renderInputs.call(this)).map(toArray);
      this.wrapper.insertAfter(el).append(el);

      function toArray() { return this.toArray(); }
    }

    getValues() {
      const values = {};
      this.inputs.each(_setInputValue);

      return values;

      function _setInputValue() {
        const $input = $(this);
        values[$input.data('unit')] = inputVal($input);
      };
    }

    update(values) {
      $.each(values, this.updateUnit.bind(this));
    }

    updateUnit(unit, value) {
      const $input = this[unit];
      if ( $input ) {
        const zeroPrefixed = $input.data('zero-prefixed');
        if ( zeroPrefixed && value < 10 ) value = '0' + value;
        this[unit].val(value);
      }
    }

    destroy() {
      const { el } = this.container;

      el.insertBefore(this.wrapper);
      this.wrapper.remove();
    }
  }

  function _renderInputs() {
    const { format } = this.container.opts;

    return $.map(format.split('/'), _createInput.bind(this));
  };

  function _createInput(input, i) {

    switch (input) {
      case 'd': case 'dd':
        return this.days  = _renderInput.call(this, 'days', input);
      case 'h': case 'hh':
        return this.hours = _renderInput.call(this, 'hours', input);
      case 'm': case 'mm':
        return this.minutes = _renderInput.call(this, 'minutes', input);
      case 's': case 'ss':
        return this.seconds = _renderInput.call(this, 'seconds', input);
      default:
        throw new SyntaxError(`${input} format is not defined in time formats`);
    }
  };

  function _renderInput(inputUnit, format) {
    const { id:containerId, opts, wrapper } = this.container;
    const { classes: { inputGroup:groupClass }, labels, tpls } = opts;

    const id = `${inputUnit}-${containerId}`;
    const label = labels[inputUnit];
    const $group = $(tpls.group(id, groupClass, label));
    const $input = $('<input>')
      .attr({ 'id': id, type: 'text' })
      .data({ 'unit': inputUnit, 'zero-prefixed': format.length > 1 });

    $group.append($input).appendTo(this.wrapper);

    return $input;
  };

  return R;
})();
