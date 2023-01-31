/* eslint-disable max-len */
/**
 * tree相关函数
 *
 * @packageDocumentation
 */

/**
 * 
 * @author holyhigh
 */

import { sortedIndexBy } from './array'
import { each, includes, map, sortBy } from './collection'
import { isArray, isEmpty, isObject } from './is'
import { cloneWith, get } from './object'
import { NonFuncItee, UnknownMapKey } from './types'
import { iteratee } from './utils'

/**
 * 使用高性能算法，将array结构数据变为tree结构数据
 * @example
 * //生成测试数据
 * function addChildren(count,parent){
 *  const data = [];
 *  const pid = parent?parent.id:null;
 *  const parentName = parent?parent.name+'-':'';
 *  _.each(_.range(0,count),i=>{
 *    const sortNo = _.randi(0,count);
 *    data.push({id:_.alphaId(),pid,name:parentName+i,sortNo})
 *  });
 *  return data;
 * }
 *
 * function genTree(depth,parents,data){
 *  _.each(parents,r=>{
 *    const children = addChildren(_.randi(1,4),r);
 *    if(depth-1>0){
 *      genTree(depth-1,children,data);
 *    }
 *    _.append(data,...children);
 *  });
 * }
 *
 * const roots = addChildren(2);
 * const data = [];
 * genTree(2,roots,data);
 * _.insert(data,0,...roots);
 *
 * const tree = _.arrayToTree(data,'id','pid',{attrMap:{text:'name'}});
 * _.walkTree(tree,(parentNode,node,chain)=>console.log('node',node.text,'sortNo',node.sortNo,'chain',_.map(chain,n=>n.name)));
 *
 *
 * @param array 原始数据集。如果非Array类型，返回空数组
 * @param idKey id标识
 * @param pidKey='pid' 父id标识
 * @param options 自定义选项
 * @param options.rootParentValue 根节点的parentValue，用于识别根节点。默认null
 * @param options.childrenKey 包含子节点容器的key。默认'children'
 * @param options.attrMap 转换tree节点时的属性映射，如\{text:'name'\}表示把array中一条记录的name属性映射为tree节点的text属性
 * @param options.sortKey 如果指定排序字段，则会在转换tree时自动排序。字段值可以是数字或字符等可直接进行比较的类型。性能高于转换后再排序
 * @returns 返回转换好的顶级节点数组或空数组
 * @since 1.5.0
 */
function arrayToTree(
  array: Record<UnknownMapKey, any>[],
  idKey: string = 'id',
  pidKey?: string,
  options: {
    rootParentValue?: any
    attrMap?: Record<string, any>
    childrenKey?: string
    sortKey?: string
  } = {}
): Record<UnknownMapKey, any>[] {
  if (!isArray(array)) return []

  const pk = pidKey || 'pid'
  const attrMap = options.attrMap
  const hasAttrMap = !!attrMap && isObject(attrMap)
  const rootParentValue = get(options, 'rootParentValue', null)
  const childrenKey = options.childrenKey || 'children'
  const sortKey = options.sortKey
  const hasSortKey = !!sortKey
  const roots: Record<any, any>[] = []
  const nodeMap: { [key: string | number]: any } = {}
  const sortMap: { [key: string | number]: any } = {}

  array.forEach((record) => {
    const nodeId = record[idKey || 'id']
    nodeMap[nodeId] = record
    if (hasSortKey) {
      const sortNo = record[sortKey]
      sortMap[nodeId] = [sortNo, sortNo] // min,max
    }

    if (record[pk] === rootParentValue) {
      if (hasAttrMap) {
        each<any, string>(attrMap, (v, k) => (record[k] = record[v]))
      }
      roots.push(record)
    }
  })

  array.forEach((record) => {
    const parentId = record[pk]
    const parentNode = nodeMap[parentId]
    if (parentNode) {
      let children = parentNode[childrenKey]
      if (!children) {
        children = parentNode[childrenKey] = []
      }
      if (hasAttrMap) {
        each<any, string>(attrMap, (v, k) => (record[k] = record[v]))
      }
      if (hasSortKey) {
        const [min, max] = sortMap[parentId]

        const sortNo = record[sortKey]
        if (sortNo <= min) {
          children.unshift(record)
          sortMap[parentId][0] = sortNo
        } else if (sortNo >= max) {
          children.push(record)
          sortMap[parentId][1] = sortNo
        } else {
          const i = sortedIndexBy(children, { [sortKey]: sortNo }, sortKey)
          children.splice(i, 0, record)
        }
      } else {
        children.push(record)
      }
    }
  })

  return hasSortKey ? sortBy(roots, sortKey) : roots
}

