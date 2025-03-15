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
  @ApiProperty({ example: 'test@test.com' })
  @IsNotEmpty()
  @IsEmail()
  readonly correo_electronico!: string;

  @ApiProperty({ example: 27 })
  @IsNotEmpty()
  @IsNumber()
  readonly edad!: number;

  @ApiProperty({ example: 'Emmanuel' })
  @IsNotEmpty()
  @IsString()
  readonly nombre!: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  readonly password!: string;

  @ApiProperty({
    example: {
      codigo: 'ASD',
      nombre_perfil: 'Manu',
    },
  })
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => CreatePerfilDto)
  readonly perfil: CreatePerfilDto;
}
