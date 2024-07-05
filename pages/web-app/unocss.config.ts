import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  shortcuts: [
    ['f-c-c', 'flex justify-center items-center'],
    ['f-b-c', 'flex justify-between items-center'],
    ['b-1-#eee', 'border-1 border-solid border-#eee'],
    ['text-ellipsis', 'truncate'],
    ['wh-full', 'w-full h-full']
  ],
  rules: [
    [/^bc-(.+)$/, ([, color]) => ({ 'border-color': `#${color}` })],
    ['card-shadow', { 'box-shadow': '0px, 6px rgba(0, 0, 0, 0.05)' }],
    ['linear', { transition: 'all .15s linear' }],
    ['cursor', { cursor: 'pointer' }],
    ['u-flex', { display: 'flex' }]
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle'
      },
      collections: {
        antd: () => import('@iconify-json/ant-design').then(i => i.icons as any)
      }
    })
  ]
})
