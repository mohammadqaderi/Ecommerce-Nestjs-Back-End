import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { AwsController } from './aws.controller';

@Module({
  providers: [AwsService],
  controllers: [AwsController],
  exports: [AwsService]
})
export class AwsModule {}
// Access Key ID:
// AKIAI74L3YS6JQG6LWBQ
// Secret Access Key:
// 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