import { ApiProperty } from '@nestjs/swagger';
import { roles } from '../../../common/enums/roles.enum';

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
  role: roles;

  @ApiProperty()
  password: string;
}
