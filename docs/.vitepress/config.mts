import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/docs/',
  title: '姜戈',
  titleTemplate: '姜戈',
  head: [['link', { rel: 'icon', href: '/public/j.svg' }]],
  appearance: true,
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: '文档站点',
    search: {
      provider: 'local'
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '涂鸦库', link: '/graffiti-docs/intro' }
    ],
    sidebar: [
      {
        text: '@jianghh/canvas-graffiti',
        items: [{
          text: '简介',
          collapsed: false,
          items: [
            { text: 'canvas graffiti', link: '/graffiti-docs/intro' },
            { text: '开始', link: '/graffiti-docs/start' }
          ]
        },
          {
            text: '使用',
            collapsed: false,
            items: [
              { text: 'Options参数', link: '/graffiti-docs/params' },
              { text: '自定义事件监听', link: '/graffiti-docs/events' },
              { text: '实例属性', link: '/graffiti-docs/attribute' },
              { text: '实例方法', link: '/graffiti-docs/methods' }
            ]
          }
        ],
      },
    ],
    footer: {
      message: 'Released under the MIT License.',
      // copyright: 'Copyright © jianghh'
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/huahaoJiang/jianghh-canvas' }],
    outline: {level:'deep',label:'本页目录'},
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    // carbonAds: {
    //   code: 'your-carbon-code',
    //   placement: 'your-carbon-placement'
    // }
  }
})
