import { capitalize } from './helpers';

export default (function () {

  const UNITS = ['days', 'hours', 'minutes', 'seconds'];
  const CONVERTERS = {
    days: 24,
    hours: 60,
    minutes: 60,
    seconds: 60
  };

  function _format2Unit(format) {
    switch (format) {
      case 'd': case 'dd': return 'days';
      case 'h': case 'hh': return 'hours';
      case 'm': case 'mm': return 'minutes';
      case 's': case 'ss': return 'seconds';
      default:
        throw new SyntaxError(`${input} format is not defined in time formats`);
    }
  };

  function splitTime(time, from, format) {
    const outputs = format.split('/').map(_format2Unit);
    const times = {};
    const minOutput = outputs[outputs.length - 1];
    const maxOutputIndex = outputs.indexOf(outputs[0]);
    const minOutputIndex = outputs.indexOf(minOutput);

    time = _convertTime(time, from, minOutput);

    for ( let i = minOutputIndex; i >= maxOutputIndex; i-- ) {
      const output = outputs[i];
      const prev   = outputs[i - 1];

      if ( prev ) {
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
    const fromUnitIndex = UNITS.indexOf(from);
    const toUnitIndex   = UNITS.indexOf(to);

    if ( typeof time === 'object' ){
      if ( Object.keys(time).length > 1 ) {
        return Object.keys(time).reduce(sumTimes);
      } else {
        const key = Object.keys(time)[0];
        return _convertTime(time[key], key, to);
      }
    }

    if ( fromUnitIndex < 0 )
      throw new SyntaxError(`${from} is not defined in time units`);
    if ( toUnitIndex < 0 )
      throw new SyntaxError(`${to} is not defined in time units`);

    if ( toUnitIndex === fromUnitIndex ) return time;
    if ( time === 0 ) return 0;

    const operator = toUnitIndex > fromUnitIndex ? '*' : '/';
    const converters = UNITS.filter(units4Conversion);

    const cr = converters.length === 1
      ? CONVERTERS[converters[0]]
      : converters.reduce(units2ConversionRate);

    return operator === '*'
      ? time * cr
      : time / cr;

    function sumTimes(current, next) {
      const value = typeof current === 'string'
        ? _convertTime(time[current], current, to)
        : current;
      const nextValue = _convertTime(time[next], next, to);

      return value + nextValue;
    };

    function units4Conversion(unit){
      const currentIndex = UNITS.indexOf(unit);

      return operator === '*'
        ? currentIndex < toUnitIndex && currentIndex >= fromUnitIndex
        : currentIndex >= toUnitIndex && currentIndex < fromUnitIndex;
    };
    function units2ConversionRate(current, next) {
      const value = typeof current === 'string' ? CONVERTERS[current] : current;

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
