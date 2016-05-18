/*
  jquery.durationInput 0.1.0
  Samuel Santiago <samuelsantia@gmail.com>
  license: ISC <https://opensource.org/licenses/ISC>
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define(['jquery'], factory) :
  (factory(global.jQuery));
}(this, function ($) { 'use strict';

  $ = 'default' in $ ? $['default'] : $;

  var babelHelpers = {};
  babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  babelHelpers;

  function inputVal($input) {
    return parseInt($input.val() || 0);
  };

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  function optsFromAttrs($input) {
    var extract = arguments.length <= 1 || arguments[1] === undefined ? ['min', 'max', 'step', 'format'] : arguments[1];

    var map = {};
    extract.forEach(_mapAttr);

    return map;

    function _mapAttr(attr) {
      var isNumber = /^\d+$/;
      var value = $input.attr(attr);

      return map[attr] = isNumber.test(value) ? parseInt(value) : value;
    };
  };

  var Renderer = (function () {
    var R = function () {
      function R(container) {
        babelHelpers.classCallCheck(this, R);

        this.container = container;
      }

      babelHelpers.createClass(R, [{
        key: 'render',
        value: function render() {
          var _container = this.container;
          var el = _container.el;
          var _container$opts = _container.opts;
          var tpls = _container$opts.tpls;
          var wrapperClass = _container$opts.classes.wrapper;


          this.wrapper = $(tpls.wrapper(wrapperClass));

          this.inputs = $(_renderInputs.call(this)).map(toArray);
          this.wrapper.insertAfter(el).append(el);

          function toArray() {
            return this.toArray();
          }
        }
      }, {
        key: 'getValues',
        value: function getValues() {
          var values = {};
          this.inputs.each(_setInputValue);

          return values;

          function _setInputValue() {
            var $input = $(this);
            values[$input.data('unit')] = inputVal($input);
          };
        }
      }, {
        key: 'update',
        value: function update(values) {
          $.each(values, this.updateUnit.bind(this));
        }
      }, {
        key: 'updateUnit',
        value: function updateUnit(unit, value) {
          if (this[unit]) this[unit].val(value);
        }
      }, {
        key: 'destroy',
        value: function destroy() {
          var el = this.container.el;


          el.insertBefore(this.wrapper);
          this.wrapper.remove();
        }
      }]);
      return R;
    }();

    function _renderInputs() {
      var format = this.container.opts.format;


      return $.map(format.split('/'), _createInput.bind(this));
    };

    function _createInput(input, i) {

      switch (input) {
        case 'd':case 'dd':
          return this.days = _renderInput.call(this, 'days');
        case 'h':case 'hh':
          return this.hours = _renderInput.call(this, 'hours');
        case 'm':case 'mm':
          return this.minutes = _renderInput.call(this, 'minutes');
        case 's':case 'ss':
          return this.seconds = _renderInput.call(this, 'seconds');
        default:
          throw new SyntaxError(input + ' format is not defined in time formats');
      }
    };

    function _renderInput(inputUnit) {
      var _container2 = this.container;
      var containerId = _container2.id;
      var opts = _container2.opts;
      var wrapper = _container2.wrapper;
      var groupClass = opts.classes.inputGroup;
      var labels = opts.labels;
      var tpls = opts.tpls;


      var id = inputUnit + '-' + containerId;
      var label = labels[inputUnit];
      var $group = $(tpls.group(id, groupClass, label));
      var $input = $('<input>').attr({ 'id': id, type: 'text' }).data('unit', inputUnit);

      $group.append($input).appendTo(this.wrapper);

      return $input;
    };

    return R;
  })();

  var converters = (function () {

    var UNITS = ['days', 'hours', 'minutes', 'seconds'];
    var CONVERTERS = {
      days: 24,
      hours: 60,
      minutes: 60,
      seconds: 60
    };

    function _format2Unit(format) {
      switch (format) {
        case 'd':case 'dd':
          return 'days';
        case 'h':case 'hh':
          return 'hours';
        case 'm':case 'mm':
          return 'minutes';
        case 's':case 'ss':
          return 'seconds';
        default:
          throw new SyntaxError(input + ' format is not defined in time formats');
      }
    };

    function splitTime(time, from, format) {
      var outputs = format.split('/').map(_format2Unit);
      var times = {};
      var minOutput = outputs[outputs.length - 1];
      var maxOutputIndex = outputs.indexOf(outputs[0]);
      var minOutputIndex = outputs.indexOf(minOutput);

      time = _convertTime(time, from, minOutput);

      for (var i = minOutputIndex; i >= maxOutputIndex; i--) {
        var output = outputs[i];
        var prev = outputs[i - 1];

        if (prev) {
          times[output] = Math.round(time % CONVERTERS[prev]);
          time = Math.floor(_convertTime(time, output, prev));
        } else {
          times[output] = Math.floor(time);
        }
      }

      return times;
    };

    function toDays(time, from) {
      return _convertTime(time, from, 'days');
    };

    function toHours(time, from) {
      return _convertTime(time, from, 'hours');
    };

    function toMinutes(time, from) {
      return _convertTime(time, from, 'minutes');
    };

    function toSeconds(time, from) {
      return _convertTime(time, from, 'seconds');
    };

    function _convertTime(time, from, to) {
      var fromUnitIndex = UNITS.indexOf(from);
      var toUnitIndex = UNITS.indexOf(to);

      if ((typeof time === 'undefined' ? 'undefined' : babelHelpers.typeof(time)) === 'object') {
        if (Object.keys(time).length > 1) {
          return Object.keys(time).reduce(sumTimes);
        } else {
          var key = Object.keys(time)[0];
          return _convertTime(time[key], key, to);
        }
      }

      if (fromUnitIndex < 0) throw new SyntaxError(from + ' is not defined in time units');
      if (toUnitIndex < 0) throw new SyntaxError(to + ' is not defined in time units');

      if (toUnitIndex === fromUnitIndex) return time;
      if (time === 0) return 0;

      var operator = toUnitIndex > fromUnitIndex ? '*' : '/';
      var converters = UNITS.filter(units4Conversion);

      var cr = converters.length === 1 ? CONVERTERS[converters[0]] : converters.reduce(units2ConversionRate);

      return operator === '*' ? time * cr : time / cr;

      function sumTimes(current, next) {
        var value = typeof current === 'string' ? _convertTime(time[current], current, to) : current;
        var nextValue = _convertTime(time[next], next, to);

        return value + nextValue;
      };

      function units4Conversion(unit) {
        var currentIndex = UNITS.indexOf(unit);

        return operator === '*' ? currentIndex < toUnitIndex && currentIndex >= fromUnitIndex : currentIndex >= toUnitIndex && currentIndex < fromUnitIndex;
      };
      function units2ConversionRate(current, next) {
        var value = typeof current === 'string' ? CONVERTERS[current] : current;

        return value * CONVERTERS[next];
      };
    };

    return {
      toDays: toDays,
      toHours: toHours,
      toMinutes: toMinutes,
      toSeconds: toSeconds,
      splitTime: splitTime
    };
  })();

  var handlers = (function () {

    var UP_ARROW = 38;
    var DOWN_ARROW = 40;
    var letterRegex = /[a-zA-Z]/;

    function _keyDownHandle(_ref) {
      var charCode = _ref.which;
      var target = _ref.target;
      var ctrlKey = _ref.ctrlKey;
      var metaKey = _ref.metaKey;
      var stopImmediatePropagation = _ref.stopImmediatePropagation;

      var char = String.fromCharCode(charCode);
      var isCtrl = ctrlKey || metaKey;
      var $input = $(target);
      var value = inputVal($input);

      if (!isCtrl && letterRegex.test(char)) return false;

      if (charCode === UP_ARROW) {
        value += _getInputStep.call(this, $input);
        $input.val(value).trigger('input');
        return false;
      }

      if (charCode === DOWN_ARROW) {
        value -= _getInputStep.call(this, $input);
        $input.val(value).trigger('input');
        return false;
      }
    };

    function _inputHandle(_ref2) {
      var target = _ref2.target;
      var unit = this.opts.unit;

      var values = this.renderer.getValues();

      this.val(converters['to' + capitalize(unit)](values));
    };

    function _blurHandle(_ref3) {
      var target = _ref3.target;

      var $input = $(target);
      var step = _getInputStep.call(this, $input);
      var value = inputVal($input);

      if (value % step > 0) {
        $input.val(value + (step - value % step));

        var unit = this.opts.unit;

        var values = this.renderer.getValues();
        this.val(converters['to' + capitalize(unit)](values));
      }
    };

    function _getInputStep($input) {
      var _opts = this.opts;
      var unit = _opts.unit;
      var step = _opts.step;


      return unit === $input.data('unit') ? step : 1;
    };

    return {
      keyDownHandle: _keyDownHandle,
      inputHandle: _inputHandle,
      blurHandle: _blurHandle
    };
  })();

  var defaults = {
    unit: 'minutes',
    step: 1,
    min: 0,
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
      wrapper: function wrapper(wrapperClass) {
        return '<div class="' + wrapperClass + '" />';
      },
      group: function group(id, groupClass, labelText) {
        return '\n        <div class="' + groupClass + '">\n          <label for="' + id + '">' + labelText + '</label>\n        </div>\n      ';
      }
    }
  };

  var DurationInput = function () {
    function DurationInput($el, opts) {
      babelHelpers.classCallCheck(this, DurationInput);

      this.el = $el.attr('type', 'hidden');
      this.id = this.el.attr('id') || this.el.attr('name');
      this.opts = $.extend({}, defaults, optsFromAttrs(this.el), opts);
      this.renderer = new Renderer(this);

      this.renderer.render();
      this.val(inputVal(this.el));
      this.bindEvents();
    }

    babelHelpers.createClass(DurationInput, [{
      key: 'destroy',
      value: function destroy() {
        this.unbindEvents();
        this.renderer.destroy();
      }
    }, {
      key: 'bindEvents',
      value: function bindEvents() {
        this.renderer.inputs.on('keydown', handlers.keyDownHandle.bind(this)).on('input', handlers.inputHandle.bind(this)).on('blur', handlers.blurHandle.bind(this));
      }
    }, {
      key: 'unbindEvents',
      value: function unbindEvents() {
        this.renderer.inputs.off('keydown', handlers.keyDownHandle.bind(this)).off('input', handlers.inputHandle.bind(this)).off('blur', handlers.blurHandle.bind(this));
      }
    }, {
      key: 'val',
      value: function val(value) {
        if (typeof value === 'undefined' || value === null) return this.el.val();

        var _opts = this.opts;
        var min = _opts.min;
        var max = _opts.max;
        var unit = _opts.unit;
        var format = _opts.format;

        if (value > max) value = max;
        if (value < min) value = min;

        var prevValue = inputVal(this.el);
        var splitted = converters.splitTime(value, unit, format);

        this.renderer.update(splitted);
        this.el.val(value);

        if (prevValue !== value) this.el.trigger('change');
      }
    }]);
    return DurationInput;
  }();

  $.fn.durationInput = function (options) {
    return this.each(function (i, el) {
      var $el = $(el);
      var instance = $el.data('duration-input');

      if (!instance || !instance instanceof DurationInput) {
        $el.data('duration-input', new DurationInput($el, options));
      }

      return $el;
    });
  };

}));