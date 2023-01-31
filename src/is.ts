/**
 * 验证类函数
 *
 * @packageDocumentation
 */
import { ArrayLike, IList, UnknownMapKey } from './types'

/**
 * 
 * @author holyhigh
 */
const UDF = void 0

/**
 * 判断两个值是否相等。使用<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality">SameValueZero</a>
 * 算法进行值比较。
 *
 * @example
 * //true
 * console.log(_.eq(NaN,NaN))
 * //false
 * console.log(_.eq(1,'1'))
 *
 * @param a
 * @param b
 * @returns
 * @since 1.0.0
 */
function eq(a: unknown, b: unknown): boolean {
  if (isNaN(a) && isNaN(b)) return true
  return a === b
}

/**
 * 判断参数是否为undefined
 * @example
 * //true
 * console.log(_.isUndefined(undefined))
 * //false
 * console.log(_.isUndefined(null))
 *
 * @param v
 * @returns
 */
function isUndefined(v: unknown): v is undefined {
  return v === UDF
}

/**
 * isUndefined()的反向验证函数，在需要验证是否变量存在的场景下非常有用
 * @example
 * //true
 * console.log(_.isDefined(null))
 * //false
 * console.log(_.isDefined(undefined))
 *
 * @param v
 * @returns
 */
function isDefined(v: unknown): boolean {
  return !isUndefined(v)
}

/**
 * 判断参数是否为null
 *
 * @example
 * //true
 * console.log(_.isNull(null))
 * //false
 * console.log(_.isNull(undefined))
 *
 * @param v
 * @returns
 */
function isNull(v: unknown): boolean {
  return null === v
}

/**
 * 判断参数是否为空，包括`null/undefined/空字符串/0/[]/{}`都表示空
 * 
 * 注意：相比isBlank，isEmpty只判断字符串长度是否为0
 *
 * @example
 * //true
 * console.log(_.isEmpty(null))
 * //true
 * console.log(_.isEmpty([]))
 * //false
 * console.log(_.isEmpty({x:1}))
 *
 * @param v
 * @returns
 */
function isEmpty(v: unknown): boolean {
  if (null === v) return true
  if (UDF === v) return true
  if ('' === v) return true
  if (0 === v) return true
  if (isArrayLike(v) && v.length < 1) return true
  if (v instanceof Object && Object.keys(v).length < 1) return true
  return false
}

/**
 * 对字符串进行trim后进行验证。如果非字符串，逻辑同isEmpty()
 * @example
 * //true
 * console.log(_.isBlank('  '))
 * //true
 * console.log(_.isBlank(null))
 * //true
 * console.log(_.isBlank({}))
 * //false
 * console.log(_.isBlank('     1'))
 *
 * @param v 字符串
 * @returns 如果字符串是null或trim后长度为0，返回true
 * @since 0.16.0
 */
function isBlank(v: unknown): boolean {
  return isEmpty(v) || (v + '').trim().length === 0
}

/**
 * 判断参数是否为Array对象的实例
 *
 * @example
 * //true
 * console.log(_.isArray([]))
 * //false
 * console.log(_.isArray(document.body.children))
 *
 * @param v
 * @returns
 */
function isArray(v: unknown): v is any[] {
  // 使用 instanceof Array 无法鉴别某些场景，比如
  // Array.prototype instanceof Array => false
  // Array.isArray(Array.prototype) => true
  // typeof new Proxy([],{}) => object
  // Array.isArray(new Proxy([],{})) => true
  return Array.isArray(v)
}

/**
 * 判断参数是否为类数组对象
 *
 * @example
 * //true
 * console.log(_.isArrayLike('abc123'))
 * //true
 * console.log(_.isArrayLike([]))
 * //true
 * console.log(_.isArrayLike(document.body.children))
 *
 * @param v
 * @returns
 */
function isArrayLike(v: unknown): v is ArrayLike {
  if (isString(v) && v.length > 0) return true
  if (!isObject(v)) return false
  // 具有length属性
  const list = v as IList
  if (isNumber(list.length)) {
    const proto = list.constructor.prototype
    // NodeList/HTMLCollection/CSSRuleList/...
    if (isFunction(proto.item)) return true
    // arguments
    if (isFunction(list[Symbol.iterator])) return true
  }

  return false
}

/**
 * 判断参数是否为字符串，包括String类的实例以及基本类型string的值
 *
 * @example
 * //true
 * console.log(_.isString(new String('')))
 * //true
 * console.log(_.isString(''))
 *
 * @param v
 * @returns
 */
function isString(v: unknown): v is string {
  return typeof v === 'string' || v instanceof String
}

