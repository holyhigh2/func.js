/* eslint-disable max-len */
/**
 * 日期时间相关函数
 *
 * @packageDocumentation
 */

import { isArray, isInteger } from './is'
import { toNumber } from './number'
import { padEnd, padZ } from './string'

/**
 * 
 * @author holyhigh
 */
const TIME_MAP: Record<string, number> = {
  s: 1000,
  m: 1000 * 60,
  h: 1000 * 60 * 60,
  d: 1000 * 60 * 60 * 24,
}

/**
 * 比较两个日期是否为同一天
 * @example
 * //true
 * console.log(_.isSameDay(new Date('2020-05-01'),'2020/5/1'))
 * //false
 * console.log(_.isSameDay(new Date('2020-05-01 23:59:59.999'),'2020/5/2 0:0:0.000'))
 *
 * @param date1 日期对象或合法格式的日期时间字符串
 * @param date2 同date1
 * @returns
 */
function isSameDay(
  date1: Date | string | number,
  date2: Date | string | number
): boolean {
  return (
    new Date(date1).setHours(0, 0, 0, 0) ===
    new Date(date2).setHours(0, 0, 0, 0)
  )
}

// const DATE_CONVERT_EXP = /(\d+)-(\d+)-(\d+)/;
/**
 * 比较两个日期，并返回由比较时间单位确定的相差时间。
 * <p>
 * 使用truncated对比算法 —— 小于指定时间单位的值会被视为相同，
 * 比如对比月，则两个日期的 日/时/分/秒 会被认为相同，以此类推。
 * </p>
 * 相差时间为正数表示date1日期晚于(大于)date2，负数相反，0表示时间/日期相同。
 * <p>
 * 注意，如果对比单位是 h/m/s，务必要保持格式一致，比如
 * 
 * ```ts
 * //实际相差8小时
 * new Date('2020-01-01') 
 * //vs
 * new Date('2020/01/01')
 * ```
 *
 * @example
 * //0
 * console.log(_.compareDate(new Date('2020/05/01'),'2020/5/1'))
 * //格式不一致，相差8小时
 * console.log(_.compareDate(new Date('2020-05-01'),'2020/5/1','h'))
 * //-59
 * console.log(_.compareDate(new Date('2019/01/01'),'2019/3/1'))
 *
 * @param date1 日期对象、时间戳或合法格式的日期时间字符串。
 * 对于字符串格式，可以时<a href="https://www.iso.org/iso-8601-date-and-time-format.html">UTC格式</a>，或者
 * <a href="https://tools.ietf.org/html/rfc2822#section-3.3">RFC2822</a>格式
 * @param date2 同date1
 * @param [type='d'] 比较时间单位
 * <ul>
 * <li><code>y</code> 年</li>
 * <li><code>M</code> 月</li>
 * <li><code>d</code> 日</li>
 * <li><code>h</code> 时</li>
 * <li><code>m</code> 分</li>
 * <li><code>s</code> 秒</li>
 * </ul>
 * @returns 根据比较时间单位返回的比较值。正数为date1日期晚于(大于)date2，负数相反，0表示相同。
 */
function compareDate(
  date1: Date | string | number,
  date2: Date | string | number,
  type?: string
): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  type = type || 'd'

  if (type === 'y') {
    return d1.getFullYear() - d2.getFullYear()
  } else if (type === 'M') {
    return (
      (d1.getFullYear() - d2.getFullYear()) * 12 +
      (d1.getMonth() - d2.getMonth())
    )
  } else {
    switch (type) {
      case 'd':
        d1.setHours(0, 0, 0, 0)
        d2.setHours(0, 0, 0, 0)
        break
      case 'h':
        d1.setHours(d1.getHours(), 0, 0, 0)
        d2.setHours(d2.getHours(), 0, 0, 0)
        break
      case 'm':
        d1.setHours(d1.getHours(), d1.getMinutes(), 0, 0)
        d2.setHours(d2.getHours(), d2.getMinutes(), 0, 0)
        break
    }
    const diff = d1.getTime() - d2.getTime()
    return diff / TIME_MAP[type]
  }
}

