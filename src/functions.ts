/* eslint-disable max-len */
/**
 * 扩展函数能力的函数
 *
 * @packageDocumentation
 */

/**
 * 
 * @author holyhigh
 */
import { flatDeep } from './array'
import { each } from './collection'
import { isFunction, isUndefined } from './is'
import { get, set } from './object'
import { UnknownMapKey } from './types'

/**
 * 类似eval，对表达式进行求值并返回结果。不同于eval，fval()执行在严格模式下
 * 
 * > 注意，如果页面设置了<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP">CSP</a>可能会导致该函数失效
 * 
 * @example
 * //5
 * console.log(_.fval('3+2'));
 * //{name:"func.js"}
 * console.log(_.fval("{name:'func.js'}"));
 *
 * @param expression 计算表达式
 * @returns 表达式计算结果
 */
function fval<T>(expression: string): T {
  return Function('"use strict";return ' + expression)()
}

const PLACEHOLDER = void 0

/**
 * 创建一个新的函数，该函数会调用fn，并传入指定的部分参数。
 * 
 * `partial()`常用来创建函数模板或扩展核心函数，比如
 * 
 * ```js
 * let delay2 = _.partial(setTimeout,undefined,2000);
 * delay2(()=>\{console.log('2秒后调用')\})
 * ```
 *
 * @example
 * //2748
 * let hax2num = _.partial(parseInt,undefined,16);
 * console.log(hax2num('abc'))
 * //9
 * let square = _.partial(Math.pow,undefined,2);
 * console.log(square(3))
 * //￥12,345.00元
 * let formatYuan = _.partial(_.formatNumber,undefined,'￥,000.00元');
 * console.log(formatYuan(12345))
 * //[func.js] hi...
 * let log = _.partial((...args)=>args.join(' '),'[func.js][',undefined,']',undefined);
 * console.log(log('info','hi...'))
 *
 * @param fn 需要调用的函数
 * @param args 参数可以使用undefined作为占位符，以此来确定不同的实参位置
 * @returns 部分应用后的新函数
 */
function partial(fn: any, ...args: any[]): Function {
  return function (...params: any[]) {
    let p = 0
    const applyArgs = args.map((v) => (v === PLACEHOLDER ? params[p++] : v))
    if (params.length > p) {
      for (let i = p; i < params.length; i++) {
        applyArgs.push(params[i])
      }
    }
    return fn(...applyArgs)
  }
}

/**
 * 创建一个新的函数，该函数的参数会传递给第一个<code>fns</code>函数来计算结果，而结果又是第二个fns函数的参数，以此类推，
 * 直到所有函数执行完成。常用于封装不同的可重用函数模块组成新的函数或实现惰性计算，比如
 *
 * <pre><code class="language-javascript">
 * let checkName = _.compose(_.trim,v=>v.length>6);
 * checkName(' holyhigh') //=> true
 * checkName(' ') //=> false
 * </code></pre>
 *
 * @example
 * // Holyhigh
 * let formatName = _.compose(_.lowerCase,_.capitalize);
 * console.log(formatName('HOLYHIGH'))
 *
 * @param  {...function} fns
 * @returns 组合后的入口函数
 */
function compose(...fns: Function[]): Function {
  return function (...args: any[]) {
    let rs = fns[0](...args)
    for (let i = 1; i < fns.length; i++) {
      if (isFunction(fns[i])) {
        rs = fns[i](rs)
      }
    }
    return rs
  }
}

/**
 * 传递v为参数执行interceptor1函数，如果该函数返回值未定义(undefined)则执行interceptor2函数，并返回函数返回值。
 * 用于函数链中的分支操作
 * @example
 * //false
 * console.log(_.alt(9,v=>false,v=>20))
 *
 * @param v
 * @param interceptor1 (v)
 * @param interceptor2 (v)
 * @returns 函数返回值
 */
function alt(v: unknown, interceptor1: Function, interceptor2: Function): any {
  let rs = interceptor1(v)
  if (isUndefined(rs)) {
    rs = interceptor2(v)
  }
  return rs
}

/**
 * 传递v为参数执行interceptor函数，然后返回v。常用于函数链的过程调试，比如在filter后执行日志操作
 * <p>
 * 注意，一旦函数链执行了shortcut fusion，tap函数的执行会延迟到一个数组推导完成后执行
 * </p>
 *
 * @example
 * //shortut fusion中的tap只保留最后一个
 * _([1,2,3,4])
 * .map(v=>v*3).tap(v=>console.log(v))//被覆盖
 * .filter(v=>v%2===0).tap(v=>console.log(v))//会延迟，并输出结果[6,12]
 * .join('-')
 * .value()
 *
 * @param v
 * @param interceptor (v);如果v是引用值，改变v将影响后续函数流
 * @returns v
 */
