import { CSSProperties, ReactNode } from 'react'

import styles from './index.module.less'
import DrawerIcon from './icon'

interface DrawerProps {
  children?: ReactNode
  visible?: boolean
  placement?: string
  onClose?: () => void
  onOpen: () => void
}

const QuickDrawer = ({
  children,
  visible,
  placement,
  onClose,
  onOpen,
}: DrawerProps) => {
  const onToggle = () => {
    if (visible) {
      onClose?.()
    } else {
      onOpen?.()
    }
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
