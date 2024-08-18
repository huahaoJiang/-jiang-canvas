import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state() {
    return {
      reloadFlag: true,
      collapsed: false
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
    }
  }
})
