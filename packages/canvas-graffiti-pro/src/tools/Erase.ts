import { ToolOptions } from '../types'
import { genRectByTwoPoint, isRectIntersect, Rect } from '../element'
import type { CanvasGraffiti } from '../index'
// 橡皮擦
export const Erase = {
  buffer: true,
  pointerdown({ offsetX: x, offsetY: y }) {
    this.bufferCtx!.moveTo(x, y)
    this.points.push({ x: x >> 0, y: y >> 0 })
    this.bufferCtx.lineJoin = 'round'
    this.bufferCtx.lineWidth = 4
    this.bufferCtx.strokeStyle = this.fillStyle
    this.bufferCtx.shadowColor = this.fillStyle
    this.bufferCtx.shadowBlur = 6

    actionHandle.call(this, {
      left: x,
      top: y,
      right: x,
      bottom: y
    })
  },
  pointermove({ offsetX: x, offsetY: y }) {
    this.points.push({ x: x >> 0, y: y >> 0 })

    if (this.points.length < 4) return
    const lastFourPoints = this.points.slice(-4)
    this.bufferCtx!.clearRect(0, 0, this.el.width, this.el.height)
    const endPoint = {
      x: (lastFourPoints[2].x + lastFourPoints[3].x) / 2,
      y: (lastFourPoints[2].y + lastFourPoints[3].y) / 2
    }
    const moveRect = genRectByTwoPoint(lastFourPoints[1], lastFourPoints[3])
    actionHandle.call(this, moveRect)

    this.bufferCtx.beginPath()
    this.bufferCtx.moveTo(this.beginPoint.x, this.beginPoint.y)
    this.bufferCtx.lineTo(lastFourPoints[0].x, lastFourPoints[0].y)
    this.bufferCtx.lineTo(lastFourPoints[1].x, lastFourPoints[1].y)
    this.bufferCtx.lineTo(lastFourPoints[2].x, lastFourPoints[2].y)
    this.bufferCtx.lineTo(lastFourPoints[3].x, lastFourPoints[3].y)
    this.bufferCtx.stroke()
    this.beginPoint = endPoint
  }
} as ToolOptions

function actionHandle(this: CanvasGraffiti, moveRect: Rect) {
  // 筛除相交的元素数组
  let hasIntersect = false
  this.graffitiEleList.forEach(ele => {
    if (isRectIntersect(ele, moveRect)) {
      switch (ele.tool) {
        case 'Marker':
          let isIntersect = ele.points.some((point, index) => {
            const nextPoint = ele.points[index + 1] || null
            let rect: Rect
            if (nextPoint) {
              rect = genRectByTwoPoint(point, nextPoint)
            } else {
              rect = {
                left: point.x - this.lineWidth,
                top: point.y - this.lineWidth,
                right: point.x + this.lineWidth,
                bottom: point.y + this.lineWidth
              }
            }
            if (isRectIntersect(rect, moveRect)) {
              return true
            }
          })
          if (isIntersect) {
            hasIntersect = true
            ele.deleteEle()
          }
          break
        default:
          break
      }
    }
  })
  if (hasIntersect) {
    this.clear()
    this.draw()
  }
}
