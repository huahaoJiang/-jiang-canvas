<template>
  <AppProvider>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </AppProvider>
</template>
<script setup lang="ts">
// import { useMainStore } from '@/store/main'
// const mainStore = useMainStore()
// mainStore.$patch(state => {
//   state.counter = 2
//   state.isAdmin = false
// })
</script>

<style scoped lang="scss">
#app {
  height: 100%;
  .n-config-provider {
    height: inherit;
  }
}
</style>
