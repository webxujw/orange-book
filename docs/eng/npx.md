---
title: npx
---


## npx

npm从5.25.2版开始，增加了 npx 命令。方便了我在项目中使用全局包。

### 解决的问题

使用npx可以在命令行直接执行本地已安装的依赖包命令，不用在scripts脚本写入命令，也不用麻烦的去找本地脚本。

### 原理
运行它时，执行下列流程：

1. 去node_modules/.bin路径检查npx后的命令是否存在，找到之后执行；
2. 找不到，就去环境变量$PATH里面，检查npx后的命令是否存在，找到之后执行;
3. 还是找不到，自动下载一个临时的依赖包最新版本在一个临时目录，然后再运行命令，运行完之后删除，不污染全局环境。

由于 npx 会检查环境变量$PATH，所以系统命令也可以调用。


### --no-instal

如果想让 npx 强制使用本地模块，不下载远程模块，可以使用--no-install参数。如果本地不存在该模块，就会报错。


### --ignore-existin

反过来，如果忽略本地的同名模块，强制安装使用远程模块，可以使用--ignore-existing参数。


## 使用场景总结

### 1. 使用npx执行 本地命令

```sh
npm i -D mocha
npx mocha --version
```

### 2. 使用npx一次性执行命令

```sh
npx create-react-app my-react-app
```

### 3. 使用npx切换node版本

```sh
 npx node@6 -v
```

### 4. 使用npx执行 GitHub 源码

```sh
npx github:piuccio/cowsay
```
远程代码必须是一个模块，即必须包含package.json和入口脚本

### 5. 使用npx开启一个静态服务器

```sh
npx http-server    #默认返回根目录下index.html
npx http-server -p 3000  #指定端口
```


## 已废弃

npm 已于v7.0版本废弃独立npx包。

转移到  `npm exec` 中