## tapable
![tapable](/img/tapable.webp)

* webpack本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，
* 而实现这一切的核心就是Tapable，webpack中最核心的负责编译的Compiler和负责创建bundles的Compilation都是Tapable的实例。

```js
    const {
        SyncHook,
        SyncBailHook,
        SyncWaterfallHook,
        SyncLoopHook,
        AsyncParallelHook,
        AsyncParallelBailHook,
        AsyncSeriesHook,
        AsyncSeriesBailHook,
        AsyncSeriesWaterfallHook
    } = require("tapable");

    // 所有钩子类的构造函数都接收一个可选的参数，这个参数是一个由字符串参数组成的数组，如下：

    const hook = new SyncHook(["arg1", "arg2", "arg3"]);
```

序号|钩子名称|执行方式|使用要点
:-|:-|:-|:-|
同|步||
1|SyncHook|串行|不关心监听函数的返回值
2|SyncBailHook||只要监听函数中有一个函数的返回值不为undefined，则跳过剩下所有的逻辑如类的名字，意义在于保险）
3|SyncWaterfallHook||上一个监听函数的返回值可以传给下一个监听函数,如果没有返回值或者返回undefined则传给下一个监听函数上一个函数的返回值
4|SyncLoopHook|循环|当监听函数被触发的时候，只要有一个监听函数返回true时则这个监听函数会从头开始反复执行，如果全部返回 undefined 则表示退出循环，
异|步||
5|AsyncParallelHook|并发|不关心监听函数的返回值，所有的函数都执行callback()时才会触发回调函数
6|AsyncParallelBailHook||只要监听函数的返回值不为 undefined，就会忽略后面的监听函数执行，直接跳跃到callAsync等触发函数绑定的回调函数，然后执行这个被绑定的回调函数|
7|AsyncSeriesHook|串行|只要返回值不为 undefined，就会忽略后面的监听函数执行，直接跳跃到触发函数绑定的回调函数，然后执行这个被绑定的回调函数|
8|AsyncSeriesBailHook||只要返回值不为 undefined，就会直接执行callAsync等触发函数绑定的回调函数|
9|AsyncSeriesWaterfallHook||上一个监听函数的中的callback(err, data)的第二个参数,可以作为下一个监听函数的参数,如果没有返回值或者返回undefined则传给下一个监听函数上一个函数的返回值

## 一、Tapable同步钩子

### 1. SyncHook

```js
// 原理
class SyncHook_MY{
    constructor(){
        this.hooks = [];
    }

    // 订阅
    tap(name, fn){
        this.hooks.push(fn);
    }

    // 发布
    call(){
        this.hooks.forEach(hook => hook(...arguments));
    }
}

//使用

const { SyncHook } = require("tapable");
let queue = new SyncHook(['name']); //所有的构造函数都接收一个可选的参数，这个参数是一个字符串的数组。

// 订阅
queue.tap('1', function (name, name2) {// tap 的第一个参数是用来标识订阅的函数的
    console.log(name, name2, 1);
    return '1'
});
queue.tap('2', function (name) {
    console.log(name, 2);
});
queue.tap('3', function (name) {
    console.log(name, 3);
});

// 发布
queue.call('webpack', 'webpack-cli');// 发布的时候触发订阅的函数 同时传入参数

// 执行结果:
/* 
webpack undefined 1 // 传入的参数需要和new实例的时候保持一致，否则获取不到多传的参数
webpack 2
webpack 3
*/
```

### 2. SyncBailHook

```js
//原理
class SyncBailHook_MY {
    constructor() {
        this.hooks = [];
    }

    // 订阅
    tap(name, fn) {
        this.hooks.push(fn);
    }

    // 发布
    call() {
        for (let i = 0, l = this.hooks.length; i < l; i++) {
            let hook = this.hooks[i];
            let result = hook(...arguments);
            if (result) {
                break;
            }
        }
    }
}

//使用

const {
    SyncBailHook
} = require("tapable");

let queue = new SyncBailHook(['name']); 

queue.tap('1', function (name) {
    console.log(name, 1);
});
queue.tap('2', function (name) {
    console.log(name, 2);
    return 'wrong'
});
queue.tap('3', function (name) {
    console.log(name, 3);
});

queue.call('webpack');

// 执行结果:
/* 
webpack 1
webpack 2
*/

```


### 3. SyncWaterfallHook

