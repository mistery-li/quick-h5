import { customStyle, IComponent } from '../types'
import { TEXT_TITLE_STYLE, TEXT_SUB_TITLE_STYLE } from './Text'

const COMMON_STYLES: customStyle = {
  textAlign: 'center',
  color: '#000000',
  fontWeight: 500,
  lineHeight: 1,
}

export const IMAGE_COMPONENTS: IComponent[] = [
  {
    component: 'Picture',
    label: '图片',
    propValue: new URL(`../assets/4114628.jpg`, import.meta.url).href,
    events: [],
    x: 0,
    y: 0,
    style: {
      width: 300,
      height: 200,
      borderRadius: 0,
      borderWidth: 1,
      rotate: 0,
    },
  },
]

export const TEXT_COMPONENTS: IComponent[] = [
  {
    component: 'VText',
    label: '标题',
    propValue: '标题',
    events: [],
    x: 0,
    y: 0,
    style: {
      ...COMMON_STYLES,
      ...TEXT_TITLE_STYLE,
      width: 200,
      height: TEXT_TITLE_STYLE.fontSize,
      fontWeight: 500,
      lineHeight: 1,
      rotate: 0,
    },
  },
  {
    component: 'VText',
    label: '副标题',
    propValue: '副标题',
    events: [],
    x: 0,
    y: 0,
    style: {
      ...COMMON_STYLES,
      ...TEXT_SUB_TITLE_STYLE,
      width: 200,
      height: TEXT_TITLE_STYLE.fontSize,
      fontWeight: 500,
      lineHeight: 1,
      rotate: 0,
    },
  },
  {
    component: 'VText',
    label: '正文内容',
    propValue: '正文内容',
    events: [],
    x: 0,
    y: 0,
    style: {
      ...COMMON_STYLES,
      fontSize: 28,
      width: 200,
      height: 28,
      fontWeight: 500,
      lineHeight: 1,
      rotate: 0,
    },
  },
]

export const COMPONENTS: IComponent[] = [
  {
    component: 'VButton',
    label: '按钮',
    propValue: '按钮',
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
      rotate: 0,
    },
  },
]

export const EVENT_MAP = {
  jump: '跳转动作',
  modal: '弹窗动作',
}
