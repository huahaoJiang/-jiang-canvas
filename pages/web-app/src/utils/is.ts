const toString = Object.prototype.toString

export function is(val: any, type: string) {
  return toString.call(val) === `[object ${type}]`
}

export function isDef(val: any) {
  return typeof val !== 'undefined'
}

export function isUndef(val: any) {
  return typeof val === 'undefined'
}

export function isNull(val: any) {
  return val === null
}

export function isWhitespace(val: any) {
  return val === ''
}

export function isObject(val: any) {
  return !isNull(val) && is(val, 'Object')
}

export function isArray(val: any) {
  return val && Array.isArray(val)
}

export function isString(val: any) {
  return is(val, 'String')
}

export function isNumber(val: any) {
  return is(val, 'Number')
}

export function isBoolean(val: any) {
  return is(val, 'Boolean')
}

export function isDate(val: any) {
  return is(val, 'Date')
}

export function isRegExp(val: any) {
  return is(val, 'RegExp')
}

export function isFunction(val: any) {
  return typeof val === 'function'
}

export function isPromise(val: any) {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

export function isElement(val: any) {
  return isObject(val) && !!val.tagName
}

export function isWindow(val: any) {
  return typeof window !== 'undefined' && isDef(window) && is(val, 'Window')
}

export function isNullOrUndef(val: any) {
  return isNull(val) || isUndef(val)
}

export function isNullOrWhitespace(val: any) {
  return isNullOrUndef(val) || isWhitespace(val)
}

export function isEmpty(val: any) {
  if (isArray(val) || isString(val)) {
    return val.length === 0
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0
  }

  return false
}

/**
 * * 类似mysql的IFNULL函数
 * * 第一个参数为null/undefined/'' 则返回第二个参数作为备用值，否则返回第一个参数
 * @param {Number|Boolean|String} val
 * @param {Number|Boolean|String} def
 * @returns
 */
export function ifNull(val: any, def = '') {
  return isNullOrWhitespace(val) ? def : val
}

export function isUrl(path: string) {
  const reg =
    // eslint-disable-next-line no-useless-escape
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/
  return reg.test(path)
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export const isServer = typeof window === 'undefined'

export const isClient = !isServer
