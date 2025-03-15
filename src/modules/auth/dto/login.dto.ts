import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'emma.g2705@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  readonly correo_electronico: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
