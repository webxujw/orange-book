---
title: 模块系统
---

## 模块的加载实现

### 1. 浏览器加载

HTML网页中，浏览器通过`<script>`标签加载JavaScript脚本。

```html
<!-- 页面内嵌的脚本 -->
<script type="application/javascript">
  // module code
</script>

<!-- 外部脚本 -->
<script type="application/javascript" src="path/to/myModule.js">
</script>
```
以上代码中，由于浏览器脚本的语言默认是 JavaScript，因此`type="application/javascript"可以省略。

在这种情况下，默认是同步加载 JavaScript 脚本，即渲染引擎`<script>`加入超时器停止，等到执行脚本，再继续播放。如果是外部脚本，还必须浏览脚本的下载时间。

如果脚本时间体积很大，下载和执行会持续很长时间，因此导致浏览器很卡，用户会坚持没有浏览器“死卡”了。显然是很不好的体验，所以浏览器允许脚本异步加载，下面就是随便加载的语法。

```html
<script src="path/to/myModule.js" defer></script>
<script src="path/to/myModule.js" async></script>
```
在上面的代码中，`<script>`标签打开`defer`或`async`属性，脚本会直接开始加载。渲染引擎遇到行命令，但会下载外部，不会等它下载和执行，而是执行后面的命令。

`defer` `async`的区别是：`defer`要到整个页面在内存中渲染结束（DOM结构以后完全生成，以及其他脚本执行完成），将执行等与`async`下载完成，渲染引擎正常显示，执行这个，再执行渲染的剧本，`defer`是“渲染完再执行”，`async`是“下载完就执行”。另外，如果有多个defer脚本，会按照在页面出现的顺序加载，而多个async是不能保证加载顺序的。


### 2. 加载规则


浏览器加载 ES6 模块，也不过使用`<script>`标签，要加入`type="module"`属性。

```html
<script type="module" src="./foo.js"></script>
```

这个代码在网页中插件的一个模块foo.js，由于设置了，所以浏览器知道这是一个 ES6 的模块`type module`

各种浏览器`type="module"`的`<script>`显示，都是异步加载完成，不会导致浏览器到整个页面渲染，然后再执行，即针对于打开了`<script>`标签的`defer`属性。

```html
<script type="module" src="./foo.js"></script>
<!-- 等同于 -->
<script type="module" src="./foo.js" defer></script>
```

如果网页有多个`<script type="module">`，它们会按照屏幕出现的顺序执行。

`<script>`的`async`属性也可以打开，只要加载完成，渲染引擎立即开始执行。执行后，重新开始执行。

```html
<script type="module" src="./foo.js" async></script>
```
使用了async属性，`<script type="module">`就不会在页面出现的顺序执行，只是该模块按照加载完成，就执行模块。

ES6 模块也允许在网页中嵌入，语法行为与加载外部脚本完全一致。

```html
<script type="module">
  import utils from "./utils.js";

  // other code
</script>
```

打个比方，jQuery 就支持模块加载。

```js
<script type="module">
  import $ from "./jquery/src/jquery.js";
  $('#message').text('Hi from jQuery!');
</script>
```

对于的模块（上例是foo.js），有外部需要注意。

* 代码是在模块作用下运行，而不是在内部域域运行。
* 模块自动采用严格模式，不管有没有声明use strict。
* 模块当中，可以`import`命令加载其他模块（.js后使用不可省略，需要提供绝对 URL 或相对 URL），也可以使用`export`命令输出接口。
* 模块中的`this`关键字`undefined`，而不是`window`模块的使用，而不是在模块中使用`this`的。
* 同一个模块如果加载多次，只执行一次。

下面是一个示例模块。

```js
import utils from 'https://example.com/js/utils.js';

const x = 1;

console.log(x === window.x); //false
console.log(this === undefined); // true
```

可以使用三个负载的语法点，可以使用当前的这个模块在`this`ES6之间。undefined

```js
const isNotModuleScript = this !== undefined;
```

##  [**ESM和CommonJs的差异**](https://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82)

讨论 Node.js 加载 ES6 模块之前，必须了解 ES6 模块与 CommonJS 模块不同。

有三个重大差异。

* CommonJS 模块输出值的拷贝，ES6 模块输出值的引用。
* CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
* CommonJS模块是同步require()加载模块，ES6模块的import命令是异步加载，有一个独立的模块依赖的解析阶段。

```js
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};
```

上面代码输出内部变量`counter`和改写这个变量的内部方法`incCounter`。然后，在`main.js`里面加载这个模块。

```js
// main.js
var mod = require('./lib');

