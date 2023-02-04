# Changelog

Func.js 更新记录

## [2.2.4] - 2023/2/4

### optimize

- move info & noConflict into utils module

## [2.2.2] - 2023/1/14

### 新增

- 模块引用

## [2.2.0] - 2023/1/4

### 新增

- tree -> closest

### 优化

- collection 函数签名支持集合类型自动推导
- array range 函数新增重载签名

## [2.1.0] - 2022/11/1

### 新增

- datetime -> getDayOfYear,getWeekOfYear,getWeekOfMonth,isLeapYear

### 优化

- formatDate 新增多种格式化标记
- replaceAll 新增重载签名

## [2.0.0] - 2022/10/23

### 变更

- 使用 ts 重构
- 优化 each 性能
- 移除个别重复函数
- 新增覆盖测试
