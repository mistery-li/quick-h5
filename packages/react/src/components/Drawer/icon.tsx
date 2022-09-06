import { RightOutlined, LeftOutlined } from '@ant-design/icons'

const DrawerIcon = ({ visible, placement }) => {
  if (visible) {
    return placement === 'left' ? <LeftOutlined /> : <RightOutlined />
  } else {
    return placement === 'left' ? <RightOutlined /> : <LeftOutlined />
  }
}

export default DrawerIcon
