<template>
  <div>
    <div id="card">
      <div
        ref="pCanvas"
        class="w-100% b-1-#eee position-relative h-440px overflow-hidden">
        <canvas id="particleDemo"> </canvas>
      </div>
    </div>
    <n-flex
      justify="space-around"
      size="large">
      <n-image
        v-for="item in logos"
        :key="item.src"
        height="60"
        preview-disabled
        :src="item.src"
        @click="handleImgChange(item)" />
    </n-flex>
  </div>
</template>
<script lang="ts" setup>
import { ParticleCanvas } from './canvas'
import { ParticleImg } from './image'
import { DEFAULT_IMAGE_LIST } from './utils'

const pCanvas = ref()
const mainCanvas = ref<ParticleCanvas>()

const logos = ref<ParticleImg[]>([])

onMounted(() => {
  canvasInit()
})

function canvasInit() {
  const body = pCanvas.value.getBoundingClientRect()
  const height = body.height
  const width = body.width

  mainCanvas.value = new ParticleCanvas({ width, height, el: '#particleDemo' })
  logos.value = DEFAULT_IMAGE_LIST.map(item => {
    return new ParticleImg(mainCanvas.value!, item.url)
  })
  mainCanvas.value.drawCanvas()
}

function handleImgChange(img: ParticleImg) {
  mainCanvas.value?.changeImg(img)
}
</script>

<style scoped lang="scss">
#particleDemo {
  cursor:
    url(/src/assets/images/mouse.png) 4 4,
    default;
}
</style>
