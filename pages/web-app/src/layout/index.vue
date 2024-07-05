<template>
  <div style="height: 100%; position: relative">
    <n-layout
      class="bg-#f5f5f5"
      position="absolute">
      <n-layout-header
        style="padding: 12px 24px"
        bordered
        :style="{ height: useTheme.header.height + 'px' }">
        <div class="leading-9 text-#333 text-18px">Jianghh</div>
      </n-layout-header>

      <n-layout
        :has-sider="currentScreen === 'large'"
        :native-scrollbar="currentScreen === 'large'"
        position="absolute"
        :style="{ top: useTheme.header.height + 'px' }">
        <n-layout-sider
          v-if="currentScreen === 'large'"
          bordered
          :native-scrollbar="false"
          collapse-mode="transform"
          :collapsed-width="40"
          :width="220"
          show-trigger="arrow-circle"
          content-style="padding: 24px">
          <n-h3>画布涂鸦</n-h3>
        </n-layout-sider>
        <n-layout :native-scrollbar="false">
          <FloatLayer />
          <WaterMark
            :width="300"
            :sec-width="400">
            <div
              class="p-24px w-full"
              style="height: calc(100vh - 60px)">
              <AppMain />
            </div>
          </WaterMark>
          <n-layout-footer>
            <div class="bg-#fff w-full text-center leading-8 color-#999 text-12px">@jianghh 姜戈的前端站点</div>
          </n-layout-footer>
        </n-layout>
      </n-layout>
    </n-layout>
  </div>
</template>
<script setup lang="ts">
import throttle from 'lodash.throttle'

import { useThemeStore } from '@/store/theme'

import AppMain from './components/AppMain.vue'
import FloatLayer from './components/floatLayer.vue'
import WaterMark from './components/waterMark.vue'

const useTheme = useThemeStore()

onMounted(() => {
  window.addEventListener('resize', throttle(handlResize, 100))
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handlResize)
})

const currentScreen = ref<'large' | 'middle' | 'small'>('large')
function handlResize(e: any) {
  const width: number = e.target.innerWidth

  if (width && width < 1024) {
    currentScreen.value = 'middle'
  } else if (width && width < 640) {
    currentScreen.value = 'small'
  } else {
    currentScreen.value = 'large'
  }
}
</script>