/**
 * 以给定节点为根遍历所有子孙节点。深度优先
 * @example
 * //生成测试数据
 * function addChildren(count,parent){
 *  const data = [];
 *  const pid = parent?parent.id:null;
 *  const parentName = parent?parent.name+'-':'';
 *  _.each(_.range(0,count),i=>{
 *    const sortNo = _.randi(0,count);
 *    data.push({id:_.alphaId(),pid,name:parentName+i,sortNo})
 *  });
 *  return data;
 * }
 *
 * function genTree(depth,parents,data){
 *  _.each(parents,r=>{
 *    const children = addChildren(_.randi(1,4),r);
 *    if(depth-1>0){
 *      genTree(depth-1,children,data);
 *    }
 *    _.append(data,...children);
 *  });
 * }
 *
 * const roots = addChildren(2);
 * const data = [];
 * genTree(2,roots,data);
 * _.insert(data,0,...roots);
 * const tree = _.arrayToTree(data,'id','pid',{sortKey:'sortNo'});
 *
 * _.walkTree(tree,(parentNode,node,chain)=>console.log('node',node.name,'sortNo',node.sortNo,'chain',_.map(chain,n=>n.name)))
 *
 * @param treeNodes 一组节点或一个节点
 * @param callback (parentNode,node,chain)回调函数，如果返回false则中断遍历，如果返回-1则停止分支遍历
 * @param options 自定义选项
 * @param options.childrenKey 包含子节点容器的key。默认'children'
 * @since 1.5.0
 */
function walkTree(
  treeNodes: Record<UnknownMapKey, any> | Record<UnknownMapKey, any>[],
  callback: (
    parentNode: Record<UnknownMapKey, any>,
    node: Record<UnknownMapKey, any>,
    chain: Record<UnknownMapKey, any>[]
  ) => boolean | number | void,
  options?: Record<UnknownMapKey, any>
): void {
  _walkTree(treeNodes, callback, options)
}
function _walkTree(
  treeNodes: Record<UnknownMapKey, any> | Record<UnknownMapKey, any>[],
  callback: (
    parentNode: Record<UnknownMapKey, any>,
    node: Record<UnknownMapKey, any>,
    chain: Record<UnknownMapKey, any>[]
  ) => boolean | number | void,
  options?: Record<UnknownMapKey, any>,
  ...rest: any[]
): boolean | void {
  options = options || {}
  const parentNode = rest[0]
  const chain = rest[1] || []
  const childrenKey = options.childrenKey || 'children'
  const data = isArray(treeNodes) ? treeNodes : [treeNodes]
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const rs = callback(parentNode, node, chain)
    if (rs === false) return
    if (rs === -1) continue

    if (!isEmpty(node[childrenKey])) {
      let nextChain = [node]
      if (parentNode) {
        nextChain = chain.concat(nextChain)
      }
      const rs = _walkTree(
        node[childrenKey],
        callback,
        options,
        node,
        nextChain
      )
      if (rs === false) return
    }
  }
}

/**
 * 对给定节点及所有子孙节点(同级)排序
 * @example
 * //生成测试数据
 * function addChildren(count,parent){
 *  const data = [];
 *  const pid = parent?parent.id:null;
 *  const parentName = parent?parent.name+'-':'';
 *  _.each(_.range(0,count),i=>{
 *    const sortNo = _.randi(0,9);
 *    data.push({id:_.alphaId(),pid,name:parentName+i,sortNo})
 *  });
 *  return data;
 * }
 *
 * function genTree(depth,parents,data){
 *  _.each(parents,r=>{
 *    const children = addChildren(_.randi(1,4),r);
 *    if(depth-1>0){
 *      genTree(depth-1,children,data);
 *    }
 *    _.append(data,...children);
 *  });
 * }
 *
 * const roots = addChildren(1);
 * const data = [];
 * genTree(2,roots,data);
 * _.insert(data,0,...roots);
 * let tree = _.arrayToTree(data,'id','pid');
 *
 * console.log('Before sort---------------');
 * _.walkTree(_.cloneDeep(tree),(parentNode,node,chain)=>console.log('node',node.name,'sortNo',node.sortNo))
 * _.sortTree(tree,(a,b)=>a.sortNo - b.sortNo);
 * console.log('After sort---------------');
 * _.walkTree(tree,(parentNode,node,chain)=>console.log('node',node.name,'sortNo',node.sortNo))
 *
 * @param treeNodes 一组节点或一个节点
 * @param comparator (a,b) 排序函数
 * @param options 自定义选项
 * @param options.childrenKey 包含子节点容器的key。默认'children'
 *
 * @since 1.5.0
 */
