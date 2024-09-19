<template>
  <div style="height: 100%; position: relative">
    <n-layout
      class="bg-#f5f5f5"
      position="absolute">
      <n-layout-header
        class="pt-6px"
        bordered
        :style="{ height: useTheme.header.height + 'px' }">
        <Header />
      </n-layout-header>

      <n-layout
        :has-sider="currentScreen === 'large'"
        :native-scrollbar="currentScreen === 'large'"
        position="absolute"
        :style="{ top: useTheme.header.height + 'px' }">
        <n-layout :native-scrollbar="false">
          <FloatLayer />
          <WaterMark
            :width="300"
            :sec-width="400">
            <div
              class="p-16px w-full"
              style="height: calc(100vh - 92px)">
              <AppMain />
            </div>
          </WaterMark>
          <n-layout-footer position="absolute">
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
import Header from './components/Header.vue'
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
