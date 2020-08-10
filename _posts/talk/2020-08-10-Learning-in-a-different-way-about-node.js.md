---
layout: post
title: 换个思路学习 nodejs
excerpt: nodejs 是一种将 JS 作为语言的 server 端开发技术 —— 说起来容易，但是真正理解起来，还是得费点时间的。因此，不同的理解方式和学习思路，对于最后学习的效率和效果都会有影响。
keywords: Node.js
categories: Node.js
word_count: true
owner: wangfupeng1988
aurl: https://github.com/wangfupeng1988/node-tutorial

---


# 换个思路学习 nodejs

nodejs 是一种将 JS 作为语言的 server 端开发技术 —— 说起来容易，但是真正理解起来，还是得费点时间的。因此，不同的理解方式和学习思路，对于最后学习的效率和效果都会有影响。nodejs 虽然说起来功能很强大，**不过现在普遍用于 web server 中，那就从这里入手最为合适**。

你会发现，从最常用的 web server 入手，逐步深入，就会遇到各个 nodejs 中的核心知识点，例如 emit stream buffer promise 等等。**遇到这些问题之后，要放在实际的 web server 场景中各个击破，这样才能深刻理解**。否则，光根据 API 看文档介绍，看过了你也不能深刻记忆，因为不知道怎么用。

