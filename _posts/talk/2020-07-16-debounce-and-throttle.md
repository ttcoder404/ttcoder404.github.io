---
layout: post
title: 函数节流与函数防抖的区别
excerpt: 函数节流与函数防抖是我们解决频繁触发DOM事件的两种常用解决方案，但是经常傻傻分不清楚。。。这不，在项目中又用遇到了，在此处记录一下
keywords: javascript
categories: javascript
word_count: true
owner: 小bearBear
aurl: https://blog.csdn.net/qq_35585701/article/details/81392174
---

## 前言

函数节流与函数防抖是我们解决频繁触发DOM事件的两种常用解决方案，但是经常傻傻分不清楚。。。这不，在项目中又用遇到了，在此处记录一下


## 函数防抖 debounce

**原理：** 将若干函数调用合成为一次，并在给定时间过去之后，或者连续事件完全触发完成之后，调用一次(**仅仅只会调用一次！！！！！！！！！！**)。

**举个栗子：** 滚动scroll事件，不停滑动滚轮会连续触发多次滚动事件，从而调用绑定的回调函数，我们希望当我们停止滚动的时，才触发一次回调，这时可以使用函数防抖。

**原理性代码及测试：**

```javascript
// 给盒子较大的height，容易看到效果
<style>
    * {
        padding: 0;
        margin: 0;
    }

    .box {
        width: 800px;
        height: 1200px;
    }
</style>
<body>
    <div class="container">
        <div class="box" style="background: tomato"></div>
        <div class="box" style="background: skyblue"></div>
        <div class="box" style="background: red"></div>
        <div class="box" style="background: yellow"></div>
    </div>
    <script>
        window.onload = function() {
            const decounce = function(fn, delay) {
                let timer = null

                return function() {
                    const context = this
                    let args = arguments
                    clearTimeout(timer) // 每次调用debounce函数都会将前一次的timer清空，确保只执行一次
                    timer = setTimeout(() => {
                        fn.apply(context, args)
                    }, delay)
                }
            }

            let num = 0

            function scrollTap() {
                num++
                console.log(`看看num吧 ${num}`)
            }
            // 此处的触发时间间隔设置的很小
            document.addEventListener('scroll', decounce(scrollTap, 500))
            // document.addEventListener('scroll', scrollTap)
        }
    </script>
</body>
```

此处的触发时间间隔设置的很小，如果匀速不间断的滚动，不断触发scroll事件，如果不用debounce处理，可以发现num改变了很多次，用了debounce函数防抖，num在一次上时间的滚动中只改变了一次。

调用debouce使scrollTap防抖之后的结果：

![img](/images/posts/debounce/1.png)

直接调用scrollTap的结果：

![img](/images/posts/debounce/2.png)

补充：浏览器在处理setTimeout和setInterval时，有最小时间间隔。
setTimeout的最短时间间隔是4毫秒；
setInterval的最短间隔时间是10毫秒，也就是说，小于10毫秒的时间间隔会被调整到10毫秒。
事实上，未优化时，scroll事件频繁触发的时间间隔也是这个最小时间间隔。
也就是说，当我们在debounce函数中的间隔事件设置不恰当（小于这个最小时间间隔），会使debounce无效。

## 函数节流 throttle

**原理：** 当达到了一定的时间间隔就会执行一次；可以理解为是缩减执行频率

**举个栗子：** 还是以scroll滚动事件来说吧，滚动事件是及其消耗浏览器性能的，不停触发。以我在项目中碰到的问题，移动端通过scroll实现分页，不断滚动，我们不希望不断发送请求，只有当达到某个条件，比如，距离手机窗口底部150px才发送一个请求，接下来就是展示新页面的请求，不停滚动，如此反复；这个时候就得用到函数节流。

**原理性代码及实现**

```javascript
// 函数节流 throttle
// 方法一：定时器实现
const throttle = function(fn,delay) {
  let timer = null

  return function() {
    const context = this
    let args = arguments
    if(!timer) {
      timer = setTimeout(() => {
        fn.apply(context,args) 
        clearTimeout(timer) 
      },delay)
    }
  }
}

// 方法二：时间戳
const throttle2 = function(fn, delay) {
  let preTime = Date.now()

  return function() {
      const context = this
      let args = arguments
      let doTime = Date.now()
      if (doTime - preTime >= delay) {
          fn.apply(context, args)
          preTime = Date.now()
      }
  }
}
```

需要注意的是定时器方法实现throttle方法和debounce方法的不同：

**在debounce中：在执行setTimeout函数之前总会将timer用setTimeout清除，取消延迟代码块，确保只执行一次
在throttle中：只要timer存在就会执行setTimeout，在setTimeout内部每次清空这个timer，但是延迟代码块已经执行啦，确保一定频率执行一次**

我们依旧可以在html页面中进行测试scroll事件，html和css代码同debounce，此处不赘述，运行结果是（可以说是一场漫长的滚轮滚动了）：

![img](/images/posts/debounce/3.png)

最后再来瞅瞅项目中封装好的debounce和throttle函数，可以说是很优秀了，考虑的特别全面，希望自己以后封装的函数也能考虑的这么全面吧，加油！

```javascript
/**
 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        传入函数，最后一个参数是额外增加的this对象，.apply(this, args) 这种方式，this无法传递进函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
 * @return {function}             返回客户调用函数
 */
const debounce = function(func, wait, immediate) {
    let timeout, args, context, timestamp, result;

    const later = function() {
        // 据上一次触发时间间隔
        let last = Number(new Date()) - timestamp;

        // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.call(context, ...args, context);
                if (!timeout) {
                    context = args = null;
                }
            }
        }
    };

    return function(..._args) {
        context = this;
        args = _args;
        timestamp = Number(new Date());
        const callNow = immediate && !timeout;
        // 如果延时不存在，重新设定延时
        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
        if (callNow) {
            result = func.call(context, ...args, context);
            context = args = null;
        }

        return result;
    };
};
```

```javascript
/**
 * 频率控制 返回函数连续调用时，func 执行频率限定为 次 / wait
 *
 * @param  {function}   func      传入函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   如果想忽略开始边界上的调用，传入{leading: false}。
 *                                如果想忽略结尾边界上的调用，传入{trailing: false}
 * @return {function}             返回客户调用函数
 */
const throttle = function(func, wait, options) {
    let context, args, result;
    let timeout = null;
    // 上次执行时间点
    let previous = 0;
    if (!options) options = {};
    // 延迟执行函数
    let later = function() {
        // 若设定了开始边界不执行选项，上次执行时间始终为0
        previous = options.leading === false ? 0 : Number(new Date());
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function(..._args) {
        let now = Number(new Date());
        // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
        if (!previous && options.leading === false) previous = now;
        // 延迟执行时间间隔
        let remaining = wait - (now - previous);
        context = this;
        args = _args;
        // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
        // remaining大于时间窗口wait，表示客户端系统时间被调整过
        if (remaining <= 0 || remaining > wait) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
            //如果延迟执行不存在，且没有设定结尾边界不执行选项
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};
```