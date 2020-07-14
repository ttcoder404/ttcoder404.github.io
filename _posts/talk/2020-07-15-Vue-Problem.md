---
layout: post
title: Vue优化：常见会导致内存泄漏问题及优化
excerpt: 在 SPA 的设计中，用户使用它时是不需要刷新浏览器的，所以 JavaScript 应用需要自行清理组件来确保垃圾回收以预期的方式生效。因此在vue开发过程中，你需要时刻警惕内存泄漏的问题。
keywords: Vue
categories: Vue
word_count: true
owner: 古兰精
aurl: https://www.cnblogs.com/goloving/p/11267124.html
---

## 前言

>如果你在用 Vue 开发应用，那么就要当心内存泄漏的问题。这个问题在单页应用 (SPA) 中尤为重要，因为在 SPA 的设计中，用户使用它时是不需要刷新浏览器的，所以 JavaScript 应用需要自行清理组件来确保垃圾回收以预期的方式生效。因此在vue开发过程中，你需要时刻警惕内存泄漏的问题，这些内存泄漏往往会发生在使用 Vue 之外的其它进行 DOM 操作的三方库时，请确保测试应用的内存泄漏问题并在适当的时机做必要的组件清理。

1. 主要是在单页应用中，用户不会刷新浏览器，所以js应用需要自己清理组件来确保垃圾回收以预期的方式生效
2. 使用其他第三方可能会创建DOM的插件的时候，在清除DOM的时候一定要保证完全清除dom片段，不要造成残留。
3. 频繁调用创建的代码，但是一直没有清除的话就会造成内存飙升，而且一直不会释放.一定要destory掉，比如echarts那个插件，切换到其他界面，不需要改组件的时候一定要destory掉
4. 尤其是手机或者其他性能不是特别好的设备尤为重要，或者应用内有很多应用内的导航么？这都需要良好的内存管理

## v-if指令产生的内存泄露

v-if绑定到false的值，但是实际上dom元素在隐藏的时候没有被真实的释放掉

## Vue router

当用户在你的应用中导航的时候，vue router从虚拟dom中移除了元素，并替换为了新的元素，Vue的beforeDestory（）钩子函数就是一个解决清理工作的好地方，我们可以将清理dom的操作都放到这个里面

## 替代方法

1. 在移除元素的时候的内存管理如上
2. 如果有需要在内存中保留状态和元素的时候，使用内建的keep-alive组件
    - keep-alive包裹的组件，状态会被保留在内存里面
    - 可以用来提升用户体验，当一个用户在文本框中输入了文本，再一次导航回来，文本还在，岂不美滋滋
    - 这个时候移除的时候就要选取 deactivated钩子来移除元素了
3. Vue中的内存泄露往往会发生在Vue之外其他DOM操作的第三方库，一定要确保测试应用的内存泄露问题并在适当的时候做组件清理

>下面是我开发过程中遇到，并查资料总结的内存泄漏问题，会持续更新中

## 一、vue自定义指令给元素绑定事件，却没有解绑事件

