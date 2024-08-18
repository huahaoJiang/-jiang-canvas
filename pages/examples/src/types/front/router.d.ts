declare namespace Jianghh {
  interface IRoute {
    name: string
    path: string
    component: any
    isHidden?: boolean
    meta?: IMeta
    redirect?: string
    children?: IRoute[]
  }
  interface IMeta {
    title: string
    icon?: string
    role?: string[]
    index?: number
    keepAlive?: boolean
    highlight?: string
    isTop?: boolean
  }
}
