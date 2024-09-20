import { genRectByTwoPoint, isRectIntersect, CustomRect, EleGroup } from '../element'
import { ToolOptions, CanvasGraffiti, SYSTEM_COLOR } from '..'

// 光标选择。交互操作，选中，拖动等操作实现
export const Cursor = {
  buffer: true,
  pointerdown({ offsetX: x, offsetY: y }) {
    this.bufferCtx!.moveTo(x, y)
    this.bufferCtx!.fillStyle = SYSTEM_COLOR
    this.bufferCtx!.strokeStyle = SYSTEM_COLOR
    // 当前存在Group对象并且是选中状态
    if (this.eleGroup?.isSelected) {
      // 判断当前是否在group内，true则准备拖动操作
      if (isRectIntersect(this.eleGroup, { left: x, top: y, right: x, bottom: y })) {
        this.ctx.canvas.style.cursor = 'move'
      } else {
        this.ctx.canvas.style.cursor = 'crosshair'

        // 在选中框外面，删除group内容，取消选中效果
        this.eleGroup.cancelSelected()
      }
    } else {
      this.beginPoint = { x, y }
    }
  },
  pointermove(event: PointerEvent) {
    const { offsetX: x, offsetY: y } = event
    // Group内事件，移动、缩放
    if (this.eleGroup?.isSelected) {
      this.eleGroup.moveGroup(x - this.beginPoint.x, y - this.beginPoint.y)
      this.customizeHandle?.onGroupMoveHandle?.call(this, event)
      this.beginPoint = { x, y }
    } else {
      // Group外事件，重新框选范围
      this.bufferCtx!.clearRect(0, 0, this.el.width, this.el.height)
      this.bufferCtx!.beginPath()
      this.bufferCtx!.moveTo(this.beginPoint.x, this.beginPoint.y)
      this.bufferCtx!.rect(this.beginPoint.x, this.beginPoint.y, x - this.beginPoint.x, y - this.beginPoint.y)
      this.endPoint = { x, y }
      this.bufferCtx!.fill()
    }
  },
  pointerup() {
    //有选中Group的情况下，动作结束
    if (this.eleGroup?.isSelected) {
      this.ctx.canvas.style.cursor = 'crosshair'
      this.customizeHandle?.onGroupHandle?.call(this, this.eleGroup)
      this.eleGroup.moveFinish()
      //记录当前动作，选择比较特殊，所以内部手动调用
      this.emitStackChange()
    } else {
      // 无选中Group的情况下，动作结束
      let moveRect: CustomRect
      if (!this.endPoint) {
        moveRect = {
          left: this.beginPoint.x - this.lineWidth,
          top: this.beginPoint.y - this.lineWidth,
          right: this.beginPoint.x + this.lineWidth,
          bottom: this.beginPoint.y + this.lineWidth
        }
      } else {
        moveRect = genRectByTwoPoint(this.beginPoint, this.endPoint)
      }

      //创建新的group
      actionHandle.call(this, moveRect)
      this.customizeHandle?.onGroupHandle?.call(this, this.eleGroup)
    }
  }
} as ToolOptions

function actionHandle(this: CanvasGraffiti, moveRect: CustomRect) {
  const eleList = this.graffitiEleList.filter(ele => {
    if (isRectIntersect(ele, moveRect)) {
      switch (ele.tool) {
        case 'Marker':
          return ele.points.some((point, index) => {
            const nextPoint = ele.points[index + 1] || null
            let rect: CustomRect
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
        default:
          return true
      }
    } else {
      return false
    }
  })
  if (this.eleGroup) {
    //在选中框外面，删除group内容，取消选中效果
    this.eleGroup.cancelSelected()
  }

  eleList.length && (this.eleGroup = new EleGroup(this, eleList).selected())
}
