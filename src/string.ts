/* eslint-disable max-len */
/**
 * 字符相关函数
 *
 * @packageDocumentation
 */
/**
 * 
 * @author holyhigh
 */
import { isUndefined, isNull, isRegExp, isObject, isString } from './is'

/**
 * 转换任何对象为字符串。如果对象本身为string类型的值/对象，则返回该对象的字符串形式。否则返回对象的toString()方法的返回值
 *
 * @example
 * //''
 * console.log(_.toString(null))
 * //1
 * console.log(_.toString(1))
 * //3,6,9
 * console.log(_.toString([3,6,9]))
 * //-0
 * console.log(_.toString(-0))
 * //[object Set]
 * console.log(_.toString(new Set([3,6,9])))
 * //{a:1}
 * console.log(_.toString({a:1,toString:()=>'{a:1}'}))
 *
 * @param v 任何值
 * @returns 对于null/undefined会返回空字符串
 */
function toString(v: any): string {
  if (isUndefined(v) || isNull(v)) return ''
  if (v === 0 && 1 / v < 0) return '-0'
  return v.toString()
}

/**
 * 把字符串的首字母大写，如果首字母不是ascii中的a-z则返回原值
 *
 * @example
 * //Abc
 * console.log(_.capitalize('abc'))
 * //''
 * console.log(_.capitalize(null))
 * //1
 * console.log(_.capitalize(1))
 *
 *
 * @param str 字符串
 * @returns 对于null/undefined会返回空字符串
 */
function capitalize(str: string): string {
  str = toString(str)
  if (str.length < 1) return str
  return str[0].toUpperCase() + toString(str.substring(1)).toLowerCase()
}

/**
 * 从字符串的两端删除空白字符。
 *
 * @example
 * //holyhigh
 * console.log(_.trim('  holyhigh '))
 *
 * @param str
 * @returns 对于null/undefined会返回空字符串
 */
function trim(str: string): string {
  str = toString(str)
  return str.trim()
}

/**
 * 从字符串起始位置删除空白字符。
 *
 * @example
 * //'holyhigh '
 * console.log(_.trimStart('  holyhigh '))
 *
 * @param str
 * @returns 对于null/undefined会返回空字符串
 */
function trimStart(str: string): string {
  str = toString(str)
  if (str.trimStart) return str.trimStart()
  return str.replace(/^\s*/, '')
}

/**
 * 从字符串末尾删除空白字符。
 *
 * @example
 * //'  holyhigh'
 * console.log(_.trimEnd('  holyhigh '))
 *
 * @param str
 * @returns 对于null/undefined会返回空字符串
 */
function trimEnd(str: string): string {
  str = toString(str)
  if (str.trimEnd) return str.trimEnd()
  return str.replace(/\s*$/, '')
}

/**
 * 使用字符0填充原字符串达到指定长度。从原字符串起始位置开始填充。
 *
 * @example
 * //001
 * console.log(_.padZ('1',3))
 *
 * @param str 原字符串
 * @param len 填充后的字符串长度
 * @returns 填充后的字符串
 */
function padZ(str: string, len: number): string {
  return padStart(str, len, '0')
}
/**
 * 使用填充字符串填充原字符串达到指定长度。从原字符串起始开始填充。
 *
 * @example
 * //001
 * console.log(_.padStart('1',3,'0'))
 *
 * @param str 原字符串。如果非字符串则会自动转换成字符串
 * @param len 填充后的字符串长度，如果长度小于原字符串长度，返回原字符串
 * @param [padString=' '] 填充字符串，如果填充后超出指定长度，会自动截取并保留右侧字符串
 * @returns 在原字符串起始填充至指定长度后的字符串
 */
function padStart(str: string, len: number, padString?: string): string {
  str = toString(str)
  if (str.padStart) return str.padStart(len, padString)

  padString = padString || ' '
  const diff = len - str.length
  if (diff < 1) return str
  let fill = ''
  let i = Math.ceil(diff / padString.length)
  while (i--) {
    fill += padString
  }
  return fill.substring(fill.length - diff, fill.length) + str
}
/**
 * 使用填充字符串填充原字符串达到指定长度。从原字符串末尾开始填充。
 *
 * @example
 * //100
 * console.log(_.padEnd('1',3,'0'))
 * //1-0-0-
 * console.log(_.padEnd('1',6,'-0'))
 * //1
 * console.log(_.padEnd('1',0,'-0'))
 *
 * @param str 原字符串
 * @param len 填充后的字符串长度，如果长度小于原字符串长度，返回原字符串
 * @param [padString=' '] 填充字符串，如果填充后超出指定长度，会自动截取并保留左侧字符串
 * @returns 在原字符串末尾填充至指定长度后的字符串
 */
