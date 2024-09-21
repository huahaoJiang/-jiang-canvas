<template>
  <div class="graffiti-container">
    <div class="opera">
      <div class="opera-bar card-shadow">
        <div>
          <n-button-group size="small">
            <n-button class="text-12px" :disabled="!canRevoke" @click="revoke"><i class="i-ion:arrow-undo-sharp"></i>撤销</n-button>
            <n-button class="text-12px" :disabled="!canRedo" @click="reMake"> <i class="i-ion:arrow-redo-sharp"></i>重做</n-button>
            <n-button class="text-12px" @click="clearAndReplay"><i class="i-ion:md-refresh"></i>重置</n-button>
          </n-button-group>

          <n-divider vertical />
          <n-button-group size="small">
            <n-button class="text-12px" @click="cutTools('Cursor')">
              <i class="i-fluent:cursor-16-regular"></i>
            </n-button>
            <n-button class="text-12px" @click="cutTools('Pen')">
              <i class="i-material-symbols:ink-pen-rounded"></i>
            </n-button>
            <n-button class="text-12px" @click="cutTools('Marker')">
              <i class="i-line-md:marker"></i>
            </n-button>
            <n-button class="text-12px" @click="cutTools('Erase')">
              <i class="i-ph:eraser"></i>
            </n-button>
            <n-button class="text-12px" @click="cutTools('Rect')"><i class="i-ph:rectangle"></i></n-button>
            <!--        <n-button class="ml-10px" @click="cutTools('Arc')">圆形</n-button>-->
          </n-button-group>
          <div class="bar-control">
            <i i-antd-up-outlined :class="{ 'rotate-180 mt-2px': showBar }" class="color-primary" @click="showBar = !showBar"></i>
          </div>
        </div>
        <n-collapse-transition class="mt-10px" appear :show="showBar">
          <n-checkbox class="text-12px" style="line-height: 28px" size="small" label="手写" :default-checked="true" @update:checked="handleAllowTouch" />
          <n-checkbox class="text-12px" style="line-height: 28px" size="small" label="笔写" :default-checked="true" @update:checked="handleAllowPen" />
          <n-button class="text-12px" size="small" @click="activate">画笔配置</n-button>
        </n-collapse-transition>
      </div>
    </div>
    <div ref="pCanvas" class="w-100% card-shadow position-relative mt-36px">
      <div class="canvas-tips text-12px">
        <div v-if="canvasState === CANVAS_STATE.saved"><i class="i-antd-check-circle-outlined color-green mr-2px mt--2px"></i>已自动保存</div>
        <div v-if="canvasState === CANVAS_STATE.changed"><i class="i-antd-info-circle-outlined color-red mr-2px mt--2px"></i>暂未保存</div>
      </div>
      <div ref="menuRef" class="canvas-menu-bar">
        <n-collapse-transition class="menu card-shadow" appear :show="showMenu">
          <n-button class="mr-10px" size="small" @click="exportContent">导出</n-button>
          <n-button size="small" @click="deleteGroup">删除(Del)</n-button>
        </n-collapse-transition>
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
  <n-drawer v-model:show="optionsActive" :width="300" placement="right" :z-index="21" :trap-focus="false" :block-scroll="false">
    <n-drawer-content title="画笔配置">
      <OptionsConfig v-model:formData="canvasGraffiti" />
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts" setup>
import type { EleGroup } from '@jianghh/canvas-graffiti'
import { CanvasGraffiti } from '@jianghh/canvas-graffiti'
import OptionsConfig from './OptionsConfig.vue'
import debounce from 'lodash.debounce'
import throttle from 'lodash.throttle'

// import type { EleGroup } from '/jhh_project/canvasPro/packages/canvas-graffiti-pro/src/element/index'
// import { CanvasGraffiti } from '/jhh_project/canvasPro/packages/canvas-graffiti-pro/src/index'

import { CANVAS_STATE } from './utils'
import { ToolType } from '@jianghh/canvas-graffiti'

const pCanvas = ref()
let canvasGraffiti = shallowRef<CanvasGraffiti>({} as CanvasGraffiti)
const canvasState = ref<CANVAS_STATE>(CANVAS_STATE.unchanged)

const canRevoke = ref(false)
const canRedo = ref(false)
const showBar = ref(false)
const resizeObserver = ref()

const menuRef = ref()
let menuWidth = 0
const showMenu = ref(false)

let lastWidth = 0
const allowType = ref(['mouse', 'pen', 'touch'])

let timer: NodeJS.Timeout
let initialData = window.localStorage.getItem('canvas_content')

const optionsActive = ref(false)
const activate = () => {
  optionsActive.value = true
}

onMounted(() => {
  init()
})

function init() {
  const body = pCanvas.value.getBoundingClientRect()
  const width = body.width
  lastWidth = Math.round(width)
  canvasGraffiti.value = new CanvasGraffiti(
    {
      el: '#graffitiDemo',
      allowType: allowType.value,
      initialTool: 'Cursor',
      width: width,
      height: 400,
      color: '#6b2312',
      lineWidth: 4
    },
    {
      onActionHandle: (item, revokeSize, redoSize) => {
        canvasState.value = CANVAS_STATE.changed
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
          canvasState.value = CANVAS_STATE.saved
          window.localStorage.setItem('canvas_content', JSON.stringify(canvasGraffiti.value.getCanvasData()))
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
    canvasGraffiti.value.setCanvasData(JSON.parse(initialData))
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
    canvasGraffiti.value.updateCanvasSize({ height })
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
  canvasGraffiti.value.updateAllowType(allowType.value)
}
function handleAllowPen(checked: boolean) {
  if (checked) {
    allowType.value.push('pen')
  } else {
    allowType.value = allowType.value.filter(item => item !== 'pen')
  }
  canvasGraffiti.value.updateAllowType(allowType.value)
}

function revoke() {
  canvasGraffiti.value.revoke()
}
function reMake() {
  canvasGraffiti.value.redo()
}

function clearAndReplay() {
  initialData = null
  window.localStorage.setItem('canvas_content', '')
  canvasGraffiti.value.clear()
  canvasGraffiti.value.destroy()
  init()
}

function deleteGroup() {
  canvasGraffiti.value.eleGroup?.deleteGroup()
  showMenu.value = false
}

function exportContent() {
  // 导出内容，做一个弹框
}

function cutTools(name: ToolType) {
  canvasGraffiti.value.toolName = name
}

function listenerSizeChange() {
  // 监听宽度变化，为了体验，不能在这里监听高度变化
  if ('ResizeObserver' in window) {
    const callback = (entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        const { width } = entry.contentRect
        const newWidth = Math.round(width)
        if (newWidth !== lastWidth) {
          canvasGraffiti.value.updateCanvasSize({ width })
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

.opera {
  position: absolute;
  top: 8px;
  left: 0;
  right: 0;
  z-index: 18;
  display: flex;

  justify-content: center;
  padding-bottom: 10px;
  .opera-bar {
    background: #fff;
    border-radius: 6px;
    padding: 4px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .bar-control {
      display: inline-flex;
      line-height: 28px;
      margin-left: 10px;
      cursor: pointer;
    }
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

.canvas-menu-bar {
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  .menu {
    padding: 4px 8px;
    border-radius: 6px;
  }
}
</style>
