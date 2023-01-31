/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/**
 * 对象相关函数
 *
 * @packageDocumentation
 */
/**
 * 
 * @author holyhigh
 */
import { concat, flatDeep, initial, last } from './array'
import { each, includes, map, size, filter } from './collection'
import {
  isObject,
  isUndefined,
  isNull,
  isString,
  isFunction,
  isArray,
  isDate,
  isBoolean,
  isRegExp,
  isDefined,
} from './is'
import { Collection, NonFuncItee, UnknownMapKey } from './types'
import { identity, iteratee, noop, toPath } from './utils'

/**
 * 将一个或多个源对象的可枚举属性值分配到目标对象。如果源对象有多个，则按照从左到右的顺序依次对target赋值，相同属性会被覆盖
 * 
 * > 该函数会修改目标对象
 * 
 * <ul>
 *  <li>当目标对象是null/undefined时，返回空对象</li>
 *  <li>当目标对象是基本类型时，返回对应的包装对象</li>
 *  <li>当目标对象是不可扩展/冻结/封闭状态时，返回目标对象</li>
 * </ul>
 * @example
 * //{x:1,y:3}
 * console.log(_.assign({x:1},{y:3}))
 *
 * @param target 目标对象
 * @param  {...object} sources 源对象
 * @returns 返回target
 */
function assign(
  target: Record<UnknownMapKey, any>,
  ...sources: any[]
): Record<UnknownMapKey, any> {
  return assignWith(target, ...sources, identity)
}

/**
 * 与<code>assign</code>相同，但支持自定义处理器
 * 
 * > 该函数会修改目标对象
 * 
 * @example
 * //{x: 1, y: '3y', z: null}
 * console.log(_.assignWith({x:1},{y:3,z:4},(sv,tv,k)=>k=='z'?null:sv+k))
 *
 * @param target 目标对象
 * @param  {...object} sources 源对象
 * @param  {Function} [handler=identity] (src[k],target[k],k,src,target) 自定义赋值处理器，返回赋予target[k]的值
 * @returns 返回target
 */
function assignWith(
  target: Record<UnknownMapKey, any>,
  ...sources: any[]
): Record<UnknownMapKey, any> {
  const rs = checkTarget(target)
  if (rs) return rs

  let src = sources
  let handler = last(sources)
  if (!isFunction(handler)) {
    handler = identity
  } else {
    src = initial(src)
  }

  eachSources(
    target,
    src,
    handler,
    (
      v: any,
      sv: any,
      tv: any,
      k: string,
      s: Record<UnknownMapKey, any>,
      t: Record<UnknownMapKey, any>
    ) => {
      t[k] = v
    }
  )

  return target
}

function checkTarget(target: any) {
  if (isNull(target) || isUndefined(target)) return {}
  if (!isObject(target)) return new target.constructor(target)
  if (
    !Object.isExtensible(target) ||
    Object.isFrozen(target) ||
    Object.isSealed(target)
  ) {
    return target
  }
}

function eachSources(
  target: Record<UnknownMapKey, any>,
  sources: Record<UnknownMapKey, any>[],
  handler: Function | null,
  afterHandler: (
    v: any,
    sv: any,
    tv: any,
    k: string,
    s: Record<UnknownMapKey, any>,
    t: Record<UnknownMapKey, any>
  ) => void
) {
  sources.forEach((src) => {
    if (!isObject(src)) return
    keys(src).forEach((k) => {
      let v = src[k]
      if (handler) {
        v = handler(src[k], target[k], k, src, target)
      }
      afterHandler(v, src[k], target[k], k, src, target)
    })
  })
}

/**
 * 浅层复制对象
 * 如果是基本类型，返回原值
 * 如果是函数类型，返回原值
 * 只复制对象的自身可枚举属性
 *
 * @example
 * //null
 * console.log(_.clone(null))
 *
 * @param obj
 * @returns 被复制的新对象
 */
function clone(obj: Record<UnknownMapKey, any>) {
  return cloneWith(obj, identity)
}

/**
 * 浅层复制对象，支持赋值处理器
 * 如果obj是基本类型，返回原值
 * 如果obj是函数类型，返回原值
 *
 * 只复制对象的自身可枚举属性
 *
 * @example
 * //{x: 1, y: 2, z: null}
 * console.log(_.cloneWith({x:1,y:2,z:3},(v,k)=>k=='z'?null:v))
 * //null
 * console.log(_.cloneWith(null))
 *
 * @param obj
 * @param  {Function} [handler=identity] (obj[k],k) 自定义赋值处理器，返回赋予新对象[k]的值
 * @returns 被复制的新对象
 */
