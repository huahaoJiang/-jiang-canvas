<template>
  <n-watermark
    class="w-full"
    :image="Logo"
    :image-width="64"
    :image-opacity="0.2"
    :font-size="13"
    font-color="rgba(51,51,51,0.06)"
    :font-weight="1000"
    :width="width"
    :height="height"
    :x-offset="-30"
    :y-offset="70"
    :rotate="-25">
    <n-watermark
      :image="Logo"
      :image-width="64"
      :image-opacity="0.2"
      :font-size="13"
      font-color="rgba(51,51,51,0.06)"
      :font-weight="1000"
      :width="secWidth"
      :x-gap="-yGap"
      :height="height"
      :x-offset="xOffset"
      :y-offset="80 + yOffset"
      :rotate="-25">
      <slot></slot>
    </n-watermark>
  </n-watermark>
</template>

<script lang="ts" setup>
import Logo from '@/assets/images/logo.png'

// const name = '姜戈的前端站点'
const props = defineProps({
  width: {
    type: Number,
    default() {
      return 300
    }
  },
  secWidth: {
    type: Number,
    default() {
      return 400
    }
  }
})
const xOffset = (props.secWidth - props.width) / 2
const height = 346
const yOffset = 228
const yGap = ((props.secWidth - props.width) * 4) / 5
</script>

<style scoped></style>
