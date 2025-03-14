import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePerfilDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly codigo!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly nombre_perfil!: string;

  //   @ApiProperty()
  //   @IsNotEmpty()
  //   @IsString()
  //   readonly usuario_id!: string;
}
