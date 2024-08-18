export class Message {
  /**
   * 规则：
   * * loading message只显示一个，新的message会替换正在显示的loading message
   * * loading message不会自动清除，除非被替换成非loading message，非loading message默认2秒后自动清除
   */
  NMessage: any
  loadingMessage: any
  constructor(NMessage: any, loadingMessage: any = null) {
    this.NMessage = NMessage
    this.loadingMessage = loadingMessage
  }

  removeMessage(message: any, duration: number = 2000) {
    setTimeout(() => {
      if (message) {
        message.destroy()
        message = null
      }
    }, duration)
  }

  showMessage(type: string, content: string, option = { duration: 2000 }) {
    if (this.loadingMessage && this.loadingMessage.type === 'loading') {
      // 如果存在则替换正在显示的loading message
      this.loadingMessage.type = type
      this.loadingMessage.content = content

      if (type !== 'loading') {
        // 非loading message需设置自动清除
        this.removeMessage(this.loadingMessage, option.duration)
      }
    } else {
      // 不存在正在显示的loading则新建一个message,如果新建的message是loading message则将message赋值存储下来
      const message = this.NMessage[type](content, option)
      if (type === 'loading') {
        this.loadingMessage = message
      }
    }
  }

  loading(content: string) {
    this.showMessage('loading', content, { duration: 2000 })
  }

  success(content: string, option = { duration: 2000 }) {
    this.showMessage('success', content, option)
  }

  error(content: string, option = { duration: 2000 }) {
    this.showMessage('error', content, option)
  }

  info(content: string, option = { duration: 2000 }) {
    this.showMessage('info', content, option)
  }

  warning(content: string, option = { duration: 2000 }) {
    this.showMessage('warning', content, option)
  }
}

export function setupMessage(NMessage: any) {
  return new Message(NMessage)
}

export function setupDialog(NDialog: any) {
  NDialog.confirm = function (option: any = {}) {
    const showIcon = !!option.title
    return NDialog[option.type || 'warning']({
      showIcon,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: option.confirm,
      onNegativeClick: option.cancel,
      onMaskClick: option.cancel,
      ...option
    })
  }

  return NDialog
}
