// Karma configuration
// Generated on Thu May 12 2016 12:57:57 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      'test/**/*.js',
      //{ watched: true, pattern: 'src/**/*.js', included: false, served: false }
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      //'src/**/*.js': ['rollup'],
      'test/**/*-test.js': ['rollup']
    },

    rollupPreprocessor: {
      rollup: {
        external: [
            'chai'
        ],
        plugins: [
          require('rollup-plugin-babel')(),
          require('rollup-plugin-istanbul')({
            exclude: ['test/**/*-test.js']
          })
        ]
      },
      bundle: {
        globals: {
            chai: 'chai'
        },
        sourceMap: 'inline',
        format: 'umd'
      }
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],

    coverageReporter: {
        reporters: [
            {'type': 'html', dir: 'coverage'},
            {'type': 'lcov'}
        ]
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox', 'PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
