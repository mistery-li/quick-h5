import Toolbar from '../components/Toolbar'
import Panel from '../components/Panel/index'
import { Layout, Alert } from 'antd'
import Drawer from '../components/Drawer'

const { Header } = Layout

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Editor from '../components/Editor/index'
import PageHeader from '../components/PageHeader'
import { useState } from 'react'

export const Home = () => {
  const [visible, setVisible] = useState(false)

  const onToggle = () => {
    setVisible(!visible)
  }
  return (
    <>
      <Layout>
        {/* <Alert
          message={
            <div>
              <span>
                仅作为熟悉React全家桶练习，暂不可作为生产使用。如有问题请提issue{' '}
              </span>
              <a href="https://github.com/mistery-li/quick-h5" target="_blank">
                https://github.com/mistery-li/quick-h5
              </a>
            </div>
          }
          type="warning"
          closable
        /> */}
        <Header style={{ background: '#fff' }}>
          <PageHeader />
        </Header>
      </Layout>
      <div className="flex h-screen">
        <DndProvider backend={HTML5Backend}>
          <Editor />
        </DndProvider>
        {/* <div className="flex-none w-3/12 flex"> */}
        <Drawer placement="right" onOpen={onToggle} onClose={onToggle}>
          {/* <Toolbar></Toolbar> */}
          <Panel></Panel>
        </Drawer>
        {/* </div> */}
      </div>
    </>
  )
}

export default Home
