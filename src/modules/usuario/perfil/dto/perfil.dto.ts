import { ApiProperty } from '@nestjs/swagger';

export class PerfilDto {
  @ApiProperty()
  readonly id!: string;

  @ApiProperty()
  readonly usuario_id!: string;

  @ApiProperty()
  readonly codigo!: string;

  @ApiProperty()
  readonly nombre_perfil!: string;
}
