/* eslint-disable max-len */
/**
 * 一些常用辅助函数
 *
 * @packageDocumentation
 */

import { join, range } from './array'
import { map } from './collection'
import {
  isArray,
  isDefined,
  isFunction,
  isMatch,
  isNaN,
  isNil,
  isNull,
  isObject,
  isString,
  isUndefined,
} from './is'
import { randi } from './math'
import { prop, toObject } from './object'
import { padEnd, padZ, substring } from './string'
import { NonFuncItee } from './types'
import * as packageInfo from '../package.json'

/**
 * 工具相关操作函数
 * @author holyhigh
 */
const UDF = void 0
/**
 * 返回一个全局的整数id，序号从0开始。可以用于前端列表编号等用途
 *
 * @example
 * //func_0
 * console.log(_.uniqueId('func'))
 * //1
 * console.log(_.uniqueId())
 *
 * @param [prefix] id前缀
 * @returns 唯一id
 * @since 0.16.0
 */
function uniqueId(prefix?: string): string {
  return (isDefined(prefix) ? prefix + '_' : '') + seed++
}
let seed = 0

/**
 * 永远返回undefined
 * @example
 * //undefined
 * console.log(_.noop('func'))
 * //undefined
 * console.log(_.noop())
 *
 * @returns undefined
 * @since 0.16.0
 */
function noop(): undefined {
  return UDF
}

/**
 * 返回参数列表中的第一个值,即<code>f(x) = x</code>。该函数可以用来为高阶函数提供数据如过滤列表或map，也用作默认迭代器
 * @example
 * //[1,2,4,'a','1']
 * console.log(_.filter([0,1,false,2,4,undefined,'a','1','',null],_.identity))
 * const list = [
 *  {name:'a',value:1},
 *  {name:'b',value:2},
 *  {name:'c',value:3}
 * ]
 * //list
 * console.log(_.map(list,_.identity))
 *
 * @param v
 * @returns 第一个参数
 * @since 0.17.0
 */
function identity(v: any): any {
  return v
}

/**
 * 解析path并返回数组
 * @example
 * //['a', 'b', '2', 'c']
 * console.log(_.toPath('a.b[2].c'))
 * //['a', 'b', 'c', '1']
 * console.log(_.toPath(['a','b','c[1]']))
 * //['1']
 * console.log(_.toPath(1))
 *
 * @param path 属性路径，可以是数字索引，字符串key，或者多级属性数组
 * @returns path数组
 * @since 0.16.0
 */
function toPath(path: Array<string | number> | string | number): string[] {
  let chain = path
  if (isArray(chain)) {
    chain = join(chain, '.')
  } else {
    chain += ''
  }

  const rs = (chain + '')
    .replace(/\[([^\]]+)\]/gm, '.$1')
    .replace(/^\./g, '')
    .split('.')

  return rs
}

/**
 * 如果v是null/undefined/NaN中的一个，返回defaultValue
 * @example
 * //"x"
 * console.log(_.defaultTo(null,'x'))
 * //0
 * console.log(_.defaultTo(0,'y'))
 *
 * @param v 任何值
 * @param defaultValue 任何值
 * @returns v或defaultValue
 * @since 0.16.0
 */
function defaultTo<T, V>(v: T, defaultValue: V): T | V {
  if (isNull(v) || isUndefined(v) || isNaN(v)) return defaultValue
  return v
}

/**
 * 创建一个函数，该函数接收一个对象为参数并返回对该对象使用props进行验证的的断言结果。
 *
 *
 * @example
 * const libs = [
 *  {name:'func.js',platform:['web','nodejs'],tags:{utils:true},js:true},
 *  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:false},
 *  {name:'soya2d',platform:['web'],tags:{utils:true},js:false}
 * ];
 *
 * //[{func.js...}]
 * console.log(_.filter(libs,_.matcher({tags:{utils:true},js:true})))
 *
 * @param props 断言条件对象
 * @returns matcher(v)函数
 * @since 0.17.0
 */
