# 纯函数, 更专注
![npm](https://img.shields.io/npm/v/@holyhigh/func.js?style=plastic)
![NPM](https://img.shields.io/npm/l/@holyhigh/func.js)

```ts
//object
_.each<string, string>({ 1: 'a', 2: 'b', 3: 'c' }, (v,k)=>{})
//dom list
_.each<HTMLElement>(document.body.children, (el)=>{})
//array
_.each([1, 2, 3], num=>{})
//set
_.each(new Set([1, 2, 3]), num=>{})
```

> 中文 | [English](./README.md)

## Func.js
Func.js是一个TS纯函数库，未开发者提供更便捷，全面及多样性的声明式开发体验。

- [📑 文档](https://holyhigh2.github.io/func.js/)
- [⚡ 在线体验](https://stackblitz.com/edit/func-js?file=index.ts)

## 特性
- 用于集合及其他模块的统一化接口
- 超过**200**个纯函数可供使用
- 惰性计算
- 树操作API
- 完整的日期/数字格式化器
- [查看更多...](https://holyhigh2.github.io/func.js/api/readme/)

## 快速上手
1. 安装
```sh
npm i @holyhigh/func.js
```
2. 导入
```ts
import _ from '@holyhigh/func.js'
//or
import {each} from '@holyhigh/func.js'
//or
import {each,map} from '@holyhigh/func.js/collection'
//or
import _ from 'https://cdn.skypack.dev/@holyhigh/func.js'
```

## 开发
1. 使用 `test` 执行jest测试 
2. 使用 `build` 进行打包
3. 使用 `doc` 生成tsdoc