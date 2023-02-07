import{_ as u,d as p}from"./Container.92acc38e.js";import{c as m,r as a,C as g,l as t,m as s,u as d,B as y}from"./runtime-core.esm-bundler.3287b943.js";/* empty css                             */import"./index.538b13da.js";const f=`/**
 * 内部类型
 * @author holyhigh
 */
interface IList {
    length: number;
    [Symbol.iterator]?: any;
    [index: number]: any;
}
/**
 * 未知类型的map key
 */
type UnknownMapKey = string | number | symbol;
/**
 * 类数组
 */
type ArrayLike<V = unknown> = Array<V> | string | NodeList | HTMLCollection | IList;
/**
 * 集合
 */
type Collection<V = unknown> = V[] | Record<UnknownMapKey, V> | Set<V> | Map<any, V> | ArrayLike<V> | string;
/**
 * 非函数迭代类型
 */
type NonFuncItee = string | Record<any, any> | Array<any>;
declare module '@holyhigh/func.js/collection' { 
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
export function size(collection: Collection): number;
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
export function each<V>(collection: Collection<V>, callback: (value: V, index: UnknownMapKey, collection: Collection<V>) => boolean | void): void;
export function each<V, K extends string | number | symbol>(collection: Collection<V>, callback: (value: V, index: K, collection: Collection<V>) => boolean | void): void;
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
export function eachRight<V>(collection: Collection<V>, callback: (value: V, index: UnknownMapKey, collection: Collection<V>) => boolean | void): void;
export function eachRight<V, K extends string | number | symbol>(collection: Collection<V>, callback: (value: V, index: K, collection: Collection<V>) => boolean | void): void;
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
 * <br>其他类型请参考<code>iteratee</code>
 * @returns 全部通过返回true，否则false。对于一个空集合，会返回true
 */
export function every<V>(collection: Collection<V>, predicate: ((value: V, index: UnknownMapKey, collection: Collection<V>) => boolean) | NonFuncItee): boolean;
export function every<V, K extends string | number | symbol>(collection: Collection<V>, predicate: ((value: V, index: K, collection: Collection<V>) => boolean) | NonFuncItee): boolean;
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
 * <br>其他类型请参考<code>iteratee</code>
 * @returns 只要有任意元素断言为真返回true，否则false。对于一个空集合，会返回false
 */
export function some<V>(collection: Collection<V>, predicate: ((value: V, index: UnknownMapKey, collection: Collection<V>) => boolean) | NonFuncItee): boolean;
export function some<V, K extends string | number | symbol>(collection: Collection<V>, predicate: ((value: V, index: K, collection: Collection<V>) => boolean) | NonFuncItee): boolean;
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
 * <br>其他类型请参考<code>iteratee</code>
 * @returns 由通过断言的元素组成的新数组
 */
export function filter<V>(collection: Collection<V>, predicate: ((value: V, index: UnknownMapKey, collection: Collection<V>) => boolean) | NonFuncItee): V[];
export function filter<V, K extends string | number | symbol>(collection: Collection<V>, predicate: ((value: V, index: K, collection: Collection<V>) => boolean) | NonFuncItee): V[];
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
 * <br>其他类型请参考<code>iteratee</code>
 * @returns 由通过断言的元素组成的新数组
 * @since 1.0.0
 */
export function reject<V>(collection: Collection<V>, predicate: ((value: V, index: UnknownMapKey, collection: Collection<V>) => boolean) | NonFuncItee): V[];
export function reject<V, K extends string | number | symbol>(collection: Collection<V>, predicate: ((value: V, index: K, collection: Collection<V>) => boolean) | NonFuncItee): V[];
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
 * <br>其他类型请参考<code>iteratee</code>
 * @returns 由匹配列表，非匹配列表构成的二维数组
 * @since 0.17.0
 */
export function partition<V>(collection: Collection<V>, predicate: ((value: V, index: string | number | symbol, collection: Collection<V>) => boolean) | NonFuncItee): V[][];
export function partition<V, K extends string | number | symbol>(collection: Collection<V>, predicate: ((value: V, index: K, collection: Collection<V>) => boolean) | NonFuncItee): V[][];
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
 * <br>其他类型请参考<code>iteratee</code>
 * @returns 第一个匹配断言的元素或undefined
 */
export function find<V>(collection: Collection<V>, predicate: ((value: V, index: string | number | symbol, collection: Collection<V>) => boolean) | NonFuncItee): V | undefined;
export function find<V, K extends string | number | symbol>(collection: Collection<V>, predicate: ((value: V, index: K, collection: Collection<V>) => boolean) | NonFuncItee): V | undefined;
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
 * <br>其他类型请参考<code>iteratee</code>
 * @returns 第一个匹配断言的元素或undefined
 */
export function findLast<V>(collection: Collection<V>, predicate: ((value: V, index: string | number | symbol, collection: Collection<V>) => boolean) | NonFuncItee): V | undefined;
export function findLast<V, K extends string | number | symbol>(collection: Collection<V>, predicate: ((value: V, index: K, collection: Collection<V>) => boolean) | NonFuncItee): V | undefined;
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
export function map<V>(collection: Collection<V>, itee: ((value: V, index: UnknownMapKey, collection: Collection<V>) => V) | NonFuncItee): V[];
export function map<V, K extends string | number | symbol>(collection: Collection<V>, itee: ((value: V, index: K, collection: Collection<V>) => V) | NonFuncItee): V[];
export function map<V, K extends string | number | symbol, U>(collection: Collection<V>, itee: ((value: V, index: K, collection: Collection<V>) => U) | NonFuncItee): U[];
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
export function flatMap<V>(collection: Collection<V>, itee: ((value: V, index: string | number | symbol, collection: Collection<V>) => V) | NonFuncItee, depth?: number): V[];
export function flatMap<V, K extends string | number | symbol>(collection: Collection<V>, itee: ((value: V, index: K, collection: Collection<V>) => V) | NonFuncItee, depth?: number): V[];
export function flatMap<V, K extends string | number | symbol, U>(collection: Collection<V>, itee: ((value: V, index: K, collection: Collection<V>) => U) | NonFuncItee, depth?: number): U[];
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
export function flatMapDeep<V>(collection: Collection<V>, itee: ((value: V, index: string | number | symbol, collection: Collection<V>) => V) | NonFuncItee): V[];
export function flatMapDeep<V, K extends string | number | symbol>(collection: Collection<V>, itee: ((value: V, index: K, collection: Collection<V>) => V) | NonFuncItee): V[];
export function flatMapDeep<V, K extends string | number | symbol, U>(collection: Collection<V>, itee: ((value: V, index: K, collection: Collection<V>) => U) | NonFuncItee): U[];
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
export function includes(collection: Collection, value: any, fromIndex?: number): boolean;
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
export function reduce<T>(collection: Collection<T>, callback: (accumulator: T, value: T, key: UnknownMapKey, collection: Collection<T>) => T, initialValue: T): T;
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
export function toArray<T>(collection: Collection<T>): T[];
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
export function sort<T>(collection: Collection<T>, comparator?: (a: T, b: T) => number): T[];
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
 * <br>其他类型请参考<code>iteratee</code>
 * @returns 排序后的数组
 * @since 1.0.0
 */
export function sortBy<V>(collection: Collection<V>, itee?: ((value: V, index: string | number | symbol) => any) | NonFuncItee): V[];
export function sortBy<V, K extends string | number | symbol>(collection: Collection<V>, itee?: ((value: V, index: K) => any) | NonFuncItee): V[];
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
export function shuffle<T>(collection: Collection<T>): T[];
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
export function sample<T>(collection: Collection<T>): T;
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
export function sampleSize<T>(collection: Collection<T>, count?: number): T[];
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
export function countBy(collection: Collection, itee?: ((value: unknown) => string) | NonFuncItee): Record<string, number>;
export function countBy<K extends string | number | symbol>(collection: Collection, itee?: ((value: unknown) => K) | NonFuncItee): Record<K, number>;
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
export function groupBy(collection: Collection, itee?: ((value: unknown) => UnknownMapKey) | NonFuncItee): Record<UnknownMapKey, unknown[]>;
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
export function keyBy<K extends string | number | symbol>(collection: Collection, itee?: ((value: unknown) => K) | NonFuncItee): Record<K, unknown>;
export function keyBy<K extends string | number | symbol, V>(collection: Collection, itee?: ((value: V) => K) | NonFuncItee): Record<K, V>;
 }
`,b=`/**
 * 内部类型
 * @author holyhigh
 */
interface IList {
    length: number;
    [Symbol.iterator]?: any;
    [index: number]: any;
}
/**
 * 未知类型的map key
 */
type UnknownMapKey = string | number | symbol;
/**
 * 类数组
 */
type ArrayLike<V = unknown> = Array<V> | string | NodeList | HTMLCollection | IList;
/**
 * 非函数迭代类型
 */
type NonFuncItee = string | Record<any, any> | Array<any>;

declare module '@holyhigh/func.js/array' { 
/**
 * 对数组内的值进行去重
 * @example
 * // [1,2,4,"a","1",null]
 * console.log(_.unique([1,2,2,4,4,'a','1','a',null,null]))
 *
 * @param array 数组
 * @returns 转换后的新数组对象
 */
export function uniq<T>(array: T[]): T[];
/**
 * 同<code>uniq</code>，但支持自定义筛选函数
 * @example
 * // [{"a":1},{"a":"1"},{"a":2},{"a":"2"}]
 * console.log(_.uniqBy([{a:1},{a:1},{a:'1'},{a:2},{a:'2'},{a:2}],'a'))
 * // [{"a":1},{"a":2}]
 * console.log(_.uniqBy([{a:1},{a:1},{a:'1'},{a:2},{a:'2'},{a:2}],v=>v.a>>0))
 *
 * @param array 数组
 * @param [iteratee=identity] (value,index) 筛选函数，返回需要对比的值
 * <br>当iteratee是函数时回调参数见定义
 * <br>其他类型请参考<code>iteratee</code>
 * @returns 去重后的新数组对象
 * @since 1.1.0
 */
export function uniqBy<T>(array: T[], itee: ((value: T, index: UnknownMapKey) => boolean) | NonFuncItee): T[];
/**
 * 对集合内的假值进行剔除，并返回剔除后的新数组。假值包括 null/undefined/NaN/0/''/false
 * @example
 * //[1,2,4,'a','1']
 * console.log(_.compact([0,1,false,2,4,undefined,'a','1','',null]))
 *
 * @param array 数组
 * @returns 转换后的新数组对象
 */
export function compact<T>(array: T[]): T[];
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
export function first<T>(array: T[]): T;
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
export function last<T>(array: T[]): T;
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
export function slice<T>(array: T[] | ArrayLike, begin?: number, end?: number): T[];
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
export function flat<T>(array: any[], depth?: number): T[];
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
export function flatDeep<T>(array: any[]): T[];
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
export function fill<T>(array: T[], value: any, start?: number, end?: number): T[];
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
export function join(array: any[], separator?: string): string;
/**
 * 合并数组或值并返回新数组，元素可以重复
 *
 * <p>
 * 基于<code>Array.prototype.concat</code>实现
 * </p>
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
export function concat(...arrays: any[]): any[];
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
export function except(...params: any): any[];
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
export function union(...params: any): any[];
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
export function intersect(...params: any): any;
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
export function reverse<T>(array: T[]): T[];
/**
 * first()的别名函数
 *
 * @function
 * @param array arrayLike对象及set对象
 * @returns 数组中第一个元素
 */
declare const head: typeof first;
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
export function tail<T>(array: T[]): T[];
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
export function initial<T>(array: T[]): T[];
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
export function take<T>(array: T[], length?: number): T[];
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
export function takeRight<T>(array: T[], length?: number): T[];
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
export function range(end: number): number[];
export function range(start: number, end: number): number[];
export function range(start: number, end: number, step: number): number[];
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
 * <br>其他类型请参考<code>iteratee</code>
 * @param [fromIndex=0] 从0开始的起始索引。设置该参数可以减少实际遍历次数
 * @returns 第一个匹配断言的元素索引或-1
 */
export function findIndex<T>(array: T[], predicate: ((value: T, index: string | number, array: T[]) => boolean) | NonFuncItee, fromIndex?: number): number;
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
 * <br>其他类型请参考<code>iteratee</code>
 * @param [fromIndex=array.length - 1] 从集合长度-1开始的起始索引。设置该参数可以减少实际遍历次数
 * @returns 最后一个匹配断言的元素索引或-1
 * @since 0.19.0
 */
export function findLastIndex<T>(array: T[], predicate: ((value: T, index: string | number, array: T[]) => boolean) | NonFuncItee, fromIndex?: number): number;
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
export function insert<T>(array: T[], index: number, ...values: any[]): T[];
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
export function append<T>(array: T[], ...values: any[]): T[];
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
 * <br>其他类型请参考<code>iteratee</code>
 * @returns 被删除的元素数组或空数组
 * @since 0.19.0
 */
export function remove<T>(array: T[], predicate: ((value: T, index: string | number, array: T[]) => boolean) | NonFuncItee): T[];
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
export function without<T>(array: T[], ...values: T[]): T[];
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
export function pull<T>(array: T[], ...values: T[]): T[];
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
export function pop<T>(array: unknown[], index?: number): T | null;
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
export function chunk<T>(array: T[], size?: number): T[][];
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
export function zip(...arrays: any[][]): any[][];
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
export function zipWith(...params: any): any[][];
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
export function unzip(array: any[]): any[][];
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
export function zipObject(keys: Array<string | number | symbol>, values: any[]): Record<UnknownMapKey, any>;
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
export function sortedIndex<T>(array: T[], value: any): number;
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
export function sortedIndexBy<T>(array: T[], value: any, itee?: ((value: any) => any) | NonFuncItee): number;


}
`,x=`declare module '@holyhigh/func.js/string' { 
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
export function toString(v: any): string;
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
export function capitalize(str: string): string;
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
export function trim(str: string): string;
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
export function trimStart(str: string): string;
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
export function trimEnd(str: string): string;
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
export function padZ(str: string, len: number): string;
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
export function padStart(str: string, len: number, padString?: string): string;
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
export function padEnd(str: string, len: number, padString?: string): string;
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
export function toFixed(v: string | number, scale?: number): string;
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
export function repeat(str: string, count: number): string;
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
export function substring(str: string, indexStart?: number, indexEnd?: number): string;
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
export function startsWith(str: string, searchStr: string, position?: number): boolean;
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
export function endsWith(str: string, searchStr: string, position?: number): boolean;
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
export function upperCase(str: string): string;
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
export function lowerCase(str: string): string;
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
export function replace(str: string, searchValue: RegExp | string, replaceValue: string | ((substring: string, ...args: any[]) => string)): string;
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
export function replaceAll(str: string, searchValue: RegExp | string, replaceValue: string | ((substring: string, ...args: any[]) => string)): string;
export function replaceAll(str: string, replacement: Record<string, any>): string;
/**
 * 转义正则字符串中的特殊字符，包括 '', '$', '(', ')', '*', '+', '.', '[', ']', '?', '^', '{', '}', '|'
 *
 * @example
 * //^[func.js] + {crud-vue} = .*?$
 * console.log(_.escapeRegExp('^[func.js] + {crud-vue} = .*?$'))
 *
 * @param str 需要转义的字符串
 * @returns 转义后的新字符串
 * @since 1.3.0
 */
export function escapeRegExp(str: string): string;
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
export function split(str: string, separator: RegExp | string, limit?: number): string[];
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
export function kebabCase(str: string): string;
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
export function snakeCase(str: string): string;
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
export function camelCase(str: string): string;
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
export function pascalCase(str: string): string;
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
export function lowerFirst(str: string): string;
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
export function upperFirst(str: string): string;
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
export function indexOf(str: string, search: string, fromIndex?: number): number;
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
export function lastIndexOf(str: string, search: string, fromIndex?: number): number;
/**
 * 检测字符串是否与指定的正则匹配
 *
 * @example
 * //true 忽略大小写包含判断
 * console.log(_.test('func.js','Func','i'))
 * //true 忽略大小写相等判断
 * console.log(_.test('func.js',/^FUNC.js$/i))
 * //false
 * console.log(_.test('func.js',/FUNC/))
 *
 * @param str
 * @param pattern 指定正则。如果非正则类型会自动转换为正则再进行匹配
 * @param [flags] 如果pattern参数不是正则类型，会使用该标记作为正则构造的第二个参数
 * @returns 匹配返回true
 * @since 0.19.0
 */
export function test(str: string, pattern: RegExp | string, flags?: string): boolean;
/**
 * 对超过指定长度的字符串进行截取并在末尾追加代替字符
 *
 * @example
 * //func...
 * console.log(_.truncate('func.js',4))
 * //func...
 * console.log(_.truncate('func.js',6,{separator:/.w+/g}))
 * //func.js.com...
 * console.log(_.truncate('func.js.com.cn',13,{separator:'.'}))
 * //func.js
 * console.log(_.truncate('func.js',10))
 * //fun!!!
 * console.log(_.truncate('func.js',3,{omission:'!!!'}))
 *
 * @param str
 * @param len 最大长度。如果长度大于<code>str</code>长度，直接返回str
 * @param [options] 可选项
 * <ul>
 *    <li>omission <code>{string}</code> 替代字符，默认 '...'</li>
 *    <li>[separator] <code>{string | RegExp}</code> 截断符。如果截取后的字符串中包含截断符，则最终只会返回截断符之前的内容</li>
 *  </ul>
 * @returns 返回新字符串
 * @since 1.3.0
 */
export function truncate(str: string, len: number, options?: {
    omission: '...';
    separator?: string | RegExp;
}): string;

}`,_={key:0,style:{color:"#eaeaea","text-align":"center","font-size":"3rem","line-height":"4"}},v=m({__name:"MonacoEditorHome",setup(h){const n=a(),e=a();let l=a(!0);g(async()=>{const r=await u(()=>import("./index.e78d5407.js"),[],import.meta.url).then(o=>o==null?void 0:o.default);e.value=await r.init(),e.value.languages.typescript.typescriptDefaults.addExtraLib(f,"@/types/collection.d.ts"),e.value.languages.typescript.typescriptDefaults.addExtraLib(b,"@/types/array.d.ts"),e.value.languages.typescript.typescriptDefaults.addExtraLib(x,"@/types/string.d.ts"),l.value=!1,e.value.editor.create(n.value,{theme:"vs",language:"typescript",value:"",automaticLayout:!0,readOnly:!0,contextmenu:!1,minimap:{enabled:!1},scrollBeyondLastLine:!1}).setValue(c)});const c=`import {each,map} from '@holyhigh/func.js/collection'
import {toString} from '@holyhigh/func.js/string'
import {range} from '@holyhigh/func.js/array'
//-------------------------------------- 泛型
// 除is模块外绝大部分函数都支持泛型，使用时请注意查看签名定义
//--------------------------------------
each<string, string>({'1':'1','2':2},(v,k)=>{}) //通过泛型指定 v,k 的类型
each(document.body.children,(el)=>{}) //根据集合类型自动推导 el 的类型

//-------------------------------------- 重载
// 集合模块中大部分函数都有多个签名，包括泛型、参数
//--------------------------------------
map({a:1,b:2,c:3},v=>{}) //自动泛型。v是数字类型，返回值是数字类型
map<number>({a:1,b:2,c:3},v=>{}) //手动泛型。v是数字类型，返回值是数字类型
map<number,string>({a:1,b:2,c:3},(v,k)=>{}) //v是数字类型，k是字符类型，返回值是数字类型
map<number,string,string>({a:1,b:2,c:3},(v,k)=>{}) //v是数字类型，k是字符类型，返回值也是字符类型

range(5) //[0, 1, 2, 3, 4]
range(-5,1) //[-5, -4, -3, -2, -1, 0]
range(0,-5,0.5) //[0, -0.5, -1, -1.5, -2, -2.5, -3, -3.5, -4, -4.5]

//-------------------------------------- 返回类型
// func.js使用TS构建，所有函数都明确定义了返回类型
//--------------------------------------
//toString的返回值类型是string，而不是string|null|undefined, 所以该函数返回的值一定是string
toString(null)`;return(r,i)=>(t(),s("div",{class:"editor",ref_key:"editor",ref:n},[d(l)?(t(),s("div",_,"Loading...")):y("",!0)],512))}}),T=p(v,[["__scopeId","data-v-8207d372"]]);export{T as default};
