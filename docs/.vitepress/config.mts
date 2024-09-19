import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'canvas-graffiti',
  description: '一个canvas涂鸦库的文档',
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap', rel: 'stylesheet' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: 'CanvasGraffiti', link: '/markdown-examples' }
    ],
    sidebar: [
      {
        text: '简介',
        collapsed: false,
        items: [
          { text: '什么是CanvasGraffiti', link: '/graffiti-docs/intro' },
          { text: '开始', link: '/graffiti-docs/start' }
        ]
      },
      {
        text: '使用',
        collapsed: false,
        items: [
          { text: '属性', link: '/graffiti-docs/attribute' },
          { text: '方法', link: '/graffiti-docs/methods' }
        ]
      }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/huahaoJiang/jianghh-canvas' }]
  }
})
