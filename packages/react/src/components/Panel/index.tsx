import { useState } from 'react'

import { Tabs, Button } from 'antd'

import Attr from './Attr'
import Animation from './Animation'

const { TabPane } = Tabs

const Panel = () => {
  const onChange = (key: string) => {
    console.log(key)
  }

  const [visible, setVisible] = useState(false)

  const showDrawer = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }

  return (
    <div className="pl-2">
      <Tabs defaultActiveKey="1" onChange={onChange}>
        <TabPane tab="属性" key="1">
          <Attr></Attr>
        </TabPane>
        <TabPane tab="动画" key="2">
          <Button onClick={showDrawer}>添加动画</Button>
          <Animation visible={visible} onClose={onClose}></Animation>
        </TabPane>
        <TabPane tab="事件" key="3">
          添加事件
        </TabPane>
      </Tabs>
    </div>
  )
}

export default Panel
