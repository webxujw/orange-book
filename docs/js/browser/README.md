---
title: 浏览器
dir:
    index: 2
    text: 浏览器相关
---


## 渲染流程

1. HTML 被 HTML 解析器解析成 DOM 树；
2. CSS  被 CSS 解析器解析成 CSSOM 树；
3. 结合 DOM 树和 CSSOM 树，生成一棵渲染树(Render Tree)，这一过程称为 Attachment；
4. 生成布局(flow)，浏览器在屏幕上“画”出渲染树中的所有节点；
5. 将布局绘制(paint)在屏幕上，显示出整个页面。

第四步和第五步是最耗时的部分，这两步合起来，就是我们通常所说的渲染。
