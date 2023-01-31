/* eslint-disable valid-jsdoc */
/* eslint-disable max-len */
/**
 * 数组/类数组相关函数
 *
 * @packageDocumentation
 */
/**
 * 
 * @author holyhigh
 */
import {
  each,
  eachRight,
  filter,
  includes,
  map,
  size,
  toArray,
} from './collection'
import { isUndefined, isArrayLike, isFunction, isArray, isNumber } from './is'
import { toInteger, toNumber } from './number'
import { get } from './object'
import { ArrayLike, NonFuncItee, UnknownMapKey } from './types'
import { identity, iteratee } from './utils'

/**
 * 对数组内的值进行去重
 * @example
 * // [1,2,4,"a","1",null]
 * console.log(_.unique([1,2,2,4,4,'a','1','a',null,null]))
 *
 * @param array 数组
 * @returns 转换后的新数组对象
 */
function uniq<T>(array: T[]): T[] {
  const ary = toArray(array)
  return toArray(new Set(ary))
}

/**
 * 同<code>uniq</code>，但支持自定义筛选函数
 * @example
 * // [{"a":1},{"a":"1"},{"a":2},{"a":"2"}]
 * console.log(_.uniqBy([{a:1},{a:1},{a:'1'},{a:2},{a:'2'},{a:2}],'a'))
 * // [{"a":1},{"a":2}]
 * console.log(_.uniqBy([{a:1},{a:1},{a:'1'},{a:2},{a:'2'},{a:2}],v=>v.a>>0))
 *
 * @param array 数组
 * @param iteratee (value,index) 筛选函数，返回需要对比的值。默认identity
 * <br>当iteratee是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils.iteratee}
 * @returns 去重后的新数组对象
 * @since 1.1.0
 */
function uniqBy<T>(
  array: T[],
  itee: ((value: T, index: UnknownMapKey) => boolean) | NonFuncItee
): T[] {
  const cb = iteratee(itee || identity)
  const keyMap = new Map()
  const rs: T[] = []
  each<T>(array, (v, k) => {
    const key = cb(v, k)
    if (keyMap.get(key)) return
    keyMap.set(key, 1)
    rs.push(v)
  })
  return rs
}

/**
 * 对集合内的假值进行剔除，并返回剔除后的新数组。假值包括 null/undefined/NaN/0/''/false
 * @example
 * //[1,2,4,'a','1']
 * console.log(_.compact([0,1,false,2,4,undefined,'a','1','',null]))
 *
 * @param array 数组
 * @returns 转换后的新数组对象
 */
function compact<T>(array: T[]): T[] {
  return toArray(array).filter<T>(identity as any)
}

/**
 * 获取数组中的第一个元素
 *
 * @example
 * //1
 * console.log(_.first([1,2,3]))
 * //"1"
 * console.log(_.first(new Set(['1',1])))
 *
 * @param array 数组
 * @returns 数组中第一个元素
 */
function first<T>(array: T[]): T {
  return toArray<T>(array)[0]
}

/**
 * 获取数组中的最后一个元素
 *
 * @example
 * //3
 * console.log(_.last([1,2,3]))
 *
 * @param array 数组
 * @returns 数组中最后一个元素
 */
function last<T>(array: T[]): T {
  const ary = toArray<T>(array)
  return ary[ary.length - 1]
}

/**
 * 对数组进行切片，并返回切片后的新数组，原数组不变。新数组内容是对原数组内容的浅拷贝
 *
 * @example
 * //[2,3,4]
 * console.log(_.slice([1,2,3,4,5],1,4))
 * //[2,3,4,5]
 * console.log(_.slice([1,2,3,4,5],1))
 *
 *
 * @param array 数组
 * @param [begin=0] 切片起始下标，包含下标位置元素
 * @param [end] 切片结束下标，<b>不包含</b>下标位置元素
 * @returns 切片元素组成的新数组
 */
function slice<T>(array: T[] | ArrayLike, begin?: number, end?: number): T[] {
  return toArray<T>(array).slice(begin || 0, end)
}

