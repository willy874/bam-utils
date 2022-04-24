import {
  nodeResolve
} from '@rollup/plugin-node-resolve'
// import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import globals from 'rollup-plugin-node-globals'
import image from '@rollup/plugin-image'
import typescript from 'rollup-plugin-typescript'
import dts from "rollup-plugin-dts";

const browserPlugins = [
  image(),
  typescript(),
  commonjs(),
  nodeResolve({
    browser: true,
    preferBuiltins: true
  }),
]
const nodePlugins = [
  image(),
  typescript(),
  nodeResolve(),
  globals(),
  commonjs({
    include: ['node_modules/**']
  }),
  commonjs(),
]
const external = []

export default [{
    input: 'node.ts',
    output: {
      file: 'dist/utils-node.mjs',
      format: 'esm'
    },
    plugins: nodePlugins,
    external
  },
  {
    input: 'node.ts',
    output: {
      file: 'dist/utils-node.cjs.js',
      format: 'cjs'
    },
    plugins: nodePlugins,
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
      file: 'dist/utils-browser.mjs',
      format: 'esm'
    },
    plugins: browserPlugins,
    external
  },
  {
    input: 'browser.ts',
    output: {
      file: 'dist/utils-browser.cjs.js',
      format: 'cjs'
    },
    plugins: browserPlugins,
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