function matcher<T extends Object>(props: T): (obj: T) => boolean {
  return (obj) => {
    return isMatch(obj, toObject(props))
  }
}

/**
 * 创建一个函数，函数类型根据参数值类型而定。创建的函数常用于迭代回调，在Func.js内部被大量使用
 *
 * @example
 * const libs = [
 *  {name:'func.js',platform:['web','nodejs'],tags:{utils:true},js:true},
 *  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:false},
 *  {name:'soya2d',platform:['web'],tags:{utils:true},js:false}
 * ];
 *
 * //[{func.js...}] 如果参数是object，返回_.matcher
 * console.log(_.filter(libs,_.iteratee({tags:{utils:true},js:true})))
 * //[func.js,juth2,soya2d] 如果参数是字符串，返回_.prop
 * console.log(_.map(libs,_.iteratee('name')))
 * //[true,false,true] 如果参数是数组，内容会转为path，并返回_.prop
 * console.log(_.map(libs,_.iteratee(['tags','utils'])))
 * //[1,3,5] 如果参数是函数，返回这个函数
 * console.log(_.filter([1,2,3,4,5],_.iteratee(n=>n%2)))
 * //[1,2,4,'a','1'] 无参返回_.identity
 * console.log(_.filter([0,1,false,2,4,undefined,'a','1','',null],_.iteratee()))
 *
 *
 * @param value 迭代模式
 * <br>当value是字符串类型时，返回_.prop
 * <br>当value是对象类型时，返回_.matcher
 * <br>当value是数组类型时，内容会转为path，并返回_.prop
 * <br>当value是函数时，返回这个函数
 * <br>当value未定义时，返回_.identity
 * <br>其他类型返回f() = false
 * @returns 不同类型的返回函数
 * @since 0.17.0
 */
function iteratee(value: Function | NonFuncItee): Function {
  if (isUndefined(value)) {
    return identity
  } else if (isFunction(value)) {
    return value
  } else if (isString(value)) {
    return prop(value)
  } else if (isArray(value)) {
    return prop(toPath(value))
  } else if (isObject(value)) {
    return matcher(value)
  }
  return () => false
}

/**
 * 调用iteratee函数n次，并将历次调用的返回值数组作为结果返回
 * @example
 * //['0',...,'4']
 * console.log(_.times(5,String))
 * //[[0],[1]]
 * console.log(_.times(2,_.toArray))
 *
 * @param n 迭代次数
 * @param iteratee 每次迭代调用函数
 * @returns 返回值数组
 * @since 0.17.0
 */
function times(n: number, iteratee: (n: number) => any): any[] {
  return range(n).map(iteratee)
}

const VARIANTS = ['8', '9', 'a', 'b']
const ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'.split('')
/**
 * 生成一个32/36个字符组件的随机uuid(v4)并返回
 * @example
 * // ddfd73a5-62ac-4412-ad2b-fd495f766caf
 * console.log(_.uuid(true))
 * // ddfd73a562ac4412ad2bfd495f766caf
 * console.log(_.uuid())
 *
 * @param delimiter 是否生成分隔符
 * @returns uuid
 * @since 1.4.0
 */
function uuid(delimiter?: boolean): string {
  let uuid = ''
  if (self.crypto.randomUUID) {
    // only in https
    uuid = self.crypto.randomUUID()
  } else {
    const r32 = Math.random()
    const r16 = Math.random()
    const p1Num = Math.floor(r32 * (0xffffffff - 0x10000000)) + 0x10000000
    const p1 = p1Num.toString(16)
    const p2Num = Math.floor(r16 * (0xffff - 0x1000)) + 0x1000
    const p2 = p2Num.toString(16)
    const p3 = substring((p2Num << 1).toString(16), 0, 3)
    const p4 = substring((p2Num >> 1).toString(16), 0, 3)
    let p5 = Date.now().toString(16)
    p5 =
      substring((p1Num >> 1).toString(16), 0, 6) +
      substring(p5, p5.length - 6, p5.length)

    uuid =
      p1 + '-' + p2 + '-4' + p3 + '-' + VARIANTS[randi(0, 3)] + p4 + '-' + p5
  }
  return delimiter ? uuid : uuid.replace(/-/g, '')
}