function cloneWith(
  obj: Record<UnknownMapKey, any>,
  handler: (v: any, k: string | number | symbol) => any = identity
) {
  if (!isObject(obj)) return obj
  if (isFunction(obj)) return obj

  let copy = cloneBuiltInObject(obj)
  if (copy !== null) return copy
  copy = new (obj as any).constructor()
  return assignWith(
    copy as Record<UnknownMapKey, any>,
    obj,
    (
      sv: Record<UnknownMapKey, any>,
      tv: Record<UnknownMapKey, any>,
      k: UnknownMapKey
    ) => handler(sv, k)
  )
}

/**
 * 完整复制对象,可以保持被复制属性的原有类型
 *
 * 如果obj是基本类型，返回原值
 * 如果obj是函数类型，返回原值
 * 只复制对象的自身可枚举属性
 *
 * @example
 * //true
 * console.log(_.cloneDeep({d:new Date}).d instanceof Date)
 *
 * @param obj
 * @returns 被复制的新对象
 */
function cloneDeep(
  obj: Record<UnknownMapKey, any>
): Record<UnknownMapKey, any> {
  return cloneDeepWith(obj, identity)
}

/**
 * 完整复制对象,可以保持被复制属性的原有类型。支持赋值处理器
 *
 * 如果obj是基本类型，返回原值
 * 如果obj是函数类型，返回原值
 * 只复制对象的自身可枚举属性
 *
 * @example
 * //true
 * console.log(_.cloneDeepWith({d:new Date}).d instanceof Date)
 *
 * @param obj
 * @param  {Function} [handler=identity] (obj[k],k) 自定义赋值处理器，返回赋予新对象[k]的值
 * @returns 被复制的新对象
 */
function cloneDeepWith(
  obj: Record<UnknownMapKey, any>,
  handler?: (v: any, k: UnknownMapKey) => any
): any {
  if (!isObject(obj)) return obj
  if (isFunction(obj)) return obj

  let copy = cloneBuiltInObject(obj)
  if (copy !== null) return copy

  copy = new (obj as any).constructor()
  const propNames = Object.keys(obj)
  propNames.forEach((p) => {
    let newProp = (handler || identity)(obj[p], p)
    if (isObject(newProp)) {
      newProp = cloneDeepWith(newProp, handler)
    }
    try {
      // maybe unwritable
      ;(copy as any)[p] = newProp
    } catch (e) {}
  })

  return copy
}

//
// eslint-disable-next-line require-jsdoc
function cloneBuiltInObject(
  obj: unknown
): Date | boolean | string | RegExp | null {
  let rs = null
  if (isDate(obj)) {
    rs = new Date(obj.getTime())
  } else if (isBoolean(obj)) {
    rs = Boolean(obj)
  } else if (isString(obj)) {
    rs = String(obj)
  } else if (isRegExp(obj)) {
    rs = new RegExp(obj)
  }
  return rs
}

/**
 * 解析传递参数并返回一个根据参数值创建的Object实例。
 * 支持数组对、k/v对、对象、混合方式等创建
 * 是 toPairs 的反函数
 *
 * @example
 * //{a:1,b:2}
 * console.log(_.toObject('a',1,'b',2))
 * //如果参数没有成对匹配，最后一个属性值则为undefined
 * //{a:1,b:2,c:undefined}
 * console.log(_.toObject('a',1,'b',2,'c'))
 * //{a:1,b:4,c:3} 重复属性会覆盖
 * console.log(_.toObject(['a',1,'b',2],['c',3],['b',4]))
 * //{a:1,b:2} 对象类型返回clone
 * console.log(_.toObject({a:1,b:2}))
 * //{1:now time,a:{}} 混合方式
 * console.log(_.toObject([1,new Date],'a',{}))
 *
 * @param vals 对象创建参数，可以是一个数组/对象或者多个成对匹配的基本类型或者多个不定的数组/对象
 * @returns 如果没有参数返回空对象
 */
