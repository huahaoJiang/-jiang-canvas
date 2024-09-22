import type { CacheGraffiti, CanvasGraffiti } from '../'
import { EleGroup } from '../'

// 工具类配置
export interface ToolOptions {
  // 是否创建离屏渲染画布
  buffer?: boolean

  /* 事件 */
  // 按下
  pointerdown?: (this: CanvasGraffiti, event: PointerEvent) => void
  // 移动
  pointermove?: (this: CanvasGraffiti, event: PointerEvent) => void
  // 抬起
  pointerup?: (this: CanvasGraffiti, event: PointerEvent) => void

  drawEle?: (this: CanvasGraffiti | EleGroup, points: Point[]) => void
}

/**
 * 配置
 */
export interface Options {
  // canvas
  el: string | HTMLCanvasElement

  // 当前绘图工具
  initialTool?: ToolType

  // 创建离屏渲染画布样式
  createBufferCanvasStyle?: { [prop: string]: any }

  // 允许书写的方式
  allowType?: AllowType[]

  // 允许鼠标书写时，可以绘图的键 0：左键，1：中键，2：右键
  allowButton?: (0 | 1 | 2)[]

  // 动态初始化画布宽度
  width?: number

  // 动态初始化画布高度
  height?: number

  // 线的宽度
  lineWidth?: number

  // 画笔颜色
  color?: string | CanvasGradient | CanvasPattern

  // 缓存图片数目，默认为5，建议不要太大
  cacheSize?: number

  // 设备分辨倍率，影响清晰度
  devicePixelRatio?: number

  // 阴影颜色
  shadowColor?: string

  // 阴影大小
  shadowBlur?: number
}

export interface CustomizeHandle {
  // 涂鸦，擦除，改变宽高等动作发生后的回调
  onActionHandle?: (item: CacheGraffiti, revokeSize: number, redoSize: number) => void
  // Group选中状态下移动时的回调
  onGroupMoveHandle?: (event: PointerEvent) => void
  // Group创建或者被销毁时的回调
  onGroupHandle?: (group: EleGroup) => void
}

// 事件名
export type EventTypes = 'pointerdown' | 'pointermove' | 'pointerup'
// 工具名
export type ToolType = 'Cursor' | 'Marker' | 'Pen' | 'Line' | 'Rect' | 'Arc' | 'Erase'
// 允许绘图的方式
export type AllowType = 'mouse' | 'touch' | 'pen' | (string & {})

export type Point = { x: number; y: number; pressure?: number }
