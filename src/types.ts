/**
 * 内部使用类型
 *
 * @packageDocumentation
 */


/**
 * 列表类型
 */
export interface IList {
  length: number
  [Symbol.iterator]?: any
  [index: number]: any
}

/**
 * 未知类型的mapKey
 */
export type UnknownMapKey = string | number | symbol

/**
 * 类数组类型
 */
export type ArrayLike<V = unknown> =
  | Array<V>
  | string
  | NodeList
  | HTMLCollection
  | IList

/**
 * 集合类型
 */
export type Collection<V = unknown> =
  | V[]
  | Record<UnknownMapKey, V>
  | Set<V>
  | Map<any, V>
  | ArrayLike<V>
  | string

/**
 * 非函数迭代类型
 */
export type NonFuncItee = string | Record<any, any> | Array<any>
