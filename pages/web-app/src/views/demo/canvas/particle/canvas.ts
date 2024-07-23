import type { ParticleImg } from './image'
import { Particle } from './particle'
import { animateTime } from './utils'

interface CanvasOptions {
  el: string | HTMLCanvasElement
  width: number
  height: number
}
export class ParticleCanvas {
  canvasEle: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  dpr: number
  width: number
  height: number
  ParticleArr: Particle[]
  mouseX?: number // 鼠标X轴位置
  mouseY?: number // 鼠标Y轴位置
  constructor(options: CanvasOptions) {
    const { width, height, el } = options
    // 设置画布 获取画布上下文
    if (typeof el === 'string') this.canvasEle = document.querySelector(el) as HTMLCanvasElement
    else this.canvasEle = el
    this.ctx = this.canvasEle.getContext('2d') as CanvasRenderingContext2D

    this.dpr = window.devicePixelRatio || 1
    this.ctx.canvas.width = width * this.dpr
    this.ctx.canvas.height = height * this.dpr
    this.ctx.canvas.style.width = width + 'px'
    this.ctx.canvas.style.height = height + 'px'
    this.ctx.scale(this.dpr, this.dpr)

    this.width = width * this.dpr
    this.height = height * this.dpr

    this.ParticleArr = []
    // 监听鼠标移动
    this.canvasEle.addEventListener('mousemove', e => {
      const { left, top } = this.canvasEle.getBoundingClientRect()
      const { clientX, clientY } = e
      this.mouseX = clientX - left
      this.mouseY = clientY - top
    })
    this.canvasEle.onmouseleave = () => {
      this.mouseX = 0
      this.mouseY = 0
    }
  }
  // 改变图片 如果已存在图片则根据情况额外操作
  changeImg(img: ParticleImg) {
    if (this.ParticleArr.length) {
      // 获取新旧两个粒子数组与它们的长度
      const newPrtArr = img.particleData
      const newLen = newPrtArr.length
      let arr = this.ParticleArr
      const oldLen = arr.length

      // 调用change修改已存在粒子
      for (let idx = 0; idx < newLen; idx++) {
        const { totalX, totalY, color } = newPrtArr[idx]
        if (arr[idx]) {
          // 找到已存在的粒子 调用change 接收新粒子的属性
          arr[idx].change(totalX, totalY, color)
        } else {
          // 新粒子数组较大 生成缺少的粒子
          arr[idx] = new Particle(totalX, totalY, animateTime, color)
        }
      }

      // 新粒子数组较小 删除多余的粒子
      if (newLen < oldLen) this.ParticleArr = arr.splice(0, newLen)
      arr = this.ParticleArr
    } else {
      this.ParticleArr = img.particleData.map(item => new Particle(item.totalX, item.totalY, animateTime, item.color))
    }
  }
  drawCanvas() {
    this.clearRect()
    this.ParticleArr.forEach(particle => {
      particle.update(this.mouseX, this.mouseY)
      particle.draw(this.ctx)
    })
    window.requestAnimationFrame(() => this.drawCanvas())
  }
  clearRect() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
}
