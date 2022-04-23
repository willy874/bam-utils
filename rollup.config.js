import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import image from '@rollup/plugin-image'
import typescript from 'rollup-plugin-typescript'
import dts from "rollup-plugin-dts";

const plugins = [
  image(),
  typescript(),
  resolve(),
  commonjs(),
]
const external = []

export default [{
    input: 'node.ts',
    output: {
      file: 'dist/utils-node.js',
      format: 'esm'
    },
    plugins,
    external
  },
  {
    input: 'node.ts',
    output: {
      file: 'dist/utils-node.cjs.js',
      format: 'cjs'
    },
    plugins,
    external
  },
  {
    input: 'node.ts',
    output: [{
      file: "dist/types-node.d.ts",
      format: "es"
    }],
    plugins: [dts()],
  },
  {
    input: 'browser.ts',
    output: {
      file: 'dist/utils-browser.js',
      format: 'esm'
    },
    plugins,
    external
  },
  {
    input: 'browser.ts',
    output: {
      file: 'dist/utils-browser.cjs.js',
      format: 'cjs'
    },
    plugins,
    external
  },
  {
    input: 'browser.ts',
    output: [{
      file: "dist/types-browser.d.ts",
      format: "es"
    }],
    plugins: [dts()],
  },
]