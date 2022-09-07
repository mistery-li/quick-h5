import { useEffect, useState } from 'react'

import {
  DownOutlined,
  EditOutlined,
  CheckOutlined,
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined,
  CaretRightFilled,
} from '@ant-design/icons'
import {
  Dropdown,
  Menu,
  Space,
  Input,
  Switch,
  Image,
  Button,
  Row,
  Col,
  Modal,
  message,
} from 'antd'
import type { MenuProps } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import {
  getEditorConfig,
  updateEditorConfig,
  getHistory,
  getCurrent,
  undo,
  redo,
  getComps,
  getCurComp,
  deleteCurComp,
  setLockComp,
  updateComps,
  compToTop,
  compToBottom,
  compToUp,
  compToDown,
} from '../store/components'
import { RootState } from '../store'

import Picture from './Widget/Picture'
import { Title, Text, SubTitle } from './Widget/Text'

import styles from './index.module.less'
const PageHeader = () => {
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()

  const histories = useSelector((state: RootState) => getHistory(state))
  const current = useSelector((state: RootState) => getCurrent(state))
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'gridlines') {
      dispatch(updateEditorConfig({ showGrid: !editorConfig.showGrid }))
    }
  }

  const handleVisibleChange = (flag: boolean) => {
    console.log(flag, 'false')
    setVisible(flag)
  }

  const onMobileFitChange = () => {
    const fit = editorConfig.fit
    dispatch(
      updateEditorConfig({
        fit: fit === 'fullScreen' ? 'shortScreen' : 'fullScreen',
      })
    )
    setVisible(true)
  }

  const editorConfig = useSelector((state: RootState) => getEditorConfig(state))
  console.log(editorConfig, 'config00')

  const comps = useSelector((state: RootState) => getComps(state))

  const curComp = useSelector((state: RootState) => getCurComp(state))

  const handleRedo = () => {
    dispatch(redo())
  }

  const handleUndo = () => {
    dispatch(undo())
  }

  const menu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          key: 'page-title',
          label: <Input placeholder="页面标题" suffix={<EditOutlined />} />,
        },
        {
          key: 'editor-size',
          label: (
            <Space>
              <span>翻页H5</span>
              <span>640 x 1008 px</span>
            </Space>
          ),
        },
        {
          type: 'divider',
        },
        {
          label: '手机适配',
          key: 'mobile-fit',
          children: [
            {
              key: 'fullScreen',
              label: (
                <div>
                  <div className="flex justify-between">
                    <div className="text-gray-400">全面屏幕</div>
                    <Switch
                      checked={editorConfig.fit === 'fullScreen'}
                      onChange={onMobileFitChange}
                    />
                  </div>
                  <div className="text-gray-400">IphoneX、XR、Xs</div>
                </div>
              ),
            },
            {
              type: 'divider',
            },
            {
              key: 'shortScreen',
              label: (
                <div>
                  <div className="flex justify-between">
                    <div className="text-gray-400">短屏</div>
                    <Switch
                      checked={editorConfig.fit === 'shortScreen'}
                      onChange={onMobileFitChange}
                    />
                  </div>
                  <div className="text-gray-400">16：9带虚拟键盘的手机</div>
                </div>
              ),
            },
          ],
        },
        // {
        //   label: (
        //     <div className="flex justify-between">
        //       <div>自动吸附</div>
        //       <CheckOutlined />
        //     </div>
        //   ),
        //   key: 'auto-adsorbent',
        // },
        {
          label: (
            <div className="flex justify-between">
              <div>网格线</div>
              {editorConfig.showGrid && <CheckOutlined />}
            </div>
          ),
          key: 'gridlines',
        },
      ]}
    />
  )

  const logo = new URL('../assets/quick-H5.png', import.meta.url).href

  const [isPreview, setIsPreview] = useState(false)

  const onPreview = () => {
    const previeData = {
      // 页面配置数据
      data: {},
      comps: comps,
    }

    sessionStorage.setItem('previewData', JSON.stringify(previeData))
    console.log('preview')
    setIsPreview(true)
  }

  const handleCancel = () => {
    setIsPreview(false)
  }

  const onDeleteComp = () => {
    if (!curComp) return message.warning('请选择要删除的组件')
    dispatch(deleteCurComp())
  }

  const onLockComp = () => {
    dispatch(setLockComp())
    dispatch(updateComps())
  }

  const handleLayerMenu: MenuProps['onClick'] = ({ key }) => {
    console.log(key, 'key')
    switch (key) {
      case 'top':
        dispatch(compToTop())
        break
      case 'bottom':
        dispatch(compToBottom())
        break
      case 'up':
        dispatch(compToUp())
        break
      case 'down':
        dispatch(compToDown())
        break
    }
  }

  const layerMenu = (
    <Menu
      onClick={handleLayerMenu}
      items={[
        {
          label: '置顶',
          key: 'top',
        },
        {
          label: '置底',
          key: 'bottom',
        },
        {
          label: '上移一层',
          key: 'up',
        },
        {
          label: '下移一层',
          key: 'down',
        },
      ]}
    />
  )

  return (
    <>
      <Row justify="start">
        <Col span={8} style={{ display: 'flex' }}>
          <Space>
            <Image preview={false} width={200} src={logo} />
          </Space>
          <Space>
            <Dropdown
              arrow
              overlay={menu}
              trigger={['click']}
              onVisibleChange={handleVisibleChange}
              visible={visible}
            >
              <div className="flex items-center cursor-pointer">
                <Space>
                  <span>页面设置</span>
                  <DownOutlined />
                </Space>
              </div>
            </Dropdown>
            <Space>
              <Button
                disabled={current === -1}
                className="hover:text-blue-500 hover:bg-white"
                type="text"
                onClick={handleUndo}
              >
                撤销
              </Button>
              <Button
                disabled={histories.length === current + 1}
                className="hover:text-blue-500"
                onClick={handleRedo}
                type="text"
              >
                重做
              </Button>
            </Space>
          </Space>
        </Col>
        <Col span={8}>
          <Space>
            <Dropdown overlay={layerMenu} trigger={['click']} arrow>
              <Button>图层顺序</Button>
            </Dropdown>
            <Button onClick={onLockComp}>
              {curComp?.lock ? <LockOutlined /> : <UnlockOutlined />}
              锁定
            </Button>
            <Button onClick={onDeleteComp} disabled={curComp?.lock}>
              <DeleteOutlined />
              删除
            </Button>
            <Button onClick={onPreview}>
              <CaretRightFilled />
              预览
            </Button>
          </Space>
        </Col>
      </Row>
      <Modal title="" visible={isPreview} onCancel={handleCancel}>
        <div className="flex justify-between" style={{ height: '800px' }}>
          <div className={`${styles['preview-container']} flex-shrink-0`}>
            <div className={styles.mobile}>
              <div className={styles['preview-area']}>
                {comps.map((item, index) => {
                  return (
                    <>
                      <div
                        className="drag-wrapper absolute"
                        style={{
                          ...item.style,
                          zIndex: index,
                          left: item.pos.x,
                          top: item.pos.y,
                        }}
                      >
                        {item.component === 'title' && <Title isEdit />}
                        {item.component === 'subTitle' && <SubTitle isEdit />}
                        {item.component === 'text' && <Text isEdit />}
                        {item.component === 'image' && (
                          <Picture
                            openEvent={item.openEvent}
                            eventData={item.eventData}
                            propValue={item.propValue}
                            styles={item.style}
                          />
                        )}
                      </div>
                    </>
                  )
                })}
              </div>
            </div>
          </div>
          <div>分享</div>
        </div>
      </Modal>
    </>
  )
}

export default PageHeader
