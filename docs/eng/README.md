---
title: npm
---

## 配置文件 .npmrc 

.npmrc，可以理解成npm running cnfiguration, 即npm运行时配置文件。简单点说， .npmrc 可以设置 package.json 中依赖包的安装来源，既从哪里下载依赖包。

电脑中有多个 .npmrc 文件，在我们安装包的时候，npm按照如下顺序读取这些配置文件

* 项目配置文件: /project/.npmrc
* 用户配置文件：~/.npmrc
* 全局配置文件：$PREFIX/etc/npmrc
* npm 内置配置文件 /path/to/npm/npmrc


## 如何配置

以@test 开头的包从 registry=https://npm.xx.com 这里下载，其余全去淘宝镜像下载。

```js
registry=https://registry.npm.taobao.org/
@test:registry = https://npm.xx.com
```


## 使用

```
npm install
给 npm 项目添加依赖模块
npm install -g 全局安装模块
npm install -P or -S => npm install --save
npm install -D => npm install --save-dev
npm install <name>@<version> => npm install vue@2.5.16
npm install url => https://github.com/vuejs/vue/archive/v2.5.16.tar.gz or https://github.com/vuejs/vue/tarball/v2.5.16
npm install [<@scope>/]<name>@<tag> => 私有模块
npm uninstall
取消安装模块
npm uninstall -g 取消全局安装
npm uninstall -S => npm uninstall --save
npm uninstall -D => npm uninstall --save-dev
```

## publish

1. 申请用户名 npm adduser 
2. 登录 npm login 
3. 发布 npm publish



## npm exec

```sh
npm exec -- <pkg>[@<version>] [args...]
npm exec --package=<pkg>[@<version>] -- <cmd> [args...]
npm exec -c '<cmd> [args...]'
npm exec --package=foo -c '<cmd> [args...]'
# 别名: npm x
```

加上 `--` 后面的参数 都会传递给 `<pkg>`
不加   `--` 后面的参数 都会传递给 npm exec 命令里面

--package  -p   指定要安装的包

--call  -c  根据安装包的PATH，运行命令

--workspace  -w 指定工作空间

--workspaces -ws  指定多个工作空间

--include-workspace-root

## npm init(npm create)

```bash
npm init [--force|-f|--yes|-y|--scope]
npm init <@scope> (same as `npx <@scope>/create`)
npm init [<@scope>/]<name> (same as `npx [<@scope>/]create-<name>`)
```