/**
 * 按照指定的嵌套深度递归遍历数组，并将所有元素与子数组中的元素合并为一个新数组返回
 *
 * @example
 * //[1,2,3,4,5]
 * console.log(_.flat([1,[2,3],[4,5]]))
 * //[1,2,3,4,5,[6,7]]
 * console.log(_.flat([1,[2,3],[4,5,[6,7]]]))
 * //[1,2,3,[4]]
 * console.log(_.flat([1,[2,[3,[4]]]],2))
 * //[1,2,1,3,4]
 * console.log(_.flat(new Set([1,1,[2,[1,[3,4]]]]),Infinity))
 *
 * @param array 数组
 * @param [depth=1] 嵌套深度
 * @returns 扁平化后的新数组
 */
function flat<T>(array: any[], depth: number = 1): T[] {
  if (depth < 1) return array.concat() as T[]
  const rs = toArray<T>(array).reduce((acc, val: any) => {
    return acc.concat(
      Array.isArray(val) && depth > 0 ? flat<T>(val, depth - 1) : val
    )
  }, [])

  return rs
}

/**
 * 无限深度遍历数组，并将所有元素与子数组中的元素合并为一个新数组返回
 *
 * @example
 * //[1,2,1,3,4]
 * console.log(_.flatDeep(new Set([1,1,[2,[1,[3,4]]]])))
 * //[1,2,3,4]
 * console.log(_.flatDeep([1,[2,[3,[4]]]]))
 *
 * @param array 数组
 * @returns 扁平化后的新数组
 */
function flatDeep<T>(array: any[]): T[] {
  return flat<T>(array, Infinity)
}

/**
 * 使用固定值填充arrayLike中从起始索引到终止索引内的全部元素
 *
 * @example
 * //[6, 6, 6]
 * console.log(_.fill(new Array(3), 6))
 * //[1, 'x', 'x', 'x', 5]
 * console.log(_.fill([1, 2, 3, 4, 5], 'x', 1, 4))
 *
 * @param array 数组
 * @param value 填充值
 * @param [start=0] 起始索引，包含
 * @param [end] 终止索引，不包含
 * @returns 填充后的新数组
 */
function fill<T>(array: T[], value: any, start: number = 0, end?: number): T[] {
  const rs = toArray<T>(array)
  rs.fill(value, start, end)
  return rs
}

/**
 * 把arrayLike中所有元素连接成字符串并返回。对于基本类型元素会直接转为字符值，对象类型会调用toString()方法
 *
 * @example
 * //'1/2/3/4'
 * console.log(_.join([1, 2, 3, 4], '/'))
 * //'1,2,3,4'
 * console.log(_.join([1, 2, 3, 4]))
 *
 * @param array 数组
 * @param [separator=','] 分隔符
 * @returns 拼接字符串
 */
function join(array: any[], separator?: string): string {
  return toArray(array).join(separator || ',')
}

/**
 * 合并数组或值并返回新数组，元素可以重复。基于 `Array.prototype.concat` 实现
 *
 * @example
 * //[a/b/a]
 * console.log(_.concat([{name:'a'},{name:'b'}],[{name:'a'}]))
 * //[1, 2, 3, 1, 2]
 * console.log(_.concat([1,2,3],[1,2]))
 * //[1, 2, 3, 1, 2, null, 0]
 * console.log(_.concat([1,2,3],[1,2],null,0))
 * //[1, 2, 3, 1, 2, doms..., 0, null]
 * console.log(_.concat([1,2,3],[1,2],document.body.children,0,null))
 *
 * @param arrays 1-n个数组对象
 * @returns 如果参数为空，返回空数组
 */
function concat(...arrays: any[]): any[] {
  if (arrays.length < 1) return []
  arrays = arrays.map((alk) => (isArrayLike(alk) ? toArray(alk) : alk))
  return toArray(arrays[0]).concat(...arrays.slice(1))
}

