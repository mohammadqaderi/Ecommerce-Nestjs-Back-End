import {
  Controller,
  Post,
  Body,
  Get,
  ValidationPipe,
  Delete,
  UseGuards, Scope,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { CreateProfileDto } from '../profile/dto/create-profile.dto';
import { GetAuthenticatedUser } from './get-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('/register')
  signUp(
    @Body('authCredentialsDto', ValidationPipe)
      authCredentialsDto: AuthCredentialsDto,
    @Body('createProfileDto', ValidationPipe)
      createProfileDto: CreateProfileDto,
  ) {
    return this.authService.signUp(
      authCredentialsDto,
      createProfileDto,
    );
  }

  @Post('/login')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @UseGuards(AuthGuard('local'))
  @Delete('/delete-user')
  deleteUser(@GetAuthenticatedUser() user: User) {
    return this.authService.deleteUser(user);
  }
  @UseGuards(AuthGuard())
  @Get('system-users')
  getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }

  @UseGuards(AuthGuard())
  @Get('exist-data')
  getExistData(): Promise<any> {
    return this.authService.existData();
  }


  @UseGuards(AuthGuard())
  @Get('/current-user')
  getCurrentUser(@GetAuthenticatedUser() user: User) {
    return this.authService.getAuthenticatedUser(user.id);
  }

  @UseGuards(AuthGuard())
  @Get('/user-main-data')
  getUserData(@GetAuthenticatedUser() user: User) {
    return this.authService.getUserData(user.id);
  }
}
