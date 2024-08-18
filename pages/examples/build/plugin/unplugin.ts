import AutoImport from 'unplugin-auto-import/vite'
/**
 * * unplugin-icons插件，自动引入iconify图标
 * usage: https://github.com/antfu/unplugin-icons
 * 图标库: https://icones.js.org/
 */
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

import { getRootPath } from '../utils'

export default [
  AutoImport({
    imports: ['vue', 'vue-router'],
    dts: getRootPath('src/types/auto-imports.d.ts')
    // eslintrc: {
    //   enabled: false,
    //   filepath: getRootPath('./eslintrc-auto-import.json'),
    //   globalsPropValue: true
    // }
  }),
  Components({
    dts: getRootPath('src/types/components.d.ts'),
    resolvers: [NaiveUiResolver()]
  })
]
