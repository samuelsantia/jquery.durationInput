import { expect } from 'chai';

import converters from '../../src/utils/converters';

function to_Unit_Tests(fn, tests, originalUnit) {

  Object.keys(tests).forEach(function (unit) {

    describe(`when passing ${unit}`, function () {
      tests[unit].forEach(function (test) {
        const { value, expected } = test;

        it(`should convert ${value} ${unit} in ${expected} ${originalUnit}`, function () {
          const result = fn.call(undefined, value, unit);

          expect(result).to.equal(expected);
        });
      });
    });
  });

  describe('when passing invalid unit', function () {

    it('should throw SyntaxError Exception', function() {
      const badFn = fn.bind(undefined, 5, 'invalid');
      expect(badFn).to.throw(SyntaxError, /is not defined in time units/);
    });
  });
};

context('Time Units Converter', function () {

  describe('Days conversions', function () {
    const secondsInADay = 24 * 60 * 60;
    const minutesInADay = 24 * 60;
    const hoursInADay =   24;

    const tests = {
      seconds: [
        { value: 1   * secondsInADay, expected: 1 },
        { value: 5   * secondsInADay, expected: 5 },
        { value: 100 * secondsInADay, expected: 100 }
      ],
      minutes: [
        { value: 1   * minutesInADay, expected: 1 },
        { value: 5   * minutesInADay, expected: 5 },
        { value: 100 * minutesInADay, expected: 100 }
      ],
      hours: [
        { value: 1   * hoursInADay, expected: 1 },
        { value: 5   * hoursInADay, expected: 5 },
        { value: 100 * hoursInADay, expected: 100 }
      ],
      days: [
        { value: 1, expected: 1 },
        { value: 5, expected: 5 },
        { value: 120, expected: 120 }
      ]
    };

    to_Unit_Tests(converters.toDays, tests, 'days');
  });

  describe('Hours conversions', function () {
    const secondsInAHour = 60 * 60;
    const minutesInAHour = 60;
    const daysInAHour    = 1 / 24;

    const tests = {
      seconds: [
        { value: 1   * secondsInAHour, expected: 1 },
        { value: 5   * secondsInAHour, expected: 5 },
        { value: 100 * secondsInAHour, expected: 100 }
      ],
      minutes: [
        { value: 1   * minutesInAHour, expected: 1 },
        { value: 5   * minutesInAHour, expected: 5 },
        { value: 100 * minutesInAHour, expected: 100 }
      ],
      hours: [
        { value: 1, expected: 1 },
        { value: 5, expected: 5 },
        { value: 100, expected: 100 }
      ],
      days: [
        { value: 24  * daysInAHour, expected: 24 },
        { value: 48  * daysInAHour, expected: 48 },
        { value: 120 * daysInAHour, expected: 120 }
      ]
    };

    to_Unit_Tests(converters.toHours, tests, 'hours');
  });

  describe('Minutes conversions', function () {
    const secondsInAMinute = 60;
    const hoursInAMinute   = 1 / 60;
    const daysInAMinute    = 1 / 60 / 24;

    const tests = {
      seconds: [
        { value: 1   * secondsInAMinute, expected: 1 },
        { value: 5   * secondsInAMinute, expected: 5 },
        { value: 100 * secondsInAMinute, expected: 100 }
      ],
      minutes: [
        { value: 1, expected: 1 },
        { value: 5, expected: 5 },
        { value: 100, expected: 100 }
      ],
      hours: [
        { value: 30 * hoursInAMinute, expected: 30 },
        { value: 60 * hoursInAMinute, expected: 60 },
        { value: 7200 * hoursInAMinute, expected: 7200 }
      ],
      days: [
        { value: 720  * daysInAMinute, expected: 720 },
        { value: 1440 * daysInAMinute, expected: 1440 },
        { value: 172800  * daysInAMinute, expected: 172800 }
      ]
    };

    to_Unit_Tests(converters.toMinutes, tests, 'minutes');
  });

  describe('Seconds conversions', function () {
    const minutesInASecond = 1 / 60;
    const hoursInASecond   = 1 / 60 / 60;
    const daysInASecond    = 1 / 60 / 60 / 24;

    const tests = {
      seconds: [
        { value: 1, expected: 1 },
        { value: 5, expected: 5 },
        { value: 100, expected: 100 }
      ],
      minutes: [
        { value: 30  * minutesInASecond, expected: 30 },
        { value: 120 * minutesInASecond, expected: 120 },
        { value: 7200 * minutesInASecond, expected: 7200 }
      ],
      hours: [
        { value: 1800 * hoursInASecond, expected: 1800 },
        { value: 3600 * hoursInASecond, expected: 3600 },
        { value: 432000 * hoursInASecond, expected: 432000 }
      ],
      days: [
        { value: 43200 * daysInASecond, expected: 43200 },
        { value: 86400 * daysInASecond, expected: 86400 },
        { value: 172800  * daysInASecond, expected: 172800 }
      ]
    };

    to_Unit_Tests(converters.toSeconds, tests, 'seconds');
  });
});
