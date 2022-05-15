---
title: vue-router 4

---


## createRouter


```ts
export declare function createRouter(options: RouterOptions): Router
```

## createWebHistory

```ts
export declare function createWebHistory(base?: string): RouterHistory
```

|参数|	类型|	描述
|:-|:-|:-
|base	|string	|提供的可选 base。当应用程序被托管在诸如 https://example.com/folder/ 之类的文件夹中时非常有用。

```js
createWebHistory() // 没有 base，应用托管在域名 `https://example.com` 的根目录下。
createWebHistory('/folder/') // 给出的网址为 `https://example.com/folder/`
```


## createWebHashHistory
```ts
export declare function createWebHashHistory(base?: string): RouterHistory
```


|参数|	类型|	描述
|:-|:-|:-
|base|	string|	提供可选的 base。默认是 location.pathname + location.search。如果 head 中有一个 <base>，它的值将被忽略，而采用这个参数。但请注意它会影响所有的 history.pushState() 调用，这意味着如果你使用一个 <base> 标签，它的 href 值必须与这个参数相匹配 (请忽略 # 后面的所有内容)

```js
// at https://example.com/folder
createWebHashHistory() // 给出的网址为 `https://example.com/folder#`
createWebHashHistory('/folder/') // 给出的网址为 `https://example.com/folder/#`
// 如果在 base 中提供了 `#`，则它不会被 `createWebHashHistory` 添加
createWebHashHistory('/folder/#/app/') // 给出的网址为 `https://example.com/folder/#/app/`
// 你应该避免这样做，因为它会更改原始 url 并打断正在复制的 url
createWebHashHistory('/other-folder/') // 给出的网址为 `https://example.com/other-folder/#`

