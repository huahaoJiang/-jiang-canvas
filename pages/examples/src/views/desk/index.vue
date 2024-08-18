<template>
  <div id="card">
    <div
      ref="pCanvas"
      class="w-100% b-1-#eee position-relative h-440px overflow-hidden">
      <canvas id="graffitiDemo"> </canvas>
      <div class="w-full f-b-c bg-#eee position-absolute bottom-0 py-6px px-12px">
        <div
          class="w-40px cursor-move h-20px"
          @pointerdown="
            e => {
              listenerMove(e)
            }
          ">
          <i
            i-antd-menu-outlined
            class="color-primary mt--2px"></i>
        </div>
        <div>
          <n-button
            :disabled="!canRevoke"
            @click="revoke"
            >撤销</n-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { CanvasGraffiti } from '/jhh_project/canvasPro/packages/canvas-graffiti-pro/src/index'

const pCanvas = ref()
let canvasGraffiti: CanvasGraffiti
const canRevoke = ref(false)
let timer: number
onMounted(() => {
  const body = pCanvas.value.getBoundingClientRect()
  const height = body.height
  const width = body.width

  canvasGraffiti = new CanvasGraffiti({
    el: '#graffitiDemo',
    allowType: ['mouse', 'pen'],
    width: width,
    height: height,
    containerHeightOffset: 40
  })

  canvasGraffiti.color = '#007aff'
  canvasGraffiti.lineWidth = 2
  canvasGraffiti.$on('stackChange', (item, size) => {
    if (size === 0) {
      canRevoke.value = false
    } else {
      canRevoke.value = true
    }
    if (timer) {
      console.log(timer, 59)
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      console.log(item, '保存咯')
    }, 10000)
  })
})

function listenerMove(e: PointerEvent) {
  let startY = e.clientY
  let startHeight = pCanvas.value.offsetHeight
  let height = startHeight

  pCanvas.value.addEventListener('pointermove', resizeDiv)
  document.addEventListener('pointerup', stopResize)
  function resizeDiv(e1: PointerEvent) {
    height = e1.clientY - startY + startHeight
    pCanvas.value.style.height = height + 'px'
  }

  function stopResize() {
    canvasGraffiti.updateHeight(height)
    pCanvas.value.removeEventListener('pointermove', resizeDiv)
    document.removeEventListener('pointerup', stopResize)
  }
}
function revoke() {
  canvasGraffiti.revoke()
}
</script>
