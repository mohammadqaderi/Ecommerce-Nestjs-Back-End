import { Controller, Post, Req, Res} from '@nestjs/common';
import { AwsService } from './aws.service';

@Controller('aws')
export class AwsController {
  constructor(private service: AwsService) {}
//   @Post('file-upload')
//   uploadFile(@Req() request, @Res() response) {
//     return this.service.fileupload(request, response);
//   }
}
