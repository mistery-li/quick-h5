import {
  UndoOutlined,
  RedoOutlined,
  PlusOutlined,
  MinusOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";

const Toolbar = () => {
  return (
    <div className="flex flex-col w-12 border-r-2 border-gray-400">
      <Tooltip placement="left" title="撤销">
        <div className="h-10">
          <UndoOutlined />
        </div>
      </Tooltip>
      <Tooltip placement="left" title="重做">
        <div className="h-10">
          <RedoOutlined />
        </div>
      </Tooltip>
      <Tooltip placement="left" title="放大">
        <div className="h-10">
          <PlusOutlined />
        </div>
      </Tooltip>
      <Tooltip placement="left" title="缩小">
        <div className="h-10">
          <MinusOutlined />
        </div>
      </Tooltip>
      <Tooltip placement="left" title="下载海报">
        <div className="h-10">
          <DownloadOutlined />
        </div>
      </Tooltip>
    </div>
  );
};

export default Toolbar;
