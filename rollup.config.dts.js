import dts from "rollup-plugin-dts"

import fs from 'fs'
import path from 'path'

const targets = [
  {
    input: "./dist/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
  {
    input: "./dist/array/index.d.ts",
    output: [{ file: "dist/array/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
]

const dirs = fs.readdirSync('dist')
  dirs.forEach((item, index) => {
    var fullpath = path.join('dist', item)
    const stat = fs.statSync(fullpath)
    if (stat.isDirectory()) {
      targets.push({
        input: "./dist/"+item+"/index.d.ts",
        output: [{ file: "dist/"+item+"/index.d.ts", format: "es" }],
        plugins: [dts()],
      })
    }
  })
process.on('exit', () => {
  const dirs = fs.readdirSync('dist')
  dirs.forEach((item, index) => {
    var fullpath = path.join('dist', item)
    const stat = fs.statSync(fullpath)
    if (stat.isDirectory()) {
      fs.rmSync("./dist/"+item+"/types.d.ts",)
    }
  })
  fs.rmSync('./dist/types', { recursive: true })
})


export default targets
