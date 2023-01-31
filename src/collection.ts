/* eslint-disable valid-jsdoc */
/* eslint-disable max-len */
/**
 * 集合相关函数，实现所有集合类数据结构的操作方法，比如array / arraylike / set / map / object / ...
 *
 * @packageDocumentation
 */
/**
 * 
 * @author holyhigh
 */
import { flat, pop, range, slice } from './array'
import { compareDate } from './datetime'
import {
  isObject,
  isUndefined,
  isNull,
  isArrayLike,
  isMap,
  isSet,
  isFunction,
  isDefined,
  isString,
  isArray,
  isNumber,
  isDate,
  isNil,
  eq,
} from './is'
import { randi } from './math'
import { values } from './object'
import { toString } from './string'
import { Collection, IList, NonFuncItee, UnknownMapKey } from './types'
import { identity, iteratee } from './utils'

/**
 * 获取集合对象的内容数量，对于map/object对象获取的是键/值对的数量
 *
 * @example
 * //3
 * console.log(_.size({a:1,b:2,c:{x:1}}))
 * //0
 * console.log(_.size(null))
 * //3
 * console.log(_.size(new Set([1,2,3])))
 * //2
 * console.log(_.size([1,[2,[3]]]))
 * //2
 * console.log(_.size(document.body.children))
 * //4
 * console.log(_.size(document.body.childNodes))
 * //3 arguments已不推荐使用，请使用Rest参数
 * console.log((function(){return _.size(arguments)})('a',2,'b'))
 * //7
 * console.log(_.size('func.js'))
 *
 * @param collection
 * @returns 集合长度，对于null/undefined/WeakMap/WeakSet返回0
 */
function size(collection: Collection): number {
  if (isUndefined(collection) || isNull(collection)) return 0
  if (isDefined((collection as IList).length))
    return (collection as IList).length
  if (isMap(collection) || isSet(collection)) return collection.size
  if (isObject(collection)) return Object.keys(collection).length
  return 0
}

// eslint-disable-next-line require-jsdoc
function _eachIterator<V,K extends string | number | symbol>(
  collection: any,
  callback: (
    value: V,
    index: K,
    collection: Collection<V>
  ) => boolean | void,
  forRight: boolean
) {
  let values
  let keys
  if (isString(collection) || isArrayLike(collection)) {
    let size = collection.length

    if (forRight) {
      while (size--) {
        const r = callback(collection[size] as V, size as K, collection)
        if (r === false) return
      }
    } else {
      for (let i = 0; i < size; i++) {
        const r = callback(collection[i] as V, i as K, collection)
        if (r === false) return
      }
    }
  } else if (isSet(collection)) {
    let size = collection.size

    if (forRight) {
      values = Array.from(collection)
      while (size--) {
        const r = callback(values[size] as V, size as K, collection)
        if (r === false) return
      }
    } else {
      values = collection.values()
      for (let i = 0; i < size; i++) {
        const r = callback(values.next().value as V, i as K, collection)
        if (r === false) return
      }
    }
  } else if (isMap(collection)) {
    let size = collection.size

    keys = collection.keys()
    values = collection.values()

    if (forRight) {
      keys = Array.from(keys)
      values = Array.from(values)
      while (size--) {
        const r = callback(values[size] as V, keys[size] as K, collection)
        if (r === false) return
      }
    } else {
      for (let i = 0; i < size; i++) {
        const r = callback(
          values.next().value as V,
          keys.next().value as K,
          collection
        )
        if (r === false) return
      }
    }
  } else if (isObject(collection)) {
    keys = Object.keys(collection)
    let size = keys.length

    if (forRight) {
      while (size--) {
        const k = keys[size]
        const r = callback(collection[k] as V, k as K, collection)
        if (r === false) return
      }
    } else {
      for (let i = 0; i < size; i++) {
        const k = keys[i]
        const r = callback(collection[k] as V, k as K, collection)
        if (r === false) return
      }
    }
  }
}

/**
 * 对集合元素进行顺序遍历。
 * 注意，object类型无法保证遍历顺序
 *
 * @example
 * //1、2、3
 * _.each(new Set([1,2,3]),console.log)
 * //a、b、c
 * _.each({'1':'a','2':'b','3':'c'},console.log)
 * //1、{"a":1}、[2,3]
 * _.each([1,{a:1},[2,3]],console.log)
 * //h/o/l/y/h/i/g/h
 * _.each('holyhigh',console.log)
 * //遍历元素集合
 * const x=[];_.each(document.body.children,v=>x.push(v));console.log(x)
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @param callback (value[,index|key[,collection]]);回调函数，如果返回false会立即中断遍历
 */
function each<V>(
  collection: Collection<V>,
  callback: (
    value: V,
    index: UnknownMapKey,
    collection: Collection<V>
  ) => boolean | void
): void
function each<V, K extends string | number | symbol>(
  collection: Collection<V>,
  callback: (value: V, index: K, collection: Collection<V>) => boolean | void
): void
function each<V, K extends string | number | symbol>(
  collection: Collection<V>,
  callback: (value: V, index: K, collection: Collection<V>) => boolean | void
): void {
  _eachIterator<V,K>(collection, callback, false)
}

