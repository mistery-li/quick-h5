import React from "react";
import { Tabs, Drawer } from "antd";

import animationList from "../../config/animate";
import runAnimation from '../../utils/runAnimation';

const { TabPane } = Tabs;

const Animation = ({ visible, onClose }) => {
  console.log(animationList, "list");

  const onAnimation = async (animation, event: React.MouseEvent) => {
    console.log(animation, 'animation')
    // if (animation.pending) return;
    // animation.pending = true
    await runAnimation(event.target, [animation])
    // 防止无限触发同一元素的动画
  //   setTimeout(() => {
  //     animation.pending = false
  //     console.log(222);
  // }, 100) 
  }

  return (
    <Drawer
      title="动画列表"
      placement="left"
      closable={false}
      onClose={onClose}
      visible={visible}
      key="left"
    >
      <Tabs defaultActiveKey="1">
        {animationList.map((animation) => {
          return (
            <TabPane tab={animation.label} key={animation.label} className="flex flex-wrap">
              {animation.children.map(item => (
                <div onMouseEnter={(event) => onAnimation(item, event)} className="m-1 p-4 text-center bg-gray-200 flex-none w-24 overflow-auto">{item.label}</div>
              ))}
            </TabPane>
          );
        })}
      </Tabs>
    </Drawer>
  );
};

export default Animation;
