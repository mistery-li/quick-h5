import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { Space, UploadProps } from 'antd'
import { Button, message, Upload, Col, InputNumber, Row, Slider } from 'antd'

import { Form, Select, Result, Input, Checkbox } from 'antd'

import type { CheckboxChangeEvent } from 'antd/es/checkbox'

import { setCompEvent, toggleEvent } from '../../store/components'

const { Option } = Select

interface formData {
  name: string
  value: any
}

const props: UploadProps = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  },
}

import {
  getCurComp,
  setCurCompStyle,
  updateComps,
  updateEditorConfig,
} from '../../store/components'
import PickColor from './PickColor'
import { RootState } from '../../store'

type SizeType = Parameters<typeof Form>[0]['size']

const Attr = () => {
  const curComp = useSelector((state: RootState) => getCurComp(state))
  const [formList, setFormList] = useState<formData[]>([])
  useEffect(() => {
    setFormList(
      Object.keys((curComp && curComp.style) || {})
        .filter((name) => name !== 'position' && name !== 'borderRadius')
        .map((name) => ({
          name,
          value: curComp?.style[name],
        }))
    )
    console.log(formList, 'list')
  }, [curComp])

  const styleMap = {
    width: '宽度',
    height: '高度',
    borderWidth: '边框宽度',
    borderColor: '边框颜色',
    borderRadius: '圆角',
    fontWeight: '字体粗度',
    fontSize: '字体大小',
    textAlign: '字体对齐',
    color: '字体颜色',
    backgroundColor: '背景颜色',
    transform: '旋转角度',
    left: 'X坐标',
    top: 'Y坐标',
  }

  const dispatch = useDispatch()

  const handleChange = (
    styleKey,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log([styleKey, event], 'update cur comp style')
    dispatch(
      setCurCompStyle({
        [styleKey]: parseFloat(event.target.value),
      })
    )
    dispatch(updateComps())
  }

  const handleFieldsChange = (changedFields, allFields) => {
    console.log(changedFields, 'field change')
    dispatch(
      setCurCompStyle({
        [changedFields[0]['name'][0]]: parseFloat(changedFields[0].value),
      })
    )
    dispatch(updateComps())
  }

  const renderImageForm = () => {
    const onBorderRadiusChange = (newValue: number) => {
      dispatch(setCurCompStyle({ borderRadius: newValue }))
      dispatch(updateComps())
    }

    const onSwitchLinkRouter = () => {
      dispatch(toggleEvent(!curComp?.openEvent))
      dispatch(updateComps())
    }

    const handleLinkChange = (e: any) => {
      console.log(e, 'eeee')
      dispatch(setCompEvent(e.target.value))
      dispatch(updateComps())
    }
    return (
      <>
        {curComp && (
          <div className="flex flex-col gap-4">
            <Button>替换图片</Button>
            <Checkbox
              checked={curComp!.openEvent}
              onChange={onSwitchLinkRouter}
            >
              启用跳转链接
            </Checkbox>
            {curComp!.openEvent && (
              <Space>
                <Select defaultValue={curComp!.eventData.type}>
                  <Option value="outerChain">网页链接</Option>
                  <Option value="pageChain">页面跳转</Option>
                </Select>
                <Input
                  value={curComp!.eventData.link}
                  onChange={handleLinkChange}
                />
              </Space>
            )}
            <Row style={{ alignItems: 'center', marginBottom: '20px' }}>
              <Col span={3}>
                <div>{styleMap['borderRadius']}</div>
              </Col>
              <Col span={14}>
                <Slider
                  min={1}
                  max={100}
                  onChange={onBorderRadiusChange}
                  value={Number(curComp.style.borderRadius)}
                />
              </Col>
              <Col span={2}>
                <InputNumber
                  style={{ width: '60px', margin: '0 8px' }}
                  size="small"
                  min={0}
                  max={100}
                  value={Number(curComp.style.borderRadius)}
                  onChange={onBorderRadiusChange}
                />
              </Col>
            </Row>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      {curComp && (
        <Form
          onFieldsChange={handleFieldsChange}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          fields={formList}
          initialValues={(curComp && curComp.style) || {}}
        >
          {curComp && curComp.component === 'image' && renderImageForm()}
          {formList
            .filter((attr) => attr[0] !== 'position')
            .map((item, index) => (
              <Form.Item
                key={index}
                label={styleMap[item.name]}
                name={item.name}
              >
                {item.name.toLowerCase().includes('color') ? (
                  <PickColor
                    styleKey={item.name}
                    colorValue={item.value}
                  ></PickColor>
                ) : item.name.toLocaleLowerCase().includes('text') ? (
                  <>
                    <Select defaultValue={item.value} style={{ width: 120 }}>
                      <Option value="left">左边</Option>
                      <Option value="center">中间</Option>
                      <Option value="right">右边</Option>
                    </Select>
                  </>
                ) : (
                  <Input value={item.value} />
                )}
              </Form.Item>
            ))}
        </Form>
      )}
      {!curComp && (
        <Result
          status="403"
          title="暂无数据"
          subTitle="请从左侧选取需要添加的功能部件以编辑生成页面"
        />
      )}
    </>
  )
}

export default Attr
