import { ApiProperty } from '@nestjs/swagger';

export class Usuario {
  @ApiProperty()
  id: string;
  @ApiProperty()
  nombre: string;
  @ApiProperty()
  correo_electronico: string;
  @ApiProperty()
  edad: number;
  @ApiProperty()
  password: string;
}