/**
 * 对集合元素进行顺序遍历，与 forEach 不同在于遍历顺序是从右到左
 * 注意，object类型无法保证遍历顺序
 *
 * @example
 * //3、2、1
 * _.eachRight(new Set([1,2,3]),console.log)
 * //c、b、a
 * _.eachRight({'1':'a','2':'b','3':'c'},console.log)
 * //[2,3]、{"a":1}、1
 * _.eachRight([1,{a:1},[2,3]],console.log)
 * //hgihyloh
 * _.eachRight('holyhigh',console.log)
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @param callback (value[,index|key[,collection]]);回调函数，如果返回false会立即中断遍历
 */
function eachRight<V>(
  collection: Collection<V>,
  callback: (
    value: V,
    index: UnknownMapKey,
    collection: Collection<V>
  ) => boolean | void
): void
function eachRight<V, K extends string | number | symbol>(
  collection: Collection<V>,
  callback: (value: V, index: K, collection: Collection<V>) => boolean | void
): void
function eachRight<V, K extends string | number | symbol>(
  collection: Collection<V>,
  callback: (value: V, index: K, collection: Collection<V>) => boolean | void
): void {
  _eachIterator<V,K>(collection, callback, true)
}

/**
 * 对集合内的所有元素进行断言，直到第一个返回false的元素结束。如果所有元素断言都为真返回true
 *
 * @example
 * const libs = [
 *  {name:'func.js',platform:['web','nodejs'],tags:{utils:true},js:true},
 *  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:false},
 *  {name:'soya2d',platform:['web'],tags:{utils:true},js:true}
 * ];
 *
 * //true
 * console.log(_.every([]))
 * //true
 * console.log(_.every([1,3,5],v=>v%2===1))
 * //false
 * console.log(_.every(['a','b','c',1],_.isNumber))
 * //false
 * console.log(_.every(libs,'tags.utils'))
 * //false
 * console.log(_.every(libs,{js:true}))
 * //false key不支持路径解析
 * console.log(_.every(libs,{'platform[0]':'web'}))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @param predicate (value[,index|key[,collection]]) 断言
 * <br>当断言是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @returns 全部通过返回true，否则false。对于一个空集合，会返回true
 */
function every<V>(
  collection: Collection<V>,
  predicate:
    | ((value: V, index: UnknownMapKey, collection: Collection<V>) => boolean)
    | NonFuncItee
): boolean
function every<V, K extends string | number | symbol>(
  collection: Collection<V>,
  predicate:
    | ((value: V, index: K, collection: Collection<V>) => boolean)
    | NonFuncItee
): boolean
function every<V, K extends string | number | symbol>(
  collection: Collection<V>,
  predicate:
    | ((value: V, index: K, collection: Collection<V>) => boolean)
    | NonFuncItee
): boolean {
  let rs = true
  const callback = iteratee(predicate)
  each<V, K>(collection, (v, k, c) => {
    const r = callback(v, k, c)
    if (!r) {
      rs = false
      return false
    }
  })
  return rs
}

/**
 * 对集合内的所有元素进行断言，直到第一个返回true的元素结束。
 *
 * @example
 * const libs = [
 *  {name:'func.js',platform:['web','nodejs'],tags:{utils:true},js:true},
 *  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:false},
 *  {name:'soya2d',platform:['web'],tags:{utils:true},js:true}
 * ];
 *
 * //false
 * console.log(_.some([]))
 * //true
 * console.log(_.some([1,2,3,4],v=>v%2===1))
 * //true
 * console.log(_.some(['a','b','c',1],_.isNumber))
 * //true
 * console.log(_.some(libs,'tags.middleware'))
 * //true
 * console.log(_.some(libs,{js:true}))
 * //false key不支持路径解析
 * console.log(_.some(libs,{'tags.utils':false}))
 *
 * @param collection 任何可遍历的集合类型，比如arraylike / set / map / object / ...
 * @param predicate (value[,index|key[,collection]]) 断言
 * <br>当断言是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @returns 只要有任意元素断言为真返回true，否则false。对于一个空集合，会返回false
 */
function some<V>(
  collection: Collection<V>,
  predicate:
    | ((value: V, index: UnknownMapKey, collection: Collection<V>) => boolean)
    | NonFuncItee
): boolean
function some<V, K extends string | number | symbol>(
  collection: Collection<V>,
  predicate:
    | ((value: V, index: K, collection: Collection<V>) => boolean)
    | NonFuncItee
): boolean
function some<V, K extends string | number | symbol>(
  collection: Collection<V>,
  predicate:
    | ((value: V, index: K, collection: Collection<V>) => boolean)
    | NonFuncItee
): boolean {
  let rs = false
  const callback = iteratee(predicate || (() => true))
  each<V, K>(collection, (v, k, c) => {
    const r = callback(v, k, c)
    if (r) {
      rs = true
      return false
    }
  })
  return rs
}