/**
 * 对日期时间进行量变处理
 *
 * @example
 * //2020/5/1 08:00:20
 * console.log(_.formatDate(_.addTime(new Date('2020-05-01'),20),'yyyy/MM/dd hh:mm:ss'))
 * //2020-04-11 08:00
 * console.log(_.formatDate(_.addTime(new Date('2020-05-01'),-20,'d')))
 * //2022-01-01 00:00
 * console.log(_.formatDate(_.addTime(new Date('2020-05-01 0:0'),20,'M')))
 *
 * @param date 原日期时间
 * @param amount 变化量，可以为负数
 * @param [type='s'] 量变时间类型
 * <ul>
 * <li><code>y</code> 年</li>
 * <li><code>M</code> 月</li>
 * <li><code>d</code> 日</li>
 * <li><code>h</code> 时</li>
 * <li><code>m</code> 分</li>
 * <li><code>s</code> 秒</li>
 * </ul>
 * @returns 日期对象
 */
function addTime(
  date: Date | string | number,
  amount: number,
  type?: string
): Date {
  type = type || 's'
  const d = new Date(date)
  switch (type) {
    case 'y':
      d.setFullYear(d.getFullYear() + amount)
      break
    case 'M':
      d.setMonth(d.getMonth() + amount)
      break
    default:
      let times = 0
      times = amount * TIME_MAP[type]
      d.setTime(d.getTime() + times)
  }
  return d
}
const INVALID_DATE = ''
/**
 * 通过表达式格式化日期时间
 * 
 * ```
 * yyyy-MM-dd hh:mm:ss => 2020-12-11 10:09:08
 * ```
 * 
 * pattern解释：
 * 
 * - `yy` 2位年 - 22
 * - `yyyy` 4位年 - 2022
 * - `M` 1位月(1-12)
 * - `MM` 2位月(01-12)
 * - `MMM` 月描述(一月 - 十二月)
 * - `d` 1位日(1-30/31/29/28)
  - `dd` 2位日(01-30/31/29/28)
  - `ddd` 一年中的日(1-365)
  - `dddd` 一年中的日(001-365)
  - `h` 1位小时(0-23)
  - `hh` 2位小时(00-23)
  - `m` 1位分钟(0-59)
  - `mm` 2位分钟(00-59)
  - `s` 1位秒(0-59)
  - `ss` 2位秒(00-59)
  - `Q` 季度(1-4)
  - `QQ` 季度描述(春-冬)
  - `W` 一年中的周(1-53)
  - `WW` 一年中的周(01-53)
  - `w` 一月中的周(1-6)
  - `ww` 一月中的周描述(第一周 - 第六周)
  - `E` 星期(1-7)
  - `EE` 星期描述(星期一 - 星期日)
 *
 * @example
 * //now time
 * console.log(_.formatDate(_.now(),'yyyy-MM-dd hh:mm'))
 * //2/1/2021
 * console.log(_.formatDate('2021-2-1','M/d/yyyy'))
 * //2/1/21
 * console.log(_.formatDate('2021-2-1','M/d/yy'))
 * //02/01/21
 * console.log(_.formatDate('2021-2-1','MM/dd/yy'))
 * //02/01/2021
 * console.log(_.formatDate('2021-2-1','MM/dd/yyyy'))
 * //21/02/01
 * console.log(_.formatDate('2021-2-1','yy/MM/dd'))
 * //2021-02-01
 * console.log(_.formatDate('2021-2-1','yyyy-MM-dd'))
 * //21-12-11 10:09:08
 * console.log(_.formatDate('2021-12-11T10:09:08','yy-MM-dd hh:mm:ss'))
 * //12/11/2020 1009
 * console.log(_.formatDate('2020-12-11 10:09:08','MM/dd/yyyy hhmm'))
 * //2020-12-11 08:00
 * console.log(_.formatDate(1607644800000))
 * //''
 * console.log(_.formatDate('13:02'))
 * //''
 * console.log(_.formatDate(null))
 * //现在时间:(20-12-11 10:09:08)
 * console.log(_.formatDate('2020-12-11 10:09:08','现在时间:(yy-MM-dd hh:mm:ss)'))
 *
 * @param val 需要格式化的值，可以是日期对象或时间字符串或日期毫秒数
 * @param [pattern='yyyy-MM-dd hh:mm:ss'] 格式化模式
 * @returns 格式化后的日期字符串，无效日期返回空字符串
 */
