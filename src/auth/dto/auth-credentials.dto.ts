import { IsString, MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator';

export class AuthCredentialsDto {


  username: string;


  password: string;
}
