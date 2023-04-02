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
import { flatMap, map } from './collection'
import { isArrayLike, isNil, isUndefined } from './is'

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
 * 对字符/数字数组/Set进行求和并返回结果
 * - 对nil值，自动转为0
 * - 对NaN值，返回NaN
 * - 对Infinity值，返回Infinity
 * 
 * @example
 * //10
 * console.log(_.sum([1,'2',3,4]))
 * //10
 * console.log(_.sum([1,'2',3,4,null,undefined]))
 * //NaN
 * console.log(_.sum([NaN,'2',3,4]))
 * //Infinity
 * console.log(_.sum([Infinity,'2',3,4]))
 * //6
 * console.log(_.sum(new Set([1,2,3])))
 *
 * @param values 数字/字符数组/Set
 * @since 2.3
 * @returns
 */


function sum(
  values: Set<string | number> | Array<string | number>
): number
function sum(...values:any[]):number
function sum(...values:any[]):number {
  let ary:any = values
  if(ary.length === 1 && isArrayLike(ary[0])){
    ary = ary[0]
  }

  const vals = map<any>(ary,v=>isNil(v)?0:v)
  let rs = 0
  const f64a = new Float64Array(vals)
  f64a.forEach((v: number) => {
    rs += v
  })
  return rs
}

/**
 * 返回给定数字序列中最大的一个。忽略NaN，null，undefined
 * @example
 * //7
 * console.log(_.max([2,3,1,NaN,7,4,null]))
 * //6
 * console.log(_.max([4,5,6,'x','y']))
 * //Infinity
 * console.log(_.max([4,5,6,Infinity]))
 *
 * @param values 数字/字符数组/Set
 * @returns
 * @since 2.3
 */
function max(
  values: Set<string | number> | Array<string | number>
): number {
  const vals = flatMap<any>(values, v => isNil(v)||isNaN(v) ? [] : v)
  let f64a = new Float64Array(vals)
  f64a.sort()
  return f64a[f64a.length - 1]
}

/**
 * 返回给定数字序列中最小的一个。忽略NaN，null，undefined
 * @example
 * //-1
 * console.log(_.min([2,3,1,7,'-1']))
 * //0
 * console.log(_.min([4,3,6,0,'x','y']))
 * //-Infinity
 * console.log(_.min([-Infinity,-9999,0,null]))
 * @param values 数字/字符数组/Set
 * @returns
 * @since 2.3
 */
function min(
  values: Set<string | number> | Array<string | number>
): number {
  const vals = flatMap<any>(values, v => isNil(v) || isNaN(v) ? [] : v)
  let f64a = new Float64Array(vals)
  f64a.sort()
  return f64a[0]
}

/**
 * a + b
 * @example
 * //3
 * console.log(_.add(1,2))
 * //1
 * console.log(_.add(1,null))
 * //NaN
 * console.log(_.add(1,NaN))
 * 
 * @param a 
 * @param b 
 * @returns a+b
 * @since 2.3
 */
function add(a:number,b:number):number{
  a = isNil(a) ? 0 : a
  b = isNil(b) ? 0 : b
  return a + b
}

/**
 * a - b
 * @example
 * //-1
 * console.log(_.subtract(1,2))
 * //1
 * console.log(_.subtract(1,null))
 * //NaN
 * console.log(_.subtract(1,NaN))
 * 
 * @param a 
 * @param b 
 * @returns a - b
 * @since 2.3
 */
function subtract(a:number,b:number):number{
  a = isNil(a) ? 0 : a
  b = isNil(b) ? 0 : b
  return a - b
}

/**
 * a / b
 * @example
 * //0.5
 * console.log(_.divide(1,2))
 * //Infinity
 * console.log(_.divide(1,null))
 * //NaN
 * console.log(_.divide(1,NaN))
 * 
 * @param a 
 * @param b 
 * @returns a/b
 * @since 2.3
 */
function divide(a:number,b:number):number{
  a = isNil(a) ? 0 : a
  b = isNil(b) ? 0 : b
  return a / b
}

/**
 * a * b
 * @example
 * //2
 * console.log(_.multiply(1,2))
 * //0
 * console.log(_.multiply(1,null))
 * //NaN
 * console.log(_.multiply(1,NaN))
 * 
 * @param a 
 * @param b 
 * @returns a*b
 * @since 2.3
 */
function multiply(a:number,b:number):number{
  a = isNil(a) ? 0 : a
  b = isNil(b) ? 0 : b
  return a * b
}

/**
 * 对多个数字或数字列表计算平均值并返回结果
 * @example
 * //2.5
 * console.log(_.mean([1,2,'3',4]))
 * //NaN
 * console.log(_.mean([1,'2',3,'a',4]))
 * //2
 * console.log(_.mean([1,'2',3,null,4]))
 *
 * @param values 数字/字符数组/Set
 * @returns mean value
 * @since 2.3
 */
function mean(values: Set<string | number> | Array<string | number> ):number{
  const vals = map<any>(values, v => isNil(v) ? 0 : v)
  let f64a = new Float64Array(vals)
  let rs = 0
  f64a.forEach(v=>{
    rs += v
  })

  return rs / f64a.length
}

export { 
  randi, randf, sum, max, min ,
  add,divide,mean,multiply,subtract
}