function toObject(...vals: any[]): Record<UnknownMapKey, any> {
  if (size(vals) === 0) return {}
  const rs: Record<UnknownMapKey, any> = {}
  const pairs: any[] = [] // 存放k/v
  let key: unknown = null
  each(vals, (v) => {
    if (isArray(v)) {
      const tmp = toObject(...v)
      assign(rs, tmp)
    } else if (isObject(v)) {
      if (key) {
        pairs.push(key, v)
        key = null
      } else {
        assign(rs, v)
      }
    } else {
      if (key) {
        pairs.push(key, v)
        key = null
      } else {
        key = v
      }
    }
  })
  if (key) {
    pairs.push(key)
  }
  if (size(pairs) > 0) {
    for (let i = 0; i < pairs.length; i += 2) {
      rs[pairs[i]] = pairs[i + 1]
    }
  }

  return rs
}

/**
 * 通过path获取对象属性值
 *
 * @example
 * //2
 * console.log(_.get([1,2,3],1))
 * //Holyhigh
 * console.log(_.get({a:{b:[{x:'Holyhigh'}]}},['a','b',0,'x']))
 * //Holyhigh2
 * console.log(_.get({a:{b:[{x:'Holyhigh2'}]}},'a.b.0.x'))
 * //Holyhigh
 * console.log(_.get({a:{b:[{x:'Holyhigh'}]}},'a.b[0].x'))
 * //hi
 * console.log(_.get([[null,[null,null,'hi']]],'[0][1][2]'))
 * //not find
 * console.log(_.get({},'a.b[0].x','not find'))
 *
 * @param obj 需要获取属性值的对象，如果obj不是对象(isObject返回false)，则返回defaultValue
 * @param path 属性路径，可以是索引数字，字符串key，或者多级属性数组
 * @param [defaultValue] 如果path未定义，返回默认值
 * @returns 属性值或默认值
 */
function get<V>(
  obj: Record<UnknownMapKey, any>,
  path: Array<string | number> | string | number,
  defaultValue?: any
): V {
  if (!isObject(obj)) return defaultValue
  const chain = toPath(path)
  let target = obj
  for (let i = 0; i < chain.length; i++) {
    const seg = chain[i]
    target = target[seg]
    if (!target) break
  }
  if (isUndefined(target)) target = defaultValue
  return target
}

/**
 * 通过path设置对象属性值。如果路径不存在则创建，索引会创建数组，属性会创建对象
 * <div class="alert alert-secondary">
      该函数会修改源对象
    </div>

    @example
 * //{"a":1,"b":{"c":[undefined,{"x":10}]}}
 * console.log(_.set({a:1},'b.c.1.x',10))
 *
 * @param obj 需要设置属性值的对象，如果obj不是对象(isObject返回false)，直接返回obj
 * @param path 属性路径，可以是索引数字，字符串key，或者多级属性数组
 * @param value 任何值
 * @returns obj 修改后的源对象
 * @since 0.16.0
 */
function set(
  obj: Record<UnknownMapKey, any>,
  path: Array<string | number> | string | number,
  value: any
): Record<UnknownMapKey, any> {
  if (!isObject(obj)) return obj
  const chain = toPath(path)
  let target = obj
  for (let i = 0; i < chain.length; i++) {
    const seg = chain[i]
    const nextSeg = chain[i + 1]
    let tmp = target[seg]
    if (nextSeg) {
      tmp = target[seg] = !tmp ? (isNaN(nextSeg as any) ? {} : []) : tmp
    } else {
      target[seg] = value
      break
    }
    target = tmp
  }
  return obj
}

/**
 * 创建一个指定属性的对象子集并返回
 * @example
 * //{b: 2}
 * console.log(_.pick({a:1,b:2,c:'3'},'b'))
 * //{b: 2,c:'3'}
 * console.log(_.pick({a:1,b:2,c:'3'},'b','c'))
 * //{a: 1, b: 2}
 * console.log(_.pick({a:1,b:2,c:'3'},['b','a']))
 *
 * @param obj 选取对象
 * @param props 属性集合
 * @returns 对象子集
 * @since 0.16.0
 */
function pick(
  obj: Record<UnknownMapKey, any>,
  ...props: (string | string[])[]
): Record<UnknownMapKey, any> {
  const keys = flatDeep(props)
  return pickBy(obj, (v, k) => {
    return includes(keys, k)
  })
}

/**
 * 同<code>pick</code>，但支持断言函数进行选取
 * @example
 * //{a: 1, b: 2}
 * console.log(_.pickBy({a:1,b:2,c:'3'},_.isNumber))
 *
 * @param obj 选取对象
 * @param [predicate=identity] (v,k)断言函数
 * @returns 对象子集
 * @since 0.23.0
 */
