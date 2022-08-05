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
