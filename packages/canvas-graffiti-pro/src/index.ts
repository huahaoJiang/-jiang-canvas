import * as tools from './tools'
import { AllowType, EventTypes, Options, ToolOptions, ToolType } from './types'
import { useStack, CacheStack, CacheGraffiti } from './stack'
import { useEventBus, IEventBus } from './event'
import { GraffitiEle } from './element'
import type { EleGroup } from './element/group'
export * from './types'

export const SYSTEM_COLOR = '#1493ee'

export class CanvasGraffiti implements ToolOptions {
  options = {
    currentTool: 'Marker',
    createBufferCanvasStyle: {},
    allowType: ['pen', 'mouse', 'touch'],
    allowButton: [0]
  } as Options

  // canvas 容器
  el: HTMLCanvasElement

  // 当前是否可撤销
  isRevoke: boolean = false

  // 存储栈
  cacheStack: CacheStack

  // 起点
  beginPoint: { x: number; y: number } = { x: 0, y: 0 }

  // 终点
  endPoint: { x: number; y: number } | undefined

  // 移动轨迹
  points: { x: number; y: number }[] = []

  // 工具名
  private currentTool: ToolType = 'Marker'

  // 离屏渲染画布
  bufferCanvas: HTMLCanvasElement | undefined

  // 允许绘图方式
  allowType!: AllowType[]

  // 鼠标允许绘图方式
  allowButton!: (0 | 1 | 2 | number)[]

  // 涂鸦元素数组
  graffitiEleList: GraffitiEle[] = []

  containerHeightOffset: number = 0

  // 设备分辨倍率
  dpr: number = 1

  // 画布样式宽度
  width: number

  // 画布样式高度
  height: number

  // 元素组对象实例
  eleGroup: EleGroup | null

  // 全局画笔粗细
  lineWidth: number

  // 全局描边色
  strokeStyle: string

  // 全局填充色
  fillStyle: string

  $on: IEventBus['on']

  $emit: IEventBus['emit']

  $off: IEventBus['off']

  setStrokeStyle(value: string) {
    this.ctx.strokeStyle = value
  }

  setFillStyle(value: string) {
    this.ctx.fillStyle = value
  }

  // 线宽
  setLineWidth(value: number) {
    this.ctx.lineWidth = value
  }

  // 当前工具
  get tool() {
    return tools[this.currentTool]
  }
  set tool(value: any) {
    this.currentTool = value
  }

  static toolList = [
    {
      label: '光标',
      value: 'Cursor'
    },
    {
      label: '记号笔',
      value: 'Marker'
    },
    {
      label: '钢笔',
      value: 'Pen'
    },
    {
      label: '直线',
      value: 'Line'
    },
    {
      label: '空心矩形',
      value: 'Rect'
    },
    {
      label: '空心圆',
      value: 'Arc'
    }
  ] as const

  static allowTypes = [
    {
      label: '鼠标',
      value: 'mouse'
    },
    {
      label: '手写',
      value: 'touch'
    },
    {
      label: '笔写',
      value: 'pen'
    }
  ]

  // 上下文
  get ctx() {
    return this.el.getContext('2d')!
  }

  // 离屏渲染画布上下文
  get bufferCtx() {
    return this.bufferCanvas?.getContext('2d')
  }

  setWidth(width: number) {
    this.width = width
    this.ctx.canvas.width = width * this.dpr
    this.ctx.canvas.style.width = width + 'px'
  }

  setHeight(height: number) {
    this.height = height
    this.ctx.canvas.height = height * this.dpr
    this.ctx.canvas.style.height = height + 'px'
  }

  constructor(options: Options) {
    Object.assign(this.options, options)
    this.dpr = options.devicePixelRatio || window.devicePixelRatio

    if (typeof this.options.el === 'string') this.el = document.querySelector(this.options.el) as HTMLCanvasElement
    else this.el = this.options.el

    this.options.width ? this.setWidth(this.options.width) : this.setWidth(this.el.width)
    this.options.height ? this.setHeight(this.options.height) : this.setHeight(this.el.height)

    this.options.lineWidth && (this.lineWidth = this.options.lineWidth)
    this.options.color && (this.strokeStyle = this.fillStyle = this.options.color)

    this.currentTool = this.options.currentTool!
    this.allowType = this.options.allowType!
    this.allowButton = this.options.allowButton!

    this.ctx.scale(this.dpr, this.dpr)
    this.ctx.canvas.style.cursor = 'crosshair'

    useStack(this, options.cacheSize)
    useEventBus(this)
    this.init()
    this.reviseCtxState()
  }

  private reviseCtxState() {
    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'

    this.setFillStyle(this.fillStyle)
    this.setStrokeStyle(this.strokeStyle)
    this.setLineWidth(this.lineWidth)
  }

