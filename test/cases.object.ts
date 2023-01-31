/**
 * 测试用例
 */
const Datas: Record<string, any[]> = {
  assign: [[{ x: 1 }, { y: 3 }, { x: 1, y: 3 }]],
  assignWith: [
    [
      { x: 1 },
      { y: 3, z: 4 },
      (sv: any, tv: any, k: any) => (k == 'z' ? null : sv + k),
      { x: 1, y: '3y', z: null },
    ],
  ],
  clone: [[null, null]],
  cloneWith: [
    [
      { x: 1, y: 2, z: 3 },
      (v: number, k: string) => (k == 'z' ? null : v),
      { x: 1, y: 2, z: null },
    ],
    [null, null],
  ],
  toObject: [
    ['a', 1, 'b', 2, { a: 1, b: 2 }],
    ['a', 1, 'b', 2, 'c', { a: 1, b: 2, c: undefined }],
  ],
  get: [
    [[1, 2, 3], 1, 2],
    [{ a: { b: [{ x: 'Holyhigh' }] } }, ['a', 'b', 0, 'x'], 'Holyhigh'],
    [{ a: { b: [{ x: 'Holyhigh2' }] } }, 'a.b.0.x', 'Holyhigh2'],
    [{ a: { b: [{ x: 'Holyhigh' }] } }, 'a.b[0].x', 'Holyhigh'],
    [[[null, [null, null, 'hi']]], '[0][1][2]', 'hi'],
    [{}, 'a.b[0].x', 'not find', 'not find'],
  ],
  set: [[{ a: 1 }, 'b.c.1.x', 10, { a: 1, b: { c: [undefined, { x: 10 }] } }]],
  pick: [
    [{ a: 1, b: 2, c: '3' }, 'b', { b: 2 }],
    [{ a: 1, b: 2, c: '3' }, 'b', 'c', { b: 2, c: '3' }],
  ],
  pickBy: [[{ a: 1, b: 2, c: '3' }, Number.isInteger, { a: 1, b: 2 }]],
  omit: [
    [{ a: 1, b: 2, c: '3' }, 'b', { a: 1, c: '3' }],
    [{ a: 1, b: 2, c: '3' }, 'b', 'c', { a: 1 }],
    [{ a: 1, b: 2, c: '3' }, ['b', 'a'], { c: '3' }],
  ],
  keys: [[{ a: 1, b: 2, c: '3' }, ['a', 'b', 'c']]],
  values: [[{ a: 1, b: 2, c: '3' }, [1, 2, '3']]],
  has: [[{ a: 12 }, 'a', true]],
  toPairs: [
    [
      { a: 1, b: 2, c: 3 },
      [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ],
    ],
  ],
  fromPairs: [
    [
      [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ],
      { a: 1, b: 2, c: 3 },
    ],
  ],
  defaults: [[{ a: 1 }, { b: 2 }, { c: 3, b: 1, a: 2 }, { a: 1, b: 2, c: 3 }]],
  defaultsDeep: [
    [
      { a: { x: 1 } },
      { b: 2 },
      { a: { x: 3, y: 2 } },
      { a: { z: 3, x: 4 } },
      { a: { x: 1, y: 2, z: 3 }, b: 2 },
    ],
  ],
  merge: [
    [
      { x: 1, y: { a: 1, b: 2 } },
      { x: 2, y: { c: 5, d: 4 } },
      { x: 0, y: { c: 3 } },
      { x: 0, y: { a: 1, b: 2, c: 3, d: 4 } },
    ],
  ],
  mergeWith: [
    [
      { x: 1, y: { a: 1, b: 2, c: 3 } },
      { x: 2, y: { a: 2, d: 3 } },
      { y: { b: 4 } },
      (sv: any, tv: any, k: any) => (k == 'd' ? sv * 9 : undefined),
      { x: 2, y: { a: 2, b: 4, c: 3, d: 27 } },
    ],
  ],
  findKey: [[[{ a: 1, b: 2 }, { c: 2 }, { d: 3 }], 'd', 2]],
}

export default Datas
