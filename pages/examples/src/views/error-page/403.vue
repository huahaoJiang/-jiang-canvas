<template>
  <div class="error w-1280px">
    <n-result
      m-auto
      status="403"
      description="对不起，您没有权限访问此页面.">
      <template #icon>
        <img
          src="@/assets/images/403.png"
          :width="500" />
      </template>
    </n-result>
  </div>
</template>
<style scoped lang="scss">
@import 'index.scss';
</style>
