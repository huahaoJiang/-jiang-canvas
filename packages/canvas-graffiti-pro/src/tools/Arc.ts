import { ToolOptions, Point } from '..'
import { GraffitiEle } from '../element'
import { roundToNDecimalPlaces } from '../utils'

// 圆形
export const Arc = {
  buffer: true,
  pointerdown({ offsetX: x, offsetY: y }) {
    this.bufferCtx!.moveTo(x, y)
    this.points.push({ x: roundToNDecimalPlaces(x), y: roundToNDecimalPlaces(y) })
  },
  pointermove({ offsetX: x, offsetY: y }) {
    this.bufferCtx!.clearRect(0, 0, this.el.width, this.el.height)
    this.bufferCtx!.beginPath()
    this.bufferCtx!.arc(this.beginPoint.x, this.beginPoint.y, Math.abs(x - this.beginPoint.x), 0, 2 * Math.PI)
    this.endPoint = { x: x, y: y }
    this.bufferCtx!.stroke()
  },
  pointerup() {
    if (this.endPoint) {
      this.points.push({ x: roundToNDecimalPlaces(this.endPoint.x), y: roundToNDecimalPlaces(this.endPoint.y) })
      this.ctx.beginPath()
      const beginPoint = this.points[0]
      const endPoint = this.points[1]
      const r = Math.abs(endPoint.x - beginPoint.x)
      this.ctx.arc(beginPoint.x, beginPoint.y, r, 0, 2 * Math.PI)
      this.ctx.stroke()
      const left = beginPoint.x < endPoint.x ? beginPoint.x - r : endPoint.x
      const top = beginPoint.y - r
      const right = beginPoint.x < endPoint.x ? endPoint.x : beginPoint.x + r
      const bottom = beginPoint.y + r
      // 将元素信息写入到数组中
      this.graffitiEleList.push(new GraffitiEle({ tool: 'Arc', left, top, right, bottom, points: this.points }))
    }
  },
  drawEle(points: Point[]) {
    let beginPoint = points[0]
    let endPoint = points[1]

    this.ctx.beginPath()
    this.ctx.arc(beginPoint.x, beginPoint.y, Math.abs(endPoint.x - beginPoint.x), 0, 2 * Math.PI)
    this.ctx.stroke()
  }
} as ToolOptions
