import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  readonly correo_electronico: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
