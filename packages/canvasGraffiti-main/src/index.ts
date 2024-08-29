import * as utils from './utils'
import { ToolOptions } from './types'
import { useStack, CacheStack } from './stack'
import { useEventBus, IEventBus } from './event'
export * from './types'

/**
 * 配置
 */
export interface Options {
  // canvas
  el: string | HTMLCanvasElement

  // 当前绘图工具
  currentTool?: ToolType

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
  color?: string

  // 画布容器的高度偏移量，容器高度 = height + containerHeightOffset
  containerHeightOffset?: number

  // 缓存图片数目，默认为5，建议不要太大
  cacheSize?: number

  // 橡皮擦大小
  eraseSize?: number
}

// 事件名
export type EventTypes = 'pointerdown' | 'pointermove' | 'pointerup'
// 工具名
export type ToolType = 'Cursor' | 'Marker' | 'Pen' | 'Line' | 'Rect' | 'Arc' | 'Erase'
// 允许绘图的方式
// eslint-disable-next-line @typescript-eslint/ban-types
export type AllowType = 'mouse' | 'touch' | 'pen' | (string & {})

export class CanvasGraffiti implements ToolOptions {
  options = {
    currentTool: 'Marker',
    createBufferCanvasStyle: {},
    allowType: ['pen', 'mouse', 'touch'],
    allowButton: [0],
    eraseSize: 16
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

  containerHeightOffset: number = 0

  dpr: number = 1

  width: number

  height: number

  eraseSize: number

  $on: IEventBus['on']

  $emit: IEventBus['emit']

  $off: IEventBus['off']

  // color
  get color() {
    return this.ctx.fillStyle
  }
  set color(value) {
    this.ctx.strokeStyle = value
    this.ctx.fillStyle = value
  }

  // 线宽
  get lineWidth() {
    return this.ctx.lineWidth
  }
  set lineWidth(value: number) {
    this.ctx.lineWidth = value
  }

  // 当前工具
  get tool() {
    return utils[this.currentTool]
  }
  set tool(value: any) {
    this.setCurrentTool(value)
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

  constructor(options: Options) {
    Object.assign(this.options, options)
    this.dpr = window.devicePixelRatio

    if (typeof this.options.el === 'string') this.el = document.querySelector(this.options.el) as HTMLCanvasElement
    else this.el = this.options.el

    this.options.containerHeightOffset && (this.containerHeightOffset = this.options.containerHeightOffset)

    if (this.options.width) {
      this.el.style.width = this.options.width + 'px'
      this.width = this.ctx.canvas.width = this.options.width * this.dpr
    }

    if (this.options.height) {
      this.el.style.height = this.options.height - this.containerHeightOffset + 'px'
      this.height = this.ctx.canvas.height = (this.options.height - this.containerHeightOffset) * this.dpr
    }
    this.ctx.scale(this.dpr, this.dpr)

    this.options.lineWidth && (this.lineWidth = this.options.lineWidth)
    this.options.color && (this.color = this.options.color)

    this.allowType = this.options.allowType!
    this.allowButton = this.options.allowButton!
    this.eraseSize = this.options.eraseSize!

    if (this.options.currentTool! === 'Cursor') {
      this.el.style.touchAction = 'auto'
    } else {
      this.el.style.touchAction = 'none'
    }
    this.currentTool = this.options.currentTool!

    useStack(this, options.cacheSize)
    useEventBus(this)
    this.init()
  }

  // 上下文
  get ctx() {
    return this.el.getContext('2d')!
  }

  // 离屏渲染画布上下文
  get bufferCtx() {
    return this.bufferCanvas?.getContext('2d')
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

    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'
  }

  private fixContent(lineWidth: number, color: string | CanvasGradient | CanvasPattern) {
    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'
    this.color = color
    this.lineWidth = lineWidth
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

  // 改变画布高度
  updateHeight(containerHeight: number) {
    if (!this.cacheStack.preItem) {
      this.emitStackChange()
    }

    const color = this.color
    const lineWidth = this.lineWidth
    this.ctx.canvas.height = (containerHeight - this.containerHeightOffset) * this.dpr
    this.ctx.canvas.style.height = containerHeight - this.containerHeightOffset + 'px'

    this.reviewImg(this.cacheStack.preItem, true, () => {
      this.fixContent(lineWidth, color)
      this.ctx.scale(this.dpr, this.dpr)
      this.emitStackChange()
    })
  }

  // 按下
  pointerdown(event: PointerEvent) {
    // if (!this.allowType.includes(event.pointerType)) return

    if (event.pointerType === 'mouse' && !this.allowButton.includes(event.button)) return

    if (event.pressure === 0) return

    this.beginPoint = { x: event.offsetX, y: event.offsetY }

    event.preventDefault()

    // 创建离屏渲染画布
    if (this.tool.buffer) {
      this.createBufferCanvas()
    }

    if (!this.cacheStack.preItem) {
      this.emitStackChange()
    }

    if (this.tool) this.tool?.pointerdown?.call(this, event)

    this.el.addEventListener('pointermove', this.pointermove)
    document.addEventListener('pointerup', this.pointerup)
  }

  // 移动
  pointermove(event: PointerEvent) {
    event.preventDefault()
    // if (!this.allowType.includes(event.pointerType)) return

    this.tool?.pointermove?.call(this, event)
  }

  // 抬起
  pointerup(event: PointerEvent) {
    // this.el.style.touchAction = 'auto'

    // if (!this.allowType.includes(event.pointerType)) return

    event.preventDefault()

    this.tool?.pointerup?.call(this, event)
    this.removeEventListener(['pointermove', 'pointerup'])

    this.emitStackChange()

    this.beginPoint = { x: 0, y: 0 }
    this.endPoint = undefined
    this.points = []
    this.bufferCanvas?.remove()
  }

  // 撤销
  revoke() {
    const data = this.cacheStack.pop()
    if (data) {
      this.reviewImg(data, false)
    }
    // 撤销触发栈内容变化
    this.$emit('cacheChange', data, this.cacheStack.revokeSize, this.cacheStack.redoSize)
  }
  redo() {
    const data = this.cacheStack.popRedo()
    if (data) {
      this.reviewImg(data, false)
    }
    this.$emit('cacheChange', data, this.cacheStack.revokeSize, this.cacheStack.redoSize)
  }

  // 清除画布
  clear() {
    this.ctx.clearRect(0, 0, this.el.width, this.el.height)
  }

  emitStackChange() {
    const data = this.toDataURL()
    this.cacheStack.push(data)
    this.$emit('cacheChange', data, this.cacheStack.revokeSize, this.cacheStack.redoSize)
  }

  private reviewImg(imageData: string, ignoreHeight = true, callback?: () => void) {
    const _this = this
    if (!imageData) {
      return
    }
    let backgroundImage = new Image()
    backgroundImage.src = imageData

    backgroundImage.onload = function () {
      if (ignoreHeight) {
        _this.clear()
        _this.ctx.drawImage(backgroundImage, 0, 0, backgroundImage.width, backgroundImage.height)

        callback && callback()
      } else {
        const color = _this.color
        const lineWidth = _this.lineWidth

        _this.ctx.canvas.height = backgroundImage.height
        _this.ctx.canvas.style.height = backgroundImage.height / _this.dpr + 'px'
        _this.el.parentElement.style.height = backgroundImage.height / _this.dpr + _this.containerHeightOffset + 'px'

        _this.fixContent(lineWidth, color)
        _this.ctx.drawImage(backgroundImage, 0, 0, backgroundImage.width, backgroundImage.height)
        _this.ctx.scale(_this.dpr, _this.dpr)
        callback && callback()
      }

      backgroundImage = null
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

    this.bufferCtx!.fillStyle = this.color
    this.bufferCtx!.strokeStyle = this.color
    this.bufferCtx!.lineWidth = this.lineWidth
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
    if (tool === 'Cursor') {
      this.el.style.touchAction = 'auto'
    } else {
      this.el.style.touchAction = 'none'
    }
    this.currentTool = tool
  }
}

export default CanvasGraffiti