function padEnd(str: string, len: number, padString?: string): string {
  str = toString(str)
  if (str.padEnd) return str.padEnd(len, padString)

  padString = padString || ' '
  const diff = len - str.length
  if (diff < 1) return str
  let fill = ''
  let i = Math.ceil(diff / padString.length)
  while (i--) {
    fill += padString
  }
  return str + fill.substring(0, diff)
}
/**
 * 截取数字小数位。用来修复原生toFixed函数的bug
 *
 * @example
 * //14.05
 * console.log(_.toFixed(14.049,2))
 * //-15
 * console.log(_.toFixed(-14.6))
 * //14.0001
 * console.log(_.toFixed(14.00005,4))
 * //0.101
 * console.log(_.toFixed(0.1009,3))
 * //2.47
 * console.log(_.toFixed(2.465,2))
 * //2.46 原生
 * console.log((2.465).toFixed(2))
 *
 * @param v 数字或数字字符串
 * @param [scale=0] 小数位长度
 * @returns 填充后的字符串
 */
function toFixed(v: string | number, scale?: number): string {
  scale = scale || 0
  const num = parseFloat(v + '')
  if (isNaN(num)) return v as string
  const isNeg = num < 0 ? -1 : 1
  const tmp = (num + '').split('.')
  const frac = tmp[1] || ''
  const diff = scale - frac.length
  let rs = ''
  if (diff > 0) {
    let z = padEnd(frac, scale, '0')
    z = z ? '.' + z : z
    rs = tmp[0] + z
  } else if (diff === 0) {
    rs = num + ''
  } else {
    let integ = parseInt(tmp[0])
    const i = frac.length + diff
    const round = frac.substring(i)
    let keep = frac.substring(0, i)
    let startZ = false
    if (keep[0] === '0' && keep.length > 1) {
      keep = 1 + keep.substring(1)
      startZ = true
    }
    let n: any = Math.round(parseFloat(keep + '.' + round))
    const strN = n + ''
    if (n > 0 && strN.length > keep.length) {
      integ += 1 * isNeg
      n = strN.substring(1)
    }
    if (startZ) {
      n = parseInt(strN[0]) - 1 + strN.substring(1)
    }
    n = n !== '' && keep.length > 0 ? '.' + n : n
    rs = integ + n + ''
    if (isNeg < 0 && rs[0] !== '-') rs = '-' + rs
  }
  return rs
}

/**
 * 创建一个以原字符串为模板，重复指定次数的新字符串
 *
 * @example
 * //funcfuncfunc
 * console.log(_.repeat('func',3))
 *
 * @param str 原字符串
 * @param count 重复次数
 * @returns 对于null/undefined会返回空字符串
 */
function repeat(str: string, count: number): string {
  str = toString(str)
  count = Number.isFinite(count) ? count : 0
  if (count < 1) return ''
  let i = count
  let rs = ''
  while (i--) {
    rs += str
  }

  return rs
}

/**
 * 对字符串进行截取，返回从起始索引到结束索引间的新字符串。
 *
 * @example
 * //"34567"
 * console.log(_.substring('12345678',2,7))
 * //"345678"
 * console.log(_.substring('12345678',2))
 * //""
 * console.log(_.substring())
 *
 * @param str 需要截取的字符串，如果非字符串对象会进行字符化处理。基本类型会直接转为字符值，对象类型会调用toString()方法
 * @param [indexStart=0] 起始索引，包含
 * @param [indexEnd=str.length] 结束索引，不包含
 * @returns
 */
function substring(
  str: string,
  indexStart?: number,
  indexEnd?: number
): string {
  str = toString(str)
  indexStart = indexStart || 0

  return str.substring(indexStart, indexEnd)
}

/**
 * 验证字符串是否以查询子字符串开头
 *
 * @example
 * //true
 * console.log(_.startsWith('func.js','func'))
 * //false
 * console.log(_.startsWith('func.js','func',3))
 * //true
 * console.log(_.startsWith('func.js','c',3))
 *
 * @param str
 * @param searchStr 查询字符串
 * @param [position=0] 索引
 * @returns 如果以查询子字符串开头返回true，否则返回false
 */
function startsWith(
  str: string,
  searchStr: string,
  position?: number
): boolean {
  return toString(str).startsWith(searchStr, position)
}