/**
 * 返回一个新数组，数组内容由集合内所有断言结果为真的元素组成
 *
 * @example
 * const libs = [
 *  {name:'func.js',platform:['web','nodejs'],tags:{utils:true},js:false},
 *  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:true},
 *  {name:'soya2d',platform:['web'],tags:{utils:true},js:true}
 * ];
 *
 * //[]
 * console.log(_.filter())
 * //[1,3]
 * console.log(_.filter([1,2,3,4],v=>v%2===1))
 * //[1]
 * console.log(_.filter(['a','b','c',1],_.isNumber))
 * //[1,2]
 * console.log(_.filter({a:1,b:2,c:'3'},_.isNumber))
 * //[f、s]
 * console.log(_.filter(libs,'tags.utils'))
 * //[j、s]
 * console.log(_.filter(libs,{js:true}))
 * //[] key不支持路径解析
 * console.log(_.filter(libs,{'platform[0]':'web'}))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @param predicate (value[,index|key[,collection]]) 断言
 * <br>当断言是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @returns 由通过断言的元素组成的新数组
 */
function filter<V>(
  collection: Collection<V>,
  predicate:
    | ((value: V, index: UnknownMapKey, collection: Collection<V>) => boolean)
    | NonFuncItee
): V[]
function filter<V, K extends string | number | symbol>(
  collection: Collection<V>,
  predicate:
    | ((value: V, index: K, collection: Collection<V>) => boolean)
    | NonFuncItee
): V[]
function filter<V, K extends string | number | symbol>(
  collection: Collection<V>,
  predicate:
    | ((value: V, index: K, collection: Collection<V>) => boolean)
    | NonFuncItee
): V[] {
  const rs: V[] = []
  const callback = iteratee(predicate)
  each<V, K>(collection, (v, k, c) => {
    const r = callback(v, k, c)
    if (r) {
      rs.push(v)
    }
  })
  return rs
}

/**
 * <code>filter</code>的反函数，数组内容由集合内所有断言结果为假的元素组成
 *
 * @example
 * //['a', 'b', 'c']
 * console.log(_.reject(['a','b','c',1],_.isNumber))
 * //['3']
 * console.log(_.reject({a:1,b:2,c:'3'},_.isNumber))
 * //[2，4]
 * console.log(_.reject([1,2,3,4],v=>v%2===1))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @param predicate (value[,index|key[,collection]]) 断言
 * <br>当断言是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @returns 由通过断言的元素组成的新数组
 * @since 1.0.0
 */
function reject<V>(
  collection: Collection<V>,
  predicate:
    | ((value: V, index: UnknownMapKey, collection: Collection<V>) => boolean)
    | NonFuncItee
): V[]
function reject<V, K extends string | number | symbol>(
  collection: Collection<V>,
  predicate:
    | ((value: V, index: K, collection: Collection<V>) => boolean)
    | NonFuncItee
): V[]
function reject<V, K extends string | number | symbol>(
  collection: Collection<V>,
  predicate:
    | ((value: V, index: K, collection: Collection<V>) => boolean)
    | NonFuncItee
): V[] {
  const rs: V[] = []
  const callback = iteratee(predicate)
  each<V, K>(collection, (v, k, c) => {
    const r = callback(v, k, c)
    if (!r) {
      rs.push(v)
    }
  })
  return rs
}

/**
 * 类似<code>filter</code>函数，但返回固定长度为2的二维数组 - [[matched...],[mismatched...]]
 *
 * @example
 * const libs = [
 *  {name:'func.js',platform:['web','nodejs'],tags:{utils:true},js:false},
 *  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:true},
 *  {name:'soya2d',platform:['web'],tags:{utils:true},js:true}
 * ];
 *
 * //[[func.js],[juth2,soya2d]]
 * console.log(_.partition(libs,{name:'func.js'}))
 *
 * const seq = [1,2,3,4,5,6];
 * //[[2, 4, 6],[1, 3, 5]]
 * console.log(_.partition(seq,n=>n%2===0))
 *
 * //[[1,3],["2"]]
 * console.log(_.partition({a:1,b:'2',c:3},_.isNumber))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @param predicate (value[,index|key[,collection]]) 断言
 * <br>当断言是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @returns 由匹配列表，非匹配列表构成的二维数组
 * @since 0.17.0
 */
function partition<V>(
  collection: Collection<V>,
  predicate:
    | ((
      value: V,
      index: string | number | symbol,
      collection: Collection<V>
    ) => boolean)
    | NonFuncItee
): V[][]
function partition<V, K extends string | number | symbol>(
  collection: Collection<V>,
  predicate:
    | ((value: V, index: K, collection: Collection<V>) => boolean)
    | NonFuncItee
): V[][]
function partition<V, K extends string | number | symbol>(
  collection: Collection<V>,
  predicate:
    | ((value: V, index: K, collection: Collection<V>) => boolean)
    | NonFuncItee
): V[][] {
  const matched: V[] = []
  const mismatched: V[] = []
  const callback = iteratee(predicate)
  each<V, K>(collection, (v, k, c) => {
    const r = callback(v, k, c)
    if (r) {
      matched.push(v)
    } else {
      mismatched.push(v)
    }
  })
  return [matched, mismatched]
}

