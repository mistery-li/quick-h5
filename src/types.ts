import type { CSSProperties } from 'vue'

export interface IComponent {
  uuid?: string
  // 组件
  component: string
  // 坐标
  x: number
  y: number
  // 展示名称
  label: string
  // 传递给组件数据
  propValue: any
  // 图标
  icon: string
  style: CSSProperties
}

export type PickByValue<T, V> = Pick<
  T,
  { [K in keyof T]: T[K] extends V ? K : never }[keyof T]
>
export type Entries<T> = {
  [K in keyof T]: [keyof PickByValue<T, T[K]>, T[K]]
}[keyof T][]
