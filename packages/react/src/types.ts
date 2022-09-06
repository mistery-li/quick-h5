import { CSSProperties } from 'react'

export interface ComponentItem<> {
  lock?: boolean
  uuid?: string
  label: string
  component: string
  propValue: any
  pos: Pos
  style: CSSProperties
}

export interface Pos {
  x: number
  y: number
}

export type Nullable<T> = null | T

export type directions = 'lt' | 't' | 'rt' | 'r' | 'rb' | 'b' | 'lb' | ''