/**
 * 对集合内的所有元素进行断言并返回第一个匹配的元素
 *
 * @example
 * const libs = [
 *  {name:'func.js',platform:['web','nodejs'],tags:{utils:true},js:false},
 *  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:true},
 *  {name:'soya2d',platform:['web'],tags:{utils:true},js:true}
 * ];
 *
 * //1
 * console.log(_.find(['a','b','c',1,3,6],_.isNumber))
 * //holyhigh
 * console.log(_.find({a:1,b:true,c:'holyhigh',d:'func.js'},_.isString))
 * //{f}
 * console.log(_.find(libs,'tags.utils'))
 * //{j}
 * console.log(_.find(libs,{js:true}))
 * //undefined key不支持路径解析
 * console.log(_.find(libs,{'tags.utils':false}))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @param predicate (value[,index|key[,collection]]) 断言
 * <br>当断言是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @returns 第一个匹配断言的元素或undefined
 */
function find<V>(
  collection: Collection<V>,
  predicate:
    | ((
      value: V,
      index: string | number | symbol,
      collection: Collection<V>
    ) => boolean)
    | NonFuncItee
): V | undefined
function find<V, K extends string | number | symbol>(
  collection: Collection<V>,
  predicate:
    | ((value: V, index: K, collection: Collection<V>) => boolean)
    | NonFuncItee
): V | undefined
function find<V, K extends string | number | symbol>(
  collection: Collection<V>,
  predicate:
    | ((value: V, index: K, collection: Collection<V>) => boolean)
    | NonFuncItee
): V | undefined {
  const callback = iteratee(predicate)
  let rs
  each<V, K>(collection, (v, k, c) => {
    const r = callback(v, k, c)
    if (r) {
      rs = v
      return false
    }
  })
  return rs
}

/**
 * 对集合内的所有元素进行断言并返回最后一个匹配的元素
 *
 * @example
 * const libs = [
 *  {name:'func.js',platform:['web','nodejs'],tags:{utils:false},js:false},
 *  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:true},
 *  {name:'soya2d',platform:['web'],tags:{utils:true},js:true}
 * ];
 *
 * //6
 * console.log(_.findLast(['a','b','c',1,3,6],_.isNumber))
 * //func.js
 * console.log(_.findLast({a:1,b:true,c:'holyhigh',d:'func.js'},_.isString))
 * //{s}
 * console.log(_.findLast(libs,'tags.utils'))
 * //{s}
 * console.log(_.findLast(libs,{js:true}))
 * //undefined key不支持路径解析
 * console.log(_.findLast(libs,{'tags.utils':false}))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @param predicate (value[,index|key[,collection]]) 断言
 * <br>当断言是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @returns 第一个匹配断言的元素或undefined
 */
function findLast<V>(
  collection: Collection<V>,
  predicate:
    | ((
      value: V,
      index: string | number | symbol,
      collection: Collection<V>
    ) => boolean)
    | NonFuncItee
): V | undefined
function findLast<V, K extends string | number | symbol>(
  collection: Collection<V>,
  predicate:
    | ((value: V, index: K, collection: Collection<V>) => boolean)
    | NonFuncItee
): V | undefined
function findLast<V, K extends string | number | symbol>(
  collection: Collection<V>,
  predicate:
    | ((value: V, index: K, collection: Collection<V>) => boolean)
    | NonFuncItee
): V | undefined {
  const callback = iteratee(predicate)
  let rs
  eachRight(collection, (v, k, c) => {
    const r = callback(v, k, c)
    if (r) {
      rs = v
      return false
    }
  })
  return rs
}

/**
 * 返回一个新数组，该数组中的每个元素是调用一次callback函数后的返回值
 *
 * @example
 * const libs = [
 *  {name:'func.js',platform:['web','nodejs'],tags:{utils:true},js:false},
 *  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:true},
 *  {name:'soya2d',platform:['web'],tags:{utils:true},js:true}
 * ];
 *
 * //[2,4,6]
 * console.log(_.map(new Set([1,2,3]),v => v*2))
 * //[1,2,3]
 * console.log(_.map({'1':'a','2':'b','3':'c'},(v,k)=>k))
 * //[true,false,false]
 * console.log(_.map([1,{a:1},[2,3]],v => _.isNumber(v)))
 * //["H", "O", "L", "Y", "H", "I", "G", "H"]
 * console.log(_.map('holyhigh',v => String.fromCharCode(v.charCodeAt(0)-32)))
 * //[true,false,true]
 * console.log(_.map(libs,'tags.utils'))
 * //["func.js", "juth2", "soya2d"]
 * console.log(_.map(libs,'name'))
 * //[1,2,3]
 * console.log(_.map({a:1,b:2,c:3}))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @param [iteratee=identity] (value[,index|key[,collection]]) 回调函数，返回值作为新数组元素。
 * 如果是字符串，表示返回集中的对象类型的元素的key值
 * @returns 映射值的新数组
 */
