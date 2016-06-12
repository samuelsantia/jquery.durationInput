import $ from 'jquery';
import Renderer from './renderer';
import handlers from './handlers';
import converters from './utils/converters';
import { inputVal, optsFromAttrs } from './utils/helpers';

const defaults = {
  unit: 'minutes',
  step: 1,
  min:  0,
  format: 'd/h/m',
  labels: {
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds'
  },
  classes: {
    wrapper: 'duration-input',
    inputGroup: 'duration-input-group'
  },
  tpls: {
    wrapper(wrapperClass) {
      return `<div class="${wrapperClass}" />`;
    },
    group(id, groupClass, labelText) {
      return `
        <div class="${groupClass}">
          <label for="${id}">${labelText}</label>
        </div>
      `;
    }
  }
};

class DurationInput {
  constructor($el, opts) {
    this.el = $el.attr('type', 'hidden');
    this.id = this.el.attr('id') || this.el.attr('name');
    this.opts  = $.extend({}, defaults, optsFromAttrs(this.el), opts);
    this.renderer = new Renderer(this);

    let initialValue = inputVal(this.el);
    if ( initialValue < this.opts.min ) initialValue = this.opts.min;

    this.renderer.render();
    this.val(initialValue);
    this.bindEvents();
  }
  destroy() {
    this.unbindEvents();
    this.renderer.destroy();
  }
  bindEvents() {
    this.renderer.inputs
      .on('keydown', handlers.keyDownHandle.bind(this))
      .on('input', handlers.inputHandle.bind(this))
      .on('blur',  handlers.blurHandle.bind(this));
  }

  unbindEvents() {
    this.renderer.inputs
      .off('keydown', handlers.keyDownHandle.bind(this))
      .off('input', handlers.inputHandle.bind(this))
      .off('blur',  handlers.blurHandle.bind(this));
  }
  val(value) {
    if ( typeof value === 'undefined' || value === null ) return this.el.val();

    const { min, max, unit, format } = this.opts;
    if ( value > max ) value = max;
    if ( value < 0 ) value = 0;

    const prevValue = inputVal(this.el);
    const splitted = converters.splitTime(value, unit, format);

    this.renderer.update(splitted);
    this.el.val(value);

    if ( prevValue !== value ) this.el.trigger('change');
  }

  forceMin() {
    const { min } = this.opts;
    if ( this.val() < min) this.val(min);
  }
}

$.fn.durationInput = function (options) {
  return this.each(function (i, el) {
    const $el = $(el);
    const instance = $el.data('duration-input');

    if ( !instance || !instance instanceof DurationInput ) {
      $el.data('duration-input', new DurationInput($el, options));
    }

    return $el;
  });
};

$.fn.durationInput.defaults = defaults;
