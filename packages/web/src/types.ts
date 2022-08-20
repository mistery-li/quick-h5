import type { CSSProperties } from 'vue'

export interface IComponent {
  uuid?: string
  // 组件
  component: string
  // 事件列表
  events: Events[]
  // 坐标
  x: number
  y: number
  // 展示名称
  label: string
  // 传递给组件数据
  propValue: any
  style: customStyle
}

export type Events = {
  type: eventType
  params: eventParam
  open: boolean
}

export type customStyle = Partial<
  Record<keyof CSSProperties, string | number | undefined> & {
    textAlign:
      | 'start'
      | 'end'
      | 'left'
      | 'right'
      | 'center'
      | 'justify'
      | 'match-parent'
  }
>

export type PickByValue<T, V> = Pick<
  T,
  { [K in keyof T]: T[K] extends V ? K : never }[keyof T]
>
export type Entries<T> = {
  [K in keyof T]: [keyof PickByValue<T, T[K]>, T[K]]
}[keyof T][]

export type direKeys = 'lt' | 't' | 'rt' | 'r' | 'rb' | 'b' | 'lb' | 'l'

export type eventType = 'jump' | 'modal'

export type eventParam = {
  jumpUrl?: string
  modal?: {
    title: ''
    width: number
    height: number
    confirmText: string
    cancelText: string
    confirmColor: string
    confirmUrl: string
  }
}
export type componentEvent = {
  type: eventType
  params: eventParam
}