console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3
```

上面代码说明，`lib.js`模块加载以后，它的内部变化就影响不到输出的`mod.counter`了。这是因为`mod.counter`是一个原始类型的值，会被缓存。除非写成一个函数，才能得到内部变动后的值。

```js
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  get counter() {
    return counter
  },
  incCounter: incCounter,
};
```

上面代码中，输出的`counter`属性实际上是一个取值器函数。现在再执行main.js，就可以正确读取内部变量counter的变动了。

```js
$ node main.js
3
4
```

`ES6` 模块的运行机制与 `cjs` 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令`import`，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，`ES6` 的`import`有点像 `Unix` 系统的“符号连接”，原始值变了，`import`加载的值也会跟着变。因此，`ES6` 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

还是举上面的例子。

```js
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}

// main.js
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```

上面代码说明，`ES6` 模块输入的变量`counter`是活的，完全反应其所在模块`lib.js`内部的变化。

再举一个出现在`export`一节中的例子。

```js
// m1.js
export var foo = 'bar';
setTimeout(() => foo = 'baz', 500);

// m2.js
import {foo} from './m1.js';
console.log(foo);
setTimeout(() => console.log(foo), 500);
```

上面代码中，`m1.js`的变量`foo`，在刚加载时等于`bar`，过了 500 毫秒，又变为等于`baz`。

让我们看看，`m2.js`能否正确读取这个变化。

```js
$ babel-node m2.js

bar
baz
```

上面代码表明，ES6 模块不会缓存运行结果，而是动态地去被加载的模块取值，并且变量总是绑定其所在的模块。

由于 ES6 输入的模块变量，只是一个“符号连接”，所以这个变量是只读的，对它进行重新赋值会报错。

```js
// lib.js
export let obj = {};

// main.js
import { obj } from './lib';

obj.prop = 123; // OK
obj = {}; // TypeError
```

上面代码中，`main.js`从`lib.js`输入变量`obj`，可以对`obj`添加属性，但是重新赋值就会报错。因为变量`obj`指向的地址是只读的，不能重新赋值，这就好比`main.js`创造了一个名为`obj`的const变量。

最后，`export`通过接口，输出的是同一个值。不同的脚本加载这个接口，得到的都是同样的实例。

```js
// mod.js
function C() {
  this.sum = 0;
  this.add = function () {
    this.sum += 1;
  };
  this.show = function () {
    console.log(this.sum);
  };
}

export let c = new C();
```

上面的脚本`mod.js`，输出的是一个C的实例。不同的脚本加载这个模块，得到的都是同一个实例。

```js
// x.js
import {c} from './mod';
c.add();

// y.js
import {c} from './mod';
c.show();

// main.js
import './x';
import './y';
```

现在执行`main.js`，输出的是1。

```js
$ babel-node main.js
1
```

这就证明了`x.js`和`y.js`加载的都是C的同一个实例。


`js` 模块是运行时加载，`esm` 是编译时输出接口。


是因为 `cjs` 加载的是一个对象（即`module.exports`属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。



 `cjs` 模块的`require()`是同步加载模块，`esm` 的`import`命令是异步加载，有一个独立的模块依赖的解析阶段。


## 二、esm(es6模块系统)

 ES6 的模块自动采用严格模式，不管你有没有在模块头部加上`"use strict"`;。

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。

### 1. export

`export` 命令用于规定模块的对外接口，

```js
// profile.js
export var firstName = 'Michael';
export var lastName = 'Jackson';
export var year = 1958;

// 或者

// profile.js
var firstName = 'Michael';
var lastName = 'Jackson';
var year = 1958;

export { firstName, lastName, year };

```

通常情况下，export输出的变量就是本来的名字，但是可以使用as关键字重命名。

```js
function v1() { ... }
function v2() { ... }

