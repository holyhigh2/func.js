/**
 * 测试用例
 */
const Datas: Record<string, any[]> = {
  sum: [
    [[1, 2, '3', 4], 10],
    [[1, '2', 3, null,undefined], 6],
    [[NaN, '2', 3, 4],NaN],
    [[Infinity, '2', 3, 4],Infinity]
  ],
  mean: [
    [[1, 2, '3', 4], 2.5],
    [[1, '2', 3, 'a', 4], NaN],
    [[1, '2', 3, null, 4],2]
  ],
  max: [
    [[2, 3, 1, NaN, 7, 4, null], 7],
    [[4, 5, 6, 'x', 'y'], 6],
    [[4, 5, 6, Infinity], Infinity]
  ],
  min: [
    [[2, 3, 1, 7, '-1'], -1],
    [[4, 3, 6, 0, 'x', 'y'], 0],
    [[-Infinity,-9999,0,null],-Infinity]
  ],
  add: [
    [1, 2, 3],
    [undefined, 1, 1],
    [NaN, 1, NaN]
  ],
  subtract: [
    [1, 2, -1],
    [1, null, 1],
    [1,NaN, NaN]
  ],
  divide: [
    [1, 2, 0.5],
    [1, null, Infinity],
    [1, NaN, NaN]
  ],
  multiply: [
    [1, 2, 2],
    [1, null, 0],
    [1, NaN, NaN]
  ],
}

export default Datas
