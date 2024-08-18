<template>
  <n-config-provider
    :theme-overrides="themStore.naiveThemeOverrides"
    :locale="zhCN"
    :date-locale="dateZhCN">
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider>
            <slot></slot>
            <NaiveProviderContent />
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { setupDialog, setupMessage } from '@utils/common/naiveTools'
import { useCssVar } from '@vueuse/core'
import { dateZhCN, zhCN } from 'naive-ui'
import { NLoadingBarProvider, useDialog, useLoadingBar, useMessage, useNotification } from 'naive-ui'

import { useThemeStore } from '@/store/theme'

const themStore = useThemeStore()
watch(
  () => themStore.naiveThemeOverrides.common,
  (vars: any) => {
    for (const key in vars) {
      useCssVar(`--${key}`, document.documentElement).value = vars[key]
      if (key === 'primaryColor') {
        window.localStorage.setItem('__THEME_COLOR__', vars[key])
      }
    }
  },
  { immediate: true }
)

// 挂载naive组件的方法至window, 以便在全局使用
function setupNaiveTools() {
  const _window = window as any
  _window.$loadingBar = useLoadingBar()
  _window.$notification = useNotification()

  _window.$message = setupMessage(useMessage())
  _window.$dialog = setupDialog(useDialog())
}

const NaiveProviderContent = defineComponent({
  setup() {
    setupNaiveTools()
  },
  render() {
    return h('div')
  }
})
</script>
