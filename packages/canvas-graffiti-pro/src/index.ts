import { tools } from './tools'
import { AllowType, CustomizeHandle, EventTypes, Options, Point, ToolOptions, ToolType } from './types'
import { CacheStack, CacheGraffiti } from './stack'
import { GraffitiEle } from './element'
import type { EleGroup } from './element/group'
import { GraffitiPlugin } from './plugin'

import CursorImage from './assets/cursor.png'
import EraserImage from './assets/eraser.png'
import { updateCtx } from './utils'

export * from './types'
export * from './element'
export * from './stack'

export const SYSTEM_COLOR = '#1493ee'

export class CanvasGraffiti implements ToolOptions {
  options = {
    initialTool: 'Marker',
    createBufferCanvasStyle: {},
    allowType: ['pen', 'mouse', 'touch'],
    allowButton: [0],
    shadowColor: 'rgba(1,1,1,0.6)',
    shadowBlur: 0,
    lineWidth: 2,
    color: '#333'
  } as Options
  customizeHandle: CustomizeHandle
  // canvas 容器
  el: HTMLCanvasElement

  // 存储栈
  private cacheStack: CacheStack

  beginPoint: { x: number; y: number } = { x: 0, y: 0 }

  endPoint: { x: number; y: number } | undefined

  points: Point[] = []

  // 工具名
  #toolName: ToolType

  // 离屏渲染画布
  bufferCanvas: HTMLCanvasElement | undefined

  // 允许绘图方式
  private allowType!: AllowType[]

  // 鼠标允许绘图方式
  private allowButton!: (0 | 1 | 2 | number)[]

  // 涂鸦元素数组
  graffitiEleList: GraffitiEle[] = []

  // 设备分辨倍率
  #dpr: number = 1

  // 画布样式宽度
  #width: number

  // 画布样式高度
  #height: number

  // 元素组对象实例
  eleGroup: EleGroup | null

  // 全局画笔粗细
  #lineWidth: number

  // 全局填充色
  #fillStyle: string | CanvasGradient | CanvasPattern

  // 全局描边色
  #strokeStyle: string | CanvasGradient | CanvasPattern

  // 阴影颜色
  #shadowColor: string

  // 阴影范围大小
  #shadowBlur: number

  get width() {
    return this.#width
  }
  private set width(width: number) {
    this.#width = width
    this.ctx.canvas.width = width * this.dpr
    this.ctx.canvas.style.width = width + 'px'
  }

  get height() {
    return this.#height
  }
  private set height(height: number) {
    this.#height = height
    this.ctx.canvas.height = height * this.dpr
    this.ctx.canvas.style.height = height + 'px'
  }

  set lineWidth(val: number) {
    this.#lineWidth = val
    this.ctx.lineWidth = val
  }
  get lineWidth() {
    return this.#lineWidth
  }

  private set dpr(val: number) {
    this.#dpr = val
  }
  get dpr() {
    return this.#dpr
  }

  set strokeStyle(val: string | CanvasGradient | CanvasPattern) {
    this.#strokeStyle = val
    this.ctx.strokeStyle = val
  }
  get strokeStyle() {
    return this.#strokeStyle
  }

  set fillStyle(val: string | CanvasGradient | CanvasPattern) {
    this.#fillStyle = val
    this.ctx.fillStyle = val
  }
  get fillStyle() {
    return this.#fillStyle
  }

  set shadowColor(val: string) {
    this.#shadowColor = val
    this.ctx.shadowColor = val
  }
  get shadowColor() {
    return this.#shadowColor
  }

  set shadowBlur(val: number) {
    this.#shadowBlur = val
    this.ctx.shadowBlur = val
  }
  get shadowBlur() {
    return this.#shadowBlur
  }

  // 当前工具
  private get tool(): ToolOptions {
    return tools[this.#toolName]
  }
  set toolName(value: ToolType) {
    if (this.eleGroup) {
      // 切换工具时，删除选中效果
      this.eleGroup.cancelSelected()
      this.customizeHandle?.onGroupHandle?.call(this, this.eleGroup)
    }
    if (value === 'Cursor') {
      this.ctx.canvas.style.cursor = 'url(' + CursorImage + '), auto'
    } else if (value === 'Erase') {
      this.ctx.canvas.style.cursor = 'url(' + EraserImage + '), auto'
    } else {
      this.ctx.canvas.style.cursor = 'crosshair'
    }
    this.#toolName = value
  }
  get toolName() {
    return this.#toolName
  }

  // 上下文
  get ctx() {
    return this.el.getContext('2d')!
  }

  // 离屏渲染画布上下文
  get bufferCtx() {
    return this.bufferCanvas?.getContext('2d')
  }

  constructor(options: Options, customizeHandle?: CustomizeHandle) {
    Object.assign(this.options, options)
    customizeHandle && (this.customizeHandle = customizeHandle)
    this.dpr = options.devicePixelRatio || window.devicePixelRatio

    if (typeof this.options.el === 'string') this.el = document.querySelector(this.options.el) as HTMLCanvasElement
    else this.el = this.options.el

    this.options.width ? (this.width = this.options.width) : (this.width = this.el.width)
    this.options.height ? (this.height = this.options.height) : (this.height = this.el.height)

    this.options.lineWidth && (this.lineWidth = this.options.lineWidth)
    this.options.color && (this.strokeStyle = this.fillStyle = this.options.color)

    this.#shadowBlur = this.options.shadowBlur || 0
    this.#shadowColor = this.options.shadowColor || 'rgba(1,1,1,0.6)'

    this.toolName = this.options.initialTool!
    this.allowType = this.options.allowType!
    this.allowButton = this.options.allowButton!

    this.ctx.scale(this.dpr, this.dpr)

    this.cacheStack = new CacheStack(options.cacheSize || 5)
    this.init()
    this.#reviseCtxState()
  }

  #reviseCtxState() {
    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'
    // this.ctx.imageSmoothingQuality = 'medium'
    this.ctx.imageSmoothingEnabled = true

    this.fillStyle = this.#fillStyle
    this.strokeStyle = this.#strokeStyle
    this.lineWidth = this.#lineWidth
    this.shadowBlur = this.#shadowBlur
    this.shadowColor = this.#shadowColor
  }