function pickBy(
  obj: Record<UnknownMapKey, any>,
  predicate?: (v: unknown, k: UnknownMapKey) => boolean
): Record<UnknownMapKey, any> {
  const rs: Record<UnknownMapKey, any> = {}
  each(obj, (v, k) => {
    if ((predicate || identity)(v, k)) {
      rs[k] = v
    }
  })
  return rs
}

/**
 * 创建一个剔除指定属性的对象子集并返回。与pick()刚好相反
 * @example
 * //{a: 1, c: '3'}
 * console.log(_.omit({a:1,b:2,c:'3'},'b'))
 * //{a: 1}
 * console.log(_.omit({a:1,b:2,c:'3'},'b','c'))
 * //{c: '3'}
 * console.log(_.omit({a:1,b:2,c:'3'},['b','a']))
 *
 * @param obj 选取对象
 * @param props 属性集合
 * @returns 对象子集
 * @since 0.16.0
 */
function omit(
  obj: Record<UnknownMapKey, any>,
  ...props: (string | string[])[]
) {
  const keys = flatDeep(props)
  return omitBy(obj, (v, k) => {
    return includes(keys, k)
  })
}

/**
 * 同<code>omit</code>，但支持断言函数进行剔除
 * @example
 * //{c: '3'}
 * console.log(_.omitBy({a:1,b:2,c:'3'},_.isNumber))
 *
 * @param obj 选取对象
 * @param [predicate=identity] (v,k)断言函数
 * @returns 对象子集
 * @since 0.23.0
 */
function omitBy<V, K extends UnknownMapKey>(
  obj: Record<UnknownMapKey, any>,
  predicate?: (v: V, k: K) => boolean
) {
  const rs: Record<UnknownMapKey, any> = {}
  each<V, K>(obj, (v, k) => {
    if (!(predicate || identity)(v, k)) {
      rs[k] = v
    }
  })
  return rs
}

/**
 * 返回对象的所有key数组
 * <div class="alert alert-secondary">
      只返回对象的自身可枚举属性
    </div>
 *
 * @example
 * let f = new Function("this.a=1;this.b=2;");
 * f.prototype.c = 3;
 * //[a,b]
 * console.log(_.keys(new f()))
 *
 * @param obj
 * @returns 对象的key
 */
function keys(obj: Record<UnknownMapKey, any>): string[] {
  if (!isObject(obj)) return []
  if (isFunction(obj)) return []

  return Object.keys(obj)
}

/**
 * 返回对象的所有key数组
 * 包括原型链中的属性key
 *
 * @example
 * let f = new Function("this.a=1;this.b=2;");
 * f.prototype.c = 3;
 * //[a,b,c]
 * console.log(_.keysIn(new f()))
 *
 * @param obj
 * @returns 对象的key
 */
function keysIn(obj: Record<UnknownMapKey, any>): string[] {
  if (!isObject(obj)) return []
  if (isFunction(obj)) return []
  const rs = []
  // eslint-disable-next-line guard-for-in
  for (const k in obj) {
    if (k) rs.push(k)
  }

  return rs
}

/**
 * 返回对象的所有value数组
 * <div class="alert alert-secondary">
      只返回对象的自身可枚举属性
    </div>
 *
 *
 * @example
 * let f = new Function("this.a=1;this.b=2;");
 * f.prototype.c = 3;
 * //[1,2]
 * console.log(_.values(new f()))
 *
 * @param obj
 * @returns 对象根属性对应的值列表
 */
function values(obj: Record<UnknownMapKey, any>): any[] {
  return keys(obj).map((k) => obj[k])
}

/**
 * 返回对象的所有value数组
 * 包括原型链中的属性
 *
 * @example
 * let f = new Function("this.a=1;this.b=2;");
 * f.prototype.c = 3;
 * //[1,2,3]
 * console.log(_.valuesIn(new f()))
 *
 * @param obj
 * @returns 对象根属性对应的值列表
 */
function valuesIn(obj: Record<UnknownMapKey, any>): any[] {
  return keysIn(obj).map((k) => obj[k])
}

/**
 * 检查指定key是否存在于指定的obj中
 *
 * @example
 * //true
 * console.log(_.has({a:12},'a'))
 *
 * @param obj
 * @param key
 * @returns 如果key存在返回true
 */
function has(obj: Record<UnknownMapKey, any>, key: UnknownMapKey): boolean {
  return toObject(obj).hasOwnProperty(key)
}

/**
 * 返回指定对象的所有[key,value]组成的二维数组
 *
 * @example
 * //[['a', 1], ['b', 2], ['c', 3]]
 * console.log(_.toPairs({a:1,b:2,c:3}))
 *
 * @param obj
 * @returns 二维数组
 */