export {
  v1 as streamV1,
  v2 as streamV2,
  v2 as streamLatestVersion
};
```
export命令规定的是对外的接口，必须与模块内部的`变量`建立一一对应关系。

```js
// 报错
export 1;

// 报错
var m = 1;
export m;
```

上面两种写法都会报错，因为没有提供对外的接口。第一种写法直接输出 1，第二种写法通过变量m，还是直接输出 1。1只是一个值，不是接口。正确的写法是下面这样。

```js
// 写法一
export var m = 1;

// 写法二
var m = 1;
export {m};

// 写法三
var n = 1;
export {n as m};
```

上面三种写法都是正确的，规定了对外的接口m。其他脚本可以通过这个接口，取到值1。它们的实质是，在接口名与模块内部变量之间，建立了一一对应的关系。

同样的，`function`和`class`的输出，也必须遵守这样的写法。

```js
// 报错
function f() {}
export f;

// 正确
export function f() {};

// 正确
function f() {}
export {f};
```

另外，`export`语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。

```js
export var foo = 'bar';
setTimeout(() => foo = 'baz', 500);
```

上面代码输出变量`foo`，值为`bar`，500 毫秒之后变成`baz`。

这一点与 CommonJS 规范完全不同。CommonJS 模块输出的是值的缓存，不存在动态更新，

最后，`export`命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内，就会报错，下一节的`import`命令也是如此。这是因为处于条件代码块之中，就没法做静态优化了，违背了 ES6 模块的设计初衷。

```js
function foo() {
  export default 'bar' // SyntaxError
}
foo()
```

上面代码中，`export`语句放在函数之中，结果报错。

### 2. import 命令

使用`export`命令定义了模块的对外接口以后，其他 JS 文件就可以通过`import`命令加载这个模块。

```js
// main.js
import { firstName, lastName, year } from './profile.js';

function setName(element) {
  element.textContent = firstName + ' ' + lastName;
}
```

上面代码的`import`命令，用于加载`profile.js`文件，并从中输入变量。`import`命令接受一对大括号，里面指定要从其他模块导入的变量名。大括号里面的变量名，必须与被导入模块`profile.js`对外接口的名称相同。

如果想为输入的变量重新取一个名字，`import`命令要使用`as`关键字，将输入的变量重命名。

```js
import { lastName as surname } from './profile.js';
```
import命令输入的变量都是只读的，因为它的本质是输入接口。也就是说，不允许在加载模块的脚本里面，改写接口。
```js
import {a} from './xxx.js'

a = {}; // Syntax Error : 'a' is read-only;
```

上面代码中，脚本加载了变量`a`，对其重新赋值就会报错，因为`a`是一个只读的接口。但是，如果`a`是一个对象，改写`a`的属性是允许的。

```js
import {a} from './xxx.js'

a.foo = 'hello'; // 合法操作
```

上面代码中，`a`的属性可以成功改写，并且其他模块也可以读到改写后的值。不过，这种写法很难查错，建议凡是输入的变量，都当作完全只读，不要轻易改变它的属性。

`import`后面的`from`指定模块文件的位置，可以是相对路径，也可以是绝对路径，`.js`后缀可以省略。如果只是模块名，不带有路径，那么必须有配置文件，告诉 JavaScript 引擎该模块的位置。

```js
import {myMethod} from 'util';
```

上面代码中，util是模块文件名，由于不带有路径，必须通过配置，告诉引擎怎么取到这个模块。

注意，`import`命令具有提升效果，会提升到整个模块的头部，首先执行。

```js
foo();

import { foo } from 'my_module';
```

上面的代码不会报错，因为`import`的执行早于foo的调用。这种行为的本质是，`import`命令是编译阶段执行的，在代码运行之前。

由于`import`是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。

```js
// 报错
import { 'f' + 'oo' } from 'my_module';

// 报错
let module = 'my_module';
import { foo } from module;

// 报错
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}
```

上面三种写法都会报错，因为它们用到了表达式、变量和if结构。在静态分析阶段，这些语法都是没法得到值的。

最后，import语句会执行所加载的模块，因此可以有下面的写法。

```js
import 'lodash';
```

上面代码仅仅执行lodash模块，但是不输入任何值。

如果多次重复执行同一句import语句，那么只会执行一次，而不会执行多次。

```js
import 'lodash';
import 'lodash';
```

上面代码加载了两次`lodash`，但是只会执行一次。

```js
import { foo } from 'my_module';
import { bar } from 'my_module';

