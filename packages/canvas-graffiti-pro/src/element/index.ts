import { roundToNDecimalPlaces } from '../utils'
import { ToolType, Point } from '..'
import CanvasGraffiti from '../index'
export * from './group'

export type IElement = Required<IElementOptions> & {}

export interface IElementOptions {
  tool: ToolType
  left: number
  top: number
  right: number
  bottom: number
  points: Point[]
  lineWidth: CanvasGraffiti['lineWidth']
  shadowBlur: CanvasGraffiti['shadowBlur']
  shadowColor: CanvasGraffiti['shadowColor']
  strokeStyle: CanvasGraffiti['strokeStyle']
  fillStyle: CanvasGraffiti['fillStyle']
}

export type OptionNumberKey = keyof Omit<IElementOptions, 'tool' | 'points' | 'shadowColor' | 'fillStyle' | 'strokeStyle'>

export type CustomRect = { left: number; right: number; top: number; bottom: number }

export class GraffitiEle implements IElement {
  tool: ToolType
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
  points: Point[]
  lineWidth: CanvasGraffiti['lineWidth']
  shadowBlur: CanvasGraffiti['shadowBlur']
  shadowColor: CanvasGraffiti['shadowColor']
  strokeStyle: CanvasGraffiti['strokeStyle']
  fillStyle: CanvasGraffiti['fillStyle']
  isDeleted: boolean = false

  constructor(options: IElementOptions) {
    for (let key in options) {
      if (key === 'tool') {
        this.tool = options.tool
      } else if (key === 'points') {
        this.points = options.points
      } else if (key === 'shadowColor') {
        this.shadowColor = options.shadowColor
      } else if (key === 'strokeStyle') {
        this.strokeStyle = options.strokeStyle
      } else if (key === 'fillStyle') {
        this.fillStyle = options.fillStyle
      } else {
        this[key as OptionNumberKey] = options[key as OptionNumberKey]
      }
    }
    this.width = this.right - this.left
    this.height = this.bottom - this.top
  }

  moveEle(offsetX: number, offsetY: number) {
    this.left = roundToNDecimalPlaces(this.left + offsetX)
    this.right = roundToNDecimalPlaces(this.right + offsetX)
    this.top = roundToNDecimalPlaces(this.top + offsetY)
    this.bottom = roundToNDecimalPlaces(this.bottom + offsetY)

    this.points = this.points.map(point => {
      return { x: roundToNDecimalPlaces(point.x + offsetX), y: roundToNDecimalPlaces(point.y + offsetY) }
    })
  }

  // moveFinish() {
  //   return deepClone(this)
  // }

  deleteEle() {
    this.isDeleted = true
  }
}

// 判断两个区域是否相交
export function isRectIntersect(r1: CustomRect, r2: CustomRect) {
  return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top)
}

// 根据两点生成Rect
export function genRectByTwoPoint(p1: Point, p2: Point) {
  return {
    left: Math.min(p1.x, p2.x),
    top: Math.min(p1.y, p2.y),
    right: Math.max(p1.x, p2.x),
    bottom: Math.max(p1.y, p2.y)
  }
}
