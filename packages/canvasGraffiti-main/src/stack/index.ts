interface ICacheStack {
  freshItem: string
  cacheList: string[]
  maxSize: number
  push: (item: string) => void
  pop: () => void
  clear: () => void
}

// 需要考虑初始情况为空白画布和有内容画布
export class CacheStack implements ICacheStack {
  freshItem: string = ''
  cacheList: string[] = []
  maxSize = 5
  constructor(maxSize?: number) {
    this.cacheList = []
    maxSize && (this.maxSize = maxSize)
  }
  get size() {
    return this.cacheList.length
  }
  get fresh() {
    return this.freshItem
  }

  push(item: string) {
    if (this.size === this.maxSize) {
      this.cacheList.shift()
    } else if (this.size > this.maxSize) {
      this.cacheList = this.cacheList
        .reverse()
        .splice(0, this.maxSize - 1)
        .reverse()
    }
    this.freshItem !== '' && this.cacheList.push(this.freshItem)
    this.freshItem = item
  }

  pop(): string {
    const item = this.size ? this.cacheList.pop() : ''
    this.freshItem = item
    return item
  }

  clear() {
    this.cacheList = []
  }
}

export function useStack(vm: any, maxSize = 5) {
  const stack = new CacheStack(maxSize)
  vm.cacheStack = stack
}
