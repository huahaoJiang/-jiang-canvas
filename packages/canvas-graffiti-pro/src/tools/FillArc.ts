import { ToolOptions } from '..'
import { Arc } from './Arc'
// 线
export const FillArc = {
  ...Arc,
  pointermove(event) {
    Arc.pointermove?.call(this, event)
    this.bufferCtx?.fill()
  },
  pointerup(event) {
    Arc.pointerup?.call(this, event)
    this.ctx?.fill()
  }
} as ToolOptions