```js
// 原理

class SyncWaterfallHook_MY{
    constructor(){
        this.hooks = [];
    }
    
    // 订阅
    tap(name, fn){
        this.hooks.push(fn);
    }

    // 发布
    call(){
        let result = null;
        for(let i = 0, l = this.hooks.length; i < l; i++) {
            let hook = this.hooks[i];
            result = i == 0 ? hook(...arguments): hook(result); 
        }
    }
}



const {
    SyncWaterfallHook
} = require("tapable");

let queue = new SyncWaterfallHook(['name']);

// 上一个函数的返回值可以传给下一个函数
queue.tap('1', function (name) {
    console.log(name, 1);
    return 1;
});
queue.tap('2', function (data) {
    console.log(data, 2);
    return 2;
});
queue.tap('3', function (data) {
    console.log(data, 3);
});

queue.call('webpack');

// 执行结果:
/* 
webpack 1
1 2
2 3
*/


```



### 4. SyncLoopHook

```js
// 原理
class SyncLoopHook_MY {
    constructor() {
        this.hook = null;
    }

    // 订阅
    tap(name, fn) {
        this.hook = fn;
    }

    // 发布
    call() {
        let result;
        do {
            result = this.hook(...arguments);
        } while (result)
    }
}


const {
    SyncLoopHook
} = require("tapable");

let queue = new SyncLoopHook(['name']); 

let count = 3;
queue.tap('1', function (name) {
    console.log('count: ', count--);
    if (count > 0) {
        return true;
    }
    return;
});

queue.call('webpack');

// 执行结果:
/* 
count:  3
count:  2
count:  1
*/

```


## 二、Tapable异步钩子

* Async 类型可以使用 tap、tapSync 和 tapPromise 注册不同类型的插件 “钩子”
* 分别通过 call、callAsync 和 promise 方法调用

### 1. AsyncParallelHook

```js

// usage - tap

const {
    AsyncParallelHook
} = require("tapable");

let queue1 = new AsyncParallelHook(['name']);
console.time('cost');
queue1.tap('1', function (name) {
    console.log(name, 1);
});
queue1.tap('2', function (name) {
    console.log(name, 2);
});
queue1.tap('3', function (name) {
    console.log(name, 3);
});
queue1.callAsync('webpack', err => {
    console.timeEnd('cost');
});

// 执行结果
/* 
webpack 1
webpack 2
webpack 3
cost: 4.520ms
*/


// usage - tapAsync

let queue2 = new AsyncParallelHook(['name']);
console.time('cost1');
queue2.tapAsync('1', function (name, cb) {
    setTimeout(() => {
        console.log(name, 1);
        cb();
    }, 1000);
});
queue2.tapAsync('2', function (name, cb) {
    setTimeout(() => {
        console.log(name, 2);
        cb();
    }, 2000);
});
queue2.tapAsync('3', function (name, cb) {
    setTimeout(() => {
        console.log(name, 3);
        cb();
    }, 3000);
});

queue2.callAsync('webpack', () => {
    console.log('over');
    console.timeEnd('cost1');
});

// 执行结果
/* 
webpack 1
webpack 2
webpack 3
over
time: 3004.411ms
*/


// usage - promise

let queue3 = new AsyncParallelHook(['name']);
console.time('cost3');
queue3.tapPromise('1', function (name, cb) {
   return new Promise(function (resolve, reject) {
       setTimeout(() => {
           console.log(name, 1);
           resolve();
       }, 1000);
   });
});

queue3.tapPromise('1', function (name, cb) {
   return new Promise(function (resolve, reject) {
       setTimeout(() => {
           console.log(name, 2);
           resolve();
       }, 2000);
   });
});

queue3.tapPromise('1', function (name, cb) {
   return new Promise(function (resolve, reject) {
       setTimeout(() => {
           console.log(name, 3);
           resolve();
       }, 3000);
   });
});

queue3.promise('webpack')
   .then(() => {
       console.log('over');
       console.timeEnd('cost3');
   }, () => {
       console.log('error');
       console.timeEnd('cost3');
   });
/* 
webpack 1
webpack 2
webpack 3
over
cost3: 3007.925ms
*/

```

### 2. AsyncParallelBailHook


