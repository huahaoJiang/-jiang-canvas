<template>
  <div class="graffiti-container">
    <div ref="pCanvas" class="w-100% card-shadow position-relative">
      <div class="canvas-tips text-12px">
        <div v-if="cavnasState === CANVAS_STATE.saved"><i class="i-antd-check-circle-outlined color-green mr-2px mt--2px"></i>已自动保存</div>
        <div v-if="cavnasState === CANVAS_STATE.changed"><i class="i-antd-info-circle-outlined color-red mr-2px mt--2px"></i>暂未保存</div>
      </div>
      <div ref="menuRef" class="cavnas-menu-bar card-shadow">
        <n-collapse-transition class="menu" :show="showMenu">
          <n-button class="mr-10px" size="small" @click="exportContent">导出</n-button>
          <n-button size="small" @click="deleteGroup">删除(Del)</n-button>
        </n-collapse-transition>
      </div>
      <div class="opera">
        <div class="opera-bar card-shadow">
          <n-collapse-transition class="mx-12px my-6px" :show="showBar">
            <n-checkbox size="small" label="手写" :default-checked="true" @update:checked="handleAllowTouch" />
            <n-checkbox size="small" label="笔写" :default-checked="true" @update:checked="handleAllowPen" />
            <n-divider vertical />
            <n-button :disabled="!canRevoke" @click="revoke">撤销</n-button>
            <n-button :disabled="!canRedo" class="ml-10px" @click="reMake">回退</n-button>
            <n-divider vertical />
            <n-button class="ml-10px" @click="cutTools('Cursor')">选择</n-button>
            <n-button class="ml-10px" @click="cutTools('Pen')">钢笔</n-button>
            <n-button class="ml-10px" @click="cutTools('Marker')">记号笔</n-button>
            <n-button class="ml-10px" @click="cutTools('Erase')">橡皮擦</n-button>

            <n-button class="ml-10px" @click="cutTools('Rect')">画框</n-button>
            <n-button class="ml-10px" @click="cutTools('Arc')">画圆</n-button>
            <n-button class="ml-10px" @click="clearAndReplay">重置</n-button>
          </n-collapse-transition>
        </div>
        <div class="btn">
          <n-button card-shadow strong circle type="default" @click="showBar = !showBar">
            <template #icon>
              <i i-antd-up-outlined :class="{ 'rotate-180 mt-2px': showBar }" class="color-primary"></i>
            </template>
          </n-button>
        </div>
      </div>
      <canvas id="graffitiDemo"> </canvas>
      <div class="drag-btn">
        <n-button
          class="cursor-move card-shadow bg-#fff"
          strong
          circle
          secondary
          type="default"
          @pointerdown="
            (e: PointerEvent) => {
              listenerMove(e)
            }
          ">
          <template #icon>
            <i i-antd-menu-outlined class="color-primary mt--2px"></i>
          </template>
        </n-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
// import type { EleGroup } from '@jianghh/canvas-graffiti'
// import { CanvasGraffiti } from '@jianghh/canvas-graffiti'
import debounce from 'lodash.debounce'
import throttle from 'lodash.throttle'

import type { EleGroup } from '/jhh_project/canvasPro/packages/canvas-graffiti-pro/src/element/index'
import { CanvasGraffiti } from '/jhh_project/canvasPro/packages/canvas-graffiti-pro/src/index'

import { CANVAS_STATE } from './utils'
import { ToolType } from '@jianghh/canvas-graffiti'

const pCanvas = ref()
let canvasGraffiti: CanvasGraffiti
const cavnasState = ref<CANVAS_STATE>(CANVAS_STATE.unchanged)

const canRevoke = ref(false)
const canRedo = ref(false)
const showBar = ref(true)
const resizeObserver = ref()

const menuRef = ref()
let menuWidth = 0
const showMenu = ref(false)

let lastWidth = 0
const allowType = ref(['mouse', 'pen', 'touch'])

let timer: NodeJS.Timeout
let initialData = window.localStorage.getItem('canvas_content')
onMounted(() => {
  init()
})

