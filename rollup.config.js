import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  dest: 'dist/jquery.durationInput.js',
  format: 'umd',
  banner:
`/*
  jquery.durationInput ${process.env.npm_package_version}
  Samuel Santiago <samuelsantia@gmail.com>
  license: ISC <https://opensource.org/licenses/ISC>
 */`,
  plugins: [ babel() ],
  external: [ 'jquery' ],
  globals: {
    jquery: 'jQuery'
  }
};