function map<V>(
  collection: Collection<V>,
  itee:
    | ((value: V, index: UnknownMapKey, collection: Collection<V>) => V)
    | NonFuncItee
): V[]
function map<V, K extends string | number | symbol>(
  collection: Collection<V>,
  itee: ((value: V, index: K, collection: Collection<V>) => V) | NonFuncItee
): V[]
function map<V, K extends string | number | symbol, U>(
  collection: Collection<V>,
  itee: ((value: V, index: K, collection: Collection<V>) => U) | NonFuncItee
): U[]
function map<V, K extends string | number | symbol, U>(
  collection: Collection<V>,
  itee: ((value: V, index: K, collection: Collection<V>) => U) | NonFuncItee
): U[] {
  const rs: U[] = []
  const cb = iteratee(itee)
  each(collection, (v, k, c) => {
    const r = cb(v, k, c)
    rs.push(r)
  })
  return rs
}

/**
 * 类似<code>map</code>，但会对返回值进行<code>flat</code>处理。
 * 除此之外，与map函数最大的不同在于返回值与元素的映射关系并不一定是一一对应，此时更像<code>filter</code>
 *
 * @example
 * //[1, 2, [3]]
 * console.log(_.flatMap([[1,2],[[3]]]))
 * //[3,5]
 * console.log(_.flatMap([[1,2],3,4,5],n=>n%2?n:[]))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @param [iteratee=identity] (value[,index|key[,collection]]) 回调函数，返回值作为新数组元素。
 * @param [depth=1] 嵌套深度
 * @returns 映射值的新数组
 * @since 1.0.0
 */
function flatMap<V>(
  collection: Collection<V>,
  itee:
    | ((
      value: V,
      index: string | number | symbol,
      collection: Collection<V>
    ) => V)
    | NonFuncItee,
  depth?: number
): V[]
function flatMap<V, K extends string | number | symbol>(
  collection: Collection<V>,
  itee: ((value: V, index: K, collection: Collection<V>) => V) | NonFuncItee,
  depth?: number
): V[]
function flatMap<V, K extends string | number | symbol, U>(
  collection: Collection<V>,
  itee: ((value: V, index: K, collection: Collection<V>) => U) | NonFuncItee,
  depth?: number
): U[]
function flatMap<V, K extends string | number | symbol, U>(
  collection: Collection<V>,
  itee: ((value: V, index: K, collection: Collection<V>) => U) | NonFuncItee,
  depth?: number
): U[] {
  return flat(map<V, K, U>(collection, itee), depth || 1)
}

/**
 * 同<code>flatMap</code>，但会递归元素进行扁平化处理
 *
 * @example
 * //[1, 2, 3]
 * console.log(_.flatMapDeep([[1,2],[[3]]]))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @param [iteratee=identity] (value[,index|key[,collection]]) 回调函数，返回值作为新数组元素。
 * @returns 映射值的新数组
 * @since 1.0.0
 */
function flatMapDeep<V>(
  collection: Collection<V>,
  itee:
    | ((
      value: V,
      index: string | number | symbol,
      collection: Collection<V>
    ) => V)
    | NonFuncItee
): V[]
function flatMapDeep<V, K extends string | number | symbol>(
  collection: Collection<V>,
  itee: ((value: V, index: K, collection: Collection<V>) => V) | NonFuncItee
): V[]
function flatMapDeep<V, K extends string | number | symbol, U>(
  collection: Collection<V>,
  itee: ((value: V, index: K, collection: Collection<V>) => U) | NonFuncItee
): U[]
function flatMapDeep<V, K extends string | number | symbol, U>(
  collection: Collection<V>,
  itee: ((value: V, index: K, collection: Collection<V>) => U) | NonFuncItee
): U[] {
  return flatMap<V, K, U>(collection, itee, Infinity)
}

/**
 * 判断集合中是否包含给定的值。使用<code>eq</code>函数进行等值判断。
 *
 * @example
 * //true
 * console.log(_.includes({a:1,b:2},2))
 * //false
 * console.log(_.includes([1,3,5,7,[2]],2))
 * //true
 * console.log(_.includes([1,3,5,7,[2]],3))
 * //false
 * console.log(_.includes([1,3,5,7,[2]],3,2))
 * //true
 * console.log(_.includes([0,null,undefined,NaN],NaN))
 * //true
 * console.log(_.includes('abcdefg','abc'))
 * //false
 * console.log(_.includes('abcdefg','abc',2))
 * //false
 * console.log(_.includes('aBcDeFg','abc'))
 *
 * @param collection 如果集合是map/object对象，则只对value进行比对
 * @param value
 * @param [fromIndex=0] 从集合的fromIndex 索引处开始查找。如果集合是map/object对象，无效
 * @returns 如果包含返回true否则返回false
 */