```js

// usage - tap

let queue1 = new AsyncParallelBailHook(['name']);
console.time('cost');
queue1.tap('1', function (name) {
    console.log(name, 1);
});
queue1.tap('2', function (name) {
    console.log(name, 2);
    return 'wrong'
});
queue1.tap('3', function (name) {
    console.log(name, 3);
});
queue1.callAsync('webpack', err => {
    console.timeEnd('cost');
});
// 执行结果:
/* 
webpack 1
webpack 2
cost: 4.975ms
 */

// usage - tapAsync

let queue2 = new AsyncParallelBailHook(['name']);
console.time('cost1');
queue2.tapAsync('1', function (name, cb) {
    setTimeout(() => {
        console.log(name, 1);
        cb();
    }, 1000);
});
queue2.tapAsync('2', function (name, cb) {
    setTimeout(() => {
        console.log(name, 2);
        return 'wrong';// 最后的回调就不会调用了
        cb();
    }, 2000);
});
queue2.tapAsync('3', function (name, cb) {
    setTimeout(() => {
        console.log(name, 3);
        cb();
    }, 3000);
});

queue2.callAsync('webpack', () => {
    console.log('over');
    console.timeEnd('cost1');
});

// 执行结果:
/* 
webpack 1
webpack 2
webpack 3
*/

// usage - promise

let queue3 = new AsyncParallelBailHook(['name']);
console.time('cost3');
queue3.tapPromise('1', function (name, cb) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            console.log(name, 1);
            resolve();
        }, 1000);
    });
});

queue3.tapPromise('2', function (name, cb) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            console.log(name, 2);
            reject('wrong');// reject()的参数是一个不为null的参数时，最后的回调就不会再调用了
        }, 2000);
    });
});

queue3.tapPromise('3', function (name, cb) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            console.log(name, 3);
            resolve();
        }, 3000);
    });
});

queue3.promise('webpack')
    .then(() => {
        console.log('over');
        console.timeEnd('cost3');
    }, () => {
        console.log('error');
        console.timeEnd('cost3');
    });

// 执行结果:
/* 
webpack 1
webpack 2
error
cost3: 2009.970ms
webpack 3
*/

```


### 3. AsyncSeriesHook

```js
// usage - tap

const {
    AsyncSeriesHook
} = require("tapable");

// tap
let queue1 = new AsyncSeriesHook(['name']);
console.time('cost1');
queue1.tap('1', function (name) {
    console.log(1);
    return "Wrong";
});
queue1.tap('2', function (name) {
    console.log(2);
});
queue1.tap('3', function (name) {
    console.log(3);
});
queue1.callAsync('zfpx', err => {
    console.log(err);
    console.timeEnd('cost1');
});
// 执行结果
/* 
1
2
3
undefined
cost1: 3.933ms
*/


// usage - tapAsync

let queue2 = new AsyncSeriesHook(['name']);
console.time('cost2');
queue2.tapAsync('1', function (name, cb) {
    setTimeout(() => {
        console.log(name, 1);
        cb();
    }, 1000);
});
queue2.tapAsync('2', function (name, cb) {
    setTimeout(() => {
        console.log(name, 2);
        cb();
    }, 2000);
});
queue2.tapAsync('3', function (name, cb) {
    setTimeout(() => {
        console.log(name, 3);
        cb();
    }, 3000);
});

queue2.callAsync('webpack', (err) => {
    console.log(err);
    console.log('over');
    console.timeEnd('cost2');
}); 
// 执行结果
/* 
webpack 1
webpack 2
webpack 3
undefined
over
cost2: 6019.621ms
*/


// usage - promise

let queue3 = new AsyncSeriesHook(['name']);
console.time('cost3');
queue3.tapPromise('1',function(name){
   return new Promise(function(resolve){
       setTimeout(function(){
           console.log(name, 1);
           resolve();
       },1000)
   });
});
queue3.tapPromise('2',function(name,callback){
    return new Promise(function(resolve){
        setTimeout(function(){
            console.log(name, 2);
            resolve();
        },2000)
    });
});
queue3.tapPromise('3',function(name,callback){
    return new Promise(function(resolve){
        setTimeout(function(){
            console.log(name, 3);
            resolve();
        },3000)
    });
});
queue3.promise('webapck').then(err=>{
    console.log(err);
    console.timeEnd('cost3');
});

// 执行结果
/* 
webapck 1
webapck 2
webapck 3
undefined
cost3: 6021.817ms
*/


// 原理

class AsyncSeriesHook_MY {
    constructor() {
        this.hooks = [];
    }

    tapAsync(name, fn) {
        this.hooks.push(fn);
    }

    callAsync() {
        var slef = this;
        var args = Array.from(arguments);
        let done = args.pop();
        let idx = 0;

        function next(err) {
            // 如果next的参数有值，就直接跳跃到 执行callAsync的回调函数
            if (err) return done(err);
            let fn = slef.hooks[idx++];
            fn ? fn(...args, next) : done();
        }
        next();
    }
}


```

### 4. AsyncSeriesBailHook

