---
title: 前端性能优化
index: 2
---


## 前端性能优化之旅

![](/img/front.svg)

## DNS Prefetch

* DNS Prefetch 就是浏览器提供给我们的一个 API。它是 Resource Hint 的一部分。它可以告诉浏览器：过会我就可能要去 baidu.com 上下载一个资源啦，帮我先解析一下域名吧。这样之后用户点击某个按钮，触发了 yourwebsite.com 域名下的远程请求时，就略去了 DNS 解析的步骤。使用方式很简单：

```
<link rel="dns-prefetch" href="//yourwebsite.com">
```

当然，浏览器并不保证一定会去解析域名，可能会根据当前的网络、负载等状况做决定。标准里也明确写了👇

```
user agent SHOULD resolve as early as possible
```

## 预先建立连接

我们知道，建立连接不仅需要 DNS 查询，还需要进行 TCP 协议握手，有些还会有 TLS/SSL 协议，这些都会导致连接的耗时。使用 Preconnect可以帮助你告诉浏览器：“我有一些资源会用到某个源（origin），你可以帮我预先建立连接。”

根据规范，当你使用 Preconnect 时，浏览器大致做了如下处理：

* 首先，解析 Preconnect 的 url；
* 其次，根据当前 link 元素中的属性进行 cors 的设置；
* 然后，默认先将 credential 设为 true，如果 cors 为 Anonymous 并且存在跨域，则将 credential 置为 false；
* 最后，进行连接。
* 使用 Preconnect 只需要将 rel 属性设为 preconnect 即可：
```
<link rel="preconnect" href="//sample.com">
```
当然，你也可以设置 CORS：
```
<link rel="preconnect" href="//sample.com" crossorigin>
```
需要注意的是，标准并没有硬性规定浏览器一定要（而是 SHOULD）完成整个连接过程，与 DNS Prefetch 类似，浏览器可以视情况完成部分工作。

## 避免代码问题
代码问题其实就非常细节了。简单列举一些常见的问题：

* async await 的不当使用导致并行请求被串行化了；
* 频繁地 JSON.parse 和 JSON.stringify 大对象；
* 正则表达式的灾难性回溯；
* 闭包导致的内存泄漏；
* CPU 密集型任务导致事件循环 delay 严重；
* 未捕获的异常导致进程频繁退出，守护进程（pm2/supervisor）又将进程重启，这种频繁的启停也会比较消耗资源；
* ……



## 使用 defer 和 async

JavaScript 会阻塞 DOM 构建，而 CSSOM 的构建又回阻塞 JavaScript 的执行。

可以使用 defer 或 async 属性。两者都会防止 JavaScript 脚本的下载阻塞 DOM 构建。但是两者也有区别，最直观的表现如下：

![](/img/front.jpeg)