/**
 * 生成一个指定长度的alphaId并返回。id内容由随机字母表字符组成
 * @example
 * // urN-k0mpetBwboeQ
 * console.log(_.alphaId())
 * // Ii6cPyfw-Ql5YC8OIhVwH1lpGY9x
 * console.log(_.alphaId(28))
 *
 * @param [len=16] id长度
 * @returns alphaId
 * @since 1.4.0
 */
function alphaId(len?: number): string {
  const bytes = self.crypto.getRandomValues(new Uint8Array(len || 16))
  return map<number>(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('')
}

/**
 * 生成一个64bit整数的雪花id并返回，具体格式如下：
 * <code>
 * 0 - timestamp                                       - nodeId       - sequence<br>
 * 0 - [0000000000 0000000000 0000000000 0000000000 0] - [0000000000] - [000000000000]
 * </code>
 * 可用于客户端生成可跟踪统计的id，如定制终端
 * @example
 * // 343155438738309188
 * console.log(_.snowflakeId(123))
 * // 78249955004317758
 * console.log(_.snowflakeId(456,new Date(2022,1,1).getTime()))
 *
 * @param nodeId 节点id，10bit整数
 * @param [epoch=1580486400000] 时间起点，用于计算相对时间戳
 * @returns snowflakeId 由于js精度问题，直接返回字符串而不是number，如果nodeId为空返回 '0000000000000000000'
 * @since 1.4.0
 */
function snowflakeId(nodeId: number, epoch?: number): string {
  epoch = epoch || 1580486400000
  if (isNil(nodeId)) return '0000000000000000000'

  let nowTime = Date.now()

  // 12bits for seq
  if (lastTimeStamp === nowTime) {
    sequence += randi(1, 9)
    if (sequence > 0xfff) {
      nowTime = _getNextTime(lastTimeStamp)
      sequence = randi(0, 99)
    }
  } else {
    sequence = randi(0, 99)
  }

  lastTimeStamp = nowTime

  // 41bits for time
  const timeOffset = (nowTime - epoch).toString(2)
  // 10bits for nodeId
  const nodeBits = padEnd((nodeId % 0x3ff).toString(2) + '', 10, '0')
  // 12bits for seq
  const seq = padZ(sequence.toString(2) + '', 12)

  return BigInt(`0b${timeOffset}${nodeBits}${seq}`).toString()
}
let lastTimeStamp = -1
let sequence = 0
const _getNextTime = (lastTime: number) => {
  let t = Date.now()
  while (t <= lastTime) {
    t = Date.now()
  }
  return t
}

/**
 * 如果忘了文档地址可以执行这个函数
 *
 * @since 2.0.0
 */
function info() {
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
    '🚀 https://github.com/holyhigh2/func.js'
  )
}

/**
 * 当通过非esm方式引用函数库时，函数库会默认挂载全局变量<code>_</code>。
 * 如果项目中存在其它以该变量为命名空间的函数库（如lodash、underscore等）则会发生命名冲突。
 * 该函数可恢复全局变量为挂载前的引用，并返回func.js命名空间
 * **仅在UMD模式中可用**
 * @example
 * // 返回func.js并重置全局命名空间 _
 * console.log(_.noConflict())
 *
 * @returns 返回func.js命名空间
 * @since 2.0.0
 */
function noConflict(): Record<string, any> {
  const ctx = globalThis as any
  if (ctx._$func) {
    ctx._ = ctx.__f_prev
  }
  return ctx._$func
};

export {
  uniqueId,
  noop,
  toPath,
  defaultTo,
  matcher,
  identity,
  iteratee,
  times,
  uuid,
  alphaId,
  snowflakeId,
  info,
  noConflict
}
