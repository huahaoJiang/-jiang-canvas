import Layout from '@/layout/index.vue'

export const basicRoutes: Jianghh.IRoute[] = [
  {
    name: 'Layout',
    path: '/',
    component: Layout,
    redirect: '/desk',
    children: [
      {
        name: 'Desk',
        path: 'desk',
        component: () => import('@/views/desk/index.vue'),
        meta: {
          title: '首页',
          icon: 'mdi:alert-circle-outline'
        }
      },
      {
        name: 'ERROR-404',
        path: '404',
        component: () => import('@/views/error-page/404.vue'),
        meta: {
          title: '404',
          icon: 'mdi:alert-circle-outline'
        }
      },
      {
        name: 'ERROR-403',
        path: '403',
        component: () => import('@/views/error-page/403.vue'),
        meta: {
          title: '没有权限',
          icon: 'mdi:alert-circle-outline'
        }
      },
      {
        name: 'ERROR-500',
        path: '500',
        component: () => import('@/views/error-page/500.vue'),
        meta: {
          title: '内部错误',
          icon: 'mdi:alert-circle-outline'
        }
      }
    ]
  }
]

export const NOT_FOUND_ROUTE = {
  name: 'NotFound',
  path: '/:pathMatch(.*)*',
  redirect: '/error-page/404',
  isHidden: true
}

export const BASE_ROUTE = (redirect: string) => ({
  path: '/',
  name: 'Layout',
  component: Layout,
  redirect: redirect,
  children: []
})