/**
 * 对所有集合做差集并返回差集元素组成的新数组
 *
 * @example
 * //[1]
 * console.log(_.except([1,2,3],[2,3]))
 * //[1,4]
 * console.log(_.except([1,2,3],[2,3],[3,2,1,4]))
 * //[{name: "b"}]
 * console.log(_.except([{name:'a'},{name:'b'}],[{name:'a'}],v=>v.name))
 * //[2, 3, "2", "3"] '2'和2不相等
 * console.log(_.except([1,2,3],[1,'2',3],[2,'3',1]))
 *
 * @param [arrays] 1-n个数组或arraylike对象，非arraylike参数会被忽略
 * @param [identifier] (v);标识函数，用来对每个元素返回唯一标识，标识相同的值会认为相等。使用<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality">SameValueZero</a>
 * 算法进行值比较。如果为空，直接使用值自身比较
 * @returns 差集元素组成的新数组
 */
function except(...params: any): any[] {
  let comparator
  let list = params
  if (params.length > 2) {
    const lp = last(params)
    if (isFunction(lp)) {
      comparator = lp
      list = params.slice(0, params.length - 1)
    }
  }
  list = list.filter((v: any) => isArrayLike(v) || isArray(v))
  if (list.length < 1) return list
  const len = list.length
  const kvMap = new Map()
  // 遍历所有元素
  for (let j = 0; j < len; j++) {
    const ary = list[j]
    const localMap = new Map()
    for (let i = 0; i < ary.length; i++) {
      const v = ary[i]
      const id = comparator ? comparator(v) : v
      if (!kvMap.get(id)) {
        // 防止组内重复
        kvMap.set(id, { i: 0, v: v })
      }
      if (kvMap.get(id) && !localMap.get(id)) {
        kvMap.get(id).i++
        // 相同id本组内不再匹配
        localMap.set(id, true)
      }
    }
  }
  const rs: any[] = []
  each(kvMap, (v: any) => {
    if (v.i < len) {
      rs.push(v.v)
    }
  })
  return rs
}

/**
 * 对所有集合做并集并返回并集元素组成的新数组。并集类似concat()但不允许重复值
 *
 * @example
 * //[1, 2, 3]
 * console.log(_.union([1,2,3],[2,3]))
 * //[1, 2, 3, "1", "2"]
 * console.log(_.union([1,2,3],['1','2']))
 * //[{name: "a"},{name: "b"}]
 * console.log(_.union([{name:'a'},{name:'b'}],[{name:'a'}],v=>v.name))
 * //[a/b/a] 没有标识函数无法去重
 * console.log(_.union([{name:'a'},{name:'b'}],[{name:'a'}]))
 * //[1, 2, 3, "3"] "3"和3不相等
 * console.log(_.union([1,2,3],[1,3],[2,'3',1]))
 *
 * @param [arrays] 1-n个数组或arraylike对象，非arraylike参数会被忽略
 * @param [identifier] (v);标识函数，用来对每个元素返回唯一标识，标识相同的值会认为相等。使用<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality">SameValueZero</a>
 * 算法进行值比较。如果为空，直接使用值自身比较
 * @returns 并集元素组成的新数组
 */
function union(...params: any): any[] {
  let comparator: any
  let list = params
  if (params.length > 2 && isFunction(last(params))) {
    comparator = last(params)
    list = params.slice(0, params.length - 1)
  }

  list = list.filter((v: any) => isArrayLike(v) || isArray(v))
  if (list.length < 1) return list
  let rs
  if (comparator) {
    const kvMap = new Map()
    flat(list).forEach((v) => {
      const id = comparator(v)
      if (!kvMap.get(id)) {
        kvMap.set(id, v)
      }
    })
    rs = map(kvMap, (v: any) => v)
  } else {
    rs = toArray(new Set(flat(list)))
  }
  return rs
}

/**
 * 对所有集合做交集并返回交集元素组成的新数组
 * <p>
 * 关于算法性能可以查看文章<a href="https://www.jianshu.com/p/aa131d573575" target="_holyhigh">《如何实现高性能集合操作(intersect)》</a>
 * </p>
 *
 * @example
 * //[2]
 * console.log(_.intersect([1,2,3],[2,3],[1,2]))
 * //[3]
 * console.log(_.intersect([1,1,2,2,3],[1,2,3,4,4,4],[3,3,3,3,3,3]))
 * //[{name: "a"}] 最后一个参数是函数时作为标识函数
 * console.log(_.intersect([{name:'a'},{name:'b'}],[{name:'a'}],v=>v.name))
 * //[]
 * console.log(_.intersect())
 * //[3] 第三个参数被忽略，然后求交集
 * console.log(_.intersect([1,2,3],[3],undefined))
 * //[1] "2"和2不相同，3和"3"不相同
 * console.log(_.intersect([1,2,3],[1,'2',3],[2,'3',1]))
 *
 * @param [arrays] 1-n个数组或arraylike对象，非arraylike参数会被忽略
 * @param [identifier] (v);标识函数，用来对每个元素返回唯一标识，标识相同的值会认为相等。使用<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality">SameValueZero</a>
 * 算法进行值比较。如果为空，直接使用值自身比较
 * @returns 交集元素组成的新数组
 */