function tap<T>(v: T, interceptor: Function): T {
  interceptor(v)
  return v
}

/**
 * 创建一个包含指定函数逻辑的包装函数并返回。该函数仅执行一次
 *
 * @example
 * //2748, undefined
 * let parseInt2 = _.once(parseInt);
 * console.log(parseInt2('abc',16),parseInt2('abc',16))
 *
 * @param fn 需要调用的函数
 * @returns 包装后的函数
 */
function once(fn: any): Function {
  let proxy = fn
  return (...args: any[]) => {
    let rtn
    if (proxy) {
      rtn = proxy(...args)
    }
    ;(proxy as any) = null
    return rtn
  }
}

/**
 * 创建一个包含指定函数逻辑且内置计数的包装函数并返回。
 * 该函数每调用一次计数会减一，直到计数为0后生效。可用于异步结果汇总时只调用一次的场景
 *
 * @example
 * //undefined, undefined, 'data saved'
 * let saveTip = _.after(()=>'data saved',2);
 * console.log(saveTip(),saveTip(),saveTip())
 *
 * @param fn 需要调用的函数
 * @param [count=0] 计数
 * @returns 包装后的函数
 */
function after(fn: any, count?: number): Function {
  const proxy = fn
  let i = count || 0
  let rtn: any
  return (...args: any[]) => {
    if (i === 0) {
      rtn = proxy(...args)
    }
    if (i > 0) i--
    return rtn
  }
}

/**
 * 启动计时器，并在倒计时为0后调用函数。
 * 内部使用setTimeout进行倒计时，如需中断延迟可以使用clearTimeout函数
 * <div class="alert alert-secondary">
      注意，函数并不提供防抖逻辑。如果需要处理重复调用必须自己处理计时器id
    </div>
 *
 * @example
 * //1000ms 后显示some text !
 * _.delay(console.log,1000,'some text','!');
 *
 * @param fn 需要调用的函数
 * @param [wait=0] 倒计时。单位ms
 * @param [args] 传入定时函数的参数
 * @returns 计时器id
 */
function delay(fn: any, wait?: number, ...args: any[]): NodeJS.Timeout {
  return setTimeout(() => {
    fn(...args)
  }, wait || 0)
}

/**
 * 创建一个新的函数，并且绑定函数的this上下文。默认参数部分同<code>partial()</code>
 *
 * @example
 * const obj = {
 *  text:'Func.js',
 *  click:function(a,b,c){console.log('welcome to '+this.text,a,b,c)},
 *  blur:function(){console.log('bye '+this.text)}
 * }
 * //自动填充参数
 * let click = _.bind(obj.click,obj,'a',undefined,'c');
 * click('hi')
 * //1秒后执行，无参数
 * setTimeout(click,1000)
 *
 * @param fn 需要调用的函数
 * @param thisArg fn函数内this所指向的值
 * @param args 参数可以使用undefined作为占位符，以此来确定不同的实参位置
 * @returns 绑定thisArg的新函数
 * @since 0.17.0
 */
function bind(fn: any, thisArg: any, ...args: any[]): Function {
  return partial(fn.bind(thisArg), ...args)
}

/**
 * 批量绑定对象内的函数属性，将这些函数的this上下文指向绑定对象。经常用于模型中的函数用于外部场景，比如setTimeout/事件绑定等
 *
 * @example
 * const obj = {
 *  text:'Func.js',
 *  click:function(a,b,c){console.log('welcome to '+this.text,a,b,c)},
 *  click2:function(){console.log('hi '+this.text)}
 * }
 * //自动填充参数
 * _.bindAll(obj,'click',['click2']);
 * //1秒后执行，无参数
 * setTimeout(obj.click,1000)
 * //事件
 * top.onclick = obj.click2
 *
 * @param object 绑定对象
 * @param  {...(string | Array<string>)} methodNames 属性名或path
 * @returns 绑定对象
 * @since 0.17.0
 */
function bindAll<T extends Record<UnknownMapKey, any>>(
  object: T,
  ...methodNames: (string | string[])[]
): T{
  const pathList = flatDeep<string>(methodNames)
  each<string>(pathList, (path) => {
    const fn = get<Function>(object, path)
    set(object, path, fn.bind(object))
  })

  return object
}

/**
 * 通过给定参数调用fn并返回执行结果
 *
 * @example
 * //自动填充参数
 * _.call(fn,1,2);
 * //事件
 * _.call(fn,1,2);
 *
 * @param fn 需要执行的函数
 * @param args 可变参数
 * @returns 执行结果。如果函数无效或无返回值返回undefined
 * @since 2.4.0
 */
function call(fn:any,...args:any): any{
  if(!isFunction(fn))return undefined
  return fn(...args)
}

export { fval, partial, compose, alt, tap, once, after, delay, bind, bindAll,call }