这个问题见上篇博客，[vue自定义指令导致的内存泄漏问题解决](https://www.cnblogs.com/goloving/p/11266974.html)

## 二、v-if指令产生的内存泄露

v-if也是一个容易产生内存泄漏的地方。因为：

1. v-if绑定到false的值，但是实际上dom元素在隐藏的时候没有被真实的释放掉

2. 就是非常常见的比如我们通过v-if删除了父级元素，但是并没有移除父级元素里的dom片段。通常产生于使用第三方库的时候，比如下面的示例中，我们加载了一个带有非常多选项的选择框，然后我们用到了一个显示/隐藏按钮，通过一个 v-if 指令从虚拟 DOM 中添加或移除它。这个示例的问题在于这个 [v-if](https://cn.vuejs.org/v2/guide/conditional.html) 指令会从 DOM 中移除父级元素，但是我们并没有清除由 Choices.js 新添加的 DOM 片段，从而导致了内存泄漏。

```javascript
<link rel="stylesheet prefetch" href="https://joshuajohnson.co.uk/Choices/assets/styles/css/choices.min.css?version=3.0.3">
<script src="https://joshuajohnson.co.uk/Choices/assets/scripts/dist/choices.min.js?version=3.0.3"></script>

<div id="app">
  <button v-if="showChoices" @click="hide">Hide</button>
  <button v-if="!showChoices" @click="show" >Show</button>
  <div v-if="showChoices">
    <select id="choices-single-default"></select>
  </div>
</div>
```

```javascript
new Vue({
  el: "#app",
  data: function () {
    return {
      showChoices: true
    }
  },
  mounted: function () {
    this.initializeChoices()
  },
  methods: {
    initializeChoices: function () {
      let list = []
      // 我们来为选择框载入很多选项
      // 这样的话它会占用大量的内存
      for (let i = 0; i < 1000; i++) {
        list.push({
          label: "Item " + i,
          value: i
        })
      }
      new Choices("#choices-single-default", {
        searchEnabled: true,
        removeItemButton: true,
        choices: list
      })
    },
    show: function () {
      this.showChoices = true
      this.$nextTick(() => {
        this.initializeChoices()
      })
    },
    hide: function () {
      this.showChoices = false
    }
  }
})
```

解决实例：在上述的示例中，我们可以用 hide() 方法在将选择框从 DOM 中移除之前做一些清理工作，来解决内存泄露问题。为了做到这一点，我们会在 Vue 实例的数据对象中保留一个属性，并会使用 [Choices API](https://github.com/jshjohnson/Choices) 中的 destroy() 方法将其清除。

```javascript
new Vue({
  el: "#app",
  data: function () {
    return {
      showChoices: true,
      choicesSelect: null
    }
  },
  mounted: function () {
    this.initializeChoices()
  },
  methods: {
    initializeChoices: function () {
      let list = []
      for (let i = 0; i < 1000; i++) {
        list.push({
          label: "Item " + i,
          value: i
        })
      }
      // 在我们的 Vue 实例的数据对象中设置一个 `choicesSelect` 的引用
      this.choicesSelect = new Choices("#choices-single-default", {
        searchEnabled: true,
        removeItemButton: true,
        choices: list
      })
    },
    show: function () {
      this.showChoices = true
      this.$nextTick(() => {
        this.initializeChoices()
      })
    },
    hide: function () {
      // 现在我们可以让 Choices 使用这个引用
      // 在从 DOM 中移除这些元素之前进行清理工作
      this.choicesSelect.destroy()
      this.showChoices = false
    }
  }
})
```
## 三、vue-router跳转到别的组件导致的内容泄漏

在上述示例中，我们使用了一个 v-if 指令产生内存泄漏，但是一个更常见的实际的场景是使用 Vue Router 在一个单页应用中路由到不同的组件。

就像这个 v-if 指令一样，当一个用户在你的应用中导航时，Vue Router 从虚拟 DOM 中移除了元素，并替换为了新的元素。但是其子元素dom片段也并没有销毁。

Vue 的 beforeDestroy() [生命周期钩子](https://cn.vuejs.org/v2/guide/instance.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%BE%E7%A4%BA)是一个解决基于 Vue Router 的应用中的这类问题的好方法。我们可以将清理工作放入 beforeDestroy() 钩子，像这样：

```javascript
beforeDestroy: function () {
  this.choicesSelect.destroy()
}
```

所以最正确的解决方案就是：首先，v-if置为false前先删除创建的dom片段；其次，路由跳出吃，在beforeDestroy钩子函数里面判断choicesSelect是否销毁，没销毁则销毁。

还有一个替代方案：

我们已经讨论了移除元素时的内存管理，但是如果你打算在内存中保留状态和元素该怎么做呢？这种情况下，你可以使用内建的 [keep-alive](https://cn.vuejs.org/v2/api/#keep-alive) 组件。

当你用 keep-alive 包裹一个组件后，它的状态就会保留，因此就留在了内存里。

```javascript
<button @click="show = false">Hide</button>
<keep-alive>
    // <my-component> 即便被删除仍会刻意保留在内存里
    <my-component v-if="show"></my-component>
</keep-alive>
```

这个技巧可以用来提升用户体验。例如，设想一个用户在一个文本框中输入了评论，之后决定导航离开。如果这个用户之后导航回来，那些评论应该还保留着。

一旦你使用了 keep-alive，那么你就可以访问另外两个生命周期钩子：`activated`和 `deactivated`。如果你想要在一个 `keep-alive` 组件被移除的时候进行清理或改变数据，可以使用 `deactivated` 钩子。

```javascript
deactivated: function () {
  // 移除任何你不想保留的数据，或者销毁可能产生内存泄漏的地方
}
```