function intersect(...params: any) {
  let comparator
  let list = params

  if (params.length > 2) {
    const lp = last(params)
    if (isFunction(lp)) {
      comparator = lp
      list = params.slice(0, params.length - 1)
    }
  }
  list = list.filter((v: any) => isArrayLike(v) || isArray(v))
  if (list.length < 1) return list
  const len = list.length
  // 取得最短集合
  list.sort((a: any, b: any) => a.length - b.length)
  const kvMap = new Map()
  // 记录最少id
  let idLength = 0 // 用于快速匹配
  for (let i = list[0].length; i--; ) {
    const v = list[0][i]
    const id = comparator ? comparator(v) : v
    if (!kvMap.get(id)) {
      // 防止组内重复
      kvMap.set(id, { i: 1, v: v })
      idLength++
    }
  }
  for (let j = 1; j < len; j++) {
    const ary = list[j]
    const localMap = new Map()
    let localMatchedCount = 0
    for (let i = 0; i < ary.length; i++) {
      const v = ary[i]
      const id = comparator ? comparator(v) : v
      if (kvMap.get(id) && !localMap.get(id)) {
        kvMap.get(id).i++
        // 相同id本组内不再匹配
        localMap.set(id, true)
        // 匹配次数加1
        localMatchedCount++
        // 已经匹配完所有可交集元素，无需继续检查
        if (localMatchedCount === idLength) break
      }
    }
  }
  const rs: any[] = []
  each(kvMap, (v: any) => {
    if (v.i === len) {
      rs.push(v.v)
    }
  })

  return rs
}

/**
 * 对数组元素位置进行颠倒，返回改变后的数组。
 *
 *  @example
 * //[3, 2, 1]
 * console.log(_.reverse([1, 2, 3]))
 *
 * @param array 数组
 * @returns 颠倒后的新数组
 */
function reverse<T>(array: T[]): T[] {
  const rs = toArray<T>(array)
  return rs.reverse()
}

/**
 * first()的别名函数
 *
 * @function
 * @param array arrayLike对象及set对象
 * @returns 数组中第一个元素
 */
const head = first

/**
 * 返回除第一个元素外的所有元素组成的新数组
 *
 * @example
 * //[2, 3]
 * console.log(_.tail([1, 2, 3]))
 *
 * @param array 数组
 * @returns 新数组
 */
function tail<T>(array: T[]): T[] {
  const rs = toArray<T>(array)
  return rs.slice(1)
}

/**
 * 返回除最后一个元素外的所有元素组成的新数组
 *
 * @example
 * //[1, 2]
 * console.log(_.initial([1, 2, 3]))
 *
 * @param array 数组
 * @returns 新数组
 * @since 0.19.0
 */
function initial<T>(array: T[]): T[] {
  const rs = toArray<T>(array)
  rs.pop()
  return rs
}

/**
 * 从起始位置获取指定数量的元素并放入新数组后返回
 *
 * @example
 * //[1, 2, 3]
 * console.log(_.take([1, 2, 3, 4, 5],3))
 * //[1, 2, 3, 4, 5]
 * console.log(_.take([1, 2, 3, 4, 5]))
 *
 * @param array 数组
 * @param [length] 获取元素数量，默认数组长度
 * @returns 新数组
 */
function take<T>(array: T[], length?: number): T[] {
  const rs = toArray<T>(array)
  return rs.slice(0, length)
}

