/**
 * 测试用例
 */
const Datas: Record<string, any[]> = {
  toString: [
    [null, ''],
    [1, '1'],
    [[3, 6, 9], '369'],
    [-0, '-0'],
    [new Set([3, 6, 9]), '[object Set]'],
    [{ a: 1, toString: () => '{a:2}' }, '{a:2}'],
  ],
  capitalize: [
    ['abc', 'Abc'],
    [null, ''],
    [1, '1'],
  ],
  trim: [
    ['  holyhigh ', 'holyhigh'],
    ['holy  high', 'holy  high'],
  ],
  trimStart: [['  holyhigh ', 'holyhigh ']],
  trimEnd: [['  holyhigh ', '  holyhigh']],
  padZ: [['1', 3, '001']],
  padStart: [['1', 3, '0', '001']],
  padEnd: [
    ['1', 3, '0', '100'],
    ['1', 6, '-0', '1-0-0-'],
    ['1', 0, '-0', '1'],
  ],
  toFixed: [
    [2.465, 2, '2.47'],
    [-14.6, '-15'],
    [14.00005, 4, '14.0001'],
  ],
  repeat: [['func', 3, 'funcfuncfunc']],
  substring: [
    ['12345678', 2, '345678'],
    ['12345678', 2, 7, '34567'],
  ],
  startsWith: [
    ['func.js', 'func', true],
    ['func.js', 'func', 3, false],
    ['func.js', 'c', 3, true],
  ],
  endsWith: [
    ['func.js', 'js', true],
    ['func.js', 'c', 4, true],
  ],
  upperCase: [['func.js', 'FUNC.JS']],
  lowerCase: [['FUNC.JS', 'func.js']],
  replace: [
    ['a.b.c', '.', '-', 'a-b.c'],
    ['geligeli', /ge/g, 'ke', 'kelikeli'],
    ['kelikeli', /ke/g, () => 'ge', 'geligeli'],
  ],
  replaceAll: [
    ['a.b.c', '.', '-', 'a-b-c'],
    ['geligeli', /ge/, 'ke', 'kelikeli'],
    ['kelikeli', /ke/, () => 'ge', 'geligeli'],
    ['kelikeli', { ke: 'gg', li: 'jj' }, 'ggjjggjj'],
  ],
  escapeRegExp: [
    [
      '^[func.js] + {crud-vue} = .*?$',
      '\\^\\[func\\.js\\] \\+ \\{crud-vue\\} = \\.\\*\\?\\$',
    ],
  ],
  split: [
    ['func.js', '.', ['func', 'js']],
    ['func.js', '.', 1, ['func']],
  ],
  kebabCase: [
    ['a B-c', 'a-b-c'],
    ['getMyURL', 'get-my-url'],
    ['a_b_c', 'a-b-c'],
  ],
  snakeCase: [
    ['a-b c', 'a_b_c'],
    ['Love loves to love Love', 'love_loves_to_love_love'],
  ],
  camelCase: [
    ['getMyURL', 'getMyUrl'],
    ['a B-c', 'aBC'],
  ],
  pascalCase: [
    ['aBc   D__EF_GH----XY_', 'ABcDEfGhXy'],
    ['getMyURL', 'GetMyUrl'],
  ],
  lowerFirst: [['FIRST', 'fIRST']],
  upperFirst: [['first', 'First']],
  indexOf: [['cyberfunc.js', 'js', 5, 10]],
  lastIndexOf: [['cyberfunc.js', 'js', 5, -1]],
  test: [
    ['func.js', 'Func', 'i', true],
    ['func.js', /FUNC/, false],
  ],
  truncate: [
    ['func.js', 4, 'func...'],
    ['func.js', 3, { omission: '!!!' }, 'fun!!!'],
  ],
}

export default Datas
