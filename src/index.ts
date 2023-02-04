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
});

(_ as any).VERSION = packageInfo.version as any
(_ as any).bind = functions.bind  as any// 覆盖原型
(_ as any).chain = chain as any
(_ as any).mixin = mixin as any

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
const ctx = globalThis as any
if(ctx._$func){
  setTimeout(function(){
    ctx.__f_prev = ctx._
    ctx._ = _
  },0);
}

export default _
