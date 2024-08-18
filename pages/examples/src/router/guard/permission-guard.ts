import type { Router } from 'vue-router'

// const WHITE_LIST = ['/login', '/login/redirect']

export function createPermissionGuard(router: Router) {
  console.log(router)
  // router.beforeEach(async (to: any, from: any, next: any) => {
  //   // 空白跳转页逻辑
  //   next()
  // })
}
