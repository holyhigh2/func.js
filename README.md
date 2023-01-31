# Pure Function, More Attention
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
> English | [中文](./README_ZH.md)

## Func.js
Func.js is a TS library of pure functions, providing developers with a more convenient, comprehensive, and diversified declarative programming experience.

- 📑 Documentation - [Gitee](https://holyhigh2.gitee.io/func.js/) | [Github](https://holyhigh2.gitee.io/func.js/)
- [⚡ Play on StackBlitz](https://stackblitz.com/edit/func-js?file=index.ts)

## Features
- Unified interface for collections and other modules
- **200+** Pure functions
- Lazy evaluation
- Tree APIs
- Full datetime/number formatter
- [and more...]()

## Quick start
1. install
```sh
npm i @holyhigh/func.js
```
2. import
```ts
import _ from '@holyhigh/func.js'
//or
import {each} from '@holyhigh/func.js'
//or
import {each,map} from '@holyhigh/func.js/collection'
//or
import _ from 'https://cdn.skypack.dev/@holyhigh/func.js'
```

## Development
1. use `test` to do jest 
2. use `build` to rollup func.js
3. use `doc` to gen tsdoc