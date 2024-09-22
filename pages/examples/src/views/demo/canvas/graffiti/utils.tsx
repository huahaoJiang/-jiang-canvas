import { ToolType } from '@jianghh/canvas-graffiti'

export enum CANVAS_STATE {
  'unchanged' = 0,
  'changed' = 1,
  'saved' = 2
}

type BtnType = {
  toolName: ToolType
  icon: any
  active: boolean
}

export function renderIcon(className: string = '') {
  // @ts-ignore
  return () => h(<i class={className} />)
}
export const operaBtn = (activate?: ToolType): BtnType[] => {
  return [
    {
      toolName: 'Cursor',
      icon: renderIcon('i-fluent:cursor-16-regular'),
      active: activate === undefined || activate === 'Cursor'
    },
    {
      toolName: 'Pen',
      icon: renderIcon('i-material-symbols:ink-pen-rounded'),
      active: activate === 'Pen'
    },
    {
      toolName: 'Marker',
      icon: renderIcon('i-line-md:marker'),
      active: activate === 'Marker'
    },
    {
      toolName: 'Erase',
      icon: renderIcon('i-ph:eraser'),
      active: activate === 'Erase'
    },
    {
      toolName: 'Rect',
      icon: renderIcon('i-ph:rectangle'),
      active: activate === 'Rect'
    }
  ]
}

export function downloadBase64File(base64Data: string, filename = 'example.png', contentType = 'image/png') {
  // 去掉Base64编码字符串中的"data:image/png;base64,"等部分，只保留编码部分
  const byteCharacters = atob(base64Data.split(',')[1])

  // 使用Array.from将byteCharacters转换为Uint8Array
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  // 创建一个Blob对象，用于保存文件的二进制数据
  const blob = new Blob([new Uint8Array(byteNumbers)], { type: contentType })

  // 创建一个临时的a标签
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)

  // 设置下载的文件名
  link.download = filename

  // 模拟点击链接进行下载
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}
