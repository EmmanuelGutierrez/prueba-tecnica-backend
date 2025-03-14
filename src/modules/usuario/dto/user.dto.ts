import { ApiProperty } from '@nestjs/swagger';
import { PerfilDto } from '../perfil/dto/perfil.dto';

export class UserDto {
  @ApiProperty()
  readonly id!: string;

  @ApiProperty()
  readonly correo_electronico!: string;

  @ApiProperty()
  readonly edad!: number;

  @ApiProperty()
  readonly nombre!: string;

  @ApiProperty()
  readonly password!: string;

  @ApiProperty()
  readonly perfil: PerfilDto;
}