/**
 * 从数组末尾位置获取指定数量的元素放入新数组并返回
 *
 * @example
 * //[3, 4, 5]
 * console.log(_.takeRight([1, 2, 3, 4, 5],3))
 * //[1, 2, 3, 4, 5]
 * console.log(_.takeRight([1, 2, 3, 4, 5]))
 *
 * @param array 数组
 * @param length
 * @returns 新数组
 * @since 1.2.0
 */
function takeRight<T>(array: T[], length?: number): T[] {
  const rs = toArray<T>(array)
  const maxLength = rs.length
  return rs.slice(maxLength - (length || maxLength), maxLength)
}

/**
 * 生成一个由(包含)start到(不包含)end的数字元素组成的数组。
 * 根据参数个数不同，分为三种签名
 * <pre><code class="language-javascript">
 * _.range(end);
 * _.range(start,end);
 * _.range(start,end,step);
 * </code></pre>
 *
 * @example
 * //[0, 1, 2, 3, 4]
 * console.log(_.range(5))
 * //[0, -1, -2, -3, -4]
 * console.log(_.range(-5))
 * //[0, -0.5, -1, -1.5, -2, -2.5, -3, -3.5, -4, -4.5]
 * console.log(_.range(0,-5,0.5))
 * //[-5, -4, -3, -2, -1, 0]
 * console.log(_.range(-5,1))
 *
 * @param [start=0] 起始数
 * @param end 结束数
 * @param [step=1] 步长
 * @returns 数字数组
 */
function range(end: number): number[]
function range(start: number, end: number): number[]
function range(start: number, end: number, step: number): number[]
function range(start: number = 0, end?: number, step?: number): number[] {
  let startNum = 0
  let endNum = 0
  let stepNum = 1

  if (isNumber(start) && isUndefined(end) && isUndefined(step)) {
    endNum = start >> 0
  } else if (isNumber(start) && isNumber(end) && isUndefined(step)) {
    startNum = start >> 0
    endNum = end >> 0
  } else if (isNumber(start) && isNumber(end) && isNumber(step)) {
    startNum = start >> 0
    endNum = end >> 0
    stepNum = step || 1
  }

  const rs = Array(Math.round(Math.abs(endNum - startNum) / stepNum))
  let rsIndex = 0
  if (endNum > startNum) {
    for (let i = startNum; i < endNum; i += stepNum) {
      rs[rsIndex++] = i
    }
  } else if (endNum < startNum) {
    for (let i = startNum; i > endNum; i -= stepNum) {
      rs[rsIndex++] = i
    }
  }

  return rs
}

/**
 * 对集合内的所有元素进行断言并返回第一个匹配的元素索引
 *
 * @example
 * //3 查询数组的索引
 * console.log(_.findIndex(['a','b','c',1,3,6],_.isNumber))
 * //0
 * console.log(_.findIndex([{a:1},{a:2},{a:3}],'a'))
 * //2
 * console.log(_.findIndex([{a:1},{a:2},{a:3}],{a:3}))
 *
 * @param array 数组
 * @param predicate (value[,index[,array]]);断言
 * <br>当断言是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @param fromIndex 从0开始的起始索引，设置该参数可以减少实际遍历次数。默认0
 * @returns 第一个匹配断言的元素索引或-1
 */
function findIndex<T>(
  array: T[],
  predicate:
    | ((value: T, index: string | number, array: T[]) => boolean)
    | NonFuncItee,
  fromIndex?: number
): number {
  let rs = -1
  let fromIndexNum = fromIndex || 0
  const itee = iteratee(predicate)
  each<any, number>(slice(array, fromIndexNum), (v, k, c) => {
    const r = itee(v, k, c)
    if (r) {
      rs = k + fromIndexNum
      return false
    }
  })
  return rs
}

/**
 * 对集合内的所有元素进行断言并返回最后一个匹配的元素索引
 *
 * @example
 * //5 查询数组的索引
 * console.log(_.findLastIndex(['a','b','c',1,3,6],_.isNumber))
 * //2
 * console.log(_.findLastIndex([{a:1},{a:2},{a:3}],'a'))
 *
 * @param array arrayLike对象及set对象
 * @param predicate (value[,index[,array]]);断言
 * <br>当断言是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @param [fromIndex=array.length - 1] 从集合长度-1开始的起始索引。设置该参数可以减少实际遍历次数
 * @returns 最后一个匹配断言的元素索引或-1
 * @since 0.19.0
 */
