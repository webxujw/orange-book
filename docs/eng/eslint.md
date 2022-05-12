---
title: Eslint
index: 2
---

## 配置文件

1. `.eslintrc.*` 文件，或者直接在 package.json 文件里的 eslintConfig 字段指定配置，


配置文件加载优先级

```js
.eslintrc.js
.eslintrc.yaml
.eslintrc.yml
.eslintrc.json
.eslintrc
package.json
```

默认情况下，ESLint 会在所有父级目录里寻找配置文件，一直到根目录。

为了将 ESLint 限制到一个特定的项目，在你项目根目录下的 `package.json` 文件或者 `.eslintrc.*` 文件里的` eslintConfig` 字段下设置 `"root": true`。ESLint 一旦发现配置文件中有 `"root": true`，它就会停止在父级目录中寻找。


## parserOptions选项

设置解析器选项能帮助 ESLint 确定什么是解析错误，所有语言选项默认都是 false。

```js
{
    "parserOptions": {
        "ecmaVersion": 6, // ECMAScript 版本。2015或者 6都可以
        "sourceType": "module", // 设置为 "script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)。
        "ecmaFeatures": {
            "globalReturn": false, // 允许在全局作用域下使用 return 语句
            "jsx": true, // 启用 JSX
            "impliedStrict":true, //  - 启用全局 strict mode (如果 ecmaVersion 是 5 或更高)
        }
    },
    "rules": {
        "semi": "error"
    }
}
```

## parser 解析器

ESLint 默认使用Espree作为其解析器，
```
{
    "parser": "esprima",
    "rules": {
        "semi": "error"
    }
}
```


## 全局变量 env

这些环境并不是互斥的，所以你可以同时定义多个。

要在你的 JavaScript 文件中使用注释来指定环境，格式如下：

```js
/* eslint-env node, mocha */
```

```js
browser - 浏览器环境中的全局变量。
node - Node.js 全局变量和 Node.js 作用域。
commonjs - CommonJS 全局变量和 CommonJS 作用域 (用于 Browserify/WebPack 打包的只在浏览器中运行的代码)。
shared-node-browser - Node.js 和 Browser 通用全局变量。
es6 - 启用除了 modules 以外的所有 ECMAScript 6 特性（该选项会自动设置 ecmaVersion 解析器选项为 6）。
worker - Web Workers 全局变量。
amd - 将 require() 和 define() 定义为像 amd 一样的全局变量。
mocha - 添加所有的 Mocha 测试全局变量。
jasmine - 添加所有的 Jasmine 版本 1.3 和 2.0 的测试全局变量。
jest - Jest 全局变量。
phantomjs - PhantomJS 全局变量。
protractor - Protractor 全局变量。
qunit - QUnit 全局变量。
jquery - jQuery 全局变量。
prototypejs - Prototype.js 全局变量。
shelljs - ShellJS 全局变量。
meteor - Meteor 全局变量。
mongo - MongoDB 全局变量。
applescript - AppleScript 全局变量。
nashorn - Java 8 Nashorn 全局变量。
serviceworker - Service Worker 全局变量。
atomtest - Atom 测试全局变量。
embertest - Ember 测试全局变量。
webextensions - WebExtensions 全局变量。
greasemonkey - GreaseMonkey 全局变量。

{
    "env": {
        "browser": true,
        "node": true
    }
}
```


如果你想在一个特定的插件中使用一种环境，确保提前在 plugins 数组里指定了插件名，然后在 env 配置中不带前缀的插件名后跟一个 / ，紧随着环境名。例如：

```js
{
    "plugins": ["example"],
    "env": {
        "example/custom": true
    }
}
```

## 全局变量 globals

要在你的 JavaScript 文件中，用注释指定全局变量，格式如下：
```js
/* global var1, var2 */
```
这定义了两个全局变量，var1 和 var2。如果你想选择性地指定这些全局变量可以被写入(而不是只被读取)，那么你可以用一个 "writable" 的标志来设置它们:
```js
/* global var1:writable, var2:writable */
```

要在配置文件中配置全局变量，请将 globals 配置属性设置为一个对象，该对象包含以你希望使用的每个全局变量。对于每个全局变量键，将对应的值设置为 "writable" 以允许重写变量，或 "readonly" 不允许重写变量。例如：
```js
{
    "globals": {
        "var1": "writable",
        "var2": "readonly"
    }
}
```

可以使用字符串 "off" 禁用全局变量。例如，在大多数 ES2015 全局变量可用但 Promise 不可用的环境中，你可以使用以下配置:

```js
{
    "env": {
        "es6": true
    },
    "globals": {
        "Promise": "off"
    }
}
```
由于历史原因，布尔值 false 和字符串值 "readable" 等价于 "readonly"。类似地，布尔值 true 和字符串值 "writeable" 等价于 "writable"。但是，不建议使用旧值。

注意：要启用no-global-assign规则来禁止对只读的全局变量进行修改。

## plugins


ESLint 支持使用第三方插件。在使用插件之前，你必须使用 npm 安装它。

在配置文件里配置插件时，可以使用 plugins 关键字来存放插件名字的列表。插件名称可以省略 eslint-plugin- 前缀。

```js
{
    "plugins": [
        "plugin1",
        "eslint-plugin-plugin2"
    ]
}
```



## 规则 Rules

ESLint 附带有大量的规则。你可以使用注释或配置文件修改你项目中要使用的规则。要改变一个规则设置，你必须将规则 ID 设置为下列值之一：

* "off" 或 0 - 关闭规则
* "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
* "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)

如果一个规则有额外的选项，你可以使用数组字面量指定它们，比如：
```js
/* eslint quotes: ["error", "double"], curly: 2 */
```
这条注释为规则 quotes 指定了 “double”选项。数组的第一项总是规则的严重程度（数字或字符串）。


## 常用注释规则


如果在整个文件范围内禁止规则出现警告，将 /* eslint-disable */ 块注释放在文件顶部：

```js
/* eslint-disable */

alert('foo');
```


在某一特定的行上禁用某个指定的规则：如果只是禁用某个规则，后面加一个空格隔开，然后规则逗号分割

```js
alert('foo'); // eslint-disable-line 

// eslint-disable-next-line 
alert('foo');

// eslint-disable-next-line no-alert, quotes, semi
alert('foo');

```





上面的所有方法同样适用于插件规则。例如，禁止 eslint-plugin-example 的 rule-name 规则，把插件名（example）和规则名（rule-name）结合为 example/rule-name：

```js
foo(); // eslint-disable-line example/rule-name
foo(); /* eslint-disable-line example/rule-name */
```
注意：为文件的某部分禁用警告的注释，告诉 ESLint 不要对禁用的代码报告规则的冲突。ESLint 仍解析整个文件，然而，禁用的代码仍需要是有效的 JavaScript 语法。


## extend 规则继承

[cli-plugin-eslint](https://eslint.vuejs.org/)
[eslint-plugin-react]()

extends 属性值可以是：

* 指定配置的字符串(配置文件的路径、可共享配置的名称、 `eslint:recommended` 或 `eslint:all`)
* 字符串数组：每个配置继承它前面的配置


值为 "eslint:recommended" 的 extends 属性启用一系列核心规则，这些规则报告一些常见问题

> 使用插件里面的规则

```js
{
    "plugins": [
        "react"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "rules": {
       "no-set-state": "off"
    }
}
```