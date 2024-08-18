import { ToolOptions } from '../types'
import { GraffitiEle, Point } from '../element'
import { roundToNDecimalPlaces } from '../utils'

// 记号笔
export const Marker = {
  pointerdown({ offsetX: x, offsetY: y }: PointerEvent) {
    this.points.push({ x: roundToNDecimalPlaces(x), y: roundToNDecimalPlaces(y) })
    //绘制圆点，提升书写效果
    this.ctx.beginPath()
    this.ctx.moveTo(this.beginPoint.x, this.beginPoint.y)
    this.ctx.arc(this.beginPoint.x, this.beginPoint.y, this.lineWidth / 2, 0, 2 * Math.PI)
    this.ctx.fill()
  },
  pointermove({ offsetX: x, offsetY: y }: PointerEvent) {
    this.points.push({ x: roundToNDecimalPlaces(x), y: roundToNDecimalPlaces(y) })
    if (this.points.length < 3) return
    const lastTwoPoints = this.points.slice(-2)
    const controlPoint = lastTwoPoints[0]
    const endPoint = {
      x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
      y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
    }
    this.ctx.beginPath()
    this.ctx.moveTo(this.beginPoint.x, this.beginPoint.y)
    this.ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y)
    this.ctx.stroke()
    this.beginPoint = endPoint
  },
  pointerup() {
    this.ctx.beginPath()
    //绘制圆点，提升书写效果
    this.ctx.arc(this.beginPoint.x, this.beginPoint.y, this.lineWidth / 2, 0, 2 * Math.PI)
    this.ctx.fill()
    let left: number = this.width
    let top: number = this.height
    let right: number = 0
    let bottom: number = 0

    this.points.forEach(point => {
      if (point.x < left) {
        left = point.x
      }
      if (point.x > right) {
        right = point.x
      }
      if (point.y < top) {
        top = point.y
      }
      if (point.y > bottom) {
        bottom = point.y
      }
    })
    // 将元素信息写入到数组中
    this.graffitiEleList.push(new GraffitiEle({ tool: 'Marker', left, top, right, bottom, points: this.points }))
  },
  drawEle(points: Point[]) {
    let pointList: Point[] = []
    let beginPoint = points[0]

    this.ctx.beginPath()
    this.ctx.moveTo(beginPoint.x, beginPoint.y)
    this.ctx.arc(beginPoint.x, beginPoint.y, this.lineWidth / 2, 0, 2 * Math.PI)

    this.ctx.fill()

    points.forEach(point => {
      pointList.push(point)
      if (pointList.length < 3) return

      const lastTwoPoints = pointList.slice(-2)
      const controlPoint = lastTwoPoints[0]

      const endPoint = {
        x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
        y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
      }

      this.ctx.beginPath()
      this.ctx.moveTo(beginPoint.x, beginPoint.y)

      this.ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y)
      this.ctx.stroke()

      beginPoint = endPoint
    })
    this.ctx.arc(beginPoint.x, beginPoint.y, this.lineWidth / 2, 0, 2 * Math.PI)
    this.ctx.fill()
    pointList = []
  }
} as ToolOptions