/**
 * 判断参数是否为函数对象
 *
 * @example
 * //true
 * console.log(_.isFunction(new Function()))
 * //true
 * console.log(_.isFunction(()=>{}))
 *
 * @param v
 * @returns
 */
function isFunction(v: unknown): v is Function {
  return typeof v == 'function' || v instanceof Function
}

/**
 * 判断参数是否为数字类型值
 *
 * @example
 * //true
 * console.log(_.isNumber(1))
 * //true
 * console.log(_.isNumber(Number.MAX_VALUE))
 * //false
 * console.log(_.isNumber('1'))
 *
 * @param v
 * @returns
 */
function isNumber(v: unknown): v is number {
  return typeof v === 'number' || v instanceof Number
}

const PRIMITIVE_TYPES = [
  'string',
  'number',
  'bigint',
  'boolean',
  'undefined',
  'symbol',
]
/**
 * 判断值是不是一个非基本类型外的值，如果true则认为值是一个对象
 * 同样，该方法还可以用来判断一个值是不是基本类型
 *
 * @example
 * //false
 * console.log(_.isObject(1))
 * //true
 * console.log(_.isObject(new String()))
 * //false
 * console.log(_.isObject(true))
 * //false
 * console.log(_.isObject(null))
 *
 * @param v value
 * @returns 是否对象。如果值是null返回false，即使typeof null === 'object'
 */
function isObject(v: unknown): v is Record<UnknownMapKey, any> {
  return !isNull(v) && PRIMITIVE_TYPES.indexOf(typeof v) < 0
}

/**
 * 判断值是不是一个朴素对象，即通过Object创建的对象
 *
 * @example
 * //false
 * console.log(_.isPlainObject(1))
 * //false
 * console.log(_.isPlainObject(new String()))
 * //true
 * console.log(_.isPlainObject({}))
 * //false
 * console.log(_.isPlainObject(null))
 * //true
 * console.log(_.isPlainObject(new Object))
 * function Obj(){}
 * //false
 * console.log(_.isPlainObject(new Obj))
 *
 * @param v value
 * @returns 是否朴素对象
 * @since 0.19.0
 */
function isPlainObject(v: unknown): boolean {
  return isObject(v) && v.constructor === Object.prototype.constructor
}

/**
 * 判断值是不是一个Map对象
 *
 * @example
 * //true
 * console.log(_.isMap(new Map()))
 * //false
 * console.log(_.isMap(new WeakMap()))
 *
 * @param v
 * @returns
 */
function isMap(v: unknown): v is Map<any, any> {
  return v instanceof Map
}

/**
 * 判断值是不是一个WeakMap对象
 *
 * @example
 * //true
 * console.log(_.isWeakMap(new WeakMap))
 * //false
 * console.log(_.isWeakMap(new Map))
 *
 * @param v
 * @returns
 */
function isWeakMap(v: unknown): v is WeakMap<any, any> {
  return v instanceof WeakMap
}

/**
 * 判断值是不是一个Set对象
 *
 * @example
 * //false
 * console.log(_.isSet(new WeakSet))
 * //true
 * console.log(_.isSet(new Set))
 *
 * @param v
 * @returns
 */
function isSet(v: unknown): v is Set<any> {
  return v instanceof Set
}

/**
 * 判断值是不是一个WeakSet对象
 *
 * @example
 * //true
 * console.log(_.isWeakSet(new WeakSet))
 * //false
 * console.log(_.isWeakSet(new Set))
 *
 * @param v
 * @returns
 */
function isWeakSet(v: unknown): v is WeakSet<any> {
  return v instanceof WeakSet
}

/**
 * 判断值是不是一个布尔值
 *
 * @example
 * //true
 * console.log(_.isBoolean(false))
 * //false
 * console.log(_.isBoolean('true'))
 * //false
 * console.log(_.isBoolean(1))
 *
 * @param v
 * @returns
 */
function isBoolean(v: unknown): v is boolean {
  return typeof v === 'boolean' || v instanceof Boolean
}

/**
 * 判断值是不是一个Date实例
 *
 * @example
 * //true
 * console.log(_.isDate(new Date()))
 * //false
 * console.log(_.isDate('2020/1/1'))
 *
 * @param v
 * @returns
 */
function isDate(v: unknown): v is Date {
  return v instanceof Date
}

/**
 * 判断值是不是一个整数
 *
 * @example
 * //true
 * console.log(_.isInteger(-0))
 * //true
 * console.log(_.isInteger(5.0))
 * //false
 * console.log(_.isSafeInteger(5.000000000000001))
 * //true
 * console.log(_.isSafeInteger(5.0000000000000001))
 * //false
 * console.log(_.isInteger('5'))
 * //true
 * console.log(_.isInteger(Number.MAX_SAFE_INTEGER))
 * //true
 * console.log(_.isInteger(Number.MAX_VALUE))
 *
 * @param v
 * @returns
 */