文章中的示例代码在这里： [code](https://github.com/wangfupeng1988/node-tutorial/tree/master/code)。

[TOC]

#### 关于作者

作者：wangfupeng1988

- 关注作者的博客 - 《[深入理解javascript原型和闭包系列](http://www.cnblogs.com/wangfupeng1988/p/4001284.html)》《[深入理解javascript异步系列](https://github.com/wangfupeng1988/js-async-tutorial)》
- 学习作者的教程 - 《[前端JS高级面试](https://coding.imooc.com/class/190.html)》《[前端JS基础面试题](http://coding.imooc.com/class/115.html)》

#### 版权声明

本课程版权归作者所有，本次活动已获得作者授权。未经作者允许，请勿转载。

## 1. Node.js 语法特性

虽然 nodejs 也是用了 JS 标准的语法（以及 ES6 的语法规范），但是肯定有一些地方和前端 JS 不一样。因此这里简单的总结一下，只说重点，不再从头说起。

**核心内容**

- 和浏览器 JS 的不同
- 模块化
- 异步

### 1.1 和浏览器 JS 的不同

前端说的 JS ，即浏览器端运行的 JS 其实是两个标准的合并。只有这俩合起来，在实际开发中才能使用，否则：例如只讲第一个标准的话，那只能写 demo 演示一下，没法实际用。

- **ECMA 262 标准** —— 即 JS 的基本语法，如何定义变量、变量类型、原型、作用域、异步等
- **W3C 的 Web-API 标准** —— 包括 BOM DOM 操作、ajax 、存储等

而在 **nodejs 中，第一个标准，即 ECMA 262 标准继续使用，也就是 JS 基本语法继续使用**，JS 原型、异步、闭包等特性也继续保持。但是第二个标准就没法继续使用过了，例如`window` `document` `location` `getElementById`等，这些就都没有了，因为 nodejs 是 server 端的，根本没有浏览器的那些特性。但是 **nodejs 中定义了自己在 server 端特有的 API**，例如`http` `fs` `Stream` `os`等，这些都是 server 端才有的特性。

总结一下，就两点

- 继续使用 ECMA 262 标准，即 JS 的基本语法
- 定义了 server 端特性的 API ，如`http` `fs`等

### 1.2 模块化

nodejs 使用 CommonJS 模块化规范，其中会用到`require` `module.exports`关键字。归总一下，一共有三种引用场景：

#### 1.2.1 引用核心模块

比较简单，即引用 nodejs 默认提供的核心 API 。例如:

```js
var http = require('http')
var fs = require('fs')
var os = require('os')
```

#### 1.2.2 引用 npm 安装的模块

npm 安装第三发模块时，可通过加入`--save`或`--save-dev`，这样安装之后模块名称会保存在`package.json`中。然后即可根据模块名称引用刚刚安装的模块，常见的有：

```js
var lodash = require('lodash')
var React = require('react')
var webpack = require('webpack')
```

#### 1.2.3 引用自定义的模块

以上`require`的时候都是输入名称，也可以输入相对路径来引用自己定义的模块。自己新建一个文件`a.js`，内容为

```js
module.exports = function (info) {
    console.log(info)
}
```

然后新建一个文件`b.js`（和`a.js`同目录），内容为

```js
var a = require('./a.js') // 引用自定义模块 a.js
a('hello world')
```

`node b.js`，即可看到效果。

#### 1.2.4 附：解答一个疑问

这里有一个问题，按照 JS 语法来说，以上代码中 `require` `module.exports` 都是未定义的变量，应该会报错的。其实，**在编译过程中，nodejs 会获取这段代码，然后进行一个函数封装**，然后变成这样，问题就解决了。

```js
// 上面提出的未定义的变量，都是函数的参数，是执行时被传入的
// 同理的还是 __filename, __dirname
(function (exports, require, module, __filename, __dirname) {
    var fs = requre('fs')
    module.exports = function () {
        console.log(__dirname)
        console.log(__filename)
    }
})
```

这就算是一个意外收获了，不过遇到问题还是要多考虑一下原型。

### 1.3 异步

这里提出“异步”，并不是要讲什么新内容，而是着重提示：接下来的讲解，会用到很多异步的知识，因此异步必须要掌握全面。提醒一下，还不了解的同学尽快去补充学习：

- 异步和同步的区别
- 异步和单线程
- event loop
- callback 方式
- Promise
- async/await

可阅读作者写的 [深入理解 JS 异步](https://github.com/wangfupeng1988/js-async-tutorial)。

## 2. web 应用

web server 其实就是讲 server 如何处理 http 请求，因为所谓的 web 就是一个一个的 http 请求，server 端拿到请求信息、计算处理、最后返回。http 标准的内容比较多，本文只讲教程相关的部分，推荐看作者写的 [《图解 http》读书笔记](https://github.com/wangfupeng1988/read-notes/blob/master/book/%E5%9B%BE%E8%A7%A3http.md) 去全面了解 http —— 如果想最！最！最！全面了解，那只能去购买《http 权威指南》阅读了，厚厚的枕头书。

**核心内容**

- 基本使用
- url 参数处理
- 路由
- cookie
- 上传文件
- 框架
- 中间件
- 页面渲染
- 问题总结

### 2.1 基本使用

#### 2.1.1 从 demo 到 http 协议

新建`demo1.js`，内容如下：

```js
var http = require('http')

function serverCallback(req, res) {
    res.writeHead(200, {'Content-type': 'text/html'})
    res.write('<h1>hello nodejs</h1>')
    res.end()
}
http.createServer(serverCallback).listen(8080)
```

命令行运行`node demo1.js`，然后浏览器访问`http://localhost:8080/`（或者命令行`curl http://localhost:8080/`）即可看到结果。这一般是介绍 nodejs 入门的常用 demo ，熟悉 http 协议的同学都知道，这其实就是一个简单的 http 请求处理。

`req`即 request 即请求内容，demo 没有代码演示，下文会补充上。例如`req.method`可以获取请求的方法（如`GET` `POST`等），`req.headers`可获取请求的头，如`accept` `host` `user-agent`等。

`res`即 response 即返回内容，这是 http 请求最基本的内容。`res.writeHead`定义返回的头，包括返回状态码和头信息。`res.write`定义返回的内容，最后`res.end()`表示 server 端处理请求结束。

> PS：这里不会专门讲解 http 协议的细节，不熟悉的同学请看看本文一开始推荐的博客和书籍

#### 2.1.2 POST 请求

上述处理 get 请求比较简单，能体现 http 协议处理的地方也有限。接下来继续了解一下 nodejs 如何处理 post 请求。

```js
var http = require('http')

function serverCallback(req, res) {
    var method = req.method.toLowerCase() // 获取请求的方法
    if (method === 'get') {
        // 省略 3 行，上文代码示例中处理 GET 请求的代码
    }
    if (method === 'post') {
        // 接收 post 请求的内容
        var data = ''
        req.on('data', function (chunk) {
            // “一点一点”接收内容
            data += chunk.toString()
        })
        req.on('end', function () {
            // 接收完毕，将内容输出
            res.writeHead(200, {'Content-type': 'text/html'})
            res.write(data)
            res.end()
        })
    }
    
}
http.createServer(serverCallback).listen(8080)
```

以上代码即可接收和处理 post 请求，代码中`req.on('data' ...`和`req.on('end', ...`这里，我们作为遗留问题，后面会详细重点的讲解，因为这些也是 nodejs 的重要知识，必须学会的。这里你看下代码注释，只要先知道，post 过来的内容是“一点一点”接收的，然后待接受完再做处理，这样即可。

可以命令行运行`curl -d "a=100&b=200" "http://localhost:8080/"`发起一个 post 请求，其中`a=100&b=200`是请求的主体内容。

#### 2.1.3 querystring 处理

以上 post 请求的内容格式是 querystring 形式的，即`key1=value1&key2=value2&key3=value3`这种，可以对代码进行改造，将这些数据结构化。

第一，代码最上面加`var querystring = require('querystring')`，引入`querystring`模块，nodejs 自带的。第二，对`req.on('end', ...`的内容做如下修改：

```js
req.on('end', function () {
    // res.writeHead(200, {'Content-type': 'text/html'})
    // res.write(data)
    data = querystring.parse(data) // 结构化为 JSON 格式
    res.writeHead(200, {'Content-type': 'application/json'})  // 返回头，改为 JSON 格式
    res.write(JSON.stringify(data)) // res 只能输出字符串或者 Buffer 类型，因此这里只能 JSON.stringify 之后再输出
    res.end()
})
```

#### 2.1.4 post 内容为 JSON 格式

以上 post 请求的内容格式是 querystring 形式，一般用于网页的`<form>`提交，打印`req.headers['content-type']`的值是`application/x-www-form-urlencoded`，即是`<form>`提交的方式 —— 虽然是用`curl`模拟的。

而现在网页中数据提交大部分使用 ajax ，数据格式也改为了 JSON 格式，且看 nodejs 如何处理

```js
var http = require('http')

function serverCallback(req, res) {
    var method = req.method.toLowerCase()
    var contentType = req.headers['content-type']
    if (method === 'post') {
        if (contentType === 'application/x-www-form-urlencoded') {
            // 省略 N 行
        }
        if (contentType === 'application/json') {
            var data = ''
            req.on('data', function (chunk) {
                data += chunk.toString()
            })
            req.on('end', function () {
                data = JSON.parse(data) // post 的数据为 JSON 格式，因此直接可以转换为 JS 对象
                res.writeHead(200, {'Content-type': 'application/json'})
                res.write(JSON.stringify(data)) // res 只能输出字符串或者 Buffer 类型，因此这里只能 JSON.stringify 之后再输出
                res.end()
            })
        }
    }
    
}
http.createServer(serverCallback).listen(8080)
```

可以使用`curl -l -H "Content-type: application/json" -X POST -d '{"name":"zhangsan","age":25}' http://localhost:8080/`发起 post 请求，并且规定格式为 JSON，内容即`{"name":"zhangsan","age":25}`

#### 2.1.5 小结

之前学习其他后端语言可能没这么费劲，接触不到这么底层的 http 协议的操作，那是因为它们都已经做好了框架的封装，并不是它们真的不需要。通过 nodejs 学习一下 http 协议的具体操作也绝对是好事一桩，不要抱怨。

另外，nodejs 虽然没有提供官方的 web 框架，但是也不会傻乎乎的在项目中直接写这么底层的代码，下文会介绍 nodejs 社区中非常成熟的 web 框架，到时候这些 http 协议的操作，也都有简单的 API 可使用。

### 2.2 url 参数处理

通过`req.url`可以获得请求网址的完整内容，其中比较重要的就是：路由和参数。路由下文讲，先说参数的处理。

完整的 url 肯定是字符串形式的，是非结构化的，要想结构化需要引入 nodejs 提供的`url`模块，即`var url = require('url')`，然后通过`var urlData = url.parse(req.url)`进行结构化。

从结构化之后的数据中，通过`urlData.query`即可轻松拿到 url 参数。代码示例如下：

```js
var http = require('http')
var url = require('url')

// 处理 url 参数
function serverCallback(req, res) {
    var urlData = url.parse(req.url) // 结构化 url 内容，变为 JS 对象
    var query = urlData.query
    console.log(query)

    // ……
}
http.createServer(serverCallback).listen(8080)
```

但是得到的 url 参数还是字符串，非结构化的，不好处理。这里引用`var querystring = require('querystring')`，然后`query = querystring.parse(query)`即可了。完整代码如下：

```js
var http = require('http')
var url = require('url')
var querystring = require('querystring')

// 处理 url 参数
function serverCallback(req, res) {
    var urlData = url.parse(req.url) // 结构化 url 内容，变为 JS 对象
    var query = urlData.query
    query = querystring.parse(query)  // 结构化 query 内容，变为 JS 对象

    res.writeHead(200, {'Content-type': 'text/html'})
    res.write(JSON.stringify(query))
    res.end()
}
http.createServer(serverCallback).listen(8080)
```

使用`curl http://127.0.0.1:8080/?a=1&b=2`即可看到结果。

### 2.3 路由

通过`urlData.query`可以获取 url 参数，通过`urlData.pathname`可以获取路由，代码如下

```js
var http = require('http')
var url = require('url')

function serverCallback(req, res) {
    var urlData = url.parse(req.url)
    var pathname = urlData.pathname // 获取 url 路由

    res.writeHead(200, {'Content-type': 'text/html'})
    res.write(pathname)
    res.end()
}
http.createServer(serverCallback).listen(8080)
```

可以通过`curl curl http://127.0.0.1:8080/api/getname`来验证。

这里演示比较简单，但是路由处理却是 web server 中非常重要而且应用场景非常复杂的模块，而且路由如何设计也非常重要。其复杂性可以总结以下几点（未考虑到的欢迎补充）：

- **不同的 method**：如针对`/api/getname`，get 方法请求和 post 方法请求，要能区分开来
- **不同的参数规则**：如`/api/getname/:id`表示必须有`id`参数，`/api/getname(/:id)`表示`id`可有可无
- **层级关系**：如`/api/getname`和`/api/setname`都有`api`这个层级，要能支持两者共享流程
- ……

（是很复杂吧？）因此，一般路由的处理，都会根据一个 web 框架选择比较成熟的路由库，如 [koa-router](https://www.npmjs.com/package/koa-router) 。

**【以下为扩展内容】**

路由设计，当下比较流行`RESTful API`的思想。简单说来，就是将每个 url 都当做一个独立的资源，通过 method 规定这次请求的操作方式，如`get` `post` `put` `delete`等。有点类似于 linux 将所有内容都抽象为文件，都符合标准输入输出。如下代码：

```js
router
  .get('/', (ctx, next) => {
    ctx.body = 'Hello World!';
  })
  .post('/users', (ctx, next) => {
    // ...
  })
  .put('/users/:id', (ctx, next) => {
    // ...
  })
  .del('/users/:id', (ctx, next) => {
    // ...
  })
  .all('/users/:id', (ctx, next) => {
    // ...
  });
```

`RESTful API`设计思想给出了 API 设计的标准，前端数据请求也将因此而更加规整，后续肯定会慢慢推广普及开来。

### 2.4 cookie

```js
var http = require('http')

function serverCallback(req, res) {
    res.writeHead(200, {
        'Content-type': 'text/html',
        // 'Set-Cookie': 'a=100'           // 设置单个值
        'Set-Cookie': ['a=100', 'b=200']   // 这是多个值
    })
    res.write('hello nodejs')
    res.end()
}
http.createServer(serverCallback).listen(8080)
```

以上代码演示了如何`Set-Cookie`，浏览器访问`http://localhost:8080/`之后，前端即存储了 cookie 。然后再次访问，看通过`req.headers.cookie`获取到 cookie 内容。

cookie 的知识都是 http 协议的内容，这里几个 API 不足以涵盖，不熟悉的同学要去学习 http 协议的知识。cookie 是网络请求中非常重要的内容，必须掌握。

**【扩展】**

cookie 应用比较典型的场景是 —— 登录。而且，cookie 要结合 server 端的 session 才能完成整个登录的功能。这是一个比较复杂而且独立的场景，具体使用应该放在一个实战项目中讲解更为合适，这里不详细赘述。

简单描述一下。前端通过登录表单将用户名和密码发送到 server 端，server 端如果验证成功，即通过`Set-Cookie`设置一个`cookie`值，如`session_id=xxxx`，并且设置 20分钟 有效期，以及`httpOnly`（前端 JS 不能访问）。以后每次网络请求，server 端都通过判断是否有`session_id`来确定用户是否登录，以及通过`session_id`的值，对应到内存中的一些数据，这些数据即 server 端未用户存储的信息。

针对登录场景操作 cookie 和 session ，针对 web 框架有专门的工具供使用，不用自己手动写。例如 [koa-session](https://www.npmjs.com/package/koa-session)

### 2.5 上传文件

HTML 中普通表单和特殊表单的区别就在于是否有`<file>`标签。如果需要有`<file>`标签，就需要指定表单需求 **`enctype`为`multipart/form-data`**

```html
<form action="/upload" method="post" enctype="multipart/form-data">
    <input ... >
    <file ... >
</form>
```

nodejs 可判断`Content-type`值为`multipart/form-data`来确定是文件上传的请求。这是一个比较特殊的场景，特别是在互联网 web server 中，nodejs 用来做上传文件的接口是否合适还需论证。如果真的有地方需要用，推荐使用 [formidable](https://www.npmjs.com/package/formidable) 工具，比较简单。

### 2.6 框架

nodejs 的 web server 框架，比较常用的有 [express](http://www.expressjs.com.cn/) 和 [koa](https://koa.bootcss.com/) ，两者使用起来差别不是特别大 —— 因为两者的作者是同一个人（或者同一个团队）。两者的不同如下：

- **这对异步**：koa 支持最新的 ES7 草案中`async/await`语法，express 还是用的 callback 形式
- **社区**：express 社区更加完善，插件更多；koa 相对来说社区、插件都少一些，不过发展这些年了也能满足日常需求

如果项目要做选择，我会这么推荐：

- 中小型项目，允许尝试新技术、踩新坑，船小也好调头，推荐使用 koa
- 大型项目，时间紧急，满足需求和稳定第一，那就使用 express

但是我们作为前端程序猿，两者必须都了解，不熟悉的同学至少要去官网看下文档，做几个 demo 玩一玩。

### 2.7 中间件

框架提供给开发者的便利的地方有：

- 封装`req`和`res`接口
- 封装路由处理
- 提供中间件机制

其中，中间件对于我们前端开发者来说，算是一个比较新的概念（虽然它早就存在）。简单说来，中间件就是将一次请求的处理拆分成许多小部分，分而治之。这样做完全符合开放封闭原则，可以复用也可以扩展。例如 express 的代码示例

```js
var app = express();

// 没有挂载路径的中间件，应用的每个请求都会执行该中间件
app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

// 挂载至 /user/:id 的中间件，任何指向 /user/:id 的请求都会执行它
app.use('/user/:id', function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

// 路由和句柄函数(中间件系统)，处理指向 /user/:id 的 GET 请求
app.get('/user/:id', function (req, res, next) {
  res.send('USER');
});
```

express 总结的中间件有以下几种：

- **应用级中间件** 公共功能的中间件，例如日志记录、获取公共数据
- **路由级中间件** 针对路由不同功能的中间件，用于业务处理
- **错误处理中间件** 用于捕获异常
- **内置中间件** 最常用的中间件，例如`express.static`是 express 内置的中间件，用于返回静态文件
- **第三方中间件** 一个框架要保证扩展性，肯定得支持第三方开发者贡献自己的代码

本文主要讲解 nodejs 基础知识，框架的内容不会详细介绍，可以自己去看文档。

### 2.8 页面渲染

nodejs 没有御用的模板引擎，这一点不像 php asp jsp 等，需要自己去选择，例如 artTemplate 。书中也简单讲解了实现一个模板引擎的逻辑，我之前了解过 vue 中模板的解析，因此对这块逻辑也不算陌生。另外，模板解析的逻辑，大概了解即可，也无需详细深入，毕竟是工具性的东西。这里先略过。

**【扩展】Bigpipe**

普通的页面渲染，即便是首屏渲染，也是拿到所有该拿的数据之后，一次性吐出给前端。**而 Bigpipe 是将页面内容分成了多个部分（pagelet），然后分批逐步输出**。

首先，要向前端输出模板和接收 pagelet 的方法，其实就是一个 JS 方法，该方法接收 DOM 选择器和内容，然后将内容渲染到 DOM 节点中。接下来，server 端异步请求数据，然后分批输出到前端去渲染，如下代码。nodejs 异步请求是部分顺序的，因此下面两个异步，哪个先输出不知道——也无需知道，先查询出来的先输出即可。

```js
app.get('/profile', function (req, res) {
    var num = 0
    db.getData('sql1', function (err, data) {
        res.write('<script>bigpipe.set("articles", "' + JSON.stringify(data) + '")</script>')
        num++
        if (num === 2) {
            res.end()  // 结束请求
        }
    })
    db.getData('sql2', function (err, data) {
        res.write('<script>bigpipe.set("copyright", "' + JSON.stringify(data) + '")</script>')
        num++
        if (num === 2) {
            res.end()  // 结束请求
        }
    })
})
```

这种多 pagelet 分批下发的方式，ajax 也可以办到。但是 ajax 每次都是一个独立的 http 请求，而 Bigpipe 共用相同的请求，开销十分小。

### 2.9 遗留问题

上文中，有一段`req.on('data' ...`和`req.on('end', ...`代码没有详细介绍，现在关注两点：

- `req.on`这里的`on`是特定的吗？
- 这里的`data`和`end`是特定的吗？

下面将用两节内容讲解这两个疑问。

## 3. 事件

本节解决上一节遗留的第一个问题 —— “`req.on`这里的`on`是特定的吗？”

```js
req.on('data', function (chunk) {

})
req.on('end', function () {

})
```

以上代码的格式其实应该比较熟悉的，和前端用 jQuery 绑定事件类似

```js
$('#btn1').on('click', function (event) {

})
```

这两点能对应起来，就好说了。

**核心内容**

- 观察者模式
- EventEmitter 基本使用
- EventEmitter 继承
- 总结

### 3.1 观察者模式

作为程序猿多少要了解 23 种设计模式，其中观察者模式是非常重要的一个。简单说来，就是定义好监听的操作，然后等待事件的触发。前端开发中，有不少地方能体现观察者模式。最简单的例如绑定事件：

```js
$('#btn1').on('click', function (event) {
    alert(1)
})
$('#btn1').on('click', function (event) {
    alert(2)
})
```

比较复杂的例如 vue 中，修改`data`之后，会立刻出发视图重新渲染，这也是观察者模式的应用。

### 3.2 EventEmitter 基本使用

nodejs 中的自定义事件也是观察者模式的一种体现，而且自定义事件常见于 nodejs 的各个地方。先看一个简单示例

```js
const EventEmitter = require('events').EventEmitter

const emitter1 = new EventEmitter()
emitter1.on('some', () => {
    // 监听 some 事件
    console.log('some event is occured 1')
})
emitter1.on('some', () => {
    // 监听 some 事件
    console.log('some event is occured 2')
})
// 触发 some 事件
emitter1.emit('some')
```

以上代码中，先引入 nodejs 提供的`EventEmitter`构造函数，然后初始化一个实例`emitter1`。实例通过`on`可监听事件，`emit`可以触发事件，事件名称可以自定义，如`some`。

自定义事件触发的时候还可传递参数，例如

```js
const emitter = new EventEmitter()
emitter.on('sbowName', name => {
    console.log('event occured ', name)
})
emitter.emit('sbowName', 'zhangsan')  // emit 时候可以传递参数过去
```

还有自定义事件的异常捕获，如下形式：

```js
// 例四
const emitter1 = new EventEmitter()
emitter1.on('some', () => {
    console.log('11111')
})
emitter1.on('some', () => {
    console.log('22222')
    throw new Error('自定义错误') // 触发过程中抛出错误
})
emitter1.on('some', () => {
    console.log('33333')
})
try {
    emitter1.emit('some')
} catch (ex) {
    console.log(ex.stack)  // 可以捕获到事件执行过程中的错误
}
console.log('after emit')
```

再次回顾上一节的`req.on('data' ...`和`req.on('end', ...`，和这里是一样的，就是监听`data`和`end`两个事件。但是，上文是`EventEmitter`实例才有这样的功能，`req`并没有看到是`EventEmitter`的实例 —— 下文解惑。

### 3.3 EventEmitter 继承

上文说到`EventEmitter`实例有`on`和`emit`接口，其实自定义 class 的实例也可以有，只不过需要继承`EventEmitter`。使用 ES6 的继承语法很容易实现

```js
// 任何构造函数都可以继承 EventEmitter 的方法 on emit
class Dog extends EventEmitter {
    constructor(name) {
        super()
        this.name = name
    }
}
var simon = new Dog('simon')
simon.on('bark', function () {
    console.log(this.name, ' barked')
})
setInterval(() => {
    simon.emit('bark')
}, 500)
```

这么说，`req.on('data' ...`和`req.on('end', ...`中，其实`req`的构造函数已经继承了`EventEmitter`，因此`req`才会有`on`接口。

### 3.4 小结

本节介绍了`EventEmitter`的使用，并顺带解释了`req.on('data' ...`和`req.on('end', ...`中的`on`。以后只要看到`xxx.on()`和`xxx.emit()`，就应该想到这里的自定义事件。

## 4. Stream 和 Buffer

本节解决 [web 应用](./02-web-应用.md) 这一节最后的遗留问题“**这里的`data`和`end`是特定的吗？**”

```js
req.on('data', function (chunk) {
    // “一点一点”接收内容
    data += chunk.toString()
})
req.on('end', function () {

})
```

上一节解决了`on`这个 API ，知道是自定义函数，但是这里的`data`和`end`又是哪里规定的，以及代码注释中的`“一点一点”接收内容`又是什么意思，本节将通过 Stream 来解惑。

另外，本文不会非常全面的介绍 Stream ，只会从 web server 的角度讲解最常用、最容易理解的 Stream 的功能。**全面了解 Stream 欢迎移步 stream-handbook 这篇经典博客**，[英文原文](https://github.com/substack/stream-handbook) [中文翻译](https://github.com/jabez128/stream-handbook)。

**核心内容**

- 为何要“一点一点”的？
- 如何才能“一点一点”的？
- “流”
- 从哪里来？
- 到哪里去？
- 有没有中转站？
- 是什么在流动？
- 总结（回顾问题）

### 4.1 为何要“一点一点”地？

你去视频网站看电影，去下载比较大的软件安装包，或者上传电影、软件包到云盘，这些文件都是动辄几个 G 大小，对吧？然而，我们的内存、网络、硬盘读写都是有速度或者大小的限制的，不可能随便的“生吞活剥”任何大文件，于是不得不“一点一点”地。

就像我们吃东西。我们牙齿的咀嚼食物的速度是有限制的，食道和食管也是有限制的，这种情况下，我们吃任何大小的东西，都得“一点一点”的来，无论是大馒头还是小包子。

专业一点说：**一次性读取、操作大文件，内存和网络是“吃不消”的**。

### 4.2 如何才能“一点一点”地？

```js
req.on('data', function (chunk) {
    // “一点一点”接收内容
    data += chunk.toString()
})
req.on('end', function () {

})
```

如上代码，我们已经知道了`on`是监听事件的触发，分别监听`data`和`end`两个事件。顾名思义，`data`就是有数据传递过来的事件，`end`就是结束的事件。那就可以通过这段代码回答这个问题。

如何做到“一点一点”地？—— **有数据传递过来就触发`data`事件，接收到这段数据，暂存下来，最后待数据全部传递完了触发`end`事件**。为何要在上一节先把事件机制给讲了？因为这儿就是一句事件机制才能实现。

### 4.3 流

上面说的这种“一点一点”的操作方式，就是“流”，Stream 。它并不是 nodejs 独有的，而是系统级别的，linux 命令的`|`就是 Stream ，因此所有 server 端语言都应该实现 Stream 的 API 。

我们用桶和水来做比喻还算比较恰当（其实计算机中的概念，都是数学概念，都是抽象的，都无法完全用现实事务做比喻），如下图。数据从原来的 source 流向 dest ，要向水一样，慢慢的一点一点的通过一个管道流过去。

![](https://camo.githubusercontent.com/ef6cc021566049c227c5cec1401d573e26af2be7/68747470733a2f2f696d61676573323031382e636e626c6f67732e636f6d2f626c6f672f3133383031322f3230313830322f3133383031322d32303138303232323137333734313635322d3937383536353638312e706e67)

上图是一个完整的流程，对于流的操作，不一定必须完整。如上文的代码，我们仅仅实现了 source 的出口部分，管道和 dest 都没有实现。即，我们通过`data`和`end`事件能监听数据的流出或者来源，然后拿到流出的数据我们做了其他处理。

### 4.4 从哪里来

上文和上图都说，数据从一个地方“流”向另一个地方，那先看看数据的来源。大家先想一下，作为一个 server 端的程序，我们一般能从哪些地方能接受到数据，或者数据能从哪些地方“流”出来？（我想了一下，就想到下面三个常用的，如果有其他的后面再补充吧）

- http 请求，上文代码的`req`
- 控制台，标准输入 stdin
- 文件，读取文件内容

其实，所有的数据来源，都可以用 Stream 来实现。下面挨个看一下，体会一下 Stream 是怎么参与进来的：

#### 4.4.1 http req

再次回顾上文代码，看 Stream 是如何“一点一点”获取 req 数据的

```js
req.on('data', function (chunk) {
    // “一点一点”接收内容
    data += chunk.toString()
})
req.on('end', function () {

})
```

#### 4.4.2 控制台输入

nodejs 作为 web server ，基本不会用到控制台输入的功能，但是为了验证 Stream 的使用，这里就简单弄个 demo 演示一下：

```js
process.stdin.on('data', function (chunk) {
    console.log(chunk.toString())
})
```

自己去运行一下看看结果，每输入一行就会输出相同内容。这就证明每次输入之后，都会触发`data`事件，用到了 Stream 。

#### 4.4.3 读取文件

为何使用 Stream 的道理，上文讲的很清楚了，因此在读取文件中就直接使用了，不再解释。

```js
var fs = require('fs')
var readStream = fs.createReadStream('./file1.txt')  // 读取文件的 Stream

var length = 0
readStream.on('data', function (chunk) {
    length += chunk.toString().length
})
readStream.on('end', function () {
    console.log(length)
})
```

如上代码，要用 Stream 那就肯定不能直接使用`fs.readFile`了，而是使用`fs.createReadStream` 。它返回的是一个 Stream 对象，通过监听其`data`和`end`来处理相关操作。

#### 4.4.4 Readable Stream

以上提到的所有能产出数据的 Stream 对象，都叫做 Readable Stream ，即可以从中读取数据的 Stream 对象。Readable Stream 对象可以监听`data` `end`事件，还有一个`pipe` API（下文会重点介绍）。你可以通过 [构造函数](http://nodejs.cn/api/stream.html#stream_implementing_a_readable_stream) 来实现一个自定义的 Readable Stream （上文三个也不过是继承、实现了这个构造函数而已）。不过一般情况下，我们无需这么做，因此这里了解一下即可。

### 4.5 到哪里去

知道了从哪里来，就得知道往哪里去。还是同样的思考方法，想一下一个 server 端程序，数据通常会“流”向何方？

- 控制台，标准输出
- 文件，写入文件内容
- http 请求，res

同理，涉及到数据“流”入的程序，也都可以用 Stream 来操作，而且要介绍一个新的 API —— **`pipe` ，它会自动将数据从 srouce 导流向 dest** ，就上上文的图一样。可以通过下面的例子来体会。

#### 4.5.1 控制台，标准输出

```js
process.stdin.pipe(process.stdout)
```

拿这句代码是对比上文中的图（source 管道流向 dest），是不是一样？从中体会一下`pipe`的作用，有了`pipe`我们就不用去关心下面代码中的`chunk`了（关于`chunk`是什么，下文会详细介绍，暂时先不管），也不用去手动监听`data` `end`事件了。

```js
process.stdin.on('data', function (chunk) {
    console.log(chunk.toString())
})
```

#### 4.5.2 写入文件

```js
var fs = require('fs')
var readStream = fs.createReadStream('./file1.txt')
var writeStream = fs.createWriteStream('./file2.txt')
readStream.pipe(writeStream)
```

`fs.createReadStream`可以创建一个文件的可读流，对应的`fs.createWriteStream`可以创建一个可写流，通过`pipe`将他们联通。这样它们就能像上文图中那样，数据从`file1.txt`通过一根管子一点一点的流向了`file2.txt`。

这就是复制大文件的方式，**不是先读后写，而是边读边写……**

#### 4.5.3 http res

根据上面两个 demo 下面的代码应该也比较好理解了，下面的代码写的就是读取`file1.txt`内容然后通过 http 协议返回。浏览器访问`http://localhost:8080/`即可看到效果，很简单。

```js
var http = require('http')
var fs = require('fs')
function serverCallback(req, res) {
    var readStream = fs.createReadStream('./file1.txt')
    res.writeHead(200, {'Content-type': 'text/html'})
    readStream.pipe(res)
}
http.createServer(serverCallback).listen(8080)
```

我们来将这段代码和 [web 应用](./02-web-应用.md) 这一节中的 demo ，关键代码对比一下

```js
// 之前的 demo
res.writeHead(200, {'Content-type': 'text/html'})
res.write('hello nodejs')
res.end()

// 这里的代码
var readStream = fs.createReadStream('./file1.txt')
res.writeHead(200, {'Content-type': 'text/html'})
readStream.pipe(res)
```

对比看来，`res.writeHead`该怎么写还是怎么写，不受影响。主要的就是之前的`res.write('hello nodejs')`换成了`readStream.pipe(res)`，之前是一次性输出内容，现在是通过 Stream 一点一点输出内容。

最后，之前的`res.end()`在当前的代码中没写，不过不会影响我们代码的运行，因为`readStream.pipe(res)`执行的时候，会自动监听到`end`事件然后执行`res.end()`，因此不需要我们手动再写一遍。

> PS：在下文我们会提到，使用 Stream 处理 http res 会提高性能。因为这样直接输出的是二进制，而`res.write('hello nodejs')`输出的是字符串，还得经过编码转换。这里先提一句，下文再详细说。

#### 4.5.4 Writable Stream

对比上文的 Readable Stream ，这里能接收数据“流”入的对象，都称为 Writable Stream 。Writable Stream 对象能作为参数传递给`pipe`方法，能接收数据。你可以通过 [构造函数](http://nodejs.cn/api/stream.html#stream_implementing_a_writable_stream) 实现自己的 Writable Stream 对象，上面讲到的三个也都是继承、实现构造函数。不过一般情况下我们无需这么做，了解即可。

#### 4.5.5 再看`pipe`

`pipe`的使用有严格要求。例如`a.pipe(b)`时，`a`必须是一个可读流，即 Readable Stream 对象（或具有相同功能的对象），而`b`必须是一个可写流，即 Writable Stream 对象（或者有相同功能的对象），否则会报错。

这里“或者有相同功能的对象”卖了个关子，见下文。

### 4.6 有没有中转站？

数据从来源流出来，然后直奔目的地而去，这种直来直去的模式肯定是不能满足所有应用场景的。就像上文图中，水从 source 直接流向 dest 其实是没有意义的，如果中间再能加一些东西（如过滤杂质、增加微量元素、高温杀菌等）那就有意义了。

#### 4.6.1 既可读又可写

上文提到，Readable Stream 对象是可读流，数据能从其中“流”出，Writable Stream 对象是可写流，数据能“流”向其中。其实，还有一种类型的流，具备两者的功能 —— Duplex Stream ，双工流，既可读又可写。这样说来，Duplex Stream 对象既可以有`pipe`接口，又可以作为`pipe`方法的参数。即：

```js
// 其中 b c d 是 Duplex Stream 对象，双工流
process.stdin.pipe(b)
b.pipe(c)
c.pipe(d)
d.pipe(process.stdout)

// 也可以写成
process.stdin.pipe(b).pipe(c).pipe(d).pipe(process.stdout)
```

如上代码，这样`b` `c` `d`其实就是一个一个的“中转站”、“过滤器”，这样数据就真的“流”起来了，像水一样。

#### 4.6.2 Duplex Stream

Duplex Stream 在实际应用不多，被举例最多的就是`gzip`压缩的功能，即读取一个文件，然后压缩保存为另一个文件。其中的`zlib.createGzip()`返回的就是一个 Duplex Stream 对象。

```js
var fs = require('fs')
var zlib = require('zlib')
var readStream = fs.createReadStream('./file1.txt')
var writeStream = fs.createWriteStream('./file1.txt.gz')
readStream.pipe(zlib.createGzip())
          .pipe(writeStream)
```

同理，你可以根据 [构造函数](http://nodejs.cn/api/stream.html#stream_an_example_duplex_stream) 实现自己的 Duplex Stream 对象，不再赘述。

最后，简单实现一个能在线压缩、下载的 web server

```js
var http = require('http')
var fs = require('fs')
var zlib = require('zlib')
function serverCallback(req, res) {
    var readStream = fs.createReadStream('./file1.txt')
    res.writeHead(200, {'Content-type': 'application/x-gzip'})  // 注意这里返回的 MIME 类型
    readStream.pipe(zlib.createGzip())  // 一行代码搞定压缩功能
              .pipe(res)
}
http.createServer(serverCallback).listen(8080)
```

> 其实还有一种类型的流 —— Transform Stream 。不常用，这里就不写了，有兴趣的自己去查资料吧。

### 4.7 是什么在流动

上文一直说数据在流动，从哪里来，到哪里去，中间经历了什么，就是没有说这个在流动的数据，到底是什么，即代码中的`chunk`是什么？

```js
req.on('data', function (chunk) {
    // “一点一点”接收内容
    data += chunk.toString()
})
```

运行代码，打印`chunk`得到的结果是`<Buffer 61 61 61 0a 62 62 62 0 ... >`，看前面`<Buffer`就知道，它是 Buffer 类型的数据。打印`chunk instanceof Buffer`即可得到`true`。

#### 4.7.1 Buffer 是什么

Buffer 对象就是二进制在 JS 中的表述形式，即 Buffer 对象就是二进制类型的数据。上文`<Buffer 61 61 61 0a 62 62 62 0 ... >`看起来像是数组的形式，但是它却不是数组，因为它的每个元素只能是一个 16 进制的两位数（换算成 10 进制即 0-255 之间的数字），就是一个字节。

> 有人可能会疑问：不是说“二进制”吗，这里怎么又成了 16 进制了？—— 因为 16 进制可以更加轻松的转换为 2 进制，而且二位数的 16 进制正好能表述为一个字节，因此就用了。

#### 4.7.2 Buffer 和字符串的关系

Buffer 是二级制，和字符串完全是两码事儿，但是他们可以相互转换 —— 前提是规定好用哪个编码规范。

```js
var str = '深入浅出nodejs'
var buf = new Buffer(str, 'utf-8')
console.log(buf)  // <Buffer e6 b7 b1 e5 85 a5 e6 b5 85 e5 87 ba 6e 6f 64 65 6a 73>
console.log(buf.toString('utf-8'))  // 深入浅出nodejs
```

以上代码使用`utf-8`编码对二进制和字符串进行了转换，不过其实 JS 默认就是`utf-8`编码。

#### 4.7.3 为何流动的数据是 Buffer 类型？

计算机真正能识别的就是二进制数据。我们在程序中使用字符串、数字、数组等都是有特定的语言和环境的，是一个封闭的开发环境。代码真正执行的时候还需要这个环境做很多其他底层的工作，并不是说计算机底层就认识字符串、数字和数组。

但是“流”动的数据却可能会跑出这个环境，它会涉及到网络 IO 和文件 IO 等其他环境。即，程序从 http 请求读取数据、或者发送数据给 http 请求，得用一个两者都认识的格式才行，那就只能是二进制了。

另外，反过来思考，不用二进制用什么呢？用字符串？那流动的数据还可能是视频和图片呢，字符串表述不了。

#### 4.7.4 Buffer 的好处

Buffer 能提高 http 请求的性能，《深入浅出 nodejs》书中提到，使用`stream.pipe(res)`在特定情况下，QPS 能从 2k+ 提升到 4k+

```js
// 不使用 Stream
res.write('hello nodejs')
res.end()

// 使用 Stream
var readStream = fs.createReadStream('./file1.txt')
readStream.pipe(res)
```

### 4.8 小结

其实洋洋洒洒这么多，主要就是解决开头提到的“一点一点”的从 req 中接收传递来的数据，从而引申出 Stream 这个概念，并且介绍了 Stream 中比较重要的内容。以后只要遇到`data` `end`事件，或者遇到大数据内容处理，或者遇到 IO 的性能问题等，都可以考虑到 Stream 。Stream 是 server 端比较重要的概念，其基础知识必须全面了解。

**【扩展】**

其实用 Stream 读取文件内容，无法确保是一行一行读取的，但是 nodejs 有 [readline](http://nodejs.cn/api/readline.html) 可以让你轻松实现一行一行读取文件。

## 5. 异步 IO

nodejs 的核心优势就在于异步 IO 的处理能力，因此肯定要重点展开讲解。其实细想一下，做一个 web server 无非就是处理 http 请求，本质上不就是 IO 吗？

**核心内容**

- JS 单线程异步的特性
- 什么是 IO ？
- 多线程 web server
- 异步 IO
- 异步编程的问题

### 5.1 JS 单线程异步的特性

说到“异步 IO”，就先来说说“异步”。

#### 5.1.1 JS 异步很重要

第一节讲解语法知识的时候，就强调过必须熟练掌握 JS 异步的相关知识，列出如下知识点。还推荐不熟悉的同学去阅读作者写的 [深入理解 JS 异步](https://github.com/wangfupeng1988/js-async-tutorial) 。

- 异步和同步的区别
- 异步和单线程
- event loop
- callback 方式
- Promise
- async/await

#### 5.1.2 单线程

这里重点说一说单线程，因为它和下文有很大的联系。

我们都知道 JS 是一门单线程执行的语言，无法用 JS 代码新启动一个线程。什么是单线程，通俗来说就是单一时间只能做一件事，不能“一心二用”。例如

```js
console.log(100)
var i, sum
for (i = 0; i < 100000000; i++) {
    sum++
}
console.log(200)
```

如上代码中，要执行 100000000 次循环，是非常耗费时间的，但是 JS 也只能这么来执行：先打印`100`，然后执行一个漫长的 for 循环（此处可能需要等待很久），最后打印`200`。那我们可不可以一边执行 for 循环，一边打印`200`呢？两者不受影响啊，一起执行也完全 OK 啊 —— 但是答案是不可以，如果一起执行的话，那就是多线程的了，JS 只能是单线程执行。

#### 5.1.3 为何要单线程

JS 为何非得要单线程呢，像 java 那样做成多线程的不行吗？答案是不行。

在浏览器环境中，JS 是可以操作 DOM 结构的，而 DOM 只有一份。如果两段 JS 能同时执行的话，那么它们都同时操作同一个 DOM 节点，不就发生冲突了吗？因此，**为了避免 DOM 操作的冲突，JS 不能同时执行，只能单线程执行**。另外，不光 JS 是单线程，而且 JS 和浏览器渲染公用一个线程，即 JS 执行时，浏览器渲染会等待、卡顿。

最后，单线程使得 JS 入门简单使用方便，也不会出现线程思索、状态同步的琐碎问题，简单才容易做大、做广，大道至简。

#### 5.1.4 延伸到 nodejs 中

nodejs 借用了 Chrome 浏览器中的 v8 引擎来解析 JS ，因此就将其单线程的特性保留了下来。但是 nodejs 提供了 Child_Process 和 Cluster 来操作进程，能解决单线程遇到的一些问题，下一节会介绍。

#### 5.1.5 解决单线程 - 异步

上文那 100000000 次循环纯粹为了演示，实际项目中不会存在这样的场景 —— 即不会存在 CPU 计算成为速度上的瓶颈，而是网络或者文件读写成为速度上的瓶颈。

网络请求和文件读写遇到性能瓶颈这是很正常的，那对于 JS 这种单线程的语言，该怎么办呢？—— 难道执行一次网络请求，就要一直等到网络请求结束（可能花费 1s 5s 甚至 10s）之后才能继续执行下去？—— 当然不是，JS 解决这个问题就是用了异步。

好了，讲到这里讲出了异步，就不在继续了，再将就是异步的语法了。

### 5.2 什么是 IO

**所谓 IO ，就是 input 和 output ，即输入和输出。**

当 JS 运行在浏览器端的时候就有 IO ，且只有一种 IO —— 网络 IO ，即 http 请求。例如 ajax 或者异步加载 script 和图片。当 JS 运行在 server 端时，IO 是最常见的，除了计算，剩下的就是 IO ，可以总结为两类：

- **网络 IO** ：通过网络请求访问其他机器或者服务器的数据，或者提交数据
- **文件 IO** ：读取文件内容，或者写内容到文件里

无论针对哪个语言、哪个框架、哪个操作系统，**IO 都有一个不变的特点 —— 慢** 。现在 CPU 的计算速度是非常快的，相比之下，读取硬盘和等待网络请求就变的非常缓慢。大家应该也能经常听到“IO 瓶颈”之类的词，这就表示其他地方很快，就卡在 IO 这块了，因此叫做“瓶颈”。

慢，但是肯定是有解决方案的。

### 5.3 多线程 web server

PHP 也没法创建线程，即也是单线程执行的，而且 PHP 也没有 JS 一样的异步，遇到 IO 的时候只能等待完成之后再继续下一步的执行。但是 PHP 作为世界上最好的语言，肯定有解决方案。

这个解决方案不是 PHP 搞定的，而是 web server 服务器搞定的，例如 Apache 。Apache 服务器每接收一个 http 请求都会新建一个线程，在该线程这个封闭的环境下执行 PHP 代码。

- **好处**：就是处理各个 http 请求在每个独立的线程中，上下文相互独立，不相互影响，独立性好。
- **坏处**：就是 http 并发量大了之后，创建如此多线程内存吃不消，因此会有著名的 [C10K](http://www.kegel.com/c10k.html) 问题。

（关于以上内容：笔者不是专业搞 PHP 的，有解释不到位的，欢迎补充）

### 5.4 异步 IO

相比上文 Apache 多线程的方式，nodejs 针对所有 http 请求，都只有一个线程。先解释一下，这里说的单线程和下一节将的多进程不是一回事，一个是线程一个是进程，不要混了。

- **好处**：减少线程开销，能承受更多的 http 的并发请求。著名的 nginx 也是用类似的方式做到高性能的。
- **坏处**：所有 http 请求公用一个线程，一个上下文，一点崩溃即权限崩溃，对于程序的稳定性要求搞

到这里就接上了本文一开始将的话题 —— 单线程的解决方案就是异步，IO 是瓶颈，那就用异步处理 IO，即 **异步 IO** ，即 nodejs 用单线程、异步的方式处理 IO 时能支持更多的并发请求。

上文说过，nodejs 中最常见的 异步 IO ，第一是 网络 IO，第二是 文件 IO ，至于详细的语法和 API 用法，就不再详细演示了，不是本文的重点。

**【扩展】事件监听算不算异步？**

前端代码如

```js
$('#btn1').on('click', function (event) {

})
```

nodejs 代码如

```js
req.on('data', function (chunk) {

})
```

这种将 callback 函数作为参数传递的形式，看着都像是异步。这里就提出一个疑问吧，想搞清楚这个疑问就必须要详细了解 event loop ，推荐大家去看一个视频 [what the hack is event loop](https://pan.baidu.com/s/1i6slMiL)（看不了就下载），也可以看作者写的 [这篇文章](https://github.com/wangfupeng1988/js-async-tutorial/blob/master/part1-basic/03-event-bind.md) 。

### 5.5 异步编程的问题

关于异步编程的问题和解决方案，我在 [《深入浅出 nodejs》读书笔记](https://github.com/wangfupeng1988/read-notes/blob/master/book/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs.md#%E7%AC%AC%E5%9B%9B%E7%AB%A0-%E5%BC%82%E6%AD%A5%E7%BC%96%E7%A8%8B) 中整理的比较详细，可以直接去参考，没必要再拷贝一遍。

### 5.6 小结

本文关于异步的语法和 API 一点都没讲，但是本文内容却很多。能了解 **异步 IO** **单线程** 等这些底层概念，比知道语法和 API 用法更重要。

## 6. 进程

JS 是单线程执行的，但是我们可以启动多个进程来执行，nodejs 中子进程管理以及进程守候是非常重要的知识点。

**核心内容**

- 线程 vs 进程
- 为何要启用多进程
- child_process
- cluster

### 6.1 线程 vs 进程

**进程（Process）** 是具有一定独立功能的程序关于某个数据集合上的一次运行活动，进程是系统进行资源分配和调度的一个独立单位。 **线程（Thread）** 是进程的一个实体，是 CPU 调度和分派的基本单位，它是比进程更小的能独立运行的基本单位。线程自己不拥有系统资源，它与同属一个进程的其他的线程共享进程所拥有的全部资源。

在 mac os 或者 linux 系统中运行`top`命令，可以看到如下列表，这些就是进程。windows 系统中的任务管理器，可以看到各个启动的软件的列表，也是进程。通过这些列表，我们都能看到每个进程 CPU 使用率，内存占用，符合上文对于进程的描述（独立分配、调度资源）

```
PID    COMMAND      %CPU TIME     #TH   #WQ  #PORT MEM    PURG   CMPRS  PGRP  PPID  STATE    BOOSTS
12080  top          9.1  00:00.62 1/1   0    23    3672K  0B     0B     12080 12059 running  *0[1]
12059  zsh          0.0  00:00.16 1     0    19    3368K  0B     0B     12059 12058 sleeping *0[1]
12058  login        0.0  00:00.04 2     1    30    1904K  0B     0B     12058 12057 sleeping *0[9]
12057  iTerm2       0.0  00:00.03 2     1    30    2364K  0B     0B     12057 945   sleeping *0[1]
12055  lsof         0.0  00:00.00 1     0    8     232K   0B     0B     12054 12054 sleeping *0[1]
12054  lsof         0.0  00:00.84 1     0    19    6004K  0B     0B     12054 70    sleeping *0[1]
12040  QuickLookSat 0.0  00:00.40 5     1    92    10M    232K   0B     12040 1     sleeping  0[12]
12012  quicklookd   0.0  00:00.61 4     1    90    4716K  216K   0B     12012 1     sleeping  0[14]
```

线程是进程中更小的单位，我们无法通过工具直观的看到。一个进程至少启动一个线程，或者启动若干个线程（多线程）。JS 是单线程运行的，我们无法通过 JS 代码新启动一个线程（java 就可以），但是可以新启动一个进程。

注意，新启动一个进程是比较耗费资源的，不应频繁启动。如果遇到需要频繁启动新进程的需求，应该考虑其他的解决方案（我曾经就遇到过，差点入坑）。

### 6.2 为何要启用多进程

第一，现在的服务器都是多核 CPU ，**启动多进程可以有效提高 CPU 利用率**，否则 CPU 资源就白白浪费了。一般会根据 CPU 的核数，启动数量相同的进程数。

> PS：和开发客户端程序不同，开发 server 端程序时，要时刻注意“节省”和“压榨”，通俗一点就是“抠门”。“节省”就是尽量减少计算次数（时间复杂度）、内存使用（空间复杂度）；“压榨”就是尽量多的合理利用起现有的资源，CPU、内存和硬盘等。有时你在开发和测试时候，对于“节省”和“压榨”看不出效果，但是一旦上线访问量增大，效果将会越来越明显。

第二，受到 v8 引擎的垃圾回收算法的限制，**nodejs 能使用的系统内存是受限制的**（64 位最多使用 1.4GB ，32 位最多使用 0.7GB）。**如何突破这种限制呢？—— 多进程**。因为每个进程都是一个新的 v8 实例，都有权利重新分配、调度资源。

### 6.3 child_process

[child_process](http://nodejs.cn/api/child_process.html) 提供了创建子进程的方法

- `spawn`
- `exec`
- `execFile`
- `fork`

```js
var cp = require('child_process')
cp.spawn('node', ['worker.js'])
cp.exec('node worker.js', function (err, stdout, stderr) {
    // todo
})
cp.execFile('worker.js', function (err, stdout, stderr) {
    // todo
})
cp.fork('./worker.js')
```

进程之间的通讯，代码如下。跟前端`WebWorker`类似，使用`on`监听（此前讲过的自定义事件），使用`send`发送。

```js
// parent.js
var cp = require('child_process')
var n = cp.for('./sub.js')
n.on('message', function (m) {
    console.log('PARENT got message: ' + m)
})
n.send({hello: 'workd'})

// sub.js
process.on('message', function (m) {
    console.log('CHILD got message: ' + m)
})
process.send({foo: 'bar'})
```

### 6.4 cluster

cluster 模块允许设立一个主进程和若干个 worker 进程，由主进程监控和协调 worker 进程的运行。worker 之间采用进程间通信交换消息，**cluster模块内置一个负载均衡器，采用 Round-robin 算法协调各个 worker 进程之间的负载**。运行时，所有新建立的链接都由主进程完成，然后主进程再把 TCP 连接分配给指定的 worker 进程。

```js
const cluster = require('cluster')
const os = require('os')
const http = require('http')

if (cluster.isMaster) {
    console.log('是主进程')
    const cpus = os.cpus() // cpu 信息
    const cpusLength = cpus.length  // cpu 核数
    for (let i = 0; i < cpusLength; i++) {
        // fork() 方法用于新建一个 worker 进程，上下文都复制主进程。只有主进程才能调用这个方法
        // 该方法返回一个 worker 对象。
        cluster.fork()
    }
} else {
    console.log('不是主进程')
    // 运行该 demo 之后，可以运行 top 命令看下 node 的进程数量
    // 如果电脑是 4 核 CPU ，会生成 4 个子进程，另外还有 1 个主进程，一共 5 个 node 进程
    // 其中， 4 个子进程受理 http-server
    http.createServer((req, res) => {
        res.writeHead(200)
        res.end('hello world')
    }).listen(8000)  // 注意，这里就不会有端口冲突的问题了！！！
}
```

维护进程健壮性，**通过 Cluster 能监听到进程退出，然后自动重启，即自动容错**，这就是进程守候。

```js
if (cluster.isMaster) {
    const num = os.cpus().length
    console.log('Master cluster setting up ' + num + ' workers...')
    for (let i = 0; i < num; i++) {
        // 按照 CPU 核数，创建 N 个子进程
        cluster.fork()
    }
    cluster.on('online', worker => {
        // 监听 workder 进程上线（启动）
        console.log('worker ' + worker.process.pid + ' is online')
    })
    cluster.on('exit', (worker, code, signal) => {
        // 兼容 workder 进程退出
        console.log('worker ' + worker.process.pid + ' exited with code: ' + code + ' and signal: ' + signal)
        // 退出一个，即可立即重启一个
        console.log('starting a new workder')
        cluster.fork()
    })
}
```

示例看似简单，但是实际应用还是尽量使用成熟的工具，例如 [pm2](https://www.npmjs.com/package/pm2)，可以自己去看文档使用。

### 6.5 小结

总要明白线程和进程的区别、联系，以及为何使用多进程，后面的 API 用法相对比较简单。

## 7. 其他

**核心内容**

- 关于数据存储（如 mysql redis 等）

### 关于数据存储（如 mysql redis 等）

npm 中也早就有了 nodejs 操作 mysql redis 等的库，可以直接拿来使用。不过考虑目前 nodejs 主要的应用场景，直接操作 mysql redis 的机会不多。

nodejs 目前属于 web server 的“表层”，即最接近前端的那部分，前后端代码同构就是这部分。nodejs 从一些线程的 server 中得到数据，然后直接渲染出 html 直接返回。至于如何从 mysql redis 中获取数据，一般不会由 nodejs 操作，而是其他 server 操作。现在比较经典的结构是`前端 -> nodejs -> 数据 server（如 PHP java）`。