// at file:///usr/etc/folder/index.html
// 对于没有 `host` 的位置，base被忽略
createWebHashHistory('/iAmIgnored') // 给出的网址为 `file:///usr/etc/folder/index.html#`
```

## Composition API

### onBeforeRouteLeave 、 onBeforeRouteUpdate

添加一个导航守卫，在当前位置的组件将要离开时触发。类似于 beforeRouteLeave、beforeRouteUpdate，但它可以在任何组件中使用。当组件被卸载时，导航守卫将被移除。

```ts
//函数签名：
export declare function onBeforeRouteLeave(leaveGuard: NavigationGuard): void
export declare function onBeforeRouteUpdate(updateGuard: NavigationGuard): void
```
|参数|	类型|	描述
|:-|:-|:-
|leaveGuard|	NavigationGuard|	要添加的导航守卫
|updateGuard|	NavigationGuard|    要添加的导航守卫


### useLink

返回 v-slot API 暴露的所有内容。

```ts
export declare function useLink(props: RouterLinkOptions): {
  route: ComputedRef<RouteLocationNormalized & { href: string }>,
  href: ComputedRef<string>,
  isActive: ComputedRef<boolean>,
  isExactActive: ComputedRef<boolean>,
  navigate: (event?: MouseEvent) => Promise(NavigationFailure | void),
}
```

|参数|	类型|	描述
|:-|:-|:-
|props|	RouterLinkOptions|	props 对象可以传递给`<router-link>`。接收 Ref 和 ComputedRef

### useRoute

返回当前路由地址。相当于在模板中使用 $route。必须在 setup() 中调用。

函数签名：
```ts
export declare function useRoute(): RouteLocationNormalized
```

### useRouter

返回 router 实例。相当于在模板中使用 $router。必须在 setup() 中调用。


|属性|	类型|	描述
|:-|:-|:-
|currentRoute|`Ref<RouteLocationNormalized>`| 当前路由地址。只读的。
|options|RouterOptions| 创建 Router 时传递的原始配置对象。只读的。


#### addRoute、removeRoute
添加一条新的路由记录作为现有路由的子路由。如果路由有一个 name，并且已经有一个与之名字相同的路由，它会先删除之前的路由。

通过名称删除现有路由。

```ts
// 函数签名：
addRoute(parentName: string | symbol, route: RouteRecordRaw): () => void
addRoute(route: RouteRecordRaw): () => void
removeRoute(name: string | symbol): void
```

|属性|	类型|	描述
|:-|:-|:-
|parentName|	string | symbol	父路由记录，route 应该被添加到的位置
|route|	RouteRecordRaw|	要添加的路由记录
|name|	string | symbol	要删除的路由名称

#### beforeEach、afterEach

添加一个导航钩子，在每次导航前、后执行。返回一个删除注册钩子的函数。

```ts
beforeEach(guard: NavigationGuard): () => void
afterEach(guard: NavigationHookAfter): () => void
```

|属性|	类型|	描述
|:-|:-|:-
|guard|	NavigationHookAfter|	要添加的导航钩子


```js
router.afterEach((to, from, failure) => {
  if (isNavigationFailure(failure)) {
    console.log('failed navigation', failure)
  }
})
```

#### forward、back、go

如果可能的话，通过调用 `history.forward()`  回溯历史。相当于 `router.go(1)` 。
如果可能的话，通过调用 `history.back()` 回溯历史。相当于 `router.go(-1)` 。
允许你在历史中前进或后退。

#### push、replace

通过在历史堆栈中推送一个 entry，以编程方式导航到一个新的 URL。

```ts
push(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined>
replace(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined>
```
|属性|	类型|	描述
|:-|:-|:-
|to|	RouteLocationRaw|	要导航到的路由地址

#### beforeResolve

添加一个导航守卫，在导航即将解析之前执行。在这个状态下，所有的组件都已经被获取，并且其他导航守卫也已经成功。返回一个删除已注册守卫的函数。

```ts
beforeResolve(guard: NavigationGuard): () => void
```

|属性|	类型|	描述
|:-|:-|:-
|guard|	NavigationHookAfter|	要添加的导航钩子


```js
router.beforeResolve(to => {
  if (to.meta.requiresAuth && !isAuthenticated) return false
})
```


#### hasRoute

确认是否存在指定名称的路由。

```ts
hasRoute(name: string | symbol): boolean
```

#### getRoutes

获取所有 路由记录的完整列表。

```ts
getRoutes(): RouteRecord[]
```


#### isReady

当路由器完成初始化导航时，返回一个 Promise，这意味着它已经解析了所有与初始路由相关的异步输入钩子和异步组件。如果初始导航已经发生了，那么 promise 就会立即解析。这在服务器端渲染中很有用，可以确保服务器和客户端的输出一致。需要注意的是，在服务器端，你需要手动推送初始位置，而在客户端，路由器会自动从 URL 中获取初始位置。

```ts
isReady(): Promise<void>
```

#### onError

添加一个错误处理程序，在导航期间每次发生未捕获的错误时都会调用该处理程序。这包括同步和异步抛出的错误、在任何导航守卫中返回或传递给 next 的错误，以及在试图解析渲染路由所需的异步组件时发生的错误。


```ts
onError(handler: (error: any, to: RouteLocationNormalized, from: RouteLocationNormalized) => any): () => void
```

#### resolve

返回路由地址的标准化版本。还包括一个包含任何现有 base 的 href 属性。

```ts
resolve(to: RouteLocationRaw): RouteLocation & {
  href: string
}
```

## RouterOptions

### ①. history

```ts
history: RouterHistory
```

有两个值

* createWebHistory
* createWebHashHistory

```js
createRouter({
  history: createWebHistory(),
  // 其他配置...
})
```

### ②. linkActiveClass

用于激活的 RouterLink 的默认类。如果什么都没提供，则会使用 router-link-active。


### ③. linkExactActiveClass

用于精准激活的 RouterLink 的默认类。如果什么都没提供，则会使用 router-link-exact-active。


### ④. parseQuery、stringifyQuery

用于解析查询的自定义实现。必须解码查询键和值。参见对应的 stringifyQuery。

### ⑤. routes

应该添加到路由的初始路由列表。

### ⑥. scrollBehavior


## RouteRecordRaw

path

redirect

children


alias


name


beforeEnter

注意如果记录有重定向属性，则 beforeEnter 无效。


props

sensitive

使路由匹配区分大小写，默认为false。注意这也可以在路由级别上设置。


strict


meta


## RouteLocationRaw


## RouteLocation


## RouteLocationNormalized


## NavigationFailure


## NavigationGuard



## NavigationFailureType


## START_LOCATION

类型：RouteLocationNormalized

详细内容：

路由所在的初始路由地址。可用于导航守卫中，以区分初始导航。

```js
import { START_LOCATION } from 'vue-router'

router.beforeEach((to, from) => {
  if (from === START_LOCATION) {
    // 初始导航
  }
})
```