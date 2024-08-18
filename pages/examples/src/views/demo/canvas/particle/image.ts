import type { ParticleCanvas } from './canvas'
import { Particle } from './particle'
import { animateTime, IMAGE_VIEW_HEIGHT } from './utils'
export class ParticleImg {
  src: string
  particleData: Particle[] // 用于保存筛选后的粒子
  constructor(canvas: ParticleCanvas, src: string) {
    this.src = src
    this.particleData = []
    const image = new Image()
    image.crossOrigin = ''
    image.src = src

    // canvas 解析数据源获取粒子数据
    image.onload = () => {
      const imgW = ~~(image.width / image.height) * IMAGE_VIEW_HEIGHT
      const imgH = IMAGE_VIEW_HEIGHT

      const offsetW = ~~(canvas.width / canvas.dpr - imgW) / 2
      const offsetH = ~~(canvas.height / canvas.dpr - imgH) / 2
      canvas.ctx.drawImage(image, offsetW, offsetH, imgW, imgH)
      // 获取图片像素数据
      const imgData = canvas.ctx.getImageData(offsetW * canvas.dpr, offsetH * canvas.dpr, imgW * canvas.dpr, imgH * canvas.dpr).data // 获取像素点数据
      canvas.clearRect()

      for (let y = 0; y < imgH * canvas.dpr; y += 3) {
        for (let x = 0; x < imgW * canvas.dpr; x += 3) {
          // 像素点的序号
          const index = (x + y * imgW * canvas.dpr) * 4

          // 在数组中对应的值
          const r = imgData![index]
          const g = imgData![index + 1]
          const b = imgData![index + 2]
          const a = imgData![index + 3]
          const sum = r + g + b + a
          // 筛选条件
          if (sum >= 100) {
            const particle = new Particle(x / canvas.dpr + offsetW, y / canvas.dpr + offsetH, animateTime, [r, g, b, a])
            this.particleData.push(particle)
          }
        }
      }
    }
  }
}