/**
 * 验证字符串是否以查询子字符串结尾
 *
 * @example
 * //true
 * console.log(_.endsWith('func.js','js'))
 * //true
 * console.log(_.endsWith('func.js','c',4))
 *
 * @param str
 * @param searchStr 查询字符串
 * @param position 索引
 * @returns 如果以查询子字符串开头返回true，否则返回false
 */
function endsWith(str: string, searchStr: string, position?: number): boolean {
  return toString(str).endsWith(searchStr, position)
}

/**
 * 返回所有字母是大写格式的字符串
 *
 * @example
 * //''
 * console.log(_.upperCase())
 * //'FUNC.JS'
 * console.log(_.upperCase('func.js'))
 *
 * @param str
 * @returns 返回新字符串
 */
function upperCase(str: string): string {
  return toString(str).toUpperCase()
}

/**
 * 返回所有字母是小写格式的字符串
 *
 * @example
 * //''
 * console.log(_.lowerCase())
 * //'func.js'
 * console.log(_.lowerCase('FUNC.JS'))
 *
 * @param str
 * @returns 返回新字符串
 */
function lowerCase(str: string): string {
  return toString(str).toLowerCase()
}

/**
 * 使用<code>replaceValue</code>替换<code>str</code>中的首个<code>searchValue</code>部分
 *
 * @example
 * //'func-js'
 * console.log(_.replace('func.js','.','-'))
 * //''
 * console.log(_.replace(null,'.','-'))
 * //'kelikeli'
 * console.log(_.replace('geligeli',/ge/g,'ke'))
 * //'geligeli'
 * console.log(_.replace('kelikeli',/ke/g,()=>'ge'))
 *
 * @param str 字符串。非字符串值会自动转换成字符串
 * @param searchValue 查找内容，正则或者字符串
 * @param replaceValue 替换内容，字符串或处理函数。函数的返回值将用于替换
 * @returns 替换后的新字符串
 */
function replace(
  str: string,
  searchValue: RegExp | string,
  replaceValue: string | ((substring: string, ...args: any[]) => string)
): string {
  return toString(str).replace(searchValue, replaceValue as any)
}

/**
 * 使用<code>replaceValue</code>替换<code>str</code>中的所有<code>searchValue</code>部分
 *
 * @example
 * //'a-b-c'
 * console.log(_.replaceAll('a.b.c','.','-'))
 * //''
 * console.log(_.replaceAll(null,'.','-'))
 * //'kelikeli'
 * console.log(_.replaceAll('geligeli',/ge/,'ke'))
 * //'geligeli'
 * console.log(_.replaceAll('kelikeli',/ke/g,()=>'ge'))
 *
 * @param str 字符串。非字符串值会自动转换成字符串
 * @param searchValue 查找内容，正则或者字符串。非global模式的正则对象会自动转为global模式
 * @param replaceValue 替换内容，字符串或处理函数。函数的返回值将用于替换
 * @returns 替换后的新字符串
 * @since 1.3.0
 */
function replaceAll(
  str: string,
  searchValue: RegExp | string,
  replaceValue: string | ((substring: string, ...args: any[]) => string)
): string
function replaceAll(str: string, replacement: Record<string, any>): string

function replaceAll(
  str: string,
  searchValue: RegExp | string | Record<string, any>,
  replaceValue?: string | ((substring: string, ...args: any[]) => string)
): string {
  let searchExp: RegExp
  let strRs = toString(str)
  if (isRegExp(searchValue)) {
    searchExp = searchValue
    if (!searchValue.global) {
      searchExp = new RegExp(searchValue, searchValue.flags + 'g')
    }
    return strRs.replace(searchExp, replaceValue as any)
  } else if (isString(searchValue)) {
    searchExp = new RegExp(escapeRegExp(searchValue), 'g')
    return strRs.replace(searchExp, replaceValue as any)
  } else if (isObject(searchValue)) {
    const ks = Object.keys(searchValue)
    for (let i = ks.length; i--; ) {
      const k = ks[i]
      const v = searchValue[k]
      searchExp = new RegExp(escapeRegExp(k), 'g')
      strRs = strRs.replace(searchExp, v)
    }
    return strRs
  }
  return str
}

const REG_EXP_KEYWORDS: string[] = [
  '\\',
  '$',
  '(',
  ')',
  '*',
  '+',
  '.',
  '[',
  ']',
  '?',
  '^',
  '{',
  '}',
  '|',
]

/**
 * 转义正则字符串中的特殊字符，包括 '\', '$', '(', ')', '*', '+', '.', '[', ']', '?', '^', '\{', '\}', '|'
 *
 * @example
 * //\^\[func\.js\] \+ \{crud-vue\} = \.\*\?\$
 * console.log(_.escapeRegExp('^[func.js] + {crud-vue} = .*?$'))
 *
 * @param str 需要转义的字符串
 * @returns 转义后的新字符串
 * @since 1.3.0
 */
