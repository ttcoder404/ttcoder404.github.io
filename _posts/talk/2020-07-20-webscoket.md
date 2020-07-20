---
layout: post
title: 浅谈webscoket原理及其应用
excerpt: WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议。使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。
keywords: webscoket
categories: webscoket
word_count: true
owner: Michael-lzg
aurl: https://github.com/Michael-lzg/my--article/blob/master/other/%E6%B5%85%E8%B0%88webscoket%E5%8E%9F%E7%90%86%E5%8F%8A%E5%85%B6%E5%BA%94%E7%94%A8.md
---

### 什么是 webSocket

WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议。使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。  

在 WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

### WebSocket 解决了什么问题：

在不使用 WebSocket 时，如果我们需要建立一条长连接，有以下几种方法：

- 轮询
- 长轮询（常用）
- SSE(Server Send Event)

当出现类似体育赛事、聊天室、实时位置之类的场景时，客户端要获取服务器端的变化，就只能通过轮询(定时请求)来了解服务器端有没有新的信息变化。WebSocket 的出现，让服务器端可以主动向服务器端发送信息，使得浏览器具备了实时双向通信的能力,这就是 WebSocket 解决的问题

- 带宽问题：WebSocket 相对于 HTTP 来说协议头更加小，同时按需传递。
- 数据实时性问题：WebSocket 相对于轮询和长轮询来说，能够实时传递数据，延迟更小。
- 状态问题：相较于 HTTP 的无状态请求，WebSocket 在建立连接后能够维持特定的状态。

### WebSocket 与 HTTP 对比

![](https://user-gold-cdn.xitu.io/2019/12/3/16ec9bc6c28a9a19?w=1014&h=442&f=png&s=225703)

### 基本使用

**客户端**

```js
const ws = new WebSocket('ws://localhost:8888')

ws.onopen = () => {
  console.log('WebSocket onopen')
}

ws.onmessage = e => {
  console.log(e)
  console.log(e.data)
}

ws.onclose = e => {
  console.log('WebSocket onclose')
}

ws.onerror = e => {
  console.log('WebSocket onerror')
}
```

- WebSocket.onopen： 连接成功后调用
- WebSocket.onmessage： 当接收到服务器消息时调用
- WebSocket.onclose： 连接关闭后调用
- WebSocket.onerror： 发生错误后调用

**服务端例子(koa)**

```js
const Koa = require('koa')
const WebSocket = require('ws')

const app = new Koa()
const ws = new WebSocket.Server({ port: 8888 })

ws.on('connection', ws => {
  console.log('server connection')

  ws.on('message', msg => {
    console.log('server receive msg：', msg)
  })

  ws.send('Information from the server')
})

app.listen(3000)
```

WebSocket 可以传递 String、ArrayBuffer 和 Blob 三种数据类型，因此在收到消息时可能是其中的任意一种。其中，String 和 ArrayBuffer 使用的最多。

- 如果是 String 类型，直接通过字符串处理函数即可进行相关转换，如 JSON 等格式。
- 如果是二进制 blob 类型，则需要使用 ArrayBuffer 和 DataView 来进行处理，下面简单介绍。

二进制数据包括：blob 对象和 Arraybuffer 对象，所以我们需要分开来处理。

```javascript
// 接收数据
ws.onmessage = function(event) {
  if (event.data instanceof ArrayBuffer) {
    // 判断 ArrayBuffer 对象
  }
  if (event.data instanceof Blob) {
    // 判断 Blob 对象
  }
}

// 发送 Blob 对象的例子
let file = document.querySelector('input[type="file"]').files[0]
ws.send(file)
// 发送 ArrayBuffer 对象的例子
var img = canvas_context.getImageData(0, 0, 400, 320)
var binary = new Uint8Array(img.data.length)
for (var i = 0; i < img.data.length; i++) {
  binary[i] = img.data[i]
}
ws.send(binary.buffer)
```

webSocket.bufferedAmount 属性，表示还有多少字节的二进制数据没有发送出去
如果发送的二进制数据很大的话，可以这样判断

```javascript
var data = new ArrayBuffer(10000000)
socket.send(data)
if (socket.bufferedAmount === 0) {
  // 发送完毕
} else {
  // 发送还没结束
}
```

### 总结 WebSocket 的优点

- 双向通信(一开始说的，也是最重要的一点)。
- 数据格式比较轻量，性能开销小，通信高效
- 协议控制的数据包头部较小，而 HTTP 协议每次通信都需要携带完整的头部
- 更好的二进制支持
- 没有同源限制，客户端可以与任意服务器通信
- 与 HTTP 协议有着良好的兼容性。默认端口也是 80 和 443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器