function includes(collection: Collection, value: any, fromIndex?: number) {
  let rs = false
  fromIndex = fromIndex || 0
  if (isString(collection)) {
    return collection.includes(value, fromIndex)
  }
  collection = isArrayLike(collection)
    ? slice(collection, fromIndex)
    : collection
  each(collection, (v) => {
    if (eq(v, value)) {
      rs = true
      return false
    }
  })
  return rs
}

/**
 * 对集合中的每个元素执行一次reducer函数，并将其结果汇总为单个值返回。
 * <p>
 * 如果没有提供initialValue，reduce 会从集合索引1开始执行 callback 方法。如果提供initialValue则从索引0开始。
 * </p>
 * <p>
 * 注意，对于Object类型的对象，如果未提供initialValue，则accumulator会是索引0元素的value，而不是key
 * </p>
 *
 * @example
 * //25
 * console.log(_.reduce([1,3,5,7,9],(a,v)=>a+v))
 * //35
 * console.log(_.reduce([1,3,5,7,9],(a,v)=>a+v,10))
 * //x-y-z
 * console.log(_.reduce({x:1,y:2,z:3},(a,v,k)=>a+'-'+k,'').substr(1))
 *
 * @param collection
 * @param callback (accumulator,value[,key|index[,collection]]);reducer函数
 * @param [initialValue] 第一次调用 callback函数时的第一个参数的值
 * @returns 汇总值
 */
function reduce<T>(
  collection: Collection<T>,
  callback: (
    accumulator: T,
    value: T,
    key: UnknownMapKey,
    collection: Collection<T>
  ) => T,
  initialValue: T
): T {
  let accumulator = initialValue
  let hasInitVal = isDefined(initialValue)
  each<T, UnknownMapKey>(collection, (v, k, c) => {
    if (hasInitVal) {
      accumulator = callback(accumulator, v, k, c)
    } else {
      accumulator = v
      hasInitVal = true
    }
  })

  return accumulator
}

/**
 * 把一个集合对象转为array对象。对于非集合对象，
 * <ul>
 * <li>字符串 - 每个字符都会变成数组的元素</li>
 * <li>其他情况 - 返回包含一个collection元素的数组</li>
 * </ul>
 *
 * @example
 * //[1,2,3]
 * console.log(_.toArray(new Set([1,2,3])))
 * //['a','b','c']
 * console.log(_.toArray('abc'))
 * //[1,2,'b']
 * console.log(_.toArray({x:1,y:2,z:'b'}))
 * //[[1, 'a'], [3, 'b'], ['a', 5]]
 * console.log(_.toArray(new Map([[1,'a'],[3,'b'],['a',5]])))
 *
 * @param collection 如果是Map/Object对象会转换为值列表
 *
 * @returns 转换后的数组对象
 */
function toArray<T>(collection: Collection<T>): T[] {
  if (isArray(collection)) return collection.concat()
  if (isFunction(collection)) return [collection as T]

  if (isSet(collection)) {
    return Array.from(collection)
  } else if (isString(collection)) {
    return collection.split('') as T[]
  } else if (isArrayLike(collection)) {
    return Array.from(collection as any)
  } else if (isMap(collection)) {
    return Array.from(collection.values())
  } else if (isObject(collection)) {
    return values(collection)
  }
  return [collection as T]
}

/**
 * 对集合进行排序，并返回排序后的数组副本。
 *
 * @example
 * //字符排序 ['lao1', 'lao2', 'lao3']
 * console.log(_.sort(['lao1','lao3','lao2']))
 * //数字排序[7, 9, 80]
 * console.log(_.sort([9,80,7]))
 * //日期排序["3/1/2019", "2020/1/1", Wed Apr 01 2020...]
 * console.log(_.sort([new Date(2020,3,1),'2020/1/1','3/1/2019']))
 * //第一个元素不是日期对象，需要转换
 * console.log(_.sort(_.map(['2020/1/1',new Date(2020,3,1),'3/1/2019'],v=>new Date(v))))
 * //对象排序
 * const users = [
 *  {name:'zhangsan',age:53},
 *  {name:'lisi',age:44},
 *  {name:'wangwu',age:25},
 *  {name:'zhaoliu',age:36}
 * ];
 * //[25,36,44,53]
 * console.log(_.sort(users,(a,b)=>a.age-b.age))
 * // 倒排
 * console.log(_.sort(users,(a,b)=>b.age-a.age))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @param [comparator] (a,b) 排序函数，如果为空使用sortBy逻辑
 * @returns 排序后的数组
 */
function sort<T>(
  collection: Collection<T>,
  comparator?: (a: T, b: T) => number
): T[] {
  const ary = toArray<T>(collection)
  if (ary.length < 1) return ary
  if (isFunction(comparator)) {
    return ary.sort(comparator)
  } else {
    return sortBy(collection)
  }
}