```js

// usage - tap
const {
    AsyncSeriesBailHook
} = require("tapable");

// tap
let queue1 = new AsyncSeriesBailHook(['name']);
console.time('cost1');
queue1.tap('1', function (name) {
    console.log(1);
    return "Wrong";
});
queue1.tap('2', function (name) {
    console.log(2);
});
queue1.tap('3', function (name) {
    console.log(3);
});
queue1.callAsync('webpack', err => {
    console.log(err);
    console.timeEnd('cost1');
});

// 执行结果:
/* 
1
null
cost1: 3.979ms
*/


// usage - tapAsync

let queue2 = new AsyncSeriesBailHook(['name']);
console.time('cost2');
queue2.tapAsync('1', function (name, callback) {
    setTimeout(function () {
        console.log(name, 1);
        callback();
    }, 1000)
});
queue2.tapAsync('2', function (name, callback) {
    setTimeout(function () {
        console.log(name, 2);
        callback('wrong');
    }, 2000)
});
queue2.tapAsync('3', function (name, callback) {
    setTimeout(function () {
        console.log(name, 3);
        callback();
    }, 3000)
});
queue2.callAsync('webpack', err => {
    console.log(err);
    console.log('over');
    console.timeEnd('cost2');
});
// 执行结果

/* 
webpack 1
webpack 2
wrong
over
cost2: 3014.616ms
*/
复制代码
usage - promise

let queue3 = new AsyncSeriesBailHook(['name']);
console.time('cost3');
queue3.tapPromise('1', function (name) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log(name, 1);
            resolve();
        }, 1000)
    });
});
queue3.tapPromise('2', function (name, callback) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log(name, 2);
            reject();
        }, 2000)
    });
});
queue3.tapPromise('3', function (name, callback) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log(name, 3);
            resolve();
        }, 3000)
    });
});
queue3.promise('webpack').then(err => {
    console.log(err);
    console.log('over');
    console.timeEnd('cost3');
}, err => {
    console.log(err);
    console.log('error');
    console.timeEnd('cost3');
});
// 执行结果：
/* 
webpack 1
webpack 2
undefined
error
cost3: 3017.608ms
*/

```


### 5. AsyncSeriesWaterfallHook

```js
usage - tap

const {
    AsyncSeriesWaterfallHook
} = require("tapable");

// tap
let queue1 = new AsyncSeriesWaterfallHook(['name']);
console.time('cost1');
queue1.tap('1', function (name) {
    console.log(name, 1);
    return 'lily'
});
queue1.tap('2', function (data) {
    console.log(2, data);
    return 'Tom';
});
queue1.tap('3', function (data) {
    console.log(3, data);
});
queue1.callAsync('webpack', err => {
    console.log(err);
    console.log('over');
    console.timeEnd('cost1');
});

// 执行结果:
/* 
webpack 1
2 'lily'
3 'Tom'
null
over
cost1: 5.525ms
*/


// usage - tapAsync

let queue2 = new AsyncSeriesWaterfallHook(['name']);
console.time('cost2');
queue2.tapAsync('1', function (name, callback) {
    setTimeout(function () {
        console.log('1: ', name);
        callback(null, 2);
    }, 1000)
});
queue2.tapAsync('2', function (data, callback) {
    setTimeout(function () {
        console.log('2: ', data);
        callback(null, 3);
    }, 2000)
});
queue2.tapAsync('3', function (data, callback) {
    setTimeout(function () {
        console.log('3: ', data);
        callback(null, 3);
    }, 3000)
});
queue2.callAsync('webpack', err => {
    console.log(err);
    console.log('over');
    console.timeEnd('cost2');
});
// 执行结果：
/* 
1:  webpack
2:  2
3:  3
null
over
cost2: 6016.889ms
*/


//usage - promise
let queue3 = new AsyncSeriesWaterfallHook(['name']);
console.time('cost3');
queue3.tapPromise('1', function (name) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log('1:', name);
            resolve('1');
        }, 1000)
    });
});
queue3.tapPromise('2', function (data, callback) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log('2:', data);
            resolve('2');
        }, 2000)
    });
});
queue3.tapPromise('3', function (data, callback) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log('3:', data);
            resolve('over');
        }, 3000)
    });
});
queue3.promise('webpack').then(res => {
    console.log(res);
    console.timeEnd('cost3');
}, err => {
    console.log(err);
    console.timeEnd('cost3');
});
// 执行结果：
/* 
1: webpack
2: 1
3: 2
over
cost3: 6016.703ms
*/


// 原理
class AsyncSeriesWaterfallHook_MY {
    constructor() {
        this.hooks = [];
    }

    tapAsync(name, fn) {
        this.hooks.push(fn);
    }

    callAsync() {
        let self = this;
        var args = Array.from(arguments);

        let done = args.pop();
        console.log(args);
        let idx = 0;
        let result = null;

        function next(err, data) {
            if (idx >= self.hooks.length) return done();
            if (err) {
                return done(err);
            }
            let fn = self.hooks[idx++];
            if (idx == 1) {

                fn(...args, next);
            } else {
                fn(data, next);
            }
        }
        next();
    }
}

```