function escapeRegExp(str: string): string {
  return toString(str)
    .split('')
    .reduce((a, b) => a + (REG_EXP_KEYWORDS.includes(b) ? '\\' + b : b), '')
}

/**
 * 使用分隔符将字符串分割为多段数组
 *
 * @example
 * //["func", "js"]
 * console.log(_.split('func.js','.'))
 * //["func"]
 * console.log(_.split('func.js','.',1))
 *
 * @param str 原字符串。如果非字符串则会自动转换成字符串
 * @param separator 分隔符
 * @param [limit] 限制返回的结果数量，为空返回所有结果
 * @returns 分割后的数组
 */
function split(
  str: string,
  separator: RegExp | string,
  limit?: number
): string[] {
  return toString(str).split(separator, limit)
}

/**
 * 返回短横线风格的字符串
 *
 * @example
 * //'a-b-c'
 * console.log(_.kebabCase('a_b_c'))//snakeCase
 * //'webkit-perspective-origin-x'
 * console.log(_.kebabCase('webkitPerspectiveOriginX'))//camelCase
 * //'a-b-c'
 * console.log(_.kebabCase('a B-c'))//mixCase
 * //'get-my-url'
 * console.log(_.kebabCase('getMyURL'))//camelCase
 *
 * @param str
 * @returns 返回新字符串
 */
function kebabCase(str: string): string {
  return lowerCase(_getGrouped(str).join('-'))
}

/**
 * 返回下划线风格的字符串
 *
 * @example
 * //'a_b_c'
 * console.log(_.snakeCase('a-b c'))//mixCase
 * //'love_loves_to_love_love'
 * console.log(_.snakeCase('Love loves to love Love'))//spaces
 * //'a_b_c'
 * console.log(_.snakeCase('a B-c'))//camelCase
 * //'get_my_url'
 * console.log(_.snakeCase('getMyURL'))//camelCase
 *
 * @param str
 * @returns 返回新字符串
 */
function snakeCase(str: string): string {
  return lowerCase(_getGrouped(str).join('_'))
}

/**
 * 返回驼峰风格的字符串
 *
 * @example
 * //'aBC'
 * console.log(_.camelCase('a-b c'))//mixCase
 * //'loveLovesToLoveLove'
 * console.log(_.camelCase('Love loves to love Love'))//spaces
 * //'aBC'
 * console.log(_.camelCase('a B-c'))//camelCase
 * //'getMyUrl'
 * console.log(_.camelCase('getMyURL'))//camelCase
 *
 * @param str
 * @returns 返回新字符串
 */
function camelCase(str: string): string {
  return lowerFirst(pascalCase(str))
}

/**
 * 返回帕斯卡风格的字符串
 *
 * @example
 * //'LoveLovesToLoveLove'
 * console.log(_.pascalCase('Love loves to love Love'))//spaces
 * //'ABC'
 * console.log(_.pascalCase('a B-c'))//mixCase
 * //'GetMyUrl'
 * console.log(_.pascalCase('getMyURL'))//camelCase
 * //'AbCdEf'
 * console.log(_.pascalCase('AB_CD_EF'))//snakeCase
 * //'ABcDEfGhXy'
 * console.log(_.pascalCase('aBc   D__EF_GH----XY_'))//mixCase
 *
 * @param str
 * @returns 返回新字符串
 */
function pascalCase(str: string): string {
  return _getGrouped(str).reduce(
    (acc, v) => acc + upperFirst(v.toLowerCase()),
    ''
  )
}

// eslint-disable-next-line require-jsdoc
function _getGrouped(str: string): string[] {
  return (
    toString(str).match(
      /[A-Z]{2,}|([^\s-_]([^\s-_A-Z]+)?(?=[\s-_A-Z]))|([^\s-_]+(?=$))/g
    ) || []
  )
}

/**
 * 转换字符串第一个字符为小写并返回
 *
 * @example
 * //'fIRST'
 * console.log(_.lowerFirst('FIRST'))//mixCase
 * //'love loves to love Love'
 * console.log(_.lowerFirst('Love loves to love Love'))//spaces
 *
 * @param str
 * @returns 返回新字符串
 */
function lowerFirst(str: string): string {
  str = toString(str)
  if (str.length < 1) return str
  return str[0].toLowerCase() + str.substring(1)
}