/**
 * 使用指定回调对集合结果进行升序排序。根据集合结果的第一个元素确定排序逻辑，内置排序逻辑包括
 * <ul>
 * <li>字符串</li>
 * <li>数字</li>
 * <li>日期</li>
 * </ul>
 *
 * @example
 * //不变
 * console.log(_.sortBy([{a:2},{a:1},{a:3}]))
 * //[{{a:1},{a:2},{a:3}] 通过iteratee把集合变为数字后排序
 * console.log(_.sortBy([{a:2},{a:1},{a:3}],'a'))
 * //['3/1/2019', '2020/1/1', '2020-3-1']
 * console.log(_.sortBy(['2020-3-1','2020/1/1','3/1/2019'],_.toDate))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @param [iteratee=identity] (value,key|index) 筛选函数，返回排序值
 * <br>当iteratee是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @returns 排序后的数组
 * @since 1.0.0
 */
function sortBy<V>(
  collection: Collection<V>,
  itee?: ((value: V, index: string | number | symbol) => any) | NonFuncItee
): V[]
function sortBy<V, K extends string | number | symbol>(
  collection: Collection<V>,
  itee?: ((value: V, index: K) => any) | NonFuncItee
): V[]
function sortBy<V, K extends string | number | symbol>(
  collection: Collection<V>,
  itee?: ((value: V, index: K) => any) | NonFuncItee
): V[] {
  if (size(collection) < 1) return []
  const cb = iteratee(itee || identity)
  let i = 0
  const list = map<V, UnknownMapKey, { src: any; index: number; value: any }>(
    collection,
    (v, k) => {
      return {
        src: v,
        index: i++,
        value: cb(v, k),
      }
    }
  )
  const comparator = getComparator(list[0].value)
  return map<{ src: any; index: number; value: any }, UnknownMapKey, V>(
    list.sort((a, b) =>
      !eq(a.value, b.value) ? comparator(a.value, b.value) : a.index - b.index
    ),
    (item) => item.src
  )
}

// comparators
const compareNumAsc = (a: number, b: number) => {
  if (isNil(a) || !isNumber(a)) return 1
  if (isNil(b) || !isNumber(b)) return -1

  return a - b
}
const compareStrAsc = (a: string, b: string) => {
  if (isNil(a)) return 1
  if (isNil(b)) return -1

  return toString(a).localeCompare(toString(b))
}
const compareDateAsc = (
  a: string | number | Date,
  b: string | number | Date
) => {
  if (isNil(a)) return 1
  if (isNil(b)) return -1

  return compareDate(a, b)
}
// eslint-disable-next-line require-jsdoc
function getComparator(el: any): Function {
  let comparator
  if (isNumber(el)) {
    comparator = compareNumAsc
  } else if (isDate(el)) {
    comparator = compareDateAsc
  } else {
    comparator = compareStrAsc
  }
  return comparator
}

/**
 * 返回指定数组的一个随机乱序副本
 * @example
 * //[随机内容]
 * console.log(_.shuffle([1,2,3,4,5,6,7,8,9,0]))
 * //[随机内容]
 * console.log(_.shuffle([{a:1},{a:2},{a:3},{a:4},{a:5}]))
 * //[随机内容]
 * console.log(_.shuffle({a:1,b:2,c:3,d:4,e:5}))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @returns 乱序副本
 * @since 0.16.0
 */
function shuffle<T>(collection: Collection<T>): T[] {
  return sampleSize(collection, size(collection))
}

/**
 * 返回对指定列表的唯一随机采样结果
 * @example
 * //随机值
 * console.log(_.sample([1,2,3,4,5,6,7,8,9,0]))
 * //随机值
 * console.log(_.sample({a:1,b:2,c:3,d:4,e:5}))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @returns 采样结果
 * @since 0.16.0
 */
function sample<T>(collection: Collection<T>): T {
  const ary = toArray<T>(collection)
  return ary[randi(ary.length)]
}

/**
 * 返回对指定列表的指定数量随机采样结果
 * @example
 * //[随机值]
 * console.log(_.sampleSize([1,2,3,4,5,6,7,8,9,0]))
 * //[随机值1,随机值2]
 * console.log(_.sampleSize([{a:1},{b:2},{c:3},{d:4},{e:5}],2))
 * //[随机值1,随机值2,随机值3]
 * console.log(_.sampleSize({a:1,b:2,c:3,d:4,e:5},3))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @param [count=1] 采样数量
 * @returns 采样结果
 * @since 0.16.0
 */
function sampleSize<T>(collection: Collection<T>, count?: number): T[] {
  count = count || 1
  const ary = toArray<T>(collection)
  const seeds = range(0, ary.length)
  const ks: number[] = []
  while (seeds.length > 0) {
    if (count-- < 1) break
    const i = pop<number>(seeds, randi(seeds.length))
    if (i) ks.push(i)
  }
  const rs = map<number, UnknownMapKey, T>(ks, (v) => ary[v])
  return rs
}