function findLastIndex<T>(
  array: T[],
  predicate:
    | ((value: T, index: string | number, array: T[]) => boolean)
    | NonFuncItee,
  fromIndex?: number
): number {
  let rs = -1
  let fromIndexNum = fromIndex || 0
  const itee = iteratee(predicate)
  if (isUndefined(fromIndex)) {
    fromIndexNum = size(array) - 1
  }
  eachRight<any, number>(slice(array, 0, fromIndexNum + 1), (v, k, c) => {
    const r = itee(v, k, c)
    if (r) {
      rs = k
      return false
    }
  })
  return rs
}

/**
 * 向数组中指定位置插入一个或多个元素并返回
 * <div class="alert alert-secondary">
      该函数会修改原数组
    </div>
 *
 * @example
 * //[1, 2, Array(1), 'a', 3, 4]
 * let ary = [1,2,3,4];
 * _.insert(ary,2,[1],'a');
 * console.log(ary);
 * //[1, 2, 3, 4]
 * ary = [3,4];
 * _.insert(ary,0,1,2);
 * console.log(ary);
 * //func.js
 * console.log(_.insert('funcjs',4,'.').join(''));
 *
 * @param array 数组对象。如果非数组类型会自动转为数组
 * @param index 插入位置索引，0 - 列表长度
 * @param values 1-n个需要插入列表的值
 * @returns 插入值后的数组对象
 */
function insert<T>(array: T[], index: number, ...values: any[]): T[] {
  const rs = isArray(array) ? array : toArray<T>(array)
  if (!isNumber(index) || index < 0) index = 0
  rs.splice(index, 0, ...values)
  return rs
}

/**
 * 向数组末尾追加一个或多个元素并返回
 * <div class="alert alert-secondary">
      该函数会修改原数组
    </div>
 *
 * @example
 * //[1, 2, 3, 4]
 * let ary = [1,2];
 * _.append(ary,3,4);
 * console.log(ary);
 * //[1, 2, Array(2), 5]
 * ary = [1,2];
 * _.append(ary,[3,4],5);
 * console.log(ary);
 * //[1, 2, 3, 4]
 * ary = [1,2];
 * _.append(ary,...[3,4]);
 * console.log(ary);
 *
 * @param array 数组对象。如果非数组类型会自动转为数组
 * @param values 1-n个需要插入列表的值
 * @returns 插入值后的数组对象
 */
function append<T>(array: T[], ...values: any[]): T[] {
  const rs = isArray(array) ? array : toArray<T>(array)
  rs.push(...values)
  return rs
}

/**
 * 删除数组中断言结果为true的元素并返回被删除的元素
 * <div class="alert alert-secondary">
      该函数会修改原数组
    </div>
 *
 * @example
 * //[1, 3] [2, 4]
 * let ary = [1,2,3,4];
 * console.log(_.remove(ary,x=>x%2),ary)
 * //[2] [1,3]
 * ary = [{a:1},{a:2},{a:3}];
 * console.log(_.remove(ary,v=>v.a===2),ary)
 * //[3] [1,2]
 * ary = [{a:1},{a:2},{a:3}];
 * console.log(_.remove(ary,{a:3}),ary)
 *
 * @param array 数组对象，如果参数非数组直接返回
 * @param predicate (value[,index[,array]]);断言
 * <br>当断言是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @returns 被删除的元素数组或空数组
 * @since 0.19.0
 */
function remove<T>(
  array: T[],
  predicate:
    | ((value: T, index: string | number, array: T[]) => boolean)
    | NonFuncItee
): T[] {
  const rs: T[] = []
  if (!isArray(array)) return rs
  const itee = iteratee(predicate)

  let i = 0
  for (let l = 0; l < array.length; l++) {
    const item = array[l]
    const r = itee(item, l, array)
    if (r) {
      rs.push(item)
    } else {
      array[i++] = item
    }
  }
  array.length = i

  return rs
}

/**
 * 返回删除所有values后的新数组。使用<code>eq</code>函数进行等值判断
 *
 * @example
 * //[1, 1]
 * console.log(_.without([1,2,3,4,3,2,1],2,3,4))
 *
 * @param array 数组对象
 * @param values 需要删除的值
 * @returns 新数组
 * @since 0.19.0
 */