function init() {
  const body = pCanvas.value.getBoundingClientRect()
  const width = body.width
  lastWidth = Math.round(width)
  canvasGraffiti = new CanvasGraffiti(
    {
      el: '#graffitiDemo',
      allowType: allowType.value,
      initialTool: 'Pen',
      width: width,
      height: 400,
      color: '#6b2312',
      lineWidth: 4
    },
    {
      onActionHandle: (item, revokeSize, redoSize) => {
        cavnasState.value = CANVAS_STATE.changed
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
          cavnasState.value = CANVAS_STATE.saved
          window.localStorage.setItem('canvas_content', JSON.stringify(canvasGraffiti.getCanvasData()))
        }, 5000)
      },
      onGroupHandle: (group: EleGroup | null) => {
        if (group) {
          showMenu.value = true
          nextTick(() => {
            !menuWidth && (menuWidth = menuRef.value.getBoundingClientRect().width)
            const xPoint = (group.left + group.right - menuWidth) / 2
            menuRef.value.style.top = (group.top > 46 ? group.top - 45 : 1) + 'px'
            menuRef.value.style.left = (xPoint > 1 ? xPoint : 1) + 'px'
          })
        } else {
          showMenu.value = false
        }
      },
      onGroupMoveHandle() {
        showMenu.value = false
      }
    }
  )
  // 重写内容
  if (initialData) {
    canvasGraffiti.setCanvasData(JSON.parse(initialData))
  }
  listenerSizeChange()
}

// 拖动改变画布高度事件
function listenerMove(e: PointerEvent) {
  showMenu.value = false

  let startY = e.clientY
  let startHeight = pCanvas.value.offsetHeight
  let height = startHeight

  const throttleHandleMove = throttle(resizeDiv, 16)

  pCanvas.value.addEventListener('pointermove', throttleHandleMove)
  document.addEventListener('pointerup', stopResize)
  function resizeDiv(e1: PointerEvent) {
    height = e1.clientY - startY + startHeight
    pCanvas.value.style.height = height + 'px'
  }

  function stopResize() {
    // pCanvas.value.style.height = height + 'px'
    canvasGraffiti.updateCanvasSize({ height })
    pCanvas.value.removeEventListener('pointermove', throttleHandleMove)
    document.removeEventListener('pointerup', stopResize)
  }
}

function handleAllowTouch(checked: boolean) {
  if (checked) {
    allowType.value.push('touch')
  } else {
    allowType.value = allowType.value.filter(item => item !== 'touch')
  }
  canvasGraffiti.updateAllowType(allowType.value)
}
function handleAllowPen(checked: boolean) {
  if (checked) {
    allowType.value.push('pen')
  } else {
    allowType.value = allowType.value.filter(item => item !== 'pen')
  }
  canvasGraffiti.updateAllowType(allowType.value)
}

function revoke() {
  canvasGraffiti.revoke()
}
function reMake() {
  canvasGraffiti.redo()
}

function clearAndReplay() {
  canvasGraffiti.clear()
  canvasGraffiti.destroy()
  window.localStorage.setItem('canvas_content', '')
  init()
}
function deleteGroup() {
  canvasGraffiti.eleGroup?.deleteGroup()
  showMenu.value = false
}
function exportContent() {
  // 导出内容，做一个弹框
}

function cutTools(name: ToolType) {
  canvasGraffiti.toolName = name
}

function listenerSizeChange() {
  // 监听宽度变化，为了体验，不能在这里监听高度变化
  if ('ResizeObserver' in window) {
    const callback = (entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        const { width } = entry.contentRect
        const newWidth = Math.round(width)
        if (newWidth !== lastWidth) {
          canvasGraffiti.updateCanvasSize({ width })
          lastWidth = newWidth
        }
      }
    }
    resizeObserver.value = new ResizeObserver(debounce(callback, 400))
    resizeObserver.value.observe(pCanvas.value)
  } else {
    // 须有降级方案，可以自行添加
    console.warn('ResizeObserver is not supported.')
  }
}

onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer)
  }
  resizeObserver.value.disconnect()
})
</script>
<style lang="scss" scoped>
.graffiti-container {
  overflow: inherit;
  padding-bottom: 100px;
  width: 100%;
  touch-action: none;
}

canvas {
  image-rendering: crisp-edges;
}

.erase-cursor {
  cursor: url('@/assets/images/erase.png'), auto;
}
.opera {
  position: absolute;
  top: 4px;
  left: 0px;
  right: 0px;
  display: flex;
  justify-content: center;
  .opera-bar {
    background: #fff;
    border-radius: 6px;
  }
  .btn {
    position: absolute;
    bottom: -36px;
    left: 50%;
    transform: translateX(-50%);
  }
}
.drag-btn {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}
.canvas-tips {
  position: absolute;
  right: 20px;
  top: 20px;
}
.cavnas-menu-bar {
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  border-radius: 6px;
  .menu {
    padding: 4px 8px;
  }
}
</style>