  /**
   * 初始化
   */
  private init() {
    this.el.style.touchAction = 'none'
    // 绑定 this
    this.pointerdown = this.pointerdown.bind(this)
    this.pointermove = this.pointermove.bind(this)
    this.pointerup = this.pointerup.bind(this)

    // 绑定事件
    this.bindCanvasEventListener()
  }

  updateAllowType(types: AllowType[]) {
    this.allowType = types
  }

  plugin(...args: GraffitiPlugin[]) {
    args.forEach(plugin => {
      const toolInstance = tools[plugin.name]
      if (toolInstance) {
        console.error('tool注入失败，已有同名的tool对象，请检查')
      } else {
        tools[plugin.name] = plugin.tool
      }
    })
  }

  // 绑定事件
  private bindCanvasEventListener() {
    this.el.addEventListener('pointerdown', this.pointerdown)
  }

  // 解绑事件
  private removeEventListener(types: EventTypes[] = ['pointerdown', 'pointermove', 'pointerup']) {
    types.forEach(i => {
      this.el.removeEventListener(i, this[i])
      document.removeEventListener(i, this[i])
    })
  }

  // 按下事件
  pointerdown(event: PointerEvent) {
    //不包含触摸事件时兼容其他品牌的触控笔
    if (!this.allowType.includes('touch') && event.pointerType === 'touch') {
      if (event.pressure === 0) return
    } else {
      if (!this.allowType.includes(event.pointerType)) return
    }

    if (event.pointerType === 'mouse' && !this.allowButton.includes(event.button)) return

    this.beginPoint = { x: event.offsetX, y: event.offsetY }

    event.preventDefault()

    // 创建离屏渲染画布
    if (this.tool.buffer) {
      this.createBufferCanvas()
    }
    // 当前内容存入栈
    if (!this.cacheStack.preItem) {
      this.emitStackChange()
    }

    if (this.tool) this.tool?.pointerdown?.call(this, event)

    this.el.addEventListener('pointermove', this.pointermove)
    document.addEventListener('pointerup', this.pointerup)
  }

  // 拖动事件
  pointermove(event: PointerEvent) {
    if (!this.allowType.includes('touch') && event.pointerType === 'touch') {
      if (event.pressure === 0) return
    } else {
      if (!this.allowType.includes(event.pointerType)) return
    }
    // this.$emit('debug', event.pressure)
    event.preventDefault()

    this.tool?.pointermove?.call(this, event)
  }

  // 抬起事件
  pointerup(event: PointerEvent) {
    if (!this.allowType.includes('touch') && event.pointerType === 'touch') {
      if (event.pressure === 0) return
    } else {
      if (!this.allowType.includes(event.pointerType)) return
    }

    event.preventDefault()

    this.tool?.pointerup?.call(this, event)
    this.removeEventListener(['pointermove', 'pointerup'])

    if (this.toolName !== 'Cursor') {
      this.emitStackChange()
    }

    this.beginPoint = { x: 0, y: 0 }
    this.endPoint = undefined
    this.points = []
    this.bufferCanvas?.remove()
  }

  // 撤销
  revoke() {
    const data = this.cacheStack.pop()
    if (data) {
      this.setCanvasData(data)
    }
    // 撤销触发栈内容变化
    this.customizeHandle?.onActionHandle?.call(this, data, this.cacheStack.revokeSize, this.cacheStack.redoSize)
    // 清除eleGroup
    if (this.eleGroup) {
      this.eleGroup = null
      this.customizeHandle?.onGroupHandle?.call(this, null)
    }
  }
  // 重做
  redo() {
    const data = this.cacheStack.popRedo()
    if (data) {
      this.setCanvasData(data)
    }
    this.customizeHandle?.onActionHandle?.call(this, data, this.cacheStack.revokeSize, this.cacheStack.redoSize)
    if (this.eleGroup) {
      this.eleGroup = null
      this.customizeHandle?.onGroupHandle?.call(this, null)
    }
  }

