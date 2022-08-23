import { Controller } from "egg";
const fs = require('fs');
const path = require('path')

export default class CommonController extends Controller {
    public async upload() {
        const {ctx} = this

        const file = ctx.request.files[0];

        ctx.logger.info(file)

        const name = 'egg-multipart-test/' + path.basename(file.filename);
    let result;
    try {
      // 处理文件，比如上传到云端
      result = await ctx.oss.put(name, file.filepath);
    } finally {
      // 需要删除临时文件
      await fs.unlink(file.filepath);
    }

    ctx.body = {
      url: result.url,
      // 获取所有的字段值
      requestBody: ctx.request.body,
    };
    }
}