  /**
   * 初始化
   */
  init() {
    this.el.style.touchAction = 'none'
    // 绑定 this
    this.pointerdown = this.pointerdown.bind(this)
    this.pointermove = this.pointermove.bind(this)
    this.pointerup = this.pointerup.bind(this)

    // 绑定事件
    this.bindCanvasEventListener()
  }

  // 绑定事件
  bindCanvasEventListener() {
    this.el.addEventListener('pointerdown', this.pointerdown)
  }

  // 解绑事件
  removeEventListener(types: EventTypes[] = ['pointerdown', 'pointermove', 'pointerup']) {
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
    event.preventDefault()
    if (!this.allowType.includes(event.pointerType)) return

    this.tool?.pointermove?.call(this, event)
  }

  // 抬起事件
  pointerup(event: PointerEvent) {
    // this.el.style.touchAction = 'auto'

    if (!this.allowType.includes(event.pointerType)) return

    event.preventDefault()

    this.tool?.pointerup?.call(this, event)
    this.removeEventListener(['pointermove', 'pointerup'])

    if (this.currentTool !== 'Cursor') {
      this.emitStackChange()
    }

    this.beginPoint = { x: 0, y: 0 }
    this.endPoint = undefined
    this.points = []
    this.bufferCanvas?.remove()
  }

  // 改变画布宽高
  updateCanvasSize(size: { width?: number; height?: number }) {
    const { width, height } = size
    if (!this.cacheStack.preItem) {
      this.emitStackChange()
    }
    if (width) {
      this.setWidth(width)
    }
    if (height) {
      this.setHeight(height)
    }

    this.$emit('sizeChange', { width: this.width, height: this.height })
    this.reviseCtxState()
    this.ctx.scale(this.dpr, this.dpr)
    this.drawEles()
    this.emitStackChange()
  }

  // 撤销
  revoke() {
    const data = this.cacheStack.pop()
    if (data) {
      this.canvasReview(data)
    }
    // 撤销触发栈内容变化
    this.$emit('change', data, this.cacheStack.revokeSize, this.cacheStack.redoSize)
    // 清除eleGroup
    if (this.eleGroup) {
      this.eleGroup = null
    }
  }
  // 重做
  redo() {
    const data = this.cacheStack.popRedo()
    if (data) {
      this.canvasReview(data)
    }
    this.$emit('change', data, this.cacheStack.revokeSize, this.cacheStack.redoSize)
    if (this.eleGroup) {
      this.eleGroup = null
    }
  }

  // 清除画布
  clear() {
    this.ctx.clearRect(0, 0, this.el.width, this.el.height)
  }

  emitStackChange() {
    const data = {
      graffitiEleList: this.graffitiEleList,
      width: this.width,
      height: this.height,
      lineWidth: this.lineWidth,
      fillStyle: this.fillStyle,
      strokeStyle: this.strokeStyle,
      dpr: this.dpr
    }
    this.cacheStack.push(data)
    this.$emit('change', data, this.cacheStack.revokeSize, this.cacheStack.redoSize)
  }

  drawEles(graffitiEleList?: GraffitiEle[]) {
    // 重绘graffitiEleList的内容
    if (graffitiEleList) {
      graffitiEleList.forEach(ele => {
        tools[ele.tool].drawEle?.call(this, ele.points)
      })
    } else {
      // 全部重绘
      this.graffitiEleList = this.graffitiEleList.filter(ele => !ele.isDeleted)
      this.graffitiEleList.forEach(ele => {
        tools[ele.tool].drawEle?.call(this, ele.points)
      })
    }
  }

  //重写画布内容
  canvasReview(graffiti: CacheGraffiti) {
    this.clear()
    graffiti.graffitiEleList.forEach(item => {
      item.isDeleted = false
    })
    if (this.width !== graffiti.width || this.height !== graffiti.height) {
      Object.assign(this, graffiti)
      this.updateCanvasSize({ width: graffiti.width, height: graffiti.height })
    } else {
      Object.assign(this, graffiti)
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
    if (isRemoveCanvas) this.el.remove()
  }

  // 获取 canvas.toDataURL
  toDataURL(type = 'image/png', encoderOptions = 0.92) {
    return this.el.toDataURL(type, encoderOptions)
  }

  // 获取 canvas 的图片文件
  toPicFile(filename = '0.png'): Promise<File> {
    return new Promise(res => {
      this.el.toBlob(blob => {
        blob && res(new File([blob], filename))
      })
    })
  }

  setCurrentTool(tool: ToolType) {
    if (this.eleGroup) {
      // 切换工具时，删除选中效果
      this.eleGroup.cancelSelected()
    }
    this.currentTool = tool
  }
}

export default CanvasGraffiti