function formatDate(val: string | Date | number, pattern?: string): string {
  pattern = pattern || 'yyyy-MM-dd hh:mm:ss'
  let formatter = cache[pattern]
  if (!formatter) {
    formatter = (date: string | Date | number) => {
      if (!date) return INVALID_DATE

      let ptn = pattern + ''
      if (typeof date === 'string' || typeof date === 'number') {
        date = toDate(date)
      }
      if (date.toString().indexOf('Invalid') > -1) return INVALID_DATE

      let valDate: Date = date

      return ptn.replace(SearchExp, (tag) => {
        const cap = tag[0]

        const month = valDate.getMonth()
        const locale = Locale[Lang]

        if (cap === 'y') {
          const year = valDate.getFullYear()
          return tag === 'yy' ? (year % 100) + '' : year + ''
        } else if (cap === 'M') {
          switch (tag) {
            case 'M':
              return month + 1 + ''
            case 'MM':
              return padZ(month + 1 + '', 2)
            case 'MMM':
              return locale?.months[month] || tag
          }
        } else if (cap == 'd') {
          let dayOfMonth = valDate.getDate()
          switch (tag) {
            case 'd':
              return dayOfMonth + ''
            case 'dd':
              return padZ(dayOfMonth + '', 2)
            case 'ddd':
              return getDayOfYear(valDate) + ''
            case 'dddd':
              return padZ(getDayOfYear(valDate) + '', 3)
          }
        } else if (cap == 'h') {
          const val = valDate.getHours() + ''
          return tag.length > 1 ? padZ(val, 2) : val
        } else if (cap == 'm') {
          const val = valDate.getMinutes() + ''
          return tag.length > 1 ? padZ(val, 2) : val
        } else if (cap == 's') {
          const val = valDate.getSeconds() + ''
          return tag.length > 1 ? padZ(val, 2) : val
        } else if (cap == 'Q') {
          const quarter = Math.ceil(month / 3)
          if (tag === 'Q') return quarter + ''
          return locale?.quarters[quarter - 1] || tag
        } else if (cap === 'W') {
          const val = getWeekOfYear(valDate) + ''
          return tag.length > 1 ? padZ(val, 2) : val
        } else if (cap === 'w') {
          const val = getWeekOfMonth(valDate)
          if (tag === 'w') return val + ''
          return locale?.weeks[val - 1] || tag
        } else if (cap === 'E') {
          let dayOfWeek = valDate.getDay()
          dayOfWeek = dayOfWeek < 1 ? 7 : dayOfWeek
          return tag === 'E'
            ? dayOfWeek + ''
            : locale?.days[dayOfWeek - 1] || tag
        }
        return tag
      })
    }
  }
  return formatter(val)
}
const cache: Record<string, Function> = {}

const Locale: Record<
  string,
  { quarters: string[]; months: string[]; weeks: string[]; days: string[] }
> = {
  'zh-CN': {
    quarters: ['一季度', '二季度', '三季度', '四季度'],
    months: [
      '一',
      '二',
      '三',
      '四',
      '五',
      '六',
      '七',
      '八',
      '九',
      '十',
      '十一',
      '十二',
    ].map((v) => v + '月'),
    weeks: ['一', '二', '三', '四', '五', '六'].map((v) => '第' + v + '周'),
    days: ['一', '二', '三', '四', '五', '六', '日'].map((v) => '星期' + v),
  },
}
let Lang = navigator.language
/**
 * 设置不同locale的配置
 * @param lang 语言标记，默认跟随系统
 * @param options 格式化选项
 * @param options.quarters 季度描述，默认"一 - 四季度"
 * @param options.months 月度描述，默认"一 - 十二月"
 * @param options.weeks 一月中的周描述，默认"第一 - 六周"
 * @param options.days 星期描述，默认"星期一 - 日"
 */
formatDate.locale = function (
  lang: string,
  options: {
    quarters: string[]
    months: string[]
    weeks: string[]
    days: string[]
  }
): void {
  let locale = Locale[lang]
  if (!locale) {
    locale = Locale[lang] = { quarters: [], months: [], weeks: [], days: [] }
  }

  if (options?.quarters) {
    locale.quarters = options?.quarters
  }
  if (options?.months) {
    locale.months = options?.months
  }
  if (options?.weeks) {
    locale.weeks = options?.weeks
  }
  if (options?.days) {
    locale.days = options?.days
  }
}
/**
 * 可以设置当前格式化使用的语言
 * @param lang 语言标记，默认跟随系统
 */
formatDate.lang = function (lang: string) {
  Lang = lang
}
const SearchExp =
  /y{2,4}|M{1,3}|d{1,4}|h{1,2}|m{1,2}|s{1,2}|Q{1,2}|E{1,2}|W{1,2}|w{1,2}/gm
