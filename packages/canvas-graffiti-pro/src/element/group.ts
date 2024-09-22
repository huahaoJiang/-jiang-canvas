import { Point, SYSTEM_COLOR, CanvasGraffiti } from '..'
import type { GraffitiEle } from './index'
import { tools } from '../tools'
import { updateCtx } from '../utils'

const GROUP_PIC_OFFSET = 20
export class EleGroup {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
  points: Point[]
  isSelected: boolean = false
  graffiti: CanvasGraffiti
  // ctx: CanvasRenderingContext2D
  graffitiEles: GraffitiEle[]
  eventFn: (event: KeyboardEvent) => void
  isCdTime: number
  offsetX: number
  offsetY: number
  lineWidth: number
  bufferCanvas: HTMLCanvasElement | null

  get ctx() {
    return this.bufferCanvas?.getContext('2d')
  }

  constructor(graffiti: CanvasGraffiti, graffitiEles: GraffitiEle[]) {
    this.graffiti = graffiti
    this.graffitiEles = graffitiEles
    this.lineWidth = graffiti.lineWidth
    this.offsetX = 0
    this.offsetY = 0
    graffitiEles.forEach((ele, index) => {
      if (index === 0) {
        this.left = ele.left
        this.right = ele.right
        this.top = ele.top
        this.bottom = ele.bottom
      } else {
        if (this.left >= ele.left) {
          this.left = ele.left
        }
        if (this.right <= ele.right) {
          this.right = ele.right
        }
        if (this.top >= ele.top) {
          this.top = ele.top
        }
        if (this.bottom <= ele.bottom) {
          this.bottom = ele.bottom
        }
      }
    })
    this.width = this.right - this.left
    this.height = this.bottom - this.top
    this.bindKeyEvent()
  }

  selected() {
    const ctx = this.graffiti.ctx
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = SYSTEM_COLOR
    ctx.lineJoin = 'round'
    ctx.lineWidth = 1
    ctx.setLineDash([10, 5])
    ctx.moveTo(this.left, this.top)
    ctx.strokeRect(this.left - 1, this.top - 1, this.width + 2, this.height + 2)
    ctx.restore()
    this.isSelected = true
    return this
  }

  cancelSelected() {
    this.isSelected = false
    this.graffiti.flush()
    this.graffiti.drawEles()
    this.graffiti.eleGroup = null
    this.graffitiEles = null
  }

  moveGroup(offsetX: number, offsetY: number) {
    const time = new Date().getTime()
    this.offsetX += offsetX
    this.offsetY += offsetY
    if (this.isCdTime + 16 > time) {
      return
    }
    this.isCdTime = time
    this.left += this.offsetX
    this.right += this.offsetX
    this.top += this.offsetY
    this.bottom += this.offsetY
    this.graffitiEles.forEach(ele => {
      ele.moveEle(this.offsetX, this.offsetY)
    })
    this.graffiti.flush()
    this.graffiti.drawEles()

    this.selected()
    this.offsetX = 0
    this.offsetY = 0
  }

  toDataURL(type = 'image/png', encoderOptions = 0.92) {
    const el = this.graffiti.el
    const dpr = this.graffiti.dpr
    const tempCanvas = el.cloneNode() as HTMLCanvasElement
    tempCanvas.style.position = 'absolute'
    tempCanvas.style.zIndex += 100
    tempCanvas.style.pointerEvents = 'none'
    tempCanvas.width = (GROUP_PIC_OFFSET * 2 + this.width) * dpr
    tempCanvas.height = (this.height + GROUP_PIC_OFFSET * 2) * dpr
    tempCanvas.style.width = GROUP_PIC_OFFSET * 2 + this.width + 'px'
    tempCanvas.style.height = this.height + GROUP_PIC_OFFSET * 2 + 'px'
    el.appendChild(tempCanvas)
    this.bufferCanvas = tempCanvas
    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'
    this.ctx.imageSmoothingEnabled = true
    this.ctx!.scale(dpr, dpr)
    this.drawEleList()
    const data = tempCanvas.toDataURL(type, encoderOptions)

    setTimeout(() => {
      this.bufferCanvas.remove()
      this.cancelSelected()
    }, 0)
    return data
  }

  drawEleList() {
    this.ctx.save()
    this.graffitiEles = this.graffitiEles.filter(ele => !ele.isDeleted)
    this.graffitiEles.forEach(ele => {
      updateCtx(this, ele)
      tools[ele.tool].drawEle?.call(
        this,
        ele.points.map(point => {
          return {
            x: point.x - this.left + GROUP_PIC_OFFSET,
            y: point.y - this.top + GROUP_PIC_OFFSET,
            pressure: point.pressure
          }
        })
      )
    })
    this.ctx.restore()
  }

  moveFinish() {
    // this.graffitiEles = this.graffitiEles.map(ele => {
    //   return ele.moveFinish()
    // })
  }

  deleteGroup() {
    this.graffitiEles.forEach(ele => {
      ele.deleteEle()
    })

    document.removeEventListener('keydown', this.eventFn)
    this.graffiti.customizeHandle?.onGroupHandle?.call(this.graffiti, null)

    this.cancelSelected()
    this.graffiti.emitStackChange()
  }

  private bindKeyEvent() {
    this.eventFn = (event: KeyboardEvent) => {
      if (this.isSelected) {
        event.preventDefault()
        if (event.key === 'Backspace' || event.key === 'Delete') {
          this.deleteGroup()
        }
      }
    }
    document.addEventListener('keydown', this.eventFn)
  }
}
