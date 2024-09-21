<template>
  <n-form label-width="250px" ref="formRef" :model="OptionsColumns" size="small" label-placement="top">
    <n-grid :cols="12" :x-gap="24">
      <n-form-item-gi :span="12" label="画笔大小">
        <n-slider v-model:value="OptionsColumns.lineWidth" @update:value="changeValue" :min="2" :max="10" :step="1" />
      </n-form-item-gi>
      <n-form-item-gi :span="12" label="画笔颜色">
        <n-color-picker v-model:value="OptionsColumns.strokeStyle" @update:value="changeValue" :show-alpha="true" />
      </n-form-item-gi>
      <n-form-item-gi :span="12" label="阴影大小">
        <n-slider v-model:value="OptionsColumns.shadowBlur" @update:value="changeValue" :max="10" :step="1" />
      </n-form-item-gi>
      <n-form-item-gi :span="12" label="颜色阴影">
        <n-color-picker v-model:value="OptionsColumns.shadowColor" @update:value="changeValue" :show-alpha="true" />
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script lang="ts" setup>
import type { CanvasGraffiti } from '@jianghh/canvas-graffiti'
interface Props {
  formData: CanvasGraffiti
}
const props = defineProps<Props>()
const emit = defineEmits(['update:formData'])
const { formData } = props
const OptionsColumns = ref({
  lineWidth: ref(formData.lineWidth),
  strokeStyle: ref(formData.strokeStyle),
  shadowColor: ref(formData.shadowColor),
  shadowBlur: ref(formData.shadowBlur)
})

function changeValue() {
  emit('update:formData', Object.assign(props.formData, OptionsColumns.value))
}
</script>