function without<T>(array: T[], ...values: T[]): T[] {
  return filter(array, (item) => !includes(values, item))
}

/**
 * 与without相同，但会修改原数组
 * <div class="alert alert-secondary">
      该函数会修改原数组
    </div>
 *
 * @example
 * //[1, 1] true
 * let ary = [1,2,3,4,3,2,1];
 * let newAry = _.pull(ary,2,3,4)
 * console.log(newAry,ary === newAry)
 *
 * @param array 数组对象
 * @param values 需要删除的值
 * @returns 新数组
 * @since 0.19.0
 */
function pull<T>(array: T[], ...values: T[]): T[] {
  remove(array, (item) => includes(values, item))
  return array
}

/**
 * 删除数组末尾或指定索引的一个元素并返回被删除的元素。
 * <div class="alert alert-secondary">
      该函数会修改原数组
    </div>
 *
 * @example
 * //3, [1, 2]
 * let ary = [1,2,3];
 * console.log(_.pop(ary),ary)
 * //{a: 1}, [{"a":2},{"a":3}]
 * ary = [{a:1},{a:2},{a:3}];
 * console.log(_.pop(ary,0),ary)
 *
 * @param array 数组对象。如果非数组类型会直接返回null
 * @param [index=-1] 要删除元素的索引。默认删除最后一个元素
 * @returns 被删除的值或null
 */
function pop<T>(array: unknown[], index?: number): T | null {
  index = index || -1
  let rs = null
  if (isArray(array)) {
    const i = toNumber(index)
    if (i > -1) {
      rs = array.splice(i, 1)
      if (size(rs) < 1) rs = null
      else {
        rs = rs[0]
      }
    } else {
      rs = array.pop()
    }
  }
  return rs as T | null
}

/**
 * 把指定数组拆分成多个长度为size的子数组，并返回子数组组成的二维数组
 * @example
 * //[[1,2],[3,4]]
 * console.log(_.chunk([1,2,3,4],2))
 * //[[1,2,3],[4]]
 * console.log(_.chunk([1,2,3,4],3))
 *
 * @param array 数组对象。如果非数组类型会转成数组
 * @param [size=1] 子数组长度
 * @returns 拆分后的新数组
 * @since 0.23.0
 */
function chunk<T>(array: T[], size: number = 1): T[][] {
  const ary = toArray<T>(array)
  const sizeNum = (size || 1) >> 0
  const rs: T[][] = []
  ary.forEach((v, i) => {
    if (i % sizeNum == 0) {
      rs.push(ary.slice(i, i + sizeNum))
    }
  })
  return rs
}

/**
 * 创建一个由指定数组arrays内元素重新分组后组成的二维数组，
 * 第一个子数组由每个数组内的第一个元素组成，第二个子数组由每个数组内的第二个元素组成，以此类推。
 * 子数组的数量由参数中数组内元素最多的数组决定。
 * @example
 * //[[1, 'a'],[2, 'b'],[undefined, 'c']]
 * console.log(_.zip([1,2],['a','b','c']))
 * //[['a', 1, '1'], ['b', 2, undefined],['c', undefined,undefined]]
 * console.log(_.zip(['a','b','c'],[1,2],['1']))
 *
 * @param arrays 1-n个数组
 * @returns 重新分组后的新数组
 * @since 0.23.0
 */
function zip(...arrays: any[][]): any[][] {
  const rs: any[][] = []
  const size = arrays.length
  arrays.forEach((ary, colIndex) => {
    each<any, number>(ary, (el, i) => {
      let group = rs[i]
      if (!group) {
        group = rs[i] = new Array(size)
      }
      group[colIndex] = el
    })
  })

  return rs
}

/**
 * 与<code>zip</code>相同，但支持自定义组合逻辑
 * @example
 * //[[1, 3, 5], [2, 4, 6]]
 * console.log(_.zipWith([1,2],[3,4],[5,6]))
 * //[9, 12]
 * console.log(_.zipWith([1,2],[3,4],[5,6],_.sum))
 * //[3, 4]
 * console.log(_.zipWith([1,2],[3,4],[5,6],group=>_.avg(group)))
 *
 * @param arrays 1-n个数组
 * @param [iteratee=identity] (group)回调函数，返回组合后的分组值
 * @returns 重新分组后的新数组
 * @since 1.0.0
 */