function toPairs(obj: Record<UnknownMapKey, any>): any[][] {
  return map(toObject(obj), (v, k) => [k, v])
}

/**
 * <code>toPairs</code>反函数，创建一个由键值对数组组成的对象
 *
 * @example
 * //{a:1,b:2,c:3}
 * console.log(_.fromPairs([['a', 1], ['b', 2], ['c', 3]]))
 *
 * @param pairs 键值对数组
 * @returns 对象
 */
function fromPairs(pairs: any[][]): Record<UnknownMapKey, any> {
  const rs: Record<UnknownMapKey, any> = {}
  each(pairs, (pair: any[]) => {
    rs[pair[0]] = pair[1]
  })
  return rs
}

/**
 * 创建一个函数，该函数返回指定对象的path属性值
 * @example
 * const libs = [
 *  {name:'func.js',platform:['web','nodejs'],tags:{utils:true},js:false},
 *  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:true},
 *  {name:'soya2d',platform:['web'],tags:{utils:true},js:true}
 * ];
 * //[true,false,true]
 * console.log(_.map(libs,_.prop('tags.utils')))
 * //nodejs
 * console.log(_.prop(['platform',1])(libs[0]))
 *
 * @param path
 * @returns 接收一个对象作为参数的函数
 * @since 0.17.0
 */
function prop(
  path: string | string[]
): (obj: Record<UnknownMapKey, any>) => any {
  return (obj) => {
    return get(obj, path)
  }
}

/**
 * 返回对象中的函数属性key数组
 * @example
 * const funcs = {
 *  a(){},
 *  b(){}
 * };
 * //[a,b]
 * console.log(_.functions(funcs))
 * //[....]
 * console.log(_.functions(_))
 *
 * @param obj
 * @returns 函数名数组
 * @since 0.18.0
 */
function functions(obj: Record<UnknownMapKey, any>): string[] {
  return filter<string>(
    map(obj, (v, k) => {
      if (isFunction(v)) return k
      else {
        return false
      }
    }),
    identity
  )
}

/**
 * 将一个或多个源对象的可枚举属性值分配到目标对象中属性值为undefined的属性上。
 * 如果源对象有多个，则按照从左到右的顺序依次对target赋值，相同属性会被忽略
 * 
 * > 该函数会修改目标对象
 * 
 * - 当目标对象是null/undefined时，返回空对象
 * - 当目标对象是基本类型时，返回对应的包装对象
 * - 当目标对象是不可扩展/冻结/封闭状态时，返回目标对象
 * 
 * @example
 * //{a: 1, b: 2, c: 3}
 * console.log(_.defaults({a:1},{b:2},{c:3,b:1,a:2}))
 *
 * @param target 目标对象
 * @param sources 1-n个源对象
 * @returns 返回target
 * @since 0.21.0
 */
function defaults<T extends Record<UnknownMapKey, any>>(
  target: T,
  ...sources: any[]
): T {
  const rs = checkTarget(target)
  if (rs) return rs

  eachSources(target, sources, null, (v, sv, tv, k, s, t) => {
    if (isUndefined(t[k])) {
      t[k] = v
    }
  })
  return target
}

/**
 * 与<code>defaults</code>相同，但会递归对象属性
 * 
 * > 该函数会修改目标对象
 * 
 * @example
 * //{a: {x: 1, y: 2, z: 3}, b: 2}
 * console.log(_.defaultsDeep({a:{x:1}},{b:2},{a:{x:3,y:2}},{a:{z:3,x:4}}))
 *
 * @param target 目标对象
 * @param sources 1-n个源对象
 * @returns 返回target
 * @since 0.21.0
 */
function defaultsDeep<T extends Record<UnknownMapKey, any>>(
  target: T,
  ...sources: any[]
): T {
  const rs = checkTarget(target)
  if (rs) return rs

  eachSources(target, sources, null, (v, sv, tv, k, s, t) => {
    if (isUndefined(tv)) {
      t[k] = v
    } else if (isObject(tv)) {
      defaultsDeep(tv, sv)
    }
  })
  return target
}

