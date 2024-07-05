import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// rollup打包分析插件
import visualizer from 'rollup-plugin-visualizer'
/**
 * * unocss插件，原子css
 * https://github.com/antfu/unocss
 */
import Unocss from 'unocss/vite'
import viteCompression from 'vite-plugin-compression'

/**
 * * 扩展setup插件，支持在script标签中使用name属性
 * usage: <script setup name="MyComp"></script>
 */
import { configHtmlPlugin } from './html'
import { configMockPlugin } from './mock'
import unplugin from './unplugin'

/*{
  template: {
    compilerOptions: {
      // 将所有包含短横线的标签作为自定义元素处理
      isCustomElement: tag => tag.includes('-')
    }
  }
}*/
export function createVitePlugins(viteEnv: any, isBuild: boolean) {
  const plugins = [
    vue(),
    vueJsx(),
    Unocss(),
    ...unplugin,
    configHtmlPlugin(viteEnv, isBuild),
    viteCompression({
      threshold: 5 * 1024
    })
  ]

  if (viteEnv?.VITE_APP_USE_MOCK) {
    plugins.push(configMockPlugin(isBuild))
  }

  if (isBuild) {
    plugins.push(
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true
      })
    )
  }

  return plugins
}
