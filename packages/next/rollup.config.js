import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';

const pkg = require('./package.json');

const rollupConfig = {
  input: 'src/index.ts',
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
        },
      },
    }),
    postcss(),
  ],
  external: (id) => !id.startsWith('.') && !id.startsWith('/')
};

const cjs = {
  ...rollupConfig,
  output: {
    file: pkg.main,
    format: 'cjs',
    sourcemap: false,
  },
};

const esm = {
  ...rollupConfig,
  output: {
    file: pkg.module,
    format: 'es',
    sourcemap: false,
  },
};

export default [cjs, esm];