/**
 * 类似<code>assign</code>，但会递归源对象的属性合并到目标对象。
 * <br>如果目标对象属性值存在，但对应源对象的属性值为undefined，跳过合并操作。
 * 支持自定义处理器，如果处理器返回值为undefined，启用默认合并。
 * 该函数在对可选配置项与默认配置项进行合并时非常有用
 *
 * > 该函数会修改目标对象
 *
 * - 当目标对象是null/undefined时，返回空对象
 * - 当目标对象是基本类型时，返回对应的包装对象
 * - 当目标对象是不可扩展/冻结/封闭状态时，返回目标对象
 *
 * @example
 * //{x: 0, y: {a: 1, b: 2, c: 3, d: 4}}
 * console.log(_.merge({x:1,y:{a:1,b:2}},{x:2,y:{c:5,d:4}},{x:0,y:{c:3}}))
 * //[{x: 0, y: {a: 1, b: 2, c: 3, d: 4}}]
 * console.log(_.merge([{x:1,y:{a:1,b:2}}],[{x:2,y:{c:5,d:4}}],[{x:0,y:{c:3}}]))
 *
 * @param target 目标对象
 * @param sources 1-n个源对象
 * @returns 返回target
 * @since 0.22.0
 */
function merge<T extends Record<UnknownMapKey, any>>(
  target: T,
  ...sources: any[]
): T {
  return mergeWith(target, ...sources, noop)
}

/**
 * 与<code>merge</code>相同，但支持自定义处理器
 * 
 * > 该函数会修改目标对象
 *
 * @example
 * //{x: 2, y: {a: 2, b: 4, c: 3, d: 27}}
 * console.log(_.mergeWith({x:1,y:{a:1,b:2,c:3}},{x:2,y:{a:2,d:3}},{y:{b:4}},(sv,tv,k)=>k=='d'?sv*9:undefined))
 *
 * @param target 目标对象
 * @param sources 1-n个源对象
 * @param [handler=noop] (src[k],target[k],k,src,target,chain) 自定义赋值处理器，返回赋予target[k]的值
 * @returns 返回target
 * @since 0.22.0
 */
function mergeWith<T extends Record<UnknownMapKey, any>>(
  target: T,
  ...sources: any[]
): T {
  const rs = checkTarget(target)
  if (rs) return rs

  let src = sources
  let handler = last(sources)
  if (!isFunction(handler)) {
    handler = noop
  } else {
    src = initial(src)
  }

  walkSources(target, src, handler as Function, [])
  return target
}

function walkSources(
  target: Record<UnknownMapKey, any>,
  src: Record<any, any>[],
  handler: Function,
  stack: any[]
) {
  eachSources(target, src, null, (v, sv, tv, k, s, t) => {
    const path = concat(stack, k)
    v = handler(sv, tv, k, s, t, path)
    if (isDefined(v)) {
      t[k] = v
    } else {
      if (isObject(tv)) {
        walkSources(tv, [sv], handler, path)
      } else {
        t[k] = sv
      }
    }
  })
}

/**
 * 对`object`内的所有属性进行断言并返回第一个匹配的属性key
 *
 * @example
 * const libs = {
 *  'func.js':{platform:['web','nodejs'],tags:{utils:true}},
 *  'juth2':{platform:['web','java'],tags:{utils:false,middleware:true}},
 *  'soya2d':{platform:['web'],tags:{utils:true}}
 * }
 *
 * //func.js 查询对象的key
 * console.log(_.findKey(libs,'tags.utils'))
 * //juth2
 * console.log(_.findKey(libs,{'tags.utils':false}))
 * //tags
 * console.log(_.findKey(libs['soya2d'],'utils'))
 * //2
 * console.log(_.findKey([{a:1,b:2},{c:2},{d:3}],'d'))
 *
 * @param object 所有集合对象array / arrayLike / map / object / ...
 * @param predicate (value[,index|key[,collection]]) 断言
 * <br>当断言是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @returns 第一个匹配断言的元素的key或undefined
 */
function findKey<V>(
  object: Collection,
  predicate:
    | ((value: V, index: UnknownMapKey, collection: Collection) => boolean)
    | NonFuncItee
): string | number | symbol | undefined {
  const callback = iteratee(predicate)
  let rs
  each(object, (v, k, c) => {
    const r = callback(v, k, c)
    if (r) {
      rs = k
      return false
    }
  })
  return rs
}

export {
  assign,
  assignWith,
  merge,
  mergeWith,
  clone,
  cloneDeep,
  cloneWith,
  cloneDeepWith,
  toObject,
  get,
  set,
  keys,
  keysIn,
  values,
  valuesIn,
  has,
  toPairs,
  fromPairs,
  pick,
  pickBy,
  omit,
  omitBy,
  prop,
  functions,
  defaults,
  defaultsDeep,
  findKey,
}
