import type { RouteLocationNormalized } from 'vue-router'

type PreloadTask = (to: RouteLocationNormalized, from: RouteLocationNormalized) => void

// 浏览器空闲时间调度任务
function scheduler(callback: () => void, timeout?: number) {
  if (typeof window.requestIdleCallback === 'function') {
    requestIdleCallback(callback, { timeout })
  } else {
    setTimeout(callback, timeout)
  }
}

/**
 * 从非/track跳转到/track页面 preload /track/trackInvest页面中getTrackInvest
 */
const trackDetailPreload: PreloadTask = (to, from) => {
  // 避免在/track/trackInvest刷新触发两次getTrackInvest
  scheduler(() => {
    // do something
    console.log(to, from)
  })
}

// 预加載任务在全局后置钩子中被执行
export const PRELOAD_TASK: PreloadTask[] = [trackDetailPreload]
