import { Point } from './index'
import type { GraffitiEle } from './index'
import { SYSTEM_COLOR, CanvasGraffiti } from '../index'
import { roundToNDecimalPlaces } from '../utils'

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

  constructor(graffiti: CanvasGraffiti, graffitiEles: GraffitiEle[]) {
    this.graffiti = graffiti
    this.graffitiEles = graffitiEles
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
    this.graffiti.draw()
    this.graffiti.eleGroup = null
    this.graffitiEles = null
  }

  moveGroup(offsetX: number, offsetY: number) {
    this.left += offsetX
    this.right += offsetX
    this.top += offsetY
    this.bottom += offsetY

    this.graffitiEles.forEach(ele => {
      ele.moveEle(offsetX, offsetY)
    })
    this.graffiti.clear()
    this.graffiti.draw()

    this.selected()
  }

  deleteGroup() {
    this.graffitiEles.forEach(ele => {
      ele.deleteEle()
    })

    this.cancelSelected()
    document.removeEventListener('keydown', this.eventFn)
  }

  private bindKeyEvent() {
    this.eventFn = (event: KeyboardEvent) => {
      if (this.isSelected) {
        if (event.key === 'Delete' || event.key === 'Del') {
          this.deleteGroup()
        }
      }
    }
    document.addEventListener('keydown', this.eventFn)
  }
}
