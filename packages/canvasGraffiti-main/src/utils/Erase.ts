import { ToolOptions } from '../types'
// 橡皮擦
export const Erase = {
  pointerdown({ offsetX: x, offsetY: y }) {
    this.points.push({ x, y })
  },
  pointermove(event) {
    this.ctx.clearRect(event.offsetX - 0, event.offsetY - 0, 32, 32)
  }
} as ToolOptions