function sortTree(
  treeNodes: Record<UnknownMapKey, any> | Record<UnknownMapKey, any>[],
  comparator: (
    a: Record<UnknownMapKey, any>,
    b: Record<UnknownMapKey, any>
  ) => number,
  options?: { childrenKey?: string }
): void {
  options = options || {}
  const childrenKey = options.childrenKey || 'children'
  const data: Record<UnknownMapKey, any>[] = isArray(treeNodes)
    ? treeNodes
    : [treeNodes]
  data.sort((a, b) => comparator(a, b))

  data.forEach((node) => {
    if (!isEmpty(node[childrenKey])) {
      sortTree(node[childrenKey], comparator)
    }
  })
}

/**
 * 查找给定节点及所有子孙节点中符合断言的第一个节点并返回
 * @example
 * //生成测试数据
 * function addChildren(count,parent){
 *  const data = [];
 *  const pid = parent?parent.id:null;
 *  const parentName = parent?parent.name+'-':'';
 *  _.each(_.range(0,count),i=>{
 *    const sortNo = _.randi(0,count);
 *    data.push({id:_.alphaId(),pid,name:parentName+i,sortNo})
 *  });
 *  return data;
 * }
 *
 * function genTree(depth,parents,data){
 *  _.each(parents,r=>{
 *    const children = addChildren(_.randi(2,5),r);
 *    if(depth-1>0){
 *      genTree(depth-1,children,data);
 *    }
 *    _.append(data,...children);
 *  });
 * }
 *
 * const roots = addChildren(2);
 * const data = [];
 * genTree(4,roots,data);
 * _.insert(data,0,...roots);
 * const tree = _.arrayToTree(data,'id','pid',{sortKey:'sortNo'});
 *
 * console.log(_.omit(_.findTreeNode(tree,node=>node.sortNo>2),'children','id','pid'))
 *
 *
 * @param treeNodes 一组节点或一个节点
 * @param predicate (node) 断言
 * <br>当断言是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @param options 自定义选项
 * @param options.childrenKey 包含子节点容器的key。默认'children'
 * @returns 第一个匹配断言的节点或undefined
 * @since 1.5.0
 */
function findTreeNode(
  treeNodes: Record<UnknownMapKey, any> | Record<UnknownMapKey, any>[],
  predicate: (node: Record<UnknownMapKey, any>) => boolean | NonFuncItee,
  options?: { childrenKey?: string }
): Record<UnknownMapKey, any> | undefined {
  const callback = iteratee(predicate)
  let node
  walkTree(
    treeNodes,
    (p, n, c) => {
      const rs = callback(n)
      if (rs) {
        node = n
        return false
      }
    },
    options
  )
  return node
}

/**
 * 查找给定节点及所有子孙节点中符合断言的所有节点并返回
 * @example
 * //生成测试数据
 * function addChildren(count,parent){
 *  const data = [];
 *  const pid = parent?parent.id:null;
 *  const parentName = parent?parent.name+'-':'';
 *  _.each(_.range(0,count),i=>{
 *    const sortNo = _.randi(0,count);
 *    data.push({id:_.alphaId(),pid,name:parentName+i,sortNo})
 *  });
 *  return data;
 * }
 *
 * function genTree(depth,parents,data){
 *  _.each(parents,r=>{
 *    const children = addChildren(_.randi(2,5),r);
 *    if(depth-1>0){
 *      genTree(depth-1,children,data);
 *    }
 *    _.append(data,...children);
 *  });
 * }
 *
 * const roots = addChildren(2);
 * const data = [];
 * genTree(3,roots,data);
 * _.insert(data,0,...roots);
 * const tree = _.arrayToTree(data,'id','pid',{sortKey:'sortNo'});
 *
 * _.each(_.findTreeNodes(tree,node=>node.sortNo>2),node=>console.log(_.omit(node,'children','id','pid')))
 *
 *
 * @param treeNodes 一组节点或一个节点
 * @param predicate (node) 断言
 * <br>当断言是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @param options 自定义选项
 * @param options.childrenKey 包含子节点容器的key。默认'children'
 * @returns 找到的符合条件的所有节点或空数组
 * @since 1.5.0
 */
