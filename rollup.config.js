/* eslint-disable max-len */
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import banner2 from 'rollup-plugin-banner2'
import json from '@rollup/plugin-json'
import copy from 'rollup-plugin-copy'
import typescript from 'rollup-plugin-typescript2'
import clear from 'rollup-plugin-clear'
import fs from 'fs'
import path from 'path'
const text = fs.readFileSync('./package.json', 'utf8')
const pkg = JSON.parse(text)

function readfilelist(dir, fileslist = []) {
  const files = fs.readdirSync(dir)
  files.forEach((item, index) => {
    var fullpath = path.join(dir, item)
    const stat = fs.statSync(fullpath)
    if (stat.isDirectory()) {
      readfilelist(path.join(dir, item), fileslist)
    } else {
      fileslist.push([fullpath, item])
    }
  })
  return fileslist
}

process.on('exit', () => {
  //move types
  readfilelist('./dist/types/src').forEach((path) => {
    fs.copyFileSync(path[0], './dist/types/' + path[1])
  })
  fs.rmSync('./dist/types/src', { recursive: true })
  //move modules
  const dirs = fs.readdirSync('dist')
  dirs.forEach((item, index) => {
    var fullpath = path.join('dist', item)
    const stat = fs.statSync(fullpath)
    if (!stat.isDirectory()) return

    const dirName = item
    if (dirName.startsWith('types')) return

    //copy package
    fs.copyFileSync(
      './dist/' + dirName + '/src/' + dirName + '.d.ts',
      './dist/' + dirName + '/index.d.ts'
    )
    fs.copyFileSync(
      './dist/types/types.d.ts',
      './dist/' + dirName + '/types.d.ts'
    )
    fs.rmSync('./dist/' + dirName + '/src', { recursive: true })
  })
})

const targets = [
  {
    input: 'src/index.ts',
    plugins: [
      clear({
        targets: ['dist'],
        watch: true,
      }),
      typescript({
        clean: true,
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          compilerOptions: {
            declarationDir: './dist/types',
          },
        },
      }),
      commonjs(),
      terser(),
      banner2(
        () => `/**
   * ${pkg.name} v${pkg.version}
   * ${pkg.description}
   * ${pkg.repository.url}
   * (c) 2021-${new Date().getFullYear()} @${pkg.author
          } may be freely distributed under the MIT license
   */
  `
      ),
      json(),
      copy({
        targets: [
          {
            src: [
              'CHANGELOG.md',
              'LICENSE',
              'README.md',
              'package.json',
              '.npmignore',
            ],
            dest: 'dist',
          },
        ],
      }),
    ],
    output: [
      {
        file: 'dist/index.esm.js',
        format: 'esm'
      },
      {
        file: 'dist/index.js',
        format: 'umd',
        name: '_$func'
      }
    ],
  }
]
//compile each module
readfilelist('./src').forEach((path) => {
  const fileName = path[1]
  const dirName = fileName.replace('.ts', '')
  if (fileName === 'types.ts' || fileName === 'index.ts') return;
  targets.push({
    input: 'src/' + fileName,
    plugins: [
      typescript(),
      commonjs(),
      terser(),
      banner2(
        () => `/**
   * ${pkg.name}/${dirName} v${pkg.version}
   * ${pkg.description}
   * ${pkg.repository.url}
   * (c) 2021-${new Date().getFullYear()} @${pkg.author
          } may be freely distributed under the MIT license
   */
  `
      ),
      json()
    ],
    output: [
      {
        file: 'dist/' + dirName + '/index.js',
        format: 'esm'
      },
    ]
  })
})

export default targets
