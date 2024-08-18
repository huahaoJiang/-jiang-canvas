import { ToolOptions } from '../types'
// 橡皮擦
export const Erase = {
  buffer: true,
  pointerdown({ offsetX: x, offsetY: y }) {
    const offset = this.eraseSize / 2
    this.points.push({ x, y })
    this.bufferCtx!.lineWidth = 1
    this.bufferCtx!.moveTo(x - offset, y - offset)
    this.bufferCtx!.beginPath()
    this.bufferCtx!.rect(x - offset, y - offset, this.eraseSize, this.eraseSize)
    this.bufferCtx!.stroke()
  },
  pointermove({ offsetX: x, offsetY: y }) {
    const offset = this.eraseSize / 2
    this.ctx.clearRect(x - offset, y - offset, this.eraseSize, this.eraseSize)

    this.bufferCtx!.clearRect(0, 0, this.el.width, this.el.height)
    this.bufferCtx!.moveTo(x - offset, y - offset)
    this.bufferCtx!.beginPath()
    this.bufferCtx!.rect(x - offset, y - offset, this.eraseSize, this.eraseSize)
    this.bufferCtx!.stroke()
  },
  pointerup() {
    this.bufferCtx!.clearRect(0, 0, this.el.width, this.el.height)
  }
} as ToolOptions
