import type { CSSProperties } from 'vue'

import { IComponent } from '../types'

const COMMON_STYLES: CSSProperties = {
  textAlign: 'center',
  color: '#000000',
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1,
}

export const COMPONENTS: IComponent[] = [
  {
    component: 'VText',
    label: '文字',
    propValue: '我是文本',
    icon: 'wenben',
    events: [],
    x: 0,
    y: 0,
    style: {
      ...COMMON_STYLES,
      width: 100,
      height: 22,
      fontWeight: 500,
      lineHeight: 1.5,
    },
  },
  {
    component: 'VButton',
    label: '按钮',
    propValue: '按钮',
    icon: 'button',
    events: [],
    x: 0,
    y: 0,
    style: {
      ...COMMON_STYLES,
      width: 100,
      height: 34,
      borderWidth: 1,
      borderColor: '',
      borderRadius: 0,
    },
  },
  {
    component: 'Picture',
    label: '图片',
    icon: 'tupian',
    // propValue: new URL(`../assets/vue.svg`, import.meta.url).href,
    propValue:
      'https://tse1-mm.cn.bing.net/th/id/OET.f9dd8f359bb4475bb3f49399f673d5d3?w=272&h=272&c=7&rs=1&o=5&pid=1.9',
    events: [],
    x: 0,
    y: 0,
    style: {
      width: 300,
      height: 200,
      borderRadius: 0,
      borderWidth: 1,
    },
  },
]
