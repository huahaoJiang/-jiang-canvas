import { viteMockServe } from 'vite-plugin-mock'

export function configMockPlugin(isBuild: boolean) {
  return viteMockServe({
    mockPath: 'mock',
    enable: !isBuild
  })
}
