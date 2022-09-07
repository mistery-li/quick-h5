import { Image } from 'antd'
import type { FC, ReactNode } from 'react'
import { memo, useCallback, useState } from 'react'
import type { DragSourceMonitor } from 'react-dnd'
import { useDrag } from 'react-dnd'
import { ComponentItem } from '../../types'

import { SourceBox } from '../Editor/SourceBox'

import { Title, SubTitle, Text } from '../Widget/Text'
import styles from './styles.module.less'

const WidgetList = ({ data, current }) => {
  return (
    <>
      {current !== 'image' &&
        data.map((widget, index) => {
          return (
            <div className={styles['widget-wrapper']} key={index}>
              {current === 'text' && (
                <SourceBox color="blue" current={current} component={widget}>
                  {widget.component === 'title' ? (
                    <Title isEdit={false} />
                  ) : null}
                  {widget.component === 'subTitle' ? (
                    <SubTitle isEdit={false} />
                  ) : null}
                  {widget.component === 'text' ? <Text isEdit={false} /> : null}
                </SourceBox>
              )}
            </div>
          )
        })}
      {current === 'text' && (
        <div className="p-10 text-white">
          <div>文字组合</div>
          <div>组合组件正在开发中,待开放...</div>
        </div>
      )}
      {current === 'image' && (
        <div className="grid grid-cols-2 gap-1 h-screen">
          {data.map((widget, index) => {
            return (
              <div
                className={`${styles['widget-wrapper']} border border-solid border-black`}
                key={index}
              >
                <SourceBox
                  key={index}
                  color="blue"
                  current={current}
                  component={widget}
                >
                  <div>
                    <Image preview={false} src={widget.propValue}></Image>
                  </div>
                </SourceBox>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default memo(WidgetList)
