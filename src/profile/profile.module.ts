import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileRepository } from './profile.repository';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from '../auth/auth.constants';
import { AwsModule } from '../shared/aws/aws.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileRepository]),
  PassportModule.register({
    defaultStrategy: jwtConstants.strategy    
  }),
  AwsModule],
  providers: [ProfileService],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
