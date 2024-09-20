export {}
// import CanvasGraffiti from '..'
//
// type Events = Record<string, ((...args: any) => void)[]>
// // 创建 Event Bus 类
// export type IEventBus = {
//   on: <T extends keyof Events>(eventName: T, handler: (...args: any) => void) => void
//   emit: <T extends keyof Events>(eventName: T, ...args: any) => void
//   off: <T extends keyof Events>(eventName: T, handler: (...args: any) => void) => void
// }
// export class EventBus implements IEventBus {
//   events: Events
//   constructor() {
//     this.events = {}
//   }
//
//   // 订阅事件
//   on<T extends keyof Events>(eventName: T, handler: (...args: any) => void) {
//     this.events[eventName] = this.events[eventName] || ([] as ((...args: any) => void)[])
//     this.events[eventName].push(handler)
//   }
//
//   // 发布事件
//   emit<T extends keyof Events>(eventName: T, ...args: any) {
//     if (this.events[eventName]) {
//       this.events[eventName].forEach(handler => {
//         handler(...args)
//       })
//     }
//   }
//
//   // 取消订阅
//   off<T extends keyof Events>(eventName: T, handler: (...args: any) => void) {
//     if (this.events[eventName]) {
//       this.events[eventName] = this.events[eventName].filter(h => h !== handler)
//     }
//   }
// }
// export function useEventBus(vm: CanvasGraffiti) {
//   const eventBus = new EventBus()
//   vm.$on = eventBus.on.bind(eventBus)
//   vm.$emit = eventBus.emit.bind(eventBus)
//   vm.$off = eventBus.off.bind(eventBus)
// }