function isInteger(v: unknown): v is number {
  return Number.isInteger(v)
}

/**
 * 判断值是不是一个安全整数
 *
 * @example
 * //true
 * console.log(_.isSafeInteger(-0))
 * //true
 * console.log(_.isSafeInteger(5.0))
 * //false
 * console.log(_.isSafeInteger(5.000000000000001))
 * //true
 * console.log(_.isSafeInteger(5.0000000000000001))
 * //false
 * console.log(_.isSafeInteger('5'))
 * //true
 * console.log(_.isSafeInteger(Number.MAX_SAFE_INTEGER))
 * //false
 * console.log(_.isSafeInteger(Number.MAX_VALUE))
 *
 * @param v
 * @returns
 */
function isSafeInteger(v: unknown): v is number {
  return Number.isSafeInteger(v)
}

/**
 * 判断值是否NaN本身。与全局isNaN函数相比，只有NaN值本身才会返回true
 * <p>
 * isNaN(undefined) => true <br>
 * _.isNaN(undefined) => false
 * </p>
 *
 * @example
 * //true
 * console.log(_.isNaN(NaN))
 * //false
 * console.log(_.isNaN(null))
 * //false
 * console.log(_.isNaN(undefined))
 *
 * @param v
 * @returns
 */
function isNaN(v: unknown): boolean {
  return Number.isNaN(v)
}

/**
 * 判断两个值是否相等，对于非基本类型会进行深度比较，可以比较日期/正则/数组/对象等
 *
 * @example
 * //false
 * console.log(_.isEqual(1,'1'))
 * //true,false
 * let o = {a:1,b:[2,{c:['3','x']}]}
 * let oo = {a:1,b:[2,{c:['3','x']}]}
 * console.log(_.isEqual(o,oo),o == oo)
 * //true
 * console.log(_.isEqual([new Date('2010-2-1'),/12/],[new Date(1264953600000),new RegExp('12')]))
 * //false
 * console.log(_.isEqual([new Date('2010-2-1'),'abcd'],['2010/2/1','Abcd']))
 *
 * @param a
 * @param b
 * @returns
 * @since 1.0.0
 */
function isEqual(a: unknown, b: unknown): boolean {
  return isEqualWith(a, b)
}

/**
 * 同<code>isEqual</code>，但支持自定义比较器
 *
 * @example
 * //true
 * console.log(_.isEqualWith([new Date('2010-2-1'),'abcd'],['2010/2/1','Abcd'],(av,bv)=>_.isDate(av)?av.toLocaleDateString() == bv:_.test(av,bv,'i')))
 *
 * @param a
 * @param b
 * @param [comparator] 比较器，参数(v1,v2)，返回true表示匹配。如果返回undefined使用对应内置比较器处理
 * @returns
 * @since 1.0.0
 */
function isEqualWith(a: any, b: any, comparator?: Function): boolean {
  let cptor = comparator
  if (!isObject(a) || !isObject(b)) {
    return (cptor || eq)(a, b)
  }
  let keys = []

  if ((keys = Object.keys(a)).length !== Object.keys(b).length) return false
  if (isDate(a) && isDate(b))
    return cptor ? cptor(a, b) : a.getTime() === b.getTime()
  if (isRegExp(a) && isRegExp(b))
    return cptor ? cptor(a, b) : a.toString() === b.toString()

  for (let i = keys.length; i--; ) {
    const k = keys[i]
    const v1 = (a as any)[k],
      v2 = (b as any)[k]
    if (!isEqualWith(v1, v2, cptor)) {
      return false
    }
  }

  return true
}

/**
 * 检测props对象中的所有属性是否在object中存在，可用于对象的深度对比。
 * 使用<code>eq</code>作为值对比逻辑
 *
 * @example
 * let target = {a:{x:1,y:2},b:1}
 * //true
 * console.log(_.isMatch(target,{b:1}))
 * //true
 * console.log(_.isMatch(target,{a:{x:1}}))
 *
 * target = [{x:1,y:2},{b:1}]
 * //true
 * console.log(_.isMatch(target,{1:{b:1}}))
 * //true
 * console.log(_.isMatch(target,[{x:1}]))
 *
 * @param object
 * @param props 对比属性对象，如果是null，返回true
 * @returns 匹配所有props返回true
 * @since 0.17.0
 */
function isMatch<T extends Record<UnknownMapKey, any>>(
  object: T,
  props: T
): boolean {
  return isMatchWith(object, props, eq)
}