/**
 * 创建一个统计对象，对象的key是iteratee返回的值，对应的值是相同key出现的次数
 * @example
 * //{true: 5, false: 4}
 * console.log(_.countBy([1,'a',3,'b',5,'c',7,'d',9],_.isNumber))
 * const users = [
 *  {name:'zhangsan',sex:'m',age:33},
 *  {name:'lisi',sex:'f',age:21},
 *  {name:'wangwu',sex:'m',age:25},
 *  {name:'zhaoliu',sex:'m',age:44},
 * ]
 * //{m: 3, f: 1} 性别分布统计
 * console.log(_.countBy(users,u=>u.sex))
 * //{20: 2, 30: 1, 40: 1} 年龄段分布统计
 * console.log(_.countBy(users,u=>(u.age/10>>0)*10))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @param [iteratee=identity] (value) 回调函数，返回统计key
 * @returns 统计对象
 * @since 1.0.0
 */
function countBy(
  collection: Collection,
  itee?: ((value: unknown) => string) | NonFuncItee
): Record<string, number>
function countBy<K extends string | number | symbol>(
  collection: Collection,
  itee?: ((value: unknown) => K) | NonFuncItee
): Record<K, number>
function countBy<K extends string | number | symbol>(
  collection: Collection,
  itee?: ((value: unknown) => K) | NonFuncItee
): Record<K, number> {
  const stat: Record<UnknownMapKey, any> = {}
  const cb = iteratee(itee || identity)
  each(collection, (el) => {
    const key = cb(el)
    if (isUndefined(stat[key])) stat[key] = 0

    stat[key]++
  })
  return stat
}

/**
 * 创建一个统计对象，对象的key是iteratee返回的值，对应的值是由所有key对应值组成的数组
 * @example
 * //{true: [1, 3, 5, 7, 9], false: ['a', 'b', 'c', 'd']}
 * console.log(_.groupBy([1,'a',3,'b',5,'c',7,'d',9],_.isNumber))
 * const users = [
 *  {name:'zhangsan',sex:'m',age:33},
 *  {name:'lisi',sex:'f',age:21},
 *  {name:'wangwu',sex:'m',age:25},
 *  {name:'zhaoliu',sex:'m',age:44},
 * ]
 * //{m: [{...},{...},{...}], f: [{...}]} 性别分布统计
 * console.log(_.groupBy(users,u=>u.sex))
 * //{20: [{...},{...}], 30: [{...}], 40: [{...}]} 年龄段分布统计
 * console.log(_.groupBy(users,u=>(u.age/10>>0)*10))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @param [iteratee=identity] (value)回调函数，返回统计key
 * @returns 统计对象
 * @since 1.0.0
 */
function groupBy(
  collection: Collection,
  itee?: ((value: unknown) => UnknownMapKey) | NonFuncItee
): Record<UnknownMapKey, unknown[]> {
  const stat: Record<UnknownMapKey, unknown[]> = {}
  const cb = iteratee(itee || identity)
  each(collection, (el) => {
    const key = cb(el)
    if (isUndefined(stat[key])) stat[key] = []

    stat[key].push(el)
  })
  return stat
}

/**
 * 创建一个对象，对象的key是iteratee返回的值，对象的值是collection中最后一个key对应的值
 * @example
 * //{true: 9, false: 'd'}
 * console.log(_.keyBy([1,'a',3,'b',5,'c',7,'d',9],_.isNumber))g
 * const users = [
 *  {name:'zhangsan',sex:'m',age:33},
 *  {name:'lisi',sex:'f',age:21},
 *  {name:'wangwu',sex:'m',age:25},
 *  {name:'zhaoliu',sex:'m',age:44},
 * ]
 * //{m: {...}, f: {...}}
 * console.log(_.keyBy(users,u=>u.sex))
 * //{20: {...}, 30: {...}, 40: {...} }
 * console.log(_.keyBy(users,u=>(u.age/10>>0)*10))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @param [iteratee=identity] (value)回调函数，返回统计key
 * @returns 统计对象
 * @since 1.0.0
 */
function keyBy<K extends string | number | symbol>(
  collection: Collection,
  itee?: ((value: unknown) => K) | NonFuncItee
): Record<K, unknown>
function keyBy<K extends string | number | symbol, V>(
  collection: Collection,
  itee?: ((value: V) => K) | NonFuncItee
): Record<K, V>
function keyBy<K extends string | number | symbol, V>(
  collection: Collection,
  itee?: ((value: V) => K) | NonFuncItee
): Record<K, V> {
  const stat: Record<UnknownMapKey, unknown> = {}
  const cb = iteratee(itee || identity)
  each(collection, (el) => {
    const key = cb(el)
    stat[key] = el
  })
  return stat as Record<K, V>
}

export {
  each,
  eachRight,
  size,
  every,
  some,
  filter,
  reject,
  partition,
  find,
  findLast,
  map,
  flatMap,
  flatMapDeep,
  includes,
  reduce,
  toArray,
  sort,
  shuffle,
  sample,
  sampleSize,
  countBy,
  groupBy,
  keyBy,
  sortBy,
}
