/* eslint-disable @typescript-eslint/consistent-type-imports */
import type { Message } from '@utils/common/naiveTools'

declare global {
  const $loadingBar: (typeof import('naive-ui'))['NLoadingBarProvider']
  const $notification: (typeof import('naive-ui'))['NNotificationProvider']
  const $message: Message
  const $dialog: (typeof import('naive-ui'))['NDialogProvider']
}

export {}
