import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';

const plugins = [
  alias({
    entries: [
      { find: 'cuid', replacement: 'cuid/dist/browser-cuid' },
    ]
  }),
  resolve(),
  commonjs(),
  babel({
    plugins: [['transform-react-jsx', { pragma: 'jsx' }]],
    babelHelpers: 'bundled',
  }),
]

if (process.env.production) {
  plugins.push(terser());
}

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/main.js',
    format: 'iife',
    name: 'main'
  },
  // context: 'module',
  plugins
};
