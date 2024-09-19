import { Point, SYSTEM_COLOR, CanvasGraffiti } from '..'
import type { GraffitiEle } from './index'

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

  constructor(graffiti: CanvasGraffiti, graffitiEles: GraffitiEle[]) {
    this.graffiti = graffiti
    this.graffitiEles = graffitiEles
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
    this.graffiti.clear()
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
    this.graffiti.clear()
    this.graffiti.drawEles()

    this.selected()
    this.offsetX = 0
    this.offsetY = 0
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
    this.graffiti.$emit('group', null)

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
