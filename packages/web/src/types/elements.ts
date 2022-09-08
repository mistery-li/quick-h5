import { CSSProperties } from 'vue'

export interface baseElement {
  id: string
  component: string
  label: string
  lock?: boolean
  style: CSSProperties
}

interface TextElement extends baseElement {
  props: {
    type: string
    value: string | number
  }
}

interface srcProps {
  type: string
  src: string
}

interface ImageElement extends baseElement {
  props: srcProps
}

interface AudioElement extends baseElement {
  props: srcProps
  loop: boolean
}

interface VideoElement extends baseElement {
  props: srcProps
  loop: boolean
}

export type pageElement =
  | TextElement
  | ImageElement
  | AudioElement
  | VideoElement
