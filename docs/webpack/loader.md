---
title: 手写loader
index: 2
---


## loader配置
## loader使用
## 手写loader


### 两个工具库 

* `loader-utils`;
* `schema-utils`;

```js
import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';

const schema = {
  type: 'object',
  properties: {
    test: {
      type: 'string'
    }
  }
}

export default function(source) {
  const options = getOptions(this);

  validateOptions(schema, options, 'Example Loader');

  // 对资源应用一些转换……

  return `export default ${ JSON.stringify(source) }`;
};

```