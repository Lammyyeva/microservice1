import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyUserDto {
  @IsEmail()
  @IsNotEmpty({ message: 'provide the verification code, please' })
  readonly email: string;

  @IsString()
  @IsNotEmpty({ message: 'provide the verification code, please' })
  otp: string;
}