/**
 * 检测props对象中的所有属性是否在object中存在并使用自定义比较器对属性值进行对比。可以用于对象的深度对比。
 * 当comparator参数是默认值时，与<code>isMath</code>函数相同
 *
 * @example
 * let target = {a:{x:1,y:2},b:1}
 * //true
 * console.log(_.isMatchWith(target,{b:1}))
 * //false
 * console.log(_.isMatchWith(target,{b:'1'}))
 *
 * target = {a:null,b:0}
 * //true
 * console.log(_.isMatchWith(target,{a:'',b:'0'},(a,b)=>_.isEmpty(a) && _.isEmpty(b)?true:a==b))
 *
 * @param target 如果不是对象类型，返回false
 * @param props 对比属性对象，如果是nil，返回true
 * @param [comparator=eq] 比较器，参数(object[k],props[k],k,object,props)，返回true表示匹配
 * @returns 匹配所有props返回true
 * @since 0.18.1
 */
function isMatchWith<T extends Record<UnknownMapKey, any>>(
  target: T,
  props: T,
  comparator: Function = eq
) {
  if (isNil(props)) return true
  const ks = Object.keys(props)
  if (!isObject(target)) return false
  let rs = true
  for (let i = ks.length; i--; ) {
    const k = ks[i]
    const v1 = target[k]
    const v2 = props[k]
    if (isObject(v1) && isObject(v2)) {
      if (!isMatchWith(v1, v2, comparator)) {
        rs = false
        break
      }
    } else {
      if (!comparator(v1, v2, k, target, props)) {
        rs = false
        break
      }
    }
  }
  return rs
}

/**
 * 判断值是不是一个正则对象
 *
 * @example
 * //true
 * console.log(_.isRegExp(new RegExp))
 * //true
 * console.log(_.isRegExp(/1/))
 *
 * @param v
 * @returns
 * @since 0.19.0
 */
function isRegExp(v: unknown): v is RegExp {
  return typeof v === 'object' && v instanceof RegExp
}

/**
 * 判断值是不是DOM元素
 *
 * @example
 * //true
 * console.log(_.isElement(document.body))
 * //false
 * console.log(_.isElement(document))
 *
 * @param v
 * @returns
 * @since 1.0.0
 */
function isElement(v: unknown): v is HTMLElement {
  return typeof v === 'object' && v instanceof HTMLElement
}

/**
 * 判断值是不是异常对象
 *
 * @example
 * //true
 * console.log(_.isError(new TypeError))
 * //false
 * console.log(_.isError(Error))
 * //true
 * try{a=b}catch(e){console.log(_.isError(e))}
 *
 * @param v
 * @returns
 * @since 1.0.0
 */
function isError(v: unknown): v is Error {
  return typeof v === 'object' && v instanceof Error
}

/**
 * 判断值是不是Symbol
 *
 * @example
 * //true
 * console.log(_.isSymbol(Symbol()))
 *
 * @param v
 * @returns
 * @since 1.0.0
 */
function isSymbol(v: unknown): v is symbol {
  return typeof v === 'symbol'
}

/**
 * 判断值是不是有限数字
 *
 * @example
 * //false
 * console.log(_.isFinite('0'))
 * //true
 * console.log(_.isFinite(0))
 * //true
 * console.log(_.isFinite(Number.MAX_VALUE))
 * //true
 * console.log(_.isFinite(99999999999999999999999999999999999999999999999999999999999999999999999))
 * //false
 * console.log(_.isFinite(Infinity))
 *
 * @param v
 * @returns
 * @since 1.0.0
 */
function isFinite(v: unknown): boolean {
  return Number.isFinite(v)
}

/**
 * 判断值是否为null或undefined
 *
 * @example
 * //true
 * console.log(_.isNil(undefined))
 * //false
 * console.log(_.isNil(0))
 * //true
 * console.log(_.isNil(null))
 * //false
 * console.log(_.isNil(NaN))
 *
 * @param v
 * @returns
 * @since 1.2.3
 */
function isNil(v: unknown): v is null | undefined {
  return isNull(v) || isUndefined(v)
}

export {
  isDefined,
  isUndefined,
  isArray,
  isArrayLike,
  isEmpty,
  isNull,
  isObject,
  isPlainObject,
  isFunction,
  isString,
  isNumber,
  isMap,
  isWeakMap,
  isSet,
  isWeakSet,
  isBoolean,
  isDate,
  isInteger,
  isSafeInteger,
  isNaN,
  isEqual,
  isBlank,
  isMatch,
  isMatchWith,
  isRegExp,
  isElement,
  isError,
  isSymbol,
  isFinite,
  isEqualWith,
  isNil,
  eq,
}
