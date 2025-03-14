import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreatePerfilDto } from '../perfil/dto/create-perfil.dto';

export class CreateUsuarioDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly correo_electronico!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly edad!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly nombre!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password!: string;

  @ApiProperty()
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => CreatePerfilDto)
  readonly perfil: CreatePerfilDto;
}
