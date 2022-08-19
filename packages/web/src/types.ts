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
  // 图标
  icon: string
  style: customStyle
}

export type Events = {
  data: {
    type: string
    jumpUrl: string
    modal: {
      title: string
      width: number
      height: number
      confirmText: string
      cancelText: string
      confirmColor: string
      confirmUrl: string
    }
  }
  open: boolean
  uuid: string
}

export type customStyle = Partial<
  Record<keyof CSSProperties, string | number | undefined>
>

export type PickByValue<T, V> = Pick<
  T,
  { [K in keyof T]: T[K] extends V ? K : never }[keyof T]
>
export type Entries<T> = {
  [K in keyof T]: [keyof PickByValue<T, T[K]>, T[K]]
}[keyof T][]

export type direKeys = 'lt' | 't' | 'rt' | 'r' | 'rb' | 'b' | 'lb' | 'l'
