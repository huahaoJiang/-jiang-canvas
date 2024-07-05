<template>
  <router-view v-slot="{ Component, route }">
    <transition
      name="fade-slide"
      mode="out-in"
      appear>
      <keep-alive :include="keepAliveRouteNames">
        <component
          :is="Component"
          v-if="appStore.reloadFlag"
          :key="handleKey(route)" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const router = useRouter()
const allRoutes = router.getRoutes()
const keepAliveRouteNames = computed(() => {
  const names = allRoutes.filter(route => route.meta?.keepAlive).map(route => route.name as string)
  if (names?.length) {
    return names
  } else {
    return [] as string[]
  }
})

function handleKey(route: any) {
  const query = JSON.stringify(route.query)
  if (keepAliveRouteNames.value.includes(route.name)) {
    return route.path
  }
  return route.path + query
}
</script>
