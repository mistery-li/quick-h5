const commonStyle = {
  textAlign: 'center',
}

export const widgets = [
  {
    label: '文字',
    icon: 'FontSizeOutlined',
    component: 'text',
    children: [
      {
        label: '标题',
        component: 'title',
        propValue: '标题0',
        pos: {
          x: 0,
          y: 0,
        },
        style: {
          width: 300,
          height: 80,
          backgroundColor: '#fff',
          fontSize: 40,
          ...commonStyle,
        },
      },
      {
        label: '副标题',
        component: 'subTitle',
        propValue: '副标题0',
        pos: {
          x: 0,
          y: 0,
        },
        style: {
          width: 300,
          height: 60,
          backgroundColor: '#fff',
          fontSize: 30,
          ...commonStyle,
        },
      },
      {
        label: '正文内容',
        component: 'text',
        propValue: '正文内容0',
        pos: {
          x: 0,
          y: 0,
        },
        style: {
          width: 300,
          height: 30,
          backgroundColor: '#fff',
          fontSize: 15,
          ...commonStyle,
        },
      },
    ],
  },
  {
    label: '图片',
    component: 'image',
    icon: 'PictureOutlined',
    children: [
      {
        label: '图片',
        component: 'image',
        propValue:
          'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        pos: {
          x: 0,
          y: 0,
        },
        style: {
          width: 375,
          height: 100,
          borderRadius: 0,
        },
      },
    ],
  },
  {
    label: '背景',
    component: 'background',
    icon: 'BoldOutlined',
    children: [],
  },
  {
    label: '互动',
    component: 'interaction',
    icon: 'InteractionOutlined',
    children: [],
  },
  {
    label: '音乐',
    component: 'music',
    icon: 'BellOutlined',
    children: [],
  },
  {
    label: '视频',
    component: 'video',
    icon: 'VideoCameraOutlined',
    children: [],
  },
]

// export const componentList = [
//   {
//     label: '文字',
//     icon: '',
//     name: 'text',
//     component: 'input',
//     propValue: '双击编辑文字',
//     pos: {
//       x: 0,
//       y: 0,
//     },
//     styles: {
//       width: 200,
//       height: 22,
//       fontSize: 14,
//       textAlign: 'center',
//       color: '',
//       position: 'absolute',
//     },
//   },
//   {
//     label: '按钮',
//     icon: '',
//     name: 'button',
//     component: 'button',
//     propValue: '按钮',
//     pos: {
//       x: 0,
//       y: 0,
//     },
//     styles: {
//       width: 100,
//       height: 34,
//       borderWidth: 1,
//       borderColor: '',
//       borderRadius: '',
//       fontWeight: 500,
//       fontSize: 14,
//       textAlign: 'center',
//       color: '',
//       backgroundColor: '',
//       position: 'absolute',
//     },
//   },
//   {
//     label: '图片',
//     icon: '',
//     name: 'Picture',
//     component: 'picture',
//     propValue: imgUrl,
//     pos: {
//       x: 0,
//       y: 0,
//     },
//     styles: {
//       width: 300,
//       height: 200,
//       borderRadius: '',
//       position: 'absolute',
//     },
//   },
// ]
