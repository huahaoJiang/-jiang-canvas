---
outline: 2
---
# 实例方法

提供给用户了可以调用的方法。在下面的示例中，将以 canvasGraffiti 作为实例对象的名称。

## updateCanvasSize
你可以通过该方法更新canvas画布的尺寸
### 方法定义
```ts
type updateCanvasSize = (size: { width?: number; height?: number;})=>void;
```
### 示例
```ts
canvasGraffiti.updateCanvasSize({width: 1000, height:400})
```

## updateAllowType
你可以通过该方法更新allowType属性，即允许书写的方式
### 方法定义
```ts
type updateAllowType = (types: AllowType[])=> void;
```
### 示例
```ts
canvasGraffiti.updateAllowType(['pen','mouse','touch'])
```

## revoke
撤销功能，你可以通过该方法返回到上一步操作之前画布的状态
### 方法定义
```ts
type revoke = ()=> void;
```
### 示例
```ts
canvasGraffiti.revoke()
```
::: warning
建议监听canvasGraffiti对象的 change 事件，根据返回的 revokeSize 来判断是否有上一步内容再执行 revoke 方法，否则将没有效果
:::

## redo
重做功能，你可以通过该方法反悔刚才的撤销操作
### 方法定义
```ts
type redo = ()=> void;
```
### 示例
```ts
canvasGraffiti.redo()
```
::: warning
建议监听 canvasGraffiti 对象的 change 事件，根据返回的 redoSize 来判断是否有上一步内容再执行 redo 方法，否则将没有效果
:::

## getCanvasData
你可以通过该方法，提取画布内容的json格式数据，通常用作可二次编辑保存的场景。
### 方法定义
```ts
type getCanvasData = ()=> CacheGraffiti;
```
### 示例
```ts
canvasGraffiti.getCanvasData()
```

## toDataURL
你可以通过该方法获取画布内容Base64格式的图片
### 方法定义
```ts
type toDataURL = (type?: string, encoderOptions?: number)=> string;
```
### 示例
```ts
// type表示图片类型，默认值为'image/png'
// encoderOptions表示图片压缩指数，默认值为 0.92
canvasGraffiti.toDataURL()
```

## toPicFile
你可以通过该方法获取画布内容的图片文件
### 方法定义
```ts
type toPicFile = (filename?: string)=> Promise<File>;
```
### 示例
```ts
// filename表示文件名称，默认为'canvas.png'
canvasGraffiti.toPicFile()
```

## flush
你可以通过该方法清空画布内容，但是并没有删除元素
### 方法定义
```ts
type flush = ()=> void;
```
### 示例
```ts
canvasGraffiti.flush()
```

## clear
你可以通过该方法清空画布内容，删除画布元素，回到完全空白的状态
### 方法定义
```ts
type clear = ()=> void;
```
### 示例
```ts
canvasGraffiti.clear()
```


## destroy
你可以通过该方法将当前的实例对象销毁
### 方法定义
```ts
type destroy = (isRemoveCanvas: boolean)=> {};
```
### 示例
```ts
// 传入true时，将会销毁canvas的dom对象
canvasGraffiti.destroy(true)
```