// 等同于
import { foo, bar } from 'my_module';
```

上面代码中，虽然`foo`和`bar`在两个语句中加载，但是它们对应的是同一个`my_module`实例。也就是说，`import`语句是 `Singleton` 模式。

### 3. 模块整体加载

```js
// circle.js

export function area(radius) {
  return Math.PI * radius * radius;
}
export function circumference(radius) {
  return 2 * Math.PI * radius;
}

// main.js
import * as circle from './circle';

console.log('圆面积：' + circle.area(4));
console.log('圆周长：' + circle.circumference(14));
```
注意，模块整体加载所在的那个对象（上例是`circle`），应该是可以静态分析的，所以不允许运行时改变。下面的写法都是不允许的。

```js
import * as circle from './circle';

// 下面两行都是不允许的
circle.foo = 'hello';
circle.area = function () {};
```
### 4. export default

```js
// export-default.js
export default function () {
  console.log('foo');
}

// import-default.js
import customName from './export-default';
customName(); // 'foo'
```

用在非匿名函数前，也是可以的。

```js
// export-default.js
export default function foo() {
  console.log('foo');
}

// 或者写成

function foo() {
  console.log('foo');
}

export default foo;
```

本质上，`export default`就是输出一个叫做`default`的变量或方法，然后系统允许你为它取任意名字。所以，下面的写法是有效的。

```js
// modules.js
function add(x, y) {
  return x * y;
}
export {add as default};
// 等同于
// export default add;

// app.js
import { default as foo } from 'modules';
// 等同于
// import foo from 'modules';
```

正是因为`export default`命令其实只是输出一个叫做`default`的变量，所以它后面不能跟变量声明语句。

```js
// 正确
export var a = 1;

// 正确
var a = 1;
export default a;

// 错误
export default var a = 1;
```

上面代码中，`export default a`的含义是将变量`a`的值赋给变量`default`。所以，最后一种写法会报错。

同样地，因为`export default`命令的本质是将后面的值，赋给`default`变量，所以可以直接将一个值写在`export default`之后。

```js
// 正确
export default 42;

// 报错
export 42;
```

上面代码中，后一句报错是因为没有指定对外的接口，而前一句指定对外接口为`default`。

有了`export default`命令，输入模块时就非常直观了，以输入 `lodash` 模块为例。

```js
import _ from 'lodash';
```

如果想在一条`import`语句中，同时输入默认方法和其他接口，可以写成下面这样。

```js
import _, { each, forEach } from 'lodash';
```

对应上面代码的export语句如下。

```js
export default function (obj) {
  // ···
}

export function each(obj, iterator, context) {
  // ···
}

export { each as forEach };
```

上面代码的最后一行的意思是，暴露出`forEach`接口，默认指向`each`接口，即`forEach`和`each`指向同一个方法。

`export default`也可以用来输出类。

```js
// MyClass.js
export default class { ... }

// main.js
import MyClass from 'MyClass';
let o = new MyClass();
```

### 5. export 与 import 的复合写法

```js
export { foo, bar } from 'my_module';

// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };
```

写成一行以后，`foo`和`bar`实际上并没有被导入当前模块，只是相当于对外转发了这两个接口，导致当前模块不能直接使用`foo`和`bar`。

模块的接口改名和整体输出，也可以采用这种写法。

```js
// 接口改名
export { foo as myFoo } from 'my_module';

// 整体输出
export * from 'my_module';
```

默认接口的写法如下。

```js
export { default } from 'foo';
```

具名接口改为默认接口的写法如下。

```js
export { es6 as default } from './someModule';

// 等同于
import { es6 } from './someModule';
export default es6;
```
 同样地，默认接口也可以改名为具名接口。

```js
export { default as es6 } from './someModule';
```

ES2020 之前，有一种`import`语句，没有对应的复合写法。

```js
import * as someIdentifier from "someModule";
```

ES2020补上了这个写法。

```js
export * as ns from "mod";

