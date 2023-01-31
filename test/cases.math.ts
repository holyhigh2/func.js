/**
 * 测试用例
 */
const Datas: Record<string, any[]> = {
  sum: [
    [1, 2, '3', 4, 10],
    [[1, '2', 3, 4], 10],
    [[1, 2], '3', 4, 10],
  ],
  avg: [
    [1, 2, '3', 4, 2.5],
    [[1, '2', 3, 'a', 4], 2.5],
  ],
  max: [
    [2, 3, 1, 7, 4, 5, 7],
    [4, [5, [1, 2, 3], 6], 'x', 'y', 6],
  ],
  min: [
    [2, 3, 1, 7, 4, 5, 1],
    [4, [5, [1, 2, 3], 6], 0, 'x', 'y', 0],
  ],
}

export default Datas
