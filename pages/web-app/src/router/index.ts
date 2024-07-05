import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import { setupRouterGuard } from '@/router/guard'
import { basicRoutes } from '@/router/routes'
import { PRELOAD_TASK } from '@/store/preloadTask'

const routes: Jianghh.IRoute[] = [...basicRoutes]
export const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_PUBLIC_PATH as string),
  // @ts-ignore 后续再改
  routes,
  scrollBehavior: () => {
    return { left: 0, top: 0 }
  }
})
router.afterEach((to, from) => {
  PRELOAD_TASK?.forEach(fn => fn(to, from))
})

router.onError((error, to) => {
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    // @ts-expect-error ...
    window.location = to.href
  }
})

export function resetRouter() {
  router.getRoutes().forEach(route => {
    const { name } = route
    if (name) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
  basicRoutes.forEach(route => {
    !router.hasRoute(route.name) && router.addRoute(route as RouteRecordRaw)
  })
}

export function setupRouter() {
  /*basicRoutes.forEach(route => {
    !router.hasRoute(route.name) && router.addRoute(route)
  })*/
  setupRouterGuard(router)
}
