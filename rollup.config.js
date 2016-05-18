import babel from 'rollup-plugin-babel';
//import jquery from 'jquery';

export default {
  entry: 'src/index.js',
  dest: 'dist/jquery.durationInput.js',
  format: 'umd',
  banner:
`/*
  jquery.durationInput 0.1.0
  Samuel Santiago <samuelsantia@gmail.com>
  license: ISC <https://opensource.org/licenses/ISC>
 */`,
  plugins: [ babel() ],
  external: [ 'jquery' ],
  globals: {
    jquery: 'jQuery'
  }
};
