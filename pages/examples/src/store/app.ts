import { defineStore } from 'pinia'

type ScreenSize = 'large' | 'middle' | 'small'
export const useAppStore = defineStore('app', {
  state() {
    return {
      reloadFlag: true,
      collapsed: false,
      screenSize: 'large'
    }
  },
  actions: {
    async reloadPage(): Promise<void> {
      $loadingBar.start()
      this.reloadFlag = false
      await nextTick()
      this.reloadFlag = true

      setTimeout(() => {
        document.documentElement.scrollTo({ left: 0, top: 0 })
        $loadingBar.finish()
      }, 100)
    },
    switchCollapsed(): void {
      this.collapsed = !this.collapsed
    },
    setCollapsed(collapsed: boolean): void {
      this.collapsed = collapsed
    },
    setScreenSize(size: 'large' | 'middle' | 'small') {
      this.screenSize = size
    }
  }
})
