/* eslint-disable max-len */
/**
 * math相关函数
 *
 * @packageDocumentation
 */
/**
 * 
 * @author holyhigh
 */
import { compact, flatDeep } from './array'
import { isNaN, isUndefined } from './is'

/**
 * 返回一个大于等于min，小于max的随机整数。支持单参数签名
 * 
 * ```js
 * _.randi(max);//此时min为0
 * ```
 * 
 * @example
 * //0-9随机整数
 * console.log(_.randi(10))
 * //10-19随机整数
 * console.log(_.randi(10,20))
 *
 * @param min 最小边界值，包含。会进行整数转换，如果非数字会变为0，如果是小数会舍弃取整
 * @param max 最大边界值，不包含。会进行整数转换，如果非数字会变为0，如果是小数会舍弃取整
 * @returns
 */
function randi(max: number): number
function randi(min: number, max?: number): number
function randi(min: number, max?: number): number {
  let maxNum = max || min
  if (isUndefined(max)) {
    min = 0
  }
  maxNum >>= 0
  min >>= 0
  return (Math.random() * (maxNum - min) + min) >> 0
}

/**
 * 返回一个大于等于min，小于max的随机浮点数。支持单参数/无参数签名
 * 
 * ```js
 * _.randf(max);//单参数签名，此时min为0
 * _.randf();//无参数签名，此时返回0-1的随机浮点数。效果与Math.random()相同
 * ```
 * 
 * @example
 * //0-1随机浮点数
 * console.log(_.randf())
 * //0-9随机浮点数
 * console.log(_.randf(10))
 * //10-19随机浮点数
 * console.log(_.randf(10,20))
 *
 * @param min 最小边界值，包含。会进行浮点数转换，如果非数字会变为0
 * @param max 最大边界值，不包含。会进行整数转换，如果非数字会变为0
 * @returns
 */
function randf(): number
function randf(max: number): number
function randf(min?: number, max?: number): number
function randf(min?: number, max?: number): number {
  if (isUndefined(max)) {
    if (!min) return Math.random()

    max = min
    min = 0
  }
  max = parseFloat(max + '') || 0
  min = parseFloat(min + '') || 0
  return Math.random() * (max - min) + min
}

/**
 * 对多个数字或数字列表进行求和并返回结果
 * @example
 * //10
 * console.log(_.sum(1,2,'3',4))
 * //10
 * console.log(_.sum([1,'2',3,4]))
 * //10
 * console.log(_.sum([1,2],'3',4))
 * //6
 * console.log(_.sum(new Set([1,2,3]),'a'))
 *
 * @param values 1-n个需要合计的值
 * @returns
 */
function sum(
  ...values: (Set<string | number> | Array<string | number> | number | string)[]
): number {
  let rs = 0
  let ary = flatDeep<any>(values)
  const f64a = new Float64Array(ary)
  f64a.forEach((v: number) => {
    rs += v || 0
  })
  return rs
}

/**
 * 对多个数字或数字列表计算平均值并返回结果。无效数字不会算在平均计数中
 * @example
 * //2.5
 * console.log(_.avg(1,2,'3',4))
 * //2.5
 * console.log(_.avg([1,'2',3,'a',4]))
 *
 * @param values 1-n个需要合计的值
 * @returns
 */
function avg(
  ...values: (Set<string | number> | Array<string | number> | number | string)[]
): number {
  let rs = 0
  let ary = flatDeep<any>(values)
  const f64a = new Float64Array(ary)

  ;(ary = compact(f64a as any)).forEach((v: number) => {
    rs += v || 0
  })
  return rs / ary.length
}

/**
 * 返回给定数字序列中最大的一个
 * @example
 * //7
 * console.log(_.max(2,3,1,7,4,5))
 * //6
 * console.log(_.max(4,[5,[1,2,3],6],'x','y'))
 *
 * @param values 1-n个需要计算的值。如果非数字会自动忽略
 * @returns
 * @since 0.16.0
 */
function max(
  ...values: (Set<string | number> | Array<string | number> | number | string)[]
): number {
  let ary = flatDeep<any>(values)
  let f64a = new Float64Array(ary)
  f64a.sort()
  f64a = f64a.filter((v: any) => !isNaN(v))
  return f64a[f64a.length - 1]
}

/**
 * 返回给定数字序列中最小的一个
 * @example
 * //1
 * console.log(_.min(2,3,1,7,4,5))
 * //0
 * console.log(_.min(4,[5,[1,2,3],6],0,'x','y'))
 * @param values 1-n个需要计算的值。如果非数字会自动忽略
 * @returns
 * @since 0.16.0
 */
function min(
  ...values: (Set<string | number> | Array<string | number> | number | string)[]
): number {
  let ary = flatDeep<any>(values)
  let f64a = new Float64Array(ary)
  f64a.sort()
  f64a = f64a.filter((v: any) => !isNaN(v))
  return f64a[0]
}

export { randi, randf, sum, max, min, avg }
