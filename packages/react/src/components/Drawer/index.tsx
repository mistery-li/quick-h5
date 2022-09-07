import { CSSProperties, ReactNode, useState } from 'react'

import styles from './index.module.less'
import DrawerIcon from './icon'

interface DrawerProps {
  children?: ReactNode
  placement?: string
  onClose?: () => void
  onOpen?: () => void
}

const QuickDrawer = ({ children, placement, onClose, onOpen }: DrawerProps) => {
  const [visible, setVisible] = useState(false)
  const onToggle = () => {
    if (visible) {
      onClose?.()
    } else {
      onOpen?.()
    }
    setVisible(!visible)
  }
  return (
    <div
      className={`${styles['quick-drawer']} ${
        placement === 'left'
          ? styles['quick-drawer--left']
          : styles['quick-drawer--right']
      }`}
    >
      <div
        className={`${styles['drawer--container']} ${
          visible ? styles['drawer--open'] : styles['drawer--close']
        }`}
      >
        {visible && <div className={styles.drawer}>{children}</div>}
      </div>
      <div
        className={`${styles['icon--toggle']} ${
          visible ? styles['icon--close'] : styles['icon--open']
        }`}
        onClick={onToggle}
      >
        <DrawerIcon visible={visible} placement={placement} />
      </div>
    </div>
  )
}

export default QuickDrawer
