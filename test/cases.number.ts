/**
 * 测试用例
 */
const Datas: Record<string, any[]> = {
  formatNumber: [
    [123.678, '0.00', '123.68'],
    [12.1, ',000.00', '012.10'],
    [123.0, '00.#', '123'],
    [123.0, '00.0', '123.0'],
  ],
  toNumber: [
    [null, NaN],
    ['1', 1],
    [[3, 6, 9], NaN],
    [-0, -0],
  ],
  lt: [
    [1, 2, true],
    [5, '5', false],
  ],
  lte: [[5, '5', true]],
  gt: [
    [2, 1, true],
    [5, '5', false],
  ],
  gte: [[5, '5', true]],
  toInteger: [
    [9.99, 9],
    ['12.34', 12],
    [null, 0],
  ],
  inRange: [
    [1, 1, 2, true],
    [-2, -2, 0, true],
    [2, 3, true],
  ],
  map: [
    [new Set([1, 2, 3]), (v: any) => v * 2, [2, 4, 6]],
    [{ '1': 'a', '2': 'b', '3': 'c' }, (v: any, k: any) => k, ['1', '2', '3']],
    [
      'holyhigh',
      (v: any) => String.fromCharCode(v.charCodeAt(0) - 32),
      ['H', 'O', 'L', 'Y', 'H', 'I', 'G', 'H'],
    ],
  ],
  flatMap: [
    [
      [[1, 2], [[3]]],
      [1, 2, [3]],
    ],
    [[[1, 2], 3, 4, 5], (n: any) => (n % 2 ? n : []), [3, 5]],
  ],
  flatMapDeep: [
    [
      [[1, 2], [[3]]],
      [1, 2, 3],
    ],
  ],
  includes: [
    [{ a: 1, b: 2 }, 2, true],
    [[1, 3, 5, 7, [2]], 2, false],
    [[1, 3, 5, 7, [2]], 3, true],
    [[1, 3, 5, 7, [2]], 3, 2, false],
  ],
  reduce: [
    [[1, 3, 5, 7, 9], (a: any, v: any) => a + v, 25],
    [[1, 3, 5, 7, 9], (a: any, v: any) => a + v, 10, 35],
  ],
  toArray: [
    [new Set([1, 2, 3]), [1, 2, 3]],
    [{ x: 1, y: 2, z: 'b' }, [1, 2, 'b']],
    ['abc', ['a', 'b', 'c']],
  ],
  sort: [
    [
      ['lao1', 'lao3', 'lao2'],
      ['lao1', 'lao2', 'lao3'],
    ],
    [
      [9, 80, 7],
      [7, 9, 80],
    ],
  ],
  sortBy: [
    [[{ a: 2 }, { a: 1 }, { a: 3 }], 'a', [{ a: 1 }, { a: 2 }, { a: 3 }]],
  ],
  countBy: [
    [
      [1, 'a', 3, 'b', 5, 'c', 7, 'd', 9],
      Number.isInteger,
      { true: 5, false: 4 },
    ],
  ],
  groupBy: [
    [
      [1, 'a', 3, 'b', 5, 'c', 7, 'd', 9],
      Number.isInteger,
      { true: [1, 3, 5, 7, 9], false: ['a', 'b', 'c', 'd'] },
    ],
  ],
  keyBy: [
    [
      [1, 'a', 3, 'b', 5, 'c', 7, 'd', 9],
      Number.isInteger,
      { true: 9, false: 'd' },
    ],
  ],
}

export default Datas
