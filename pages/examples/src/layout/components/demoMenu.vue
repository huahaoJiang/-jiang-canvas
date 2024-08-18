<template>
  <n-menu
    v-model:value="activeKey"
    default-expand-all
    :root-indent="36"
    :indent="12"
    :options="menuOptions"
    @update:value="handleUpdateValue" />
</template>

<script setup lang="ts">
import type { MenuOption } from 'naive-ui'

// function renderIcon(icon: Component) {
//   return () => h(NIcon, null, { default: () => h(icon) })
// }
const router = useRouter()
const { currentRoute } = router

const activeKey = ref<string | null>(null)
onMounted(() => {
  if (currentRoute.value.name) {
    console.log(currentRoute.value)

    activeKey.value = currentRoute.value.name as string
  }
})
const menuOptions: MenuOption[] = [
  {
    label: 'Canvas画布',
    key: 'canvas',
    children: [
      {
        label: '涂鸦库',
        key: 'CanvasGraffiti'
      }
    ]
  },
  {
    label: 'Canvas动画',
    key: 'animation',
    children: [
      {
        label: '粒子动画',
        key: 'CanvasParticle'
      },
      {
        label: '开屏动画',
        key: 'dd'
      }
    ]
  }
]

function handleUpdateValue(key: string) {
  if (key === currentRoute.value.name && !currentRoute.value.meta?.keepAlive) {
    location.reload()
  } else {
    router.push({ name: key })
  }
  // router.push('/' + key)
}
</script>