function zipWith(...params: any): any[][] {
  let itee = last(params)
  const arys = params
  if (!isFunction(itee)) {
    itee = identity
  } else {
    pop(arys)
  }
  const rs = zip(...arys)
  return map(rs, (group) => (itee as Function)(group))
}

/**
 * <code>zip</code>的反操作
 * @example
 * //[[1,2,undefined],['a','b','c']]
 * console.log(_.unzip([[1, 'a'],[2, 'b'],[undefined, 'c']]))
 * //[['a', 'b', 'c'], [1, 2, undefined],['1', undefined,undefined]]
 * console.log(_.unzip([['a', 1, '1'], ['b', 2],['c']]))
 *
 * @param array 包含若干分组的数组
 * @returns 重新分组后的新数组
 * @since 0.23.0
 */
function unzip(array: any[]): any[][] {
  const rs: any[][] = []
  const len = size(array)
  each<any[], number>(array, (group, colIndex) => {
    each<any, number>(group, (el, rowIndex) => {
      let row = rs[rowIndex]
      if (!row) {
        row = rs[rowIndex] = new Array(len)
      }
      row[colIndex] = el
    })
  })

  return rs
}

/**
 * 创建一个对象，属性名称与属性值分别来自两个数组
 * @example
 * //{a: 1, b: 2}
 * console.log(_.zipObject(['a','b'],[1,2,3]))
 *
 * @param keys 对象属性标识符数组
 * @param values 对象值数组
 * @returns 组合后的对象
 * @since 0.23.0
 */
function zipObject(
  keys: Array<string | number | symbol>,
  values: any[]
): Record<UnknownMapKey, any> {
  const rs: { [key: string | number | symbol]: any } = {}
  each<string | number | symbol, number>(keys, (k, i) => {
    rs[k] = get(values, i)
  })

  return rs
}

/**
 * 使用二分法确定在array保持排序不变的情况下，value可以插入array的最小索引
 * @example
 * //1
 * console.log(_.sortedIndex([1,2,3],1.5))
 * //1
 * console.log(_.sortedIndex(['a', 'c'], 'b'))
 * //0
 * console.log(_.sortedIndex([{a:1},{a:2},{a:3}], {a:2.5}))
 *
 * @param array 对象属性标识符数组
 * @param value 需要插入数组的值
 * @returns array索引
 * @since 1.0.0
 */
function sortedIndex<T>(array: T[], value: any): number {
  return sortedIndexBy(array, value)
}

/**
 * 同<code>sortedIndex</code>，但支持自定义回调用来获取对比值
 * @example
 * //2
 * console.log(_.sortedIndexBy([{a:1},{a:2},{a:3}], {a:2.5},'a'))
 *
 * @param keys 对象属性标识符数组
 * @param value 需要插入数组的值
 * @param [iteratee=identity] (value)回调函数，返回排序对比值
 * @returns array索引
 * @since 1.0.0
 */
function sortedIndexBy<T>(
  array: T[],
  value: any,
  itee?: ((value: any) => any) | NonFuncItee
): number {
  let left = 0
  let right = size(array)
  let index = 0
  const cb = iteratee(itee || identity)
  value = cb(value)
  while (left < right) {
    const mid = toInteger((left + right) / 2)
    if (cb(array[mid]) < value) {
      left = mid + 1
      index = left
    } else {
      right = mid
    }
  }
  return index
}

export {
  findIndex,
  findLastIndex,
  compact,
  concat,
  except,
  first,
  join,
  last,
  flat,
  flatDeep,
  fill,
  slice,
  union,
  uniq,
  uniqBy,
  intersect,
  reverse,
  head,
  tail,
  initial,
  take,
  takeRight,
  range,
  pop,
  remove,
  append,
  insert,
  without,
  pull,
  chunk,
  zip,
  unzip,
  zipObject,
  zipWith,
  sortedIndex,
  sortedIndexBy,
}
