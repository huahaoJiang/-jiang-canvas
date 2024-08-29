import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'canvas-graffiti',
  description: '一个canvas涂鸦库的文档',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: 'CanvasGraffiti', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: '简介',
        items: [
          { text: '什么是CanvasGraffiti', link: '/graffiti-docs/intro' },
          { text: '开始', link: '/graffiti-docs/start' }
        ]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/huahaoJiang/jianghh-canvas' }]
  }
})
