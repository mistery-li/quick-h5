import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('common')
export class UploadController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  updateFile(): string {
    return 'hello upload';
  }
}
