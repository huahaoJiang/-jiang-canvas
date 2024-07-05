<template>
  <div class="error w-1280px">
    <n-result
      m-auto
      status="500"
      description="对不起，服务器内部错误.">
      <template #icon>
        <img
          src="@/assets/images/404.png"
          :width="500" />
      </template>
      <template #footer>
        <n-button
          size="large"
          @click="go(-1)"
          >返回</n-button
        >
      </template>
    </n-result>
  </div>
</template>
<script setup lang="ts">
const { go } = useRouter()
</script>
<style scoped lang="scss">
@import 'index.scss';
</style>
