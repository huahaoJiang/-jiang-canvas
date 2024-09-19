import { ToolOptions, Point } from '..'
import { GraffitiEle } from '../element'
import { roundToNDecimalPlaces } from '../utils'

let isPen = false
// 钢笔
export const Pen = {
  pointerdown({ offsetX: x, offsetY: y, pointerType, pressure }: PointerEvent) {
    this.points.push({ x: roundToNDecimalPlaces(x), y: roundToNDecimalPlaces(y), pressure: roundToNDecimalPlaces(pressure) })
    if (pointerType === 'pen' && pressure !== 0) {
      // 苹果笔
      this.ctx.lineWidth = this.lineWidth * 0.5
      isPen = true
    } else {
      this.ctx.lineWidth = this.lineWidth * 0.8
      isPen = false
    }
    this.ctx.moveTo(this.beginPoint.x, this.beginPoint.y)
  },
  pointermove({ offsetX: x, offsetY: y, pressure }: PointerEvent) {
    const _pressure = roundToNDecimalPlaces(pressure)
    if (isPen) {
      this.points.push({ x: roundToNDecimalPlaces(x), y: roundToNDecimalPlaces(y), pressure: _pressure })
    } else {
      this.points.push({ x: roundToNDecimalPlaces(x), y: roundToNDecimalPlaces(y) })
    }
    if (this.points.length < 3) return
    const lastTwoPoints = this.points.slice(-2)
    const controlPoint = lastTwoPoints[0]
    const endPoint = {
      x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
      y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
    }

    if (isPen) {
      // 苹果笔
      const ratio = calculatorSpeedForPen(_pressure) + 0.5
      this.ctx.lineWidth = this.lineWidth * ratio
    } else {
      let distance = Math.sqrt(Math.pow(x - lastTwoPoints[0].x, 2) + Math.pow(y - lastTwoPoints[0].y, 2))

      const ratio = calculatorSpeed(distance) + 0.8
      this.ctx.lineWidth = this.lineWidth * ratio
    }

    this.ctx.beginPath()

    this.ctx.moveTo(this.beginPoint.x, this.beginPoint.y)
    this.ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y)
    this.ctx.stroke()
    this.beginPoint = endPoint
  },
  pointerup() {
    // 复原线宽
    this.ctx.lineWidth = this.lineWidth
    widthTarget = 0
    speedTarget = 0.2

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
    this.graffitiEleList.push(new GraffitiEle({ tool: 'Pen', left, top, right, bottom, points: this.points }))
  },
  drawEle(points: Point[]) {
    let pointList: Point[] = []
    let beginPoint = points[0]

    points.forEach(point => {
      pointList.push(point)
      if (pointList.length < 3) return

      const lastTwoPoints = pointList.slice(-2)
      const controlPoint = lastTwoPoints[0]

      const endPoint = {
        x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
        y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
      }

      if (point.pressure && point.pressure > 0) {
        // 苹果笔
        const ratio = calculatorSpeedForPen(point.pressure) + 0.5
        this.ctx.lineWidth = this.lineWidth * ratio
      } else {
        let distance = Math.sqrt(Math.pow(point.x - lastTwoPoints[0].x, 2) + Math.pow(point.y - lastTwoPoints[0].y, 2))
        const ratio = calculatorSpeed(distance) + 0.8
        this.ctx.lineWidth = this.lineWidth * ratio
      }

      this.ctx.beginPath()
      this.ctx.moveTo(beginPoint.x, beginPoint.y)

      this.ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y)
      this.ctx.stroke()

      beginPoint = endPoint
    })

    widthTarget = 0
    speedTarget = 0.2
    pointList = []
  }
} as ToolOptions

let widthTarget = 0
const TARGET_STEP_LENGTH = 2
const MAX_DISTANCE = 8
const RATIO_VALUE = 40

// 路径短的变粗，长的变细，初始0.8，最细0.5，最粗1
function calculatorSpeed(distance: number): number {
  // 达到最大值
  if (distance >= MAX_DISTANCE * 2) {
    // 往最小靠拢
    if (widthTarget <= -12 + TARGET_STEP_LENGTH) {
      widthTarget = -12
    } else {
      widthTarget -= TARGET_STEP_LENGTH
    }
    return widthTarget / RATIO_VALUE
  } else if (distance >= MAX_DISTANCE) {
    // 往0靠拢
    if (widthTarget <= 0) {
      widthTarget < -TARGET_STEP_LENGTH ? (widthTarget += TARGET_STEP_LENGTH) : (widthTarget = 0)
    } else {
      widthTarget > TARGET_STEP_LENGTH ? (widthTarget -= TARGET_STEP_LENGTH) : (widthTarget = 0)
    }
    return widthTarget / RATIO_VALUE
  } else {
    // 往最大靠拢
    widthTarget < MAX_DISTANCE - TARGET_STEP_LENGTH ? (widthTarget += TARGET_STEP_LENGTH) : (widthTarget = MAX_DISTANCE)
    return widthTarget / RATIO_VALUE
  }
}

let speedTarget = 0.2
let lastPressure = 0
const PRESSURE_STEP = 0.05
const BALANCE_SPEED = 0.35
// 路径短的变粗，长的变细，初始0.8，最细0.5，最粗1
function calculatorSpeedForPen(pressure: number): number {
  // 达到最大值
  if (pressure >= 0.5) {
    if (speedTarget >= 0.5) {
      speedTarget = 0.5
    } else {
      speedTarget += PRESSURE_STEP
    }
    return speedTarget
  } else if (pressure >= 0.15) {
    // 往0.35靠拢
    if (pressure > lastPressure) {
      if (speedTarget <= BALANCE_SPEED) {
        speedTarget += PRESSURE_STEP
      } else {
        speedTarget = BALANCE_SPEED
      }
    } else {
      if (speedTarget >= 0.2) {
        speedTarget -= PRESSURE_STEP
      } else {
        speedTarget = 0.15
      }
    }

    return speedTarget
  } else {
    // 往0靠拢
    if (speedTarget <= PRESSURE_STEP) {
      speedTarget = 0
    } else {
      speedTarget -= PRESSURE_STEP
    }
    return speedTarget
  }
}