// 等同于
import * as ns from "mod";
export {ns};
```

### 6. 跨模块常量

如果想设置跨模块的常量（即跨多个文件），或者说一个值要被多个模块共享，可以采用下面的写法。

```js
// constants.js 模块
export const A = 1;
export const B = 3;
export const C = 4;

// test1.js 模块
import * as constants from './constants';
console.log(constants.A); // 1
console.log(constants.B); // 3

// test2.js 模块
import {A, B} from './constants';
console.log(A); // 1
console.log(B); // 3
```

如果要使用的常量非常多，可以建一个专门的`constants`目录，将各种常量写在不同的文件里面，保存在该目录下。

```js
// constants/db.js
export const db = {
  url: 'http://my.couchdbserver.local:5984',
  admin_username: 'admin',
  admin_password: 'admin password'
};

// constants/user.js
export const users = ['root', 'admin', 'staff', 'ceo', 'chief', 'moderator'];
```
 然后，将这些文件输出的常量，合并在index.js里面。

```js
// constants/index.js
export {db} from './db';
export {users} from './users';
```

使用的时候，直接加载index.js就可以了。

```js
// script.js
import {db, users} from './constants/index';
```

### 7. import()

*  支持动态加载模块
* import()返回一个 Promise 对象。
* import()函数与所加载的模块没有静态连接关系，这点也是与import语句不相同。

import()加载模块成功以后，这个模块会作为一个对象，当作then方法的参数。因此，可以使用对象解构赋值的语法，获取输出接口。

```js
import('./myModule.js')
.then(({export1, export2}) => {
  // ...·
});
```

## 三、cjs(CommonJs)

>一个文件就是一个模块，拥有单独的作用域；\
>普通方式定义的变量、函数、对象都属于该模块内；\
>通过require来加载模块；\
>通过exports和modul.exports来暴露模块中的内容；

### 1.模块加载机制
`require`（同步加载）基本功能：读取并执行一个JS文件，然后返回该模块的`exports`对象，如果没有发现指定模块会报错;

1. 核心模块（位于`Node`的系统安装目录中）。
2. 如果是一个目录，那么`require`会先查看该目录的`package.json`文件，然后加载`main`字段指定的脚本文件。否则取不到`main`字段，则会加载`index`文件如果指定的模块文件没有发现，`Node`会尝试为文件名添加.`js`、`.json`、`.node`后，再去搜索。`.js`文件会以文本格式的JavaScript脚本文件解析，`.json`文件会以JSON格式的文本文件解析，`.node`文件会议编译后二进制文件解析。
3. 如果不是核心模块也不是一个目录
    1. 当前文件目录下的node_modules目录下；
    2. 没有符合条件的则去当前目录的父文件夹的node_modules目录下；
    3. 若没有则再往上一层目录的node_modules目录下；
    4. 若没有则重复3，直到找到符合的模块或者根目录为止。
4. 如果想得到`require`命令加载的确切文件名，使用`require.resolve()`方法。

### 2.模块的循环加载

模块可以多次加载，但只会在第一次加载的时候运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果；模块的加载顺序，按照代码的出现顺序是同步加载的; 如果发生模块的循环加载，即`A`加载`B`，`B`又加载`A`，则`B`将加载`A`的不完整版本。

```js
    // a.js
    exports.x = 'a1';
    console.log('a.js ', require('./b.js').x);
    exports.x = 'a2';

    // b.js
    exports.x = 'b1';
    console.log('b.js ', require('./a.js').x);
    exports.x = 'b2';

    // main.js
    console.log('main.js ', require('./a.js').x);
    console.log('main.js ', require('./b.js').x);
