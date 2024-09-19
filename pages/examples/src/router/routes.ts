import Display from '@/layout/display.vue'
import Layout from '@/layout/index.vue'

export const basicRoutes: Jianghh.IRoute[] = [
  {
    name: 'Layout',
    path: '/',
    component: Layout,
    redirect: '/graffiti',
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
      },
      {
        name: 'CanvasGraffiti',
        path: 'graffiti',
        component: () => import('@/views/demo/canvas/graffiti/index.vue'),
        meta: {
          title: '涂鸦画板',
          icon: 'mdi:alert-circle-outline',
          keepAlive: true
        }
      },
      {
        name: 'CanvasParticle',
        path: 'particle',
        component: () => import('@/views/demo/canvas/particle/index.vue'),
        meta: {
          title: '粒子动画',
          icon: 'mdi:alert-circle-outline',
          keepAlive: true
        }
      },
      {
        name: 'ThreePage_1',
        path: 'three_page_1',
        component: () => import('@/views/demo/three/pages/robot.vue'),
        meta: {
          title: '第一章',
          icon: 'mdi:alert-circle-outline',
          keepAlive: true
        }
      }
    ]
  },
  {
    name: 'Display',
    path: '/display',
    component: Display,
    redirect: '/graffiti',
    children: [
      {
        name: 'DisplayCanvasGraffiti',
        path: 'graffiti',
        component: () => import('@/views/demo/canvas/graffiti/index.vue'),
        meta: {
          title: '涂鸦画板',
          icon: 'mdi:alert-circle-outline',
          keepAlive: true
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
