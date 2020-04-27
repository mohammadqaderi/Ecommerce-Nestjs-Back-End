import { Injectable, Req, Res } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as config from '../../config';
import { extname } from 'path';
const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: config.default.aws.Access_Key_ID,
  secretAccessKey: config.default.aws.Secret_Access_Key,
});
@Injectable()
export class AwsService {
  async fileupload(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const name = file.originalname.split('.')[0];
      const fileExtName = extname(file.originalname);
      const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      const params: AWS.S3.Types.PutObjectRequest = {
        Bucket: 'e-commerce-products',
        Key: `${name}-${randomName}${fileExtName}`,
        Body: file.buffer,
        ACL: 'public-read',
        
      };
      s3.upload(params, (err, data: AWS.S3.ManagedUpload.SendData) => {
        if (err) {
          return reject(err);
        }
        resolve(`${config.default.aws.cdnUrl}/${data.Key}`)
      });
    });
  }
  async fileDelete(filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const params: AWS.S3.DeleteObjectRequest = {
        Bucket: 'e-commerce-products',
        Key: filename.substring(55),
      };
      s3.deleteObject(params, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve();
      })
    });
  }
}