  // 改变画布宽高
  #updateSize(size: { width?: number; height?: number }) {
    const { width, height } = size
    if (!this.cacheStack.preItem) {
      this.emitStackChange()
    }
    width && (this.width = width)
    height && (this.height = height)
    // this.$emit('sizeChange', { width: this.width, height: this.height })
    this.#reviseCtxState()
    this.ctx.scale(this.dpr, this.dpr)
    this.drawEles()
  }

  updateCanvasSize(size: { width?: number; height?: number }) {
    this.#updateSize(size)
    this.emitStackChange()
  }

  // 清空画布
  flush() {
    this.ctx.clearRect(0, 0, this.el.width, this.el.height)
  }

  // 清除画布，同时删除内部元素
  clear() {
    this.flush()
    this.graffitiEleList = []
    this.eleGroup = null
  }

  emitStackChange() {
    const data = this.getCanvasData()
    this.cacheStack.push(data)

    this.customizeHandle?.onActionHandle?.call(this, data, this.cacheStack.revokeSize, this.cacheStack.redoSize)
  }

  // 绘制ele元素数据
  drawEles(graffitiEleList?: GraffitiEle[]) {
    // 重绘graffitiEleList的内容
    this.ctx.save()
    if (graffitiEleList) {
      graffitiEleList.forEach(ele => {
        updateCtx(this, ele)
        tools[ele.tool].drawEle?.call(this, ele.points)
      })
    } else {
      // 全部重绘
      this.graffitiEleList = this.graffitiEleList.filter(ele => !ele.isDeleted)
      this.graffitiEleList.forEach(ele => {
        updateCtx(this, ele)
        tools[ele.tool].drawEle?.call(this, ele.points)
      })
    }
    this.ctx.restore()
  }

  // 获取足够重绘的必要数据
  getCanvasData(): CacheGraffiti {
    const eleInfoList = this.graffitiEleList.map(ele => {
      return {
        tool: ele.tool,
        left: ele.left,
        top: ele.top,
        right: ele.right,
        bottom: ele.bottom,
        points: ele.points,
        shadowColor: ele.shadowColor,
        lineWidth: ele.lineWidth,
        shadowBlur: ele.shadowBlur,
        strokeStyle: ele.strokeStyle,
        fillStyle: ele.fillStyle
      }
    })
    return {
      eleInfoList,
      width: this.width,
      height: this.height,
      lineWidth: this.lineWidth,
      shadowBlur: this.shadowBlur,
      shadowColor: this.shadowColor,
      fillStyle: this.fillStyle,
      strokeStyle: this.strokeStyle,
      dpr: this.dpr
    }
  }

  //重写画布内容
  setCanvasData(graffiti: CacheGraffiti) {
    this.flush()
    this.graffitiEleList = graffiti.eleInfoList.map(item => {
      return new GraffitiEle(item)
    })
    // graffiti.eleInfoList = null

    if (this.width !== graffiti.width || this.height !== graffiti.height) {
      Object.assign(this, graffiti)
      this.#updateSize({ width: graffiti.width, height: graffiti.height })
    } else {
      Object.assign(this, graffiti)
      this.ctx.scale(this.dpr, this.dpr)
      this.#reviseCtxState()
      this.drawEles()
    }
  }

  // 创建离屏渲染画布
  createBufferCanvas() {
    const tempCanvas = this.el.cloneNode() as HTMLCanvasElement
    tempCanvas.style.zIndex += 100
    tempCanvas.style.pointerEvents = 'none'
    tempCanvas.style.position = 'absolute'
    tempCanvas.style.left = this.el.offsetLeft + 'px'
    tempCanvas.style.top = this.el.offsetTop + 'px'

    const style = this.options.createBufferCanvasStyle
    if (style) {
      for (const k in style) {
        tempCanvas.setAttribute(k, style[k])
      }
    }
    this.el.parentElement!.appendChild(tempCanvas)
    this.bufferCanvas = tempCanvas
    this.bufferCtx!.scale(this.dpr, this.dpr)
    this.bufferCtx!.fillStyle = this.fillStyle
    this.bufferCtx!.strokeStyle = this.strokeStyle
    this.bufferCtx!.globalAlpha = 0.3
    this.bufferCtx!.lineWidth = 1
  }

  // 销毁
  destroy(isRemoveCanvas?: boolean) {
    this.removeEventListener()
    this.cacheStack.clear()
    this.clear()
    this.options = null
    this.customizeHandle = null
    if (isRemoveCanvas) this.el.remove()
  }

  // 获取 canvas.toDataURL
  toDataURL(type = 'image/png', encoderOptions = 0.92) {
    return this.el.toDataURL(type, encoderOptions)
  }

  // 获取 canvas 的图片文件
  toPicFile(filename = 'canvas.png'): Promise<File> {
    return new Promise(res => {
      this.el.toBlob(blob => {
        blob && res(new File([blob], filename))
      })
    })
  }
}

export default CanvasGraffiti
