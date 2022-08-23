import { Controller } from "egg";

export default class CommonController extends Controller {
    public async upload() {
        const {ctx} = this

        const file = ctx.request.files
        
        
        ctx.body = {
            message: '上传成功',
            data: [file],
            code: 0
        }
        ctx.status = 200
    }
}