/**
 * 数字相关函数
 *
 * @packageDocumentation
 */
/**
 * 
 * @author holyhigh
 */

import { isNull, isUndefined } from './is'

/**
 * 通过表达式格式化数字
 * 
 * ``` 
 * #,##0.00 => 1,234.00
 * ```
 * 
 * pattern解释：
 * 
 * - `0` 如果对应位置上没有数字，则用零代替。用于整数位时在位数不足时补0，用于小数位时，如果超长会截取限位并四舍五入；如果位数不足则补0
 * - `#` 如果对应位置上没有数字，不显示。用于整数位时在位数不足时原样显示，用于小数位时，如果超长会截取限位并四舍五入；如果位数不足原样显示
 * - `.` 小数分隔符，只能出现一个
 * - `,` 分组符号，如果出现多个分组符号，以最右侧为准
 * - `%` 后缀符号，数字乘100，并追加%
 * - `\u2030` 后缀符号，数字乘1000，并追加‰
 * - `E` 后缀符号，转为科学计数法格式
 *
 * @example
 * //小数位截取时会自动四舍五入
 * console.log(_.formatNumber(123.678,'0.00'))
 * //在整数位中，0不能出现在#左侧；在小数位中，0不能出现在#右侧。
 * console.log(_.formatNumber(12.1,'0##.#0')) //格式错误，返回原值
 * //当有分组出现时，0只会影响短于表达式的数字
 * console.log(_.formatNumber(12.1,',000.00'))//012.10
 * console.log(_.formatNumber(1234.1,',000.00'))//1,234.10
 * //非表达式字符会原样保留
 * console.log(_.formatNumber(1234.1,'￥,000.00元'))//￥1,234.10元
 * //转为科学计数法
 * console.log(_.formatNumber(-0.01234,'##.0000E'))//-1.2340e-2
 * //#号在小数位中会限位，整数位中不会
 * console.log(_.formatNumber(123.456,'#.##'))//123.46
 *
 * @param v 需要格式化的值，可以是数字或字符串类型
 * @param [pattern='#,##0.00'] 格式化模式
 *
 * @returns 格式化后的字符串或原始值字符串(如果格式无效时)或特殊值(Infinity\u221E、NaN\uFFFD)
 */
function formatNumber(v: string | number, pattern = '#,##0.00'): string {
  if (v === Infinity) return '\u221E'
  if (v === -Infinity) return '-\u221E'
  if (Number.isNaN(v)) return '\uFFFD'
  if (isNaN(parseFloat(v + ''))) return v + ''

  let formatter: Function = cache[pattern]
  if (!formatter) {
    const match = pattern.match(
      /(?<integer>[0,#]+)(?:\.(?<fraction>[0#]+))?(?<suffix>[%\u2030E])?/
    )
    if (match == null) {
      return v + ''
    }
    let integerPtn = match.groups?.integer || ''
    const fractionPtn = match.groups?.fraction || ''
    let suffix = match.groups?.suffix || ''
    if (
      !integerPtn ||
      integerPtn.indexOf('0#') > -1 ||
      fractionPtn.indexOf('#0') > -1
    )
      return v + ''

    const ptnPart = match[0]
    const endsPart = pattern.split(ptnPart)

    const rnd = true // round
    const isPercentage = suffix === '%'
    const isPermillage = suffix === '\u2030'
    const isScientific = suffix === 'E'

    const groupMatch = integerPtn.match(/,[#0]+$/)
    let groupLen = -1
    if (groupMatch) {
      groupLen = groupMatch[0].substring(1).length
      integerPtn = integerPtn.replace(/^.*,(?=[^,])/, '')
    }

    let zeroizeLen = integerPtn.indexOf('0')
    if (zeroizeLen > -1) {
      zeroizeLen = integerPtn.length - zeroizeLen
    }
    let fixedLen = Math.max(
      fractionPtn.lastIndexOf('0'),
      fractionPtn.lastIndexOf('#')
    )
    if (fixedLen > -1) {
      fixedLen += 1
    }
    formatter = (val: string | number): string => {
      const num = parseFloat(val + '')

      let number = num
      let exponent = 0

      if (isPercentage) {
        number = number * 100
      } else if (isPermillage) {
        number = number * 1000
      } else if (isScientific) {
        const str = number + ''
        const pair = str.split('.')
        if (number >= 1) {
          exponent = pair[0].length - 1
        } else if (number < 1) {
          const fraStr = pair[1]
          exponent = fraStr.replace(/^0+/, '').length - fraStr.length - 1
        }
        number = number / 10 ** exponent
      }

      const numStr = number + ''
      let integer = parseInt(numStr)
      const pair = numStr.split('.')
      const fraction = pair[1] || ''

      // 处理小数
      let dStr = ''
      if (fractionPtn) {
        if (fraction.length >= fixedLen) {
          dStr = parseFloat('0.' + fraction).toFixed(fixedLen)
          dStr = dStr.substring(1)
        } else {
          dStr =
            '.' +
            fractionPtn.replace(/[0#]/g, (tag, i) => {
              const l = fraction[i]
              return l == undefined ? (tag === '0' ? '0' : '') : l
            })
        }
        if (dStr.length < 2) {
          dStr = ''
        }
      } else {
        let carry = 0
        if (fraction && rnd) {
          carry = Math.round(parseFloat('0.' + fraction))
        }

        integer += carry
      }
      // 处理整数
      let iStr = integer + ''
      let sym = num < 0 ? '-' : ''
      if (iStr[0] === '-' || iStr[0] === '+') {
        sym = iStr[0]
        iStr = iStr.substring(1)
      }
      if (groupLen > -1 && iStr.length > groupLen) {
        const reg = new RegExp('\\B(?=(\\d{' + groupLen + '})+$)', 'g')
        iStr = iStr.replace(reg, ',')
      } else if (iStr.length < integerPtn.length) {
        const integerPtnLen = integerPtn.length
        const iStrLen = iStr.length
        iStr = integerPtn.replace(/[0#]/g, (tag, i) => {
          if (integerPtnLen - i > iStrLen) return tag === '0' ? '0' : ''
          const l = iStr[iStrLen - (integerPtnLen - i)]
          return l == undefined ? (tag === '0' ? '0' : '') : l
        })
      }

      // 合并
      if (isScientific) {
        suffix = 'e' + exponent
      }
      let rs = sym + iStr + dStr + suffix
      return (endsPart[0] || '') + rs + (endsPart[1] || '')
    }
  }
  return formatter(v)
}
const cache: Record<string, Function> = {}

/**
 * 转换任何对象为数字类型
 *
 * @example
 * //NaN
 * console.log(_.toNumber(null))
 * //1
 * console.log(_.toNumber('1'))
 * //NaN
 * console.log(_.toNumber([3,6,9]))
 * //-0
 * console.log(_.toNumber(-0))
 * //NaN
 * console.log(_.toNumber(NaN))
 * //NaN
 * console.log(_.toNumber('123a'))
 *
 * @param v 任何值
 * @returns 对于null/undefined会返回NaN
 */
function toNumber(v: any): number {
  if (isUndefined(v) || isNull(v)) return NaN
  return Number(v)
}

/**
 * 判断a是否小于b
 *
 * @example
 * //true
 * console.log(_.lt(1,2))
 * //false
 * console.log(_.lt(5,'5'))
 *
 * @param a
 * @param b
 * @returns
 * @since 1.0.0
 */
function lt(a: any, b: any): boolean {
  return toNumber(a) < toNumber(b)
}

/**
 * 判断a是否小于等于b
 *
 * @example
 * //true
 * console.log(_.lte(1,2))
 * //true
 * console.log(_.lte(5,'5'))
 * //false
 * console.log(_.lte(5,'b'))
 *
 * @param a
 * @param b
 * @returns
 * @since 1.0.0
 */
function lte(a: any, b: any): boolean {
  return toNumber(a) <= toNumber(b)
}

/**
 * 判断a是否大于b
 *
 * @example
 * //true
 * console.log(_.gt(2,1))
 * //false
 * console.log(_.gt(5,'5'))
 *
 * @param a
 * @param b
 * @returns
 * @since 1.0.0
 */
function gt(a: any, b: any): boolean {
  return toNumber(a) > toNumber(b)
}

/**
 * 判断a是否大于等于b
 *
 * @example
 * //true
 * console.log(_.gte(2,1))
 * //true
 * console.log(_.gte(5,'5'))
 * //false
 * console.log(_.gte(5,'b'))
 *
 * @param a
 * @param b
 * @returns
 * @since 1.0.0
 */
function gte(a: any, b: any): boolean {
  return toNumber(a) >= toNumber(b)
}

/**
 * 转换整数。小数部分会直接丢弃
 *
 * @example
 * //9
 * console.log(_.toInteger(9.99))
 * //12
 * console.log(_.toInteger('12.34'))
 * //0
 * console.log(_.toInteger(null))
 * //0
 * console.log(_.toInteger(new Error))
 *
 * @param v
 * @returns
 * @since 1.0.0
 */
function toInteger(v: any): number {
  return v >> 0
}

/**
 * 验证数字v是否大于等于start并且小于end
 * 根据参数个数不同，分为两种签名
 * <pre><code class="language-javascript">
 * _.inRange(v,end);
 * _.inRange(v,start,end);
 * </code></pre>
 * 如果start大于end，则会交换位置
 *
 * @example
 * //true
 * console.log(_.inRange(1,1,2))
 * //true
 * console.log(_.inRange(2,3))
 * //false
 * console.log(_.inRange(2,0,2))
 * //true
 * console.log(_.inRange(-2,-2,0))
 * //true
 * console.log(_.inRange(-1,-2))
 *
 * @param v
 * @param [start=0] 最小值
 * @param end 最大值
 * @returns
 * @since 1.0.0
 */
function inRange(v: any, end: number): boolean
function inRange(v: any, start: number, end: number): boolean
function inRange(v: any, start?: number, end?: number): boolean {
  start = start || 0
  if (isUndefined(end)) {
    end = start
    start = 0
  }
  if (start > end) {
    const tmp = end
    end = start
    start = tmp
  }
  return gte(v, start) && lt(v, end)
}

export { formatNumber, toNumber, lt, lte, gt, gte, inRange, toInteger }
