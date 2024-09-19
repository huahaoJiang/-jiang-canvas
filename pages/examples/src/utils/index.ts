/**
 * @desc  函数节流
 * @param {Function} fn
 * @param {Number} wait
 * @returns {Function}
 */
export function throttle<T extends (...args: any[]) => void>(fn: T, wait: number) {
  let previous = 0

  return function (this: any, ...args: Parameters<T>) {
    const now = +new Date()

    if (now - previous > wait) {
      fn.apply(this, args)
      previous = now
    }
  }
}

/**
 * @desc  函数防抖
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */

export function debounce<T extends (...args: any[]) => void>(method: T, wait: number, immediate?: boolean) {
  let timeout: number | undefined
  return function (this: any, ...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout)
    }
    // 立即执行需要两个条件，一是immediate为true，二是timeout未被赋值或被置为null
    if (immediate) {
      const callNow = !timeout
      timeout = window.setTimeout(() => {
        window.clearTimeout(timeout)
      }, wait)
      if (callNow) {
        method.apply(this, args)
      }
    } else {
      // 如果immediate为false，则函数wait毫秒后执行
      timeout = window.setTimeout(() => {
        method.apply(this, args)
      }, wait)
    }
  }
}

/**
 * @desc 转百分比
 */
export function toPrecent(num: number | string) {
  let res = ''
  if (num !== undefined) {
    if (typeof num === 'string' && num.substr(-1, 1) === '%') {
      const beforeStr = num.substring(0, num.length - 1) as any
      if (!isNaN(beforeStr - 0)) {
        res = num
      }
    } else if (!isNaN((num as any) - 0)) {
      num = ((num as any) - 0) * 100

      res = keepTwoDecimalFull(num) + '%'
    } else {
      return num
    }
  }
  return res
}

/**
 * @desc 数字千分位分割 目前只针对整数部分
 */
export function numDivide(num: number | string, keepTwoDecimals = true) {
  if (isNaN(parseFloat(num + ''))) {
    return num
  }

  let signBit = ''

  if (Number(num) < 0) {
    signBit = '-'
    num = -num
  }

  const arr = ((keepTwoDecimals ? keepTwoDecimalFull(num) : num) + '').split('.')

  const int = arr[0].split('')

  const decimal = arr[1] ? `.${arr[1]}` : ''

  return signBit + int.reverse().reduce((str, curr, index) => `${curr}${index % 3 === 0 && index !== 0 ? ',' : ''}${str}`, '') + `${decimal}`
}

export function keepTwoDecimalFull(num: number | string) {
  if (isNaN(parseFloat(num + ''))) {
    return num
  }

  num = +num

  const arr = (Math.round(num * 100) / 100 + '').split('.')

  const int = arr[0]

  const decimal = (arr[1] || '').padEnd(2, '0')

  return `${int}.${decimal}`
}

// 这里只考虑了params为Record<string, string>的情况
export const getHashByParameter = (url: string, params: Record<string, any> = {}) => {
  return Object.keys(params)
    .sort()
    .reduce((acc, curr, index) => {
      const val = params[curr]
      if (index === 0) {
        return `${acc}${val ? `?${curr}=${val}` : '?'}`
      }
      return `${acc}${val ? `&${curr}=${val}` : ''}`
    }, url)
}

export const openNewTAB = (url: string, params: Record<string, any> = {}) => {
  const base = import.meta.env.VITE_PUBLIC_PATH
  const URL = `${base.slice(0, -1)}${getHashByParameter(url, params)}`
  const aTag = document.createElement('a')
  aTag.setAttribute('target', '_blank')
  aTag.setAttribute('href', URL)
  aTag.click()
  aTag.remove()
}

export function divideColors(lightColor: [number, number, number], darkColor: [number, number, number], m: number) {
  function interpolateColor(color1: number, color2: number, t: number) {
    return Math.round(color1 + (color2 - color1) * t)
  }

  const dividedColors = []

  const step = 1 / (m - 1)

  for (let i = 0; i < m; i++) {
    const t = i * step
    dividedColors.push([interpolateColor(darkColor[0], lightColor[0], t), interpolateColor(darkColor[1], lightColor[1], t), interpolateColor(darkColor[2], lightColor[2], t)])
  }

  return dividedColors.reverse()
}
