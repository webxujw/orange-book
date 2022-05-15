---
title: 模块联邦
index: 10
---

## 模块联邦 ModuleFederationPlugin


### 抛出组件

```js
const { ModuleFederationPlugin } = require('webpack').container;

// 抛出组件
new ModuleFederationPlugin({
    // 模块联邦名字，提供给其他模块使用
    name: 'app',
    // 提供给外部访问的资源入口
    filename: 'remoteEntry.js',
    // 引用的外部资源列表
    remotes: {},
    // 暴露给外部的资源列表
    exposes: {
    /**
     *  ./Header 是让外部应用使用时基于这个路径拼接引用路径，如：app/Header
     *  ./src/Header.js 是当前应用的要暴露给外部的资源模块路径
     */
    './Header': './src/Header.js',
    },
    // 共享模块，值当前被 exposes 的模块需要使用的共享模块，如lodash
    shared: {},
})
```


### 引用组件


```js
const { ModuleFederationPlugin } = require('webpack').container;

new ModuleFederationPlugin({
    // 模块联邦名字，提供给其他模块使用
    name: 'app1',
    // 提供给外部访问的资源入口
    filename: 'remoteEntry.js',
    // 引用的外部资源列表
    remotes: {
        /**
         *  App 引用其他应用模块的资源别名
         *  app 是 APP 的模块联邦名字
         *  http://localhost:3001 是 app 运行的地址
         *  RemoteEntry.js 是 APP 提供的外部访问的资源名字
         *  可以访问到 app 通过 exposes 暴露给外部的资源
         */
        App: 'app@http://localhost:3001/remoteEntry.js',
    },
    // 暴露给外部的资源列表
    exposes: {},
    // 共享模块，如lodash
    shared: {},
})


// 使用组件

import('App/Header').then(Header => {
    // Header.default
})

```