function findTreeNodes(
  treeNodes: Record<UnknownMapKey, any> | Record<UnknownMapKey, any>[],
  predicate: (node: Record<UnknownMapKey, any>) => boolean | NonFuncItee,
  options?: { childrenKey?: string }
): Record<UnknownMapKey, any>[] {
  const callback = iteratee(predicate)
  const nodes: Record<UnknownMapKey, any>[] = []
  walkTree(
    treeNodes,
    (p, n, c) => {
      const rs = callback(n)
      if (rs) {
        nodes.push(n)
      }
    },
    options
  )
  return nodes
}

/**
 * 类似<code>findTreeNodes</code>，但会返回包含所有父节点的节点副本数组，已做去重处理。
 * 结果集可用于重新构建tree
 * @example
 * //生成测试数据
 * function addChildren(count,parent){
 *  const data = [];
 *  const pid = parent?parent.id:null;
 *  const parentName = parent?parent.name+'-':'';
 *  _.each(_.range(0,count),i=>{
 *    const sortNo = _.randi(1,4);
 *    data.push({id:_.alphaId(),pid,name:parentName+i,sortNo})
 *  });
 *  return data;
 * }
 *
 * function genTree(depth,parents,data){
 *  _.each(parents,r=>{
 *    const children = addChildren(_.randi(1,4),r);
 *    if(depth-1>0){
 *      genTree(depth-1,children,data);
 *    }
 *    _.append(data,...children);
 *  });
 * }
 *
 * const roots = addChildren(2);
 * const data = [];
 * genTree(2,roots,data);
 * _.insert(data,0,...roots);
 * const tree = _.arrayToTree(data,'id','pid',{sortKey:'sortNo'});
 *
 * _.each(_.filterTree(tree,node=>node.sortNo>1),node=>console.log(_.omit(node,'children','id','pid')))
 *
 *
 * @param treeNodes 一组节点或一个节点
 * @param predicate (node) 断言
 * <br>当断言是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @param options 自定义选项
 * @param options.childrenKey 包含子节点容器的key。默认'children'
 * @returns 找到的符合条件的所有节点副本或空数组
 * @since 1.5.0
 */
function filterTree(
  treeNodes: Record<UnknownMapKey, any> | Record<UnknownMapKey, any>[],
  predicate: (node: Record<UnknownMapKey, any>) => boolean | NonFuncItee,
  options?: { childrenKey?: string }
): Record<UnknownMapKey, any>[] {
  options = options || {}
  const callback = iteratee(predicate)
  const childrenKey = options.childrenKey || 'children'
  let nodes: Record<UnknownMapKey, any>[] = []
  walkTree(
    treeNodes,
    (p, n, c) => {
      const rs = callback(n)
      if (rs) {
        c.forEach((node) => {
          if (!includes(nodes, node)) {
            nodes.push(node)
          }
        })
        nodes.push(n)
      }
    },
    options
  )

  nodes = map(nodes, (item) =>
    cloneWith(item, (v, k) => (k === childrenKey ? null : v))
  )

  return nodes
}

/**
 * 根据指定的node及parentKey属性，查找最近的祖先节点
 * @param node Element节点或普通对象节点
 * @param predicate (node,times,cancel)断言函数，如果返回true表示节点匹配。或调用cancel中断查找
 * @param parentKey 父节点引用属性名
 * @returns 断言为true的最近一个祖先节点
 * @since 2.2.0
 */
function closest(
  node: Record<UnknownMapKey, any>,
  predicate: (node: Record<UnknownMapKey, any>,times:number,cancel:()=>void) => boolean,
  parentKey: string,
): Record<UnknownMapKey, any> | null {
  let p = node
  let t = null
  let k = true
  let i = 0
  while (k && p) {
    if (predicate(p,i++,()=>{k=false})) {
      t = p
      break
    }
    p = p[parentKey]
  }
  return t
}

export {
  arrayToTree,
  walkTree,
  sortTree,
  filterTree,
  findTreeNode,
  findTreeNodes,
  closest,
}