const DaysOfMonth = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

/**
 * 返回13位日期毫秒数，表示从1970 年 1 月 1 日 00:00:00 (UTC)起到当前时间
 *
 * @example
 * //now time
 * console.log(_.now())
 *
 * @returns 带毫秒数的时间戳
 */
function now(): number {
  return Date.now()
}

/**
 * 通过指定参数得到日期对象。支持多种签名
 * 
 * ```js
 * _.toDate(1320940800); //timestamp unix style
 * _.toDate(1320940800123); //timestamp javascript style
 * _.toDate([year,month,day]); //注意，month的索引从1开始
 * _.toDate([year,month,day,hour,min,sec]); //注意，month的索引从1开始
 * _.toDate(datetimeStr);
 * ```
 *
 * @example
 * //'2011/11/11 00:00:00'
 * console.log(_.toDate(1320940800).toLocaleString())
 * //'2011/11/11 00:01:39'
 * console.log(_.toDate(1320940899999).toLocaleString())
 * //'2022/12/12 00:00:00'
 * console.log(_.toDate([2022,11,12]).toLocaleString())
 * //'2022/12/12 12:12:12'
 * console.log(_.toDate([2022,11,12,12,12,12]).toLocaleString())
 * //'2022/2/2 00:00:00'
 * console.log(_.toDate('2022/2/2').toLocaleString())
 * //'2022/2/2 08:00:00'
 * console.log(_.toDate('2022-02-02').toLocaleString())
 *
 * @param value 转换参数
 *
 * @returns 转换后的日期。无效日期统一返回1970/1/1
 */
function toDate(value: number | Array<number> | string | Date): Date {
  let rs
  if (isInteger(value)) {
    if (value < TIMESTAMP_MIN) {
      value = toNumber(padEnd(value + '', 13, '0'))
    } else if (value > TIMESTAMP_MAX) {
      value = 0
    }
    rs = new Date(value)
  } else if (isArray(value)) {
    rs = new Date(...(value as []))
  } else {
    rs = new Date(value)
  }

  if (rs.toDateString() === 'Invalid Date') {
    rs = new Date(0)
  }

  return rs
}
const TIMESTAMP_MIN = 1000000000000
const TIMESTAMP_MAX = 9999999999999

/**
 * 获取指定日期在当前年中的天数并返回
 * @param date 日期对象
 * @returns {number} 当前年中的第几天
 */
function getDayOfYear(date: Date): number {
  date = toDate(date)
  const leapYear = isLeapYear(date)
  const month = date.getMonth()

  let dates = date.getDate()
  for (let i = 0; i < month; i++) {
    const ds = DaysOfMonth[i] || (leapYear ? 29 : 28)
    dates += ds
  }
  return dates
}

/**
 * 获取指定日期在当前年中的周数并返回
 * @param date 日期对象
 * @returns {number} 当前年中的第几周
 */
function getWeekOfYear(date: Date): number {
  date = toDate(date)
  const year = date.getFullYear()
  let firstDayOfYear = new Date(year, 0, 1)
  let extraWeek = 0
  //超过周5多1周
  let d = firstDayOfYear.getDay()
  if (d === 0 || d > 5) {
    extraWeek = 1
  }

  return Math.ceil(getDayOfYear(date) / 7) + extraWeek
}

/**
 * 获取指定日期在当前月中的周数并返回
 * @param date 日期对象
 * @returns {number} 当前月中的第几周
 */
function getWeekOfMonth(date: Date): number {
  date = toDate(date)
  const year = date.getFullYear()
  let firstDayOfMonth = new Date(year, date.getMonth(), 1)
  let extraWeek = 0
  //超过周5多1周
  let d = firstDayOfMonth.getDay()
  if (d === 0 || d > 5) {
    extraWeek = 1
  }

  return Math.ceil(date.getDate() / 7) + extraWeek
}

/**
 * 指定日期是否是闰年
 * @param date 日期对象
 * @returns {number} 闰年返回true
 */
function isLeapYear(date: Date): boolean {
  date = toDate(date)
  const year = date.getFullYear()
  return year % 400 === 0 || year % 4 === 0
}

export {
  isSameDay,
  addTime,
  formatDate,
  compareDate,
  now,
  toDate,
  getDayOfYear,
  getWeekOfYear,
  getWeekOfMonth,
  isLeapYear,
}