## 三、手写webpack

## 四、手写loader

[官方API](https://webpack.docschina.org/api/loaders/)

* 是一个导出为函数的 JavaScript 模块

```js

const { getOptions } = require("loader-utils");
const validateOptions = require("schema-utils");
 
const schema = {
    type: "object",
    properties: {
        work: {
            type: 'String'
        },
        sick: {
            type: 'String'
        }
    }
};
 
module.exports = function(source) {
 
    const options = getOptions(this);
    validateOptions(schema, options, 'loader');
 
    const  {work, sick} = options;
    source = source.replace(/\[work\]/g, work).replace(/\[sick\]/g, sick);
 
    return `export default ${JSON.stringify(source)}`;
}
```

* this.callback 个可以同步或者异步调用的可以返回多个结果的函数
* this.async  告诉 loader-runner 这个 loader 将会异步地回调。返回 this.callback。
* 处理二进制数据

```js
module.exports = function(source) {
    // 在 exports.raw === true 时，Webpack 传给 Loader 的 source 是 Buffer 类型的
    source instanceof Buffer === true;
    // Loader 返回的类型也可以是 Buffer 类型的
    // 在 exports.raw !== true 时，Loader 也可以返回 Buffer 类型的结果
    return source;
};
// 通过 exports.raw 属性告诉 Webpack 该 Loader 是否需要二进制数据 
module.exports.raw = true;

// 以上代码中最关键的代码是最后一行 module.exports.raw = true;，没有该行 Loader 只能拿到字符串。
```

* 缓存加速

```js
module.exports = function(source) {
  // 关闭该 Loader 的缓存功能
  this.cacheable(false);
  return source;
};
```

* this.context：当前处理文件的所在目录，假如当前 Loader 处理的文件是 /src/main.js，则 this.context 就等于 /src。
* this.resource：当前处理文件的完整请求路径，包括 querystring，例如 /src/main.js?name=1。
* this.resourcePath：当前处理文件的路径，例如 /src/main.js。
* this.resourceQuery：当前处理文件的 querystring。
* this.target：等于 Webpack 配置中的 Target，详情见 2-7其它配置项-Target。
* this.loadModule：当 Loader 在处理一个文件时，如果依赖其它文件的处理结果才能得出当前文件的结果时， 就可以通过 this.loadModule(request: string, callback: function(err, source, * sourceMap, module)) 去获得 request 对应文件的处理结果。
* this.resolve：像 require 语句一样获得指定文件的完整路径，使用方法为 resolve(context: string, request: string, callback: function(err, result: string))。
* this.addDependency：给当前处理文件添加其依赖的文件，以便再其依赖的文件发生变化时，会重新调用 Loader 处理该文件。使用方法为 addDependency(file: string)。
* this.addContextDependency：和 addDependency 类似，但 addContextDependency 是把整个目录加入到当前正在处理文件的依赖中。使用方法为 addContextDependency(directory: string)。
* this.clearDependencies：清除当前正在处理文件的所有依赖，使用方法为 clearDependencies()。
* this.emitFile：输出一个文件，使用方法为 emitFile(name: string, content: Buffer|string, sourceMap: {...})。



## 五、手写plugin

* [Plugin API](https://webpack.docschina.org/api/plugins/)

* [compiler.hooks](https://webpack.docschina.org/api/compiler-hooks/)

* [compilation.hooks](https://webpack.docschina.org/api/compilation-hooks/)


```js

class CopyrightWebpackPlugin {

    constructor (options){
        console.log(options)
    }
	apply(compiler) {

		compiler.hooks.compile.tap('CopyrightWebpackPlugin', (compilation) => {
			console.log('compiler');
		})

		compiler.hooks.emit.tapAsync('CopyrightWebpackPlugin', (compilation, cb) => {
			debugger;
			compilation.assets['copyright.txt']= {
				source: function() {
					return 'copyright by dell lee'
				},
				size: function() {
					return 21;
				}
			};
			cb();
		})
	}

}

module.exports = CopyrightWebpackPlugin;

```