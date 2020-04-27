import { Controller, Get, Res, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/files/:filename')
  getImage(@Param('filename') filename: string, @Res() res: Response) {
    res.sendFile(filename, { root: 'files' });
  }
  @Get('/files/profile-images/:filename')
  getProfileImage(@Param('filename') filename: string, @Res() res: Response) {
    res.sendFile(filename, { root: 'files/profile-images' });
  }

  @Get('/files/product-images/:filename')
  getProductImage(@Param('filename') filename: string, @Res() res: Response) {
    res.sendFile(filename, { root: 'files/product-images' });
  }
}