```

上面代码是三个JavaScript文件。其中，`a.js`加载了`b.js`，而`b.js`又加载`a.js`。这时，Node返回`a.js`的不完整版本，所以执行结果如下。

```js
$ node main.js
b.js  a1
a.js  b2
main.js  a2
main.js  b2
```

修改`main.js`，再次加载`a.js`和`b.js`。

```js
// main.js
console.log('main.js ', require('./a.js').x);
console.log('main.js ', require('./b.js').x);
console.log('main.js ', require('./a.js').x);
console.log('main.js ', require('./b.js').x);
```

执行上面代码，结果如下。

```js
$ node main.js
b.js  a1
a.js  b2
main.js  a2
main.js  b2
main.js  a2
main.js  b2
```
上面代码中，第二次加载`a.js`和`b.js`时，会直接从缓存读取`exports`属性，所以`a.js`和`b.js`内部的`console.log`语句都不会执行了。

### 3.模块封装器

```js
(function(exports, require, module, __filename, __dirname) {
// 模块的代码实际上在这里
});
```

### 4.模块作用域

`__dirname`：当前模块的目录名\
`__filename`：当前模块的文件名。 这是当前的模块文件的绝对路径（符号链接会被解析）\
`exports`：\
`module`：\
`require(id)`：



### 5.require对象

`require.cache` 被引入的模块将被缓存在这个对象中
`require.main` Module 对象，表示当 Node.js 进程启动时加载的入口脚本
`require.resolve(request [，options])`
使用内部的 require() 机制查询模块的位置，此操作只返回解析后的文件名，不会加载该模块
`require.resolve.paths(request)`

### 6.module 对象

每个模块都有一个`module`变量，该变量指向当前模块。`module`不是全局变量，而是每个模块都有的本地变量。所有代码都运行在模块作用域，不会污染全局作用域；

* `module.id `模块的识别符，通常是带有绝对路径的模块文件名。
* `module.filename` 模块的文件名。
* `module.loaded` 返回一个布尔值，表示模块是否已经完成加载。
* `module.parent` 返回一个对象，表示调用该模块的模块。
* `module.children` 返回一个数组，表示该模块要用到的其他模块。
* `module.exports`和 `exports`：为了方便，node为每个模块提供一个exports变量，其指向module.exports，相当于在模块头部加了这句话：var exports = module.exports，在对外输出时，可以给exports对象添加方法，PS：不能直接赋值（因为这样就切断了exports和module.exports的联系）;
* `module.paths`：模块的搜索路径。
* `module.require(id)`：`module.require()` 方法提供了一种加载模块的方法，就像从原始模块调用 require() 一样。

## 四、[AMD(异步模块定义)](https://github.com/amdjs/amdjs-api/blob/master/AMD.md)

* 它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行


## 五、[umd(通用模块规范)](https://github.com/umdjs/umd)

* 同时兼容AMD和CommonJs规范而出现
* 多被一些需要同时支持浏览器端和服务端引用的第三方库所使用

### 1.适配AMD

```js
/*
* AMD规范的模块定义格式是define(id?, dependencies?, factory),factory就是实际的模块内容
*/
(function (factory){
    //判断全局环境是否支持AMD标准
    if(typeof define === 'function' && define.amd){
        //定义一个AMD模块
        define([/*denpendencies*/],factory);
    }
}(function(/*formal parameters*/){
    //自定义模块主体的内容
    /*
        var a,b,c
        function a1(){}
        function b1(){}
        function c1(){}
        return {
           a:a1,
           b:b1
        }
     */
}))
```

### 2.适配CommonJs

```js
/*
* CommonJs规范使用require('moduleName')的格式来引用模块，
* 使用module.exports对象输出模块，
* 只要把模块的输出内容挂载到module.exports上就完成了模块定义。
*/
(function (factory){
    //判断全局环境是否支持CommonJs标准
      if(typeof exports === 'object' && typeof define !== 'function'){
             module.exports = factory(/*require(moduleA), require(moduleB)*/);
      }
}(function(/*formal parameters*/){
    //自定义模块主体的内容
    /*
        var a,b,c
        function a1(){}
        function b1(){}
        function c1(){}
        return {
           a:a1,
           b:b1
        }
     */
}))
```

### 3.总结


```js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery', 'underscore'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory(require('jquery'), require('underscore'));
    } else {
        // 浏览器全局变量(root 即 window)
        root.returnExports = factory(root.jQuery, root._);
    }
}(this, function ($, _) {
    //    方法
    function a(){};    //    私有方法，因为它没被返回 (见下面)
    function b(){};    //    公共方法，因为被返回了
    function c(){};    //    公共方法，因为被返回了

    //    暴露公共方法
    return {
        b: b,
        c: c
    }
}));

```
