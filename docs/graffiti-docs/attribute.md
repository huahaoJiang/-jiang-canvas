---
outline: deep
---

# 构造函数

通过new CanvasGraffiti()调用构造函数创建实例对象

## 参数

### el：string | HTMLCanvasElement

你可以通过传入一个 **#Id名称** 或者一个HTMLCanvasElement对象来绑定dom。
::: tip
该属性必传
:::

### currentTool：ToolType

```ts
type ToolType = 'Cursor' | 'Marker' | 'Pen' | 'Line' | 'Rect' | 'Arc' | 'Erase'
```

你可以通过传入ToolType类型的值设置当前的工具类型。比如，Cursor是光标选择工具。
::: tip
默认选中Marker
:::

### allowType：AllowType[]

```ts
type AllowType = 'mouse' | 'touch' | 'pen'
```

你可以通过传入AllowType类型的数组，控制允许书写的方式。
::: tip
默认全部允许
:::

### allowButton：(0 | 1 | 2)[]

你可以定义允许绘图的键 0：左键，1：中键，2：右键。
::: warning
该属性默认只允许左键，并且在allowType允许鼠标书写时才会生效
:::

### width：number

你可以定义画布的初始宽度。
::: tip
默认为300px
:::

### height：number

你可以定义画布的初始高度。
::: tip
默认为150px
:::

### lineWidth：number

你可以定义画笔的宽度。
::: tip
默认为2px
:::

### color：string | CanvasGradient | CanvasPattern

你可以定义画笔的颜色。
::: tip
默认为#333
:::

### cacheSize：number

你可以定义缓存的操作步数大小，通常不建议太大，会对内存造成消耗。
::: tip
默认缓存之前的5步操作
:::

### devicePixelRatio：number

你可以定义设备的物理像素分辨率与CSS 像素分辨率之比，一般不需要调整，如有需要可手动调整。
::: tip
默认取当前设备的devicePixelRatio值
:::

### shadowBlur：number

你可以定义画笔阴影的大小
::: tip
默认设置为 0
:::

### shadowColor：string

你可以定义画笔阴影的颜色
::: warning
该属性默认设置为 'rgba(1,1,1,0.6)'，并且需要shadowBlur属性不为 0 才能生效
:::
