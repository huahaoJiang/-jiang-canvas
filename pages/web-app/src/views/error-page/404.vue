<template>
  <div class="error w-1280px">
    <n-result
      m-auto
      status="404"
      description="抱歉，您访问的页面不存在。">
      <template #icon>
        <img
          src="@/assets/images/404.png"
          :width="500" />
      </template>
    </n-result>
  </div>
</template>

<style scoped lang="scss">
@import 'index.scss';
</style>
