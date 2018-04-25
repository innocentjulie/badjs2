# BJ_REPORT

# Installation
``` javascript
npm install badjs-report
```
``` javascript
bower install https://github.com/BetterJS/report.git
```



## Getting Started
> badjs-report 必须在所有类库之前加载并初始化。

##### 初始化
``` javascript
BJ_REPORT.init({
  id: 1                                   // 不指定id将不上报
});
```
##### 配置说明
``` javascript
BJ_REPORT.init({
  id: 1,                                // 不指定id将不上报
  uin: 123,                             // 指定用户 number , 默认已经读取 qq uin
  combo:0,								// combo 是否合并上报， 0 关闭， 1 启动（默认）
  delay:1000, 							// 当 combo= 1 可用，延迟多少毫秒，合并缓冲区中的上报
  url: "http://badjs2.qq.com/badjs",    // 指定上报地址
  ignore: [/Script error/i],            // 忽略某个错误
  level: 4, // 设置默认的级别             // 上报等级   // 1-debug 2-info 4-error
  target : "xxxx.js"                    //  错误来源的js
  random : 1                            // 抽样上报，1~0 之间数值，  1为100%上报
  onReport : function (id , errObj){    // 当上报的时候回调 。 id: 上报的id , errObj : 错误的对象
  ext : {}                              // 扩展属性，后端做扩展处理属性。例如：存在 msid 就会分发到 monitor.server.com

  }
});
```
BJ_Report 是重写了 window.onerror 进行上报的，无需编写任何捕获错误的代码
<br/>
#####  手动上报
``` javascript
BJ_REPORT.report("error msg");

BJ_REPORT.report({
  msg: "xx load error",                 // 错误信息
  target: "xxx.js",                     // 错误的来源js
  rowNum: 100,                          // 错误的行数
  colNum: 100,                          // 错误的列数
});

try{
    // something throw error ...
}catch(error){
    BJ_REPORT.report(e);
}
```
<br/>
#####  延迟上报
``` javascript
BJ_REPORT.push("error msg");

BJ_REPORT.push({
  msg: "xx load error",                 // 错误信息
  target: "xxx.js",                     // 错误的来源js
  rowNum: 100,                          // 错误的行数
  colNum: 100,                          // 错误的列数
});

BJ_REPORT.report();

```
当 combo = 1 时候的， 调用 report ，根据缓冲池中的数据一条条上报;<br/>
当 combo = 0 时候的， 会延迟 delay 毫秒，再合并上报
<br/>
#####  可以链式调用
``` javascript
BJ_REPORT.init({id: 1}).push("error msg").report("error msg 2");
```

#####  info 上报
``` javascript
BJ_REPORT.info("info"); // 用户记录日志
```

#####  debug 上报
``` javascript
BJ_REPORT.debug("debug");  //可以结合实时上报，跟踪问题
```
<br/>
<br/>
### 高级用法
>script error  的错误，怎么解决？  [#3](https://github.com/BetterJS/badjs-report/issues/3)

由于 BJ_Report 只是重写了onerror 方法而已，而且浏览器的跨域问题不能获得外链 javascript 的错误，所以使用tryJs  进行包裹。
#### 包裹jquery
``` javascript
BJ_REPORT.tryJs().spyJquery();
```
包裹 jquery 的 event.add , event.remove , event.ajax 这几个异步方法。
<br/>
<br/>
#### 包裹 define , require
``` javascript
BJ_REPORT.tryJs().spyModules();
```
包裹 模块化框架 的 define , require 方法
<br/>
<br/>
#### 包裹  js 默认的方法
``` javascript
BJ_REPORT.tryJs().spySystem();
```
包裹 js 的 setTimeout , setInterval 方法
<br/>
<br/>
#### 包裹 自定义的方法
``` javascript
var customFunction = function (){};
customFunction  = BJ_REPORT.tryJs().spyCustom(customFunction );

// 只会包裹 customOne  , customTwo
var customObject = { customOne : function (){} , customTwo : function (){} , customVar : 1}
BJ_REPORT.tryJs().spyCustom(customObject );
```
包裹 自定义的方法或则对象
<br/>
<br/>
#### 运行所有默认的包裹
``` javascript
//自动运行 SpyJquery , SpyModule , SpySystem
BJ_REPORT.tryJs().spyAll();
```


## update log

#### v6.0.0
1. 优化代码
2. 合并上报
3. 离线日志 (默认不启用)

#### v5.57.0
1. 合并上报

##### v1.1.6
1. add BJ_ERROR hash

##### v1.1.5
1. bugfix

##### v1.1.4
1. 增加info 和 debug 接口
2. report 增加对 error 对象处理
3. 处理 [Object event] 问题

##### v1.1.3
1. bugfix

##### v1.1.2
1. 增加抽样参数 random

##### v1.1.1
1. seajs 兼容的BUG修复
2. 增加 ext 属性，用户可以自己定义里面的值上报

##### v1.1.0
1. 增加对seajs 模块化的包裹
2. 增加对IE下面的错误的上报

##### v1.0.5
1. 修复异步环境下抛给浏览器的BUG也会上报，
2. 修复ignore 数组判断的迭代的问题

##### v1.0.4
1. 修复 spy 插件增加在 异步环境中，抛出异常捕获后，再抛给浏览器
2. 修复 增加在异步环境中，抛出异常，捕获后，将错误信息输出
3. 增加onReport 回调

##### v1.0.3
1. 修复说明文档

##### v1.0.2
1. 修复 uin 的正则

##### v1.0.1
1. 增加 spy 插件

##### v1.0.0
1. 功能上线





