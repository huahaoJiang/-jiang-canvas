import { resolve } from 'path'
import type { UserConfigExport } from 'vite'
import { defineConfig } from 'vite'

// 生成打包后的 ts 类型文件
import dts from 'vite-plugin-dts'
console.log(__dirname, 7)
export const config: UserConfigExport = {
  resolve: {
    alias: {
      '@/': resolve(__dirname, './src/')
    },
    extensions: ['.ts', '.vue', '.tsx', '.js', '.json']
  },
  plugins: [
    dts({
      entryRoot: 'src', // 入口，不配置会生成嵌套根目录的文件
      outputDir: 'es', // 输出
      insertTypesEntry: true
    })
  ],
  // 打包为库
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'index',
      fileName: 'index'
    },
    target: 'modules',
    outDir: 'es',
    rollupOptions: {
      input: ['src/index.ts'],
      external: [],
      output: [
        {
          format: 'es', // es6 模块
          dir: 'es', // 输出文件夹
          entryFileNames: '[name].js', // 文件名
          preserveModules: true, // 保留模块的文件结构
          preserveModulesRoot: 'src', // 模块的入口
          exports: 'named'
        },
        {
          format: 'cjs', // cjs 模块
          dir: 'lib', // 输出文件夹
          entryFileNames: '[name].js', // 文件名
          preserveModules: true, // 保留模块的文件结构
          preserveModulesRoot: 'src', // 模块的入口
          exports: 'named'
        }
      ]
    }
  }
}

export default defineConfig(config)
