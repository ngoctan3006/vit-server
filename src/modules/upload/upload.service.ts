import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { extname } from 'path';
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

@Injectable()
export class UploadService {
  private readonly region: string;
  private readonly bucketName: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get('AWS_REGION');
    this.bucketName = this.configService.get('AWS_BUCKET_NAME');
    this.accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
    this.secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
  }

  getSignedUrl(key: string) {
    const s3 = this.getS3();
    return s3.getSignedUrl('getObject', {
      Bucket: this.bucketName,
      Key: key,
      Expires: 60 * 60 * 12,
    });
  }

  async updateACL(key: string) {
    const s3 = this.getS3();
    await s3
      .putObjectAcl({
        Bucket: this.bucketName,
        Key: key,
        ACL: 'public-read',
      })
      .promise();
    return (
      s3.endpoint.protocol +
      '//' +
      this.bucketName +
      '.' +
      s3.endpoint.hostname +
      '/' +
      key
    );
  }

  async uploadFile(file: Express.Multer.File) {
    const s3 = this.getS3();
    const { Location, Key } = await s3
      .upload({
        Bucket: this.bucketName,
        Body: file.buffer,
        Key:
          Date.now() +
          '_' +
          Math.round(Math.random() * 1e9) +
          extname(file.originalname),
        ACL: 'public-read',
      })
      .promise();

    return {
      url: Location,
      type: file.mimetype,
      key: Key,
    };
  }

  async deleteFileS3(key: string) {
    const s3 = this.getS3();
    await s3
      .deleteObject({
        Bucket: this.bucketName,
        Key: key,
      })
      .promise();
    return true;
  }

  private getS3() {
    return new S3({
      region: this.region,
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    });
  }
}
