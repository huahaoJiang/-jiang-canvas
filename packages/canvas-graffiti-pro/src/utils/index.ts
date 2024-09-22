import CanvasGraffiti, { EleGroup, GraffitiEle } from '..'

export function roundToNDecimalPlaces(num: number, n = 2) {
  return parseFloat(num.toFixed(n))
}

export function deepClone(obj: any, hash = new WeakMap()) {
  if (obj === null) return null // 如果传入的是null或undefined则直接返回
  if (obj instanceof Date) return new Date(obj) // 如果传入的是Date对象，则创建并返回一个新的Date对象
  if (obj instanceof RegExp) return new RegExp(obj) // 如果传入的是RegExp对象，则创建并返回一个新的RegExp对象

  // 如果循环引用了就用weakMap来解决
  if (hash.has(obj)) return hash.get(obj)

  let allDesc = Object.getOwnPropertyDescriptors(obj)
  let cloneObj = Object.create(Object.getPrototypeOf(obj), {})
  hash.set(obj, cloneObj)

  for (let key of Reflect.ownKeys(obj)) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      cloneObj[key] = deepClone(obj[key], hash) // 递归复制
    } else {
      Object.defineProperty(cloneObj, key, allDesc[key as string]) // 直接赋值或复制属性描述符
    }
  }

  return cloneObj
}

export function updateCtx(vm: CanvasGraffiti | EleGroup, config: GraffitiEle) {
  vm.ctx.strokeStyle = config.strokeStyle
  vm.ctx.lineWidth = config.lineWidth
  vm.ctx.shadowBlur = config.shadowBlur
  vm.ctx.fillStyle = config.fillStyle
  vm.ctx.shadowColor = config.shadowColor
}
