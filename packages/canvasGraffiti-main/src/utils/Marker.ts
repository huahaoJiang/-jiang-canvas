import { ToolOptions } from '../types'

// 记号笔
export const Marker = {
  pointerdown({ offsetX: x, offsetY: y }: PointerEvent) {
    this.points.push({ x: x >> 0, y: y >> 0 })
    //绘制圆点，提升书写效果
    this.ctx.beginPath()
    this.ctx.arc(this.beginPoint.x, this.beginPoint.y, this.lineWidth / 2, 0, 2 * Math.PI)
    this.ctx.fill()
    this.ctx.closePath()
  },
  pointermove({ offsetX: x, offsetY: y }: PointerEvent) {
    this.points.push({ x: x >> 0, y: y >> 0 })
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
  }
} as ToolOptions
