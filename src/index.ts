/* eslint-disable require-jsdoc */
/* eslint-disable no-invalid-this */
/* eslint-disable max-len */

import * as str from './string'
import * as num from './number'
import * as datetime from './datetime'
import * as is from './is'
import * as object from './object'
import * as collection from './collection'
import * as array from './array'
import * as math from './math'
import * as utils from './utils'
import * as functions from './functions'
import * as template from './template'
import * as tree from './tree'
import _, { chain, mixin } from './chaining'
import * as packageInfo from '../package.json'

mixin({
  ...str,
  ...num,
  ...datetime,
  ...is,
  ...object,
  ...collection,
  ...math,
  ...utils,
  ...functions,
  ...array,
  ...template,
  ...tree,
})
const namespace: Record<string, any> = _

/**
 * 默认导出。在umd模式下可通过 _ 直接访问
 */
namespace.VERSION = packageInfo.version
namespace.bind = functions.bind // 覆盖原型
namespace.chain = chain
namespace.mixin = mixin

/**
 * 当前版本
 */
export const VERSION = packageInfo.version
export * from './string'
export * from './is'
export * from './number'
export * from './datetime'
export * from './object'
export * from './collection'
export * from './array'
export * from './math'
export * from './functions'
export * from './utils'
export * from './template'
export * from './tree'
export { chain, mixin }

//bind _
const prevRef = (self as any)._ as any
;(self as any)._ = _

/**
 * 当通过非esm方式引用函数库时，函数库会默认挂载全局变量<code>_</code>。
 * 如果项目中存在其它以该变量为命名空间的函数库（如lodash、underscore等）则会发生命名冲突。
 * 该函数可以恢复全局变量为挂在前的引用，并返回func.js命名空间
 * **仅在UMD模式中可用**
 * @example
 * // 返回func.js并重置全局命名空间 _
 * console.log(_.noConflict())
 *
 * @returns 返回func.js命名空间
 * @since 2.0.0
 */
namespace.noConflict = function (): Record<string, any> {
  if (is.isDefined(prevRef)) {
    ;(self as any)._ = prevRef
  }
  return namespace
}

/**
 * 如果忘了文档地址可以执行这个函数
 *
 * @since 2.0.0
 */
namespace.info = function () {
  // welcome info
  const ssAry: string[] = []
  ;['248,116,51', '227,80,29', '179,55,15'].forEach((v, i) => {
    const cu = 'background:rgb(' + v + ');'
    if (i < 2) {
      ssAry[i] = ssAry[5 - 1 - i] = cu
    } else {
      ssAry[i] = 'color:#fff;' + cu
    }
  })
  console.info(
    `%c %c %c Func - The Functional APIs | v${packageInfo.version} %c %c `,
    ...ssAry,
    '🚀 https://holyhigh2.gitee.io/func/'
  )
}

export default namespace
