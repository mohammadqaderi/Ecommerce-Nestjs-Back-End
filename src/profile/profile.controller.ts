import {
  Controller,
  Put,
  Get,
  UseGuards,
  Body,
  ValidationPipe,
  Post,
  UseInterceptors,
  UploadedFile,
  Delete,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetAuthenticatedUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {
  }

  @UseGuards(AuthGuard())
  @Put('userprofile/edit')
  editProfile(
    @GetAuthenticatedUser() user: User,
    @Body(ValidationPipe) createProfileDto: CreateProfileDto,
  ) {
    return this.profileService.editUserProfile(user, createProfileDto);
  }

  @UseGuards(AuthGuard())
  @Get()
  getUserProfile(@GetAuthenticatedUser() user: User) {
    return this.profileService.getProfileData(user);
  }

  @UseGuards(AuthGuard())
  @Post('userprofile/setprofileimage')
  @UseInterceptors(
    FileInterceptor('image')
  )
  setImage(@GetAuthenticatedUser() user: User, @UploadedFile() file) {
    return this.profileService.setProfileImage(user, file);
  }

  @UseGuards(AuthGuard())
  @Delete('userprofile/deleteprofileimage')
  deleteImage(@GetAuthenticatedUser() user: User) {
    return this.profileService.deleteProfileImage(user);
  }

  @UseGuards(AuthGuard())
  @Patch('userprofile/changeprofileimage')
  @UseInterceptors(
    FileInterceptor('image')
  )
  changeProfileImage(@GetAuthenticatedUser() user: User, @UploadedFile() file) {
    return this.profileService.changeProfileImage(user, file);
  }
}
