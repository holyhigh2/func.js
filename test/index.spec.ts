/**
 * @jest-environment jsdom
 */
import _, { initial, isArray, isObject, last, merge } from '../src/index'
import CasesIs from './cases.is'
import CasesString from './cases.string'
import CasesArray from './cases.array'
import CasesColl from './cases.collection'
import CasesDatetime from './cases.datetime'
import CasesMath from './cases.math'
import CasesNumber from './cases.number'
import CasesObject from './cases.object'
;(_ as any).info()

const Cases = merge(
  CasesIs,
  CasesString,
  CasesArray,
  CasesDatetime,
  CasesColl,
  CasesMath,
  CasesNumber,
  CasesObject
)

for (let fnName in Cases) {
  const datas = Cases[fnName]
  datas.forEach((dataAry: any[]) => {
    const paramsAry = initial(dataAry)
    const result = last(dataAry)

    test(
      fnName +
        ' - ' +
        JSON.stringify(paramsAry, (k, v: any[]) => {
          return v
            .map((val) => {
              if (val === null) return 'null'
              if (val === undefined) return 'undefined'
              if (Number.isNaN(val)) return 'NaN'
              if (val instanceof RegExp) return val.toString()
              if (val instanceof Function) return val.toString()
              return JSON.stringify(val)
            })
            .join(',')
        }) +
        ' => ' +
        JSON.stringify(result),
      async () => {
        if (isArray(result) || isObject(result)) {
          expect((_ as any)[fnName](...paramsAry)).toEqual(result)
        } else {
          expect((_ as any)[fnName](...paramsAry)).toBe(result)
        }
      }
    )
  })
}
