interface ICacheStack {
  preItem: string
  revokeList: string[]
  maxSize: number
  push: (item: string) => void
  pop: () => void
  clear: () => void
}

// 需要考虑初始情况为空白画布和有内容画布
export class CacheStack implements ICacheStack {
  revokeList: string[] = []
  redoList: string[] = []
  preItem: string = '' // 存储上一步内容，由于撤销操作是需要滞后一步的，所以有个预备入栈的项
  maxSize = 5
  constructor(maxSize?: number) {
    this.revokeList = []
    maxSize && (this.maxSize = maxSize)
  }
  get revokeSize() {
    return this.revokeList.length
  }

  get redoSize() {
    return this.redoList.length
  }

  push(item: string) {
    if (this.revokeSize === this.maxSize) {
      this.revokeList.shift()
    } else if (this.revokeSize > this.maxSize) {
      this.revokeList = this.revokeList
        .reverse()
        .splice(0, this.maxSize - 1)
        .reverse()
    }
    // 预备入栈的item存在，往栈里推上一个item，错开入栈
    this.preItem !== '' && this.revokeList.push(this.preItem)
    // 当前item赋值给预备入栈的项
    this.preItem = item
    this.redoList = []
  }

  pop(): string {
    // 这时候的preItem是真正的上一步内容，保存到remakeList中
    this.redoList.push(this.preItem)

    const item = this.revokeSize ? this.revokeList.pop() : ''
    // 这时候的preItem是当前内容
    this.preItem = item
    return item
  }

  popRedo(): string {
    if (this.redoSize) {
      // item是上一步内容，返回用于绘制
      const item = this.redoList.pop()

      // 这时候的this.preItem是item的上一步内容
      this.revokeList.push(this.preItem)
      this.preItem = item
      return item
    } else {
      return ''
    }
  }

  clear() {
    this.revokeList = []
    this.redoList = []
    this.preItem = ''
  }
}

export function useStack(vm: any, maxSize = 5) {
  const stack = new CacheStack(maxSize)
  vm.cacheStack = stack
}
