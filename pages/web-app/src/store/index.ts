import { createPinia } from 'pinia'

/**
 * 注册app状态库
 */
export const registerStore = (app: any) => {
  app.use(createPinia())
}
