import { ToolOptions, Point } from '..'
import { genRectByTwoPoint, GraffitiEle } from '../element'
import { roundToNDecimalPlaces } from '../utils'

// 矩形
export const Rect = {
  buffer: true,
  pointerdown({ offsetX: x, offsetY: y }) {
    this.bufferCtx!.moveTo(x, y)
    this.points.push({ x: roundToNDecimalPlaces(x), y: roundToNDecimalPlaces(y) })
  },
  pointermove({ offsetX: x, offsetY: y }) {
    this.bufferCtx!.clearRect(0, 0, this.el.width, this.el.height)
    this.bufferCtx!.beginPath()
    this.bufferCtx!.moveTo(this.beginPoint.x, this.beginPoint.y)
    this.bufferCtx!.rect(this.beginPoint.x, this.beginPoint.y, x - this.beginPoint.x, y - this.beginPoint.y)
    this.endPoint = { x, y }
    this.bufferCtx!.stroke()
  },
  pointerup() {
    if (this.endPoint) {
      this.points.push({ x: roundToNDecimalPlaces(this.endPoint.x), y: roundToNDecimalPlaces(this.endPoint.y) })
      const beginPoint = this.points[0]
      const endPoint = this.points[1]
      this.ctx.beginPath()
      this.ctx.moveTo(beginPoint.x, beginPoint.y)
      this.ctx.rect(beginPoint.x, beginPoint.y, endPoint.x - beginPoint.x, endPoint.y - beginPoint.y)
      this.ctx.stroke()

      const rect = genRectByTwoPoint(beginPoint, endPoint)

      // 将元素信息写入到数组中
      this.graffitiEleList.push(new GraffitiEle({ tool: 'Rect', ...rect, points: this.points }))
    }
  },
  drawEle(points: Point[]) {
    let beginPoint = points[0]
    let endPoint = points[1]

    this.ctx.beginPath()
    this.ctx.moveTo(beginPoint.x, beginPoint.y)
    this.ctx.rect(beginPoint.x, beginPoint.y, endPoint.x - beginPoint.x, endPoint.y - beginPoint.y)
    this.ctx.stroke()
  }
} as ToolOptions
