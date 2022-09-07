import { FC, useState, memo, useEffect } from 'react'
import * as Icons from '@ant-design/icons'
import Icon, { RightOutlined, LeftOutlined } from '@ant-design/icons'
import styles from './style.module.less'

import TargetBox from './TargetBox/TargetBox'

import { widgets } from '../../config/componentList'
import WdigetList from '../WidgetList'

import QuickDrawer from '../Drawer'

import { createApi } from 'unsplash-js'
import { ComponentItem } from '../../types'
export const Container = () => {
  const List = widgets

  const [current, setCurrent] = useState('')

  const [currentWdigetList, setCurrentWdigetList] = useState<ComponentItem[]>(
    []
  )

  const unSplashApi = createApi({
    accessKey: 'oBe1wCYQT-clVYqehPyyRthRokOebCryZWWQi1IsTEE',
  })

  const getImages = async () => {
    if (current === 'image') {
      const { response: images } = await unSplashApi.photos.getRandom({
        count: 30,
      })
      const imageComp = List.find((item) => item.component === current)
        ?.children[0]
      setCurrentWdigetList(
        (images as any).map((item) => ({
          ...imageComp,
          propValue: item.urls.thumb,
        }))
      )
    }
  }

  useEffect(() => {
    getImages()
  }, [current])

  const openWidgetList = (comp: string) => {
    setCurrent(comp)
    if (comp !== 'image') {
      const widgetList = List.find((item) => item.component === comp)
      setCurrentWdigetList(widgetList?.children as any)
    }
  }
  return (
    <div className="flex w-full">
      <ul className="pl-0 widget-wrapper">
        {List.map((item, index) => {
          return (
            <li
              key={index}
              onClick={() => openWidgetList(item.component)}
              className={`w-20 p-5 list-none text-center background- hover:bg-blue-500 cursor-pointer hover:text-white ${
                current === item.component && 'bg-blue-500'
              }`}
            >
              <Icon
                style={{ fontSize: 24 }}
                component={
                  Icons[item.icon] as React.ForwardRefExoticComponent<any>
                }
              />
              <div>{item.label}</div>
            </li>
          )
        })}
      </ul>
      <QuickDrawer placement="left">
        <WdigetList current={current} data={currentWdigetList}></WdigetList>
      </QuickDrawer>
      <div className="flex-grow bg-gray-200">
        <TargetBox />
      </div>
    </div>
  )
}
