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
          <n-button
            :disabled="!canRedo"
            @click="reMake"
            >回退</n-button
          >
          <n-button
            class="ml-10px"
            @click="checkErase"
            >橡皮擦</n-button
          >
          <n-button
            class="ml-10px"
            @click="checkMarker"
            >记号笔</n-button
          >
          <n-button
            class="ml-10px"
            @click="checkRect"
            >画框</n-button
          >
          <n-button
            class="ml-10px"
            @click="checkArc"
            >画圆</n-button
          >
          <n-button
            class="ml-10px"
            @click="checkCursor"
            >选择</n-button
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
const canRedo = ref(false)

let timer: NodeJS.Timeout
onMounted(() => {
  const body = pCanvas.value.getBoundingClientRect()
  const height = body.height
  const width = body.width

  canvasGraffiti = new CanvasGraffiti({
    el: '#graffitiDemo',
    allowType: ['mouse', 'pen'],
    currentTool: 'Marker',
    width: width,
    height: height - 40,
    color: '#333',
    lineWidth: 3
  })

  canvasGraffiti.$on('change', (item, revokeSize, redoSize) => {
    if (revokeSize === 0) {
      canRevoke.value = false
    } else {
      canRevoke.value = true
    }

    if (redoSize === 0) {
      canRedo.value = false
    } else {
      canRedo.value = true
    }

    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      console.log(1, '保存咯')
    }, 10000)
  })
  canvasGraffiti.$on('sizeChange', ({ height }) => {
    pCanvas.value.style.height = height + 40 + 'px'
  })
})
onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer)
  }
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
    canvasGraffiti.updateCanvasSize({ height: height - 40 })
    pCanvas.value.style.height = height + 'px'
    pCanvas.value.removeEventListener('pointermove', resizeDiv)
    document.removeEventListener('pointerup', stopResize)
  }
}
function revoke() {
  canvasGraffiti.revoke()
}
function reMake() {
  canvasGraffiti.redo()
}
function checkMarker() {
  canvasGraffiti.setCurrentTool('Marker')
}
function checkErase() {
  canvasGraffiti.setCurrentTool('Erase')
}
function checkCursor() {
  canvasGraffiti.setCurrentTool('Cursor')
}
function checkRect() {
  canvasGraffiti.setCurrentTool('Rect')
}
function checkArc() {
  canvasGraffiti.setCurrentTool('Arc')
}
</script>
<style lang="scss" scoped>
.erase-cursor {
  cursor: url('@/assets/images/erase.png'), auto;
}
</style>
