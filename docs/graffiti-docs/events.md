---
outline: 2
---

# 构造函数
通过new CanvasGraffiti()调用构造函数创建实例对象。构造函数接受两个参数，第二个是CustomizeHandle对象，具体参数如下。

## 自定义处理函数
自定义处理函数均为非必传。注意如果要用this的话，应避免使用箭头函数。
## onActionHandle
该函数监听每次涂鸦，擦除，改变宽高等动作，并返回当前画布内容信息。内部this指向canvasGraffiti。
### 方法定义
```ts
/**
 * @item CacheGraffiti，记录当前画布内容的对象
 * @revokeSize 可撤销操作的次数
 * @redoSize 可重做操作的次数
 * */
type onActionHandle = (item: CacheGraffiti, revokeSize: number, redoSize: number) => void;
```

## onGroupHandle
该函数监听每次Group的创建与销毁，并返回当前的group对象。内部this指向canvasGraffiti。
::: tip
EleGroup对象记录当前选中的一个或多个元素，并且同时只会存在一个对象实例
:::
### 方法定义
```ts
/**
 * @group EleGroup，当前选中的元素组对象
 * */
type onGroupHandle = (group: EleGroup) => void;
```

## onGroupMoveHandle
该函数监听每次Group选中状态下的 move 事件。内部this指向canvasGraffiti。

### 方法定义
```ts
/**
 * @event PointerEvent
 * */
type onGroupMoveHandle = (event: PointerEvent) => void;
```