/**
 * 转换字符串第一个字符为大写并返回
 *
 * @example
 * //'First'
 * console.log(_.upperFirst('first'))//mixCase
 * //'GetMyURL'
 * console.log(_.upperFirst('getMyURL'))//camelCase
 *
 * @param str
 * @returns 返回新字符串
 */
function upperFirst(str: string): string {
  str = toString(str)
  if (str.length < 1) return str
  return str[0].toUpperCase() + str.substring(1)
}

/**
 * 查找指定值在字符串中首次出现的位置索引
 *
 * @example
 * //10
 * console.log(_.indexOf('cyberfunc.js','js'))
 * //10
 * console.log(_.indexOf('cyberfunc.js','js',5))
 *
 * @param str
 * @param search 指定字符串
 * @param [fromIndex=0] 起始索引
 * @returns 第一个匹配搜索字符串的位置索引或-1
 */
function indexOf(str: string, search: string, fromIndex?: number): number {
  str = toString(str)
  return str.indexOf(search, fromIndex || 0)
}

/**
 * 查找指定值在字符串中最后出现的位置索引
 *
 * @example
 * //10
 * console.log(_.lastIndexOf('cyberfunc.js','js'))
 * //-1
 * console.log(_.lastIndexOf('cyberfunc.js','js',5))
 *
 * @param str
 * @param search 指定字符串
 * @param [fromIndex=Infinity] 起始索引，从起始索引位置向左查找指定字符串
 * @returns 最后一个匹配搜索字符串的位置索引或-1
 */
function lastIndexOf(str: string, search: string, fromIndex?: number): number {
  str = toString(str)
  return str.lastIndexOf(search, fromIndex || Infinity)
}

/**
 * 检测字符串是否与指定的正则匹配
 *
 * @example
 * //true 忽略大小写包含判断
 * console.log(_.test('func.js','Func','i'))
 * //true 忽略大小写相等判断
 * console.log(_.test('func.js',/^FUNC\.js$/i))
 * //false
 * console.log(_.test('func.js',/FUNC/))
 *
 * @param str
 * @param pattern 指定正则。如果非正则类型会自动转换为正则再进行匹配
 * @param [flags] 如果pattern参数不是正则类型，会使用该标记作为正则构造的第二个参数
 * @returns 匹配返回true
 * @since 0.19.0
 */
function test(str: string, pattern: RegExp | string, flags?: string): boolean {
  let regExp = pattern
  if (!isRegExp(regExp)) {
    regExp = new RegExp(pattern, flags)
  }
  return regExp.test(str)
}

/**
 * 对超过指定长度的字符串进行截取并在末尾追加代替字符
 *
 * @example
 * //func...
 * console.log(_.truncate('func.js',4))
 * //func...
 * console.log(_.truncate('func.js',6,{separator:/\.\w+/g}))
 * //func.js.com...
 * console.log(_.truncate('func.js.com.cn',13,{separator:'.'}))
 * //func.js
 * console.log(_.truncate('func.js',10))
 * //fun!!!
 * console.log(_.truncate('func.js',3,{omission:'!!!'}))
 *
 * @param str
 * @param len 最大长度。如果长度大于<code>str</code>长度，直接返回str
 * @param options 可选项
 * @param options.omission 替代字符，默认 '...'
 * @param options.separator 截断符。如果截取后的字符串中包含截断符，则最终只会返回截断符之前的内容
 * @returns 返回新字符串
 * @since 1.3.0
 */
function truncate(
  str: string,
  len: number,
  options?: { omission?: '...'; separator?: string | RegExp }
) {
  str = toString(str)
  if (str.length <= len) return str

  if (!isObject(options)) {
    options = { omission: '...' }
  }

  options.omission = options.omission || '...'

  str = str.substring(0, len)
  if (options.separator) {
    let separator = options.separator
    if (!isRegExp(separator)) {
      separator = new RegExp(escapeRegExp(separator), 'g')
    } else if (!separator.global) {
      separator = new RegExp(separator, separator.flags + 'g')
    }
    let rs
    let tmp
    while ((tmp = separator.exec(str)) !== null) {
      rs = tmp
    }
    if (rs) {
      str = str.substring(0, rs.index)
    }
  }

  return str + options.omission
}

export {
  toString,
  capitalize,
  trim,
  trimStart,
  trimEnd,
  padZ,
  padEnd,
  padStart,
  toFixed,
  repeat,
  replaceAll,
  substring,
  startsWith,
  endsWith,
  upperCase,
  lowerCase,
  replace,
  split,
  kebabCase,
  snakeCase,
  camelCase,
  pascalCase,
  lowerFirst,
  upperFirst,
  indexOf,
  lastIndexOf,
  test,
  escapeRegExp,
  truncate,
}
