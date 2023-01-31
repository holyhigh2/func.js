/**
 * 测试用例
 */
const Datas:Record<string,any[]> = {
    isDefined: [
        [null, true], [undefined, false]
    ],
    isUndefined: [
        [undefined, true], [null, false]
    ],
    isArray: [
        [[], true], [document.body.children, false]
    ],
    isArrayLike: [
        ['abc123', true], [[], true], [document.body.children, true]
    ],
    isNull: [
        [null, true], [undefined, false]
    ],
    isEmpty: [
        [null, true], [[], true], [{ }, true], [{ x: 1 }, false]
    ],
    isBlank: [
        ['  ', true], [null, true], [{}, true], ['     1', false]
    ],
    eq:[
        [NaN, NaN, true], [1, '1', false]
    ],
    isObject: [
        [1, false], [new String(), true], [true, false], [null, false]
    ],
    isPlainObject: [
        [1, false], [new String(), false], [{}, true], [new Object, true], [new Date, false]
    ],
    isMap: [
        [new Map(), true], [new WeakMap(), false]
    ],
    isWeakMap: [
        [new Map(), false], [new WeakMap(), true]
    ],
    isSet: [
        [new WeakSet(), false], [new Set(), true]
    ],
    isWeakSet: [
        [new WeakSet(), true], [new Set(), false]
    ],
    isBoolean: [
        [1, false], [false, true]
    ],
    isDate: [
        [new Date(), true], [Date.now(), false]
    ],
    isInteger: [
        [-0, true], [1.0, true], ['1', false], [Number.MAX_VALUE, true], [5.0000000000000001, true]
    ],
    isSafeInteger: [
        [-0, true], [1.0, true], ['1', false], [Number.MAX_VALUE, false], [5.0000000000000001, true]
    ],
    isNaN: [
        [NaN, true], [undefined, false]
    ],
    isEqual: [
        [[new Date('2010-2-1'), /12/], [new Date(1264953600000), new RegExp('12')], true],
        [[new Date('2010-2-1'), 'abcd'], ['2010/2/1', 'Abcd'], false],
        [1, '1', false],
    ],
    isMatch: [
        [{ a: { x: 1, y: 2 }, b: 1 }, { b: 1 }, true], [[{ x: 1, y: 2 }, { b: 1 }], [{ x: 1 }], true]
    ],
    isRegExp: [
        [new RegExp(''), true], [/1/, true]
    ],
    isElement: [
        [document, false], [document.documentElement, true], [document.body, true]
    ],
    isError: [
        [new TypeError(''), true], [Error, false]
    ],
    isSymbol: [
        [Symbol(), true], [Symbol.iterator, true]
    ],
    isFinite: [
        [Number.MAX_VALUE,true],[99999999999999999999999999999999999999999999999999999999999999999999999, true], [Infinity, false]
    ],
    isNil: [
        [null, true], [undefined, true], [0, false], [NaN, false]
    ],
}

export default Datas