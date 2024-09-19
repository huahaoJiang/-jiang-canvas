# 快速开始

::: code-group

```sh [npm]
$ npm i @jianghh/canvas-graffiti
```

```sh [pnpm]
$ pnpm add @jianghh/canvas-graffiti
```

:::

本项目没有引用其他第三方库，体积极小，对nodejs版本没有强制要求。打包产物有cjs和esm两个版本，兼容性也无须担心。

## 使用

通过绑定canvas元素创建一个CanvasGraffiti对象的实例。

```html
<template>
  <canvas id="graffiti" />
</template>
```

```ts
import { CanvasGraffiti } from '@jianghh/canvas-graffiti'

const canvasGraffiti = new CanvasGraffiti({
  el: '#graffiti',
  width: 1000,
  height: 400
})
```

这里宽高如果不设定的话就是默认的宽度300px，高度150px。

当然也可以像下面这样写。:wink:

```html
<template>
  <canvas
    id="graffiti"
    width="1000"
    height="400" />
</template>
```

```ts
import { CanvasGraffiti } from '@jianghh/canvas-graffiti'

const canvasGraffiti = new CanvasGraffiti({
  el: '#graffiti'
})
```
