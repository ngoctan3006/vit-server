import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { extname } from 'path';
import { EnvConstant } from 'src/shares/constants';
require('aws-sdk/lib/maintenance_mode_message').suppress = true; // Fix: The AWS SDK for JavaScript (v2) will be put into maintenance mode in 2023. Please upgrade to v3.

@Injectable()
export class UploadService {
  private readonly region: string;
  private readonly bucketName: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;
  private readonly s3URL: string;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get(EnvConstant.AWS_S3_REGION);
    this.bucketName = this.configService.get(EnvConstant.AWS_S3_BUCKET_NAME);
    this.accessKeyId = this.configService.get(EnvConstant.AWS_S3_ACCESS_KEY_ID);
    this.secretAccessKey = this.configService.get(
      EnvConstant.AWS_S3_SECRET_ACCESS_KEY
    );
    this.s3URL = this.configService.get(EnvConstant.AWS_S3_URL);
  }

  getKey(url: string): string {
    return url.replace(this.s3URL, '');
  }

  getSignedUrl(key: string): string {
    const s3 = this.getS3();
    return s3.getSignedUrl('getObject', {
      Bucket: this.bucketName,
      Key: key,
      Expires: 60 * 60 * 12, // 12 hours
    });
  }

  async updateACL(key: string): Promise<string> {
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

  async uploadFile(
    file: Express.Multer.File,
    key?: string
  ): Promise<{
    url: string;
    type: string;
    key: string;
  }> {
    const s3 = this.getS3();
    const { Location, Key } = await s3
      .upload({
        Bucket: this.bucketName,
        Body: file.buffer,
        Key: key
          ? `${key}${extname(file.originalname)}`
          : ` ${Date.now()}_${Math.round(Math.random() * 1e9)}${extname(
              file.originalname
            )}`,
        ContentType: file.mimetype,
        ACL: 'public-read',
      })
      .promise();

    return {
      url: Location,
      type: file.mimetype,
      key: Key,
    };
  }

  async deleteFileS3(url?: string): Promise<boolean> {
    if (!url) return false;
    const s3 = this.getS3();
    const key = this.getKey(url);
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
