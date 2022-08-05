import { IComponent } from '../types'

export const components: IComponent[] = [
  {
    component: 'VText',
    label: '文字',
    propValue: '双击编辑文字',
    icon: 'wenben',
    style: {
      width: 200,
      height: 22,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1.5,
      textAlign: 'center',
      color: '',
      borderRadius: 0,
      // transform: 'translate(0px, 0px)',
    },
  },
  {
    component: 'VButton',
    label: '按钮',
    propValue: '按钮',
    icon: 'button',
    style: {
      width: 100,
      height: 34,
      borderWidth: 1,
      borderColor: '',
      borderRadius: 0,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 2,
      textAlign: 'center',
      color: '',
      backgroundColor: '',
      // transform: 'translate(0px, 0px)',
    },
  },
  {
    component: 'Picture',
    label: '图片',
    icon: 'tupian',
    propValue: new URL(`../assets/vue.svg`, import.meta.url).href,
    style: {
      width: 300,
      height: 200,
      borderRadius: 0,
      borderWidth: 1,
      // transform: 'translate(0px, 0px)',
    },
  },
]
