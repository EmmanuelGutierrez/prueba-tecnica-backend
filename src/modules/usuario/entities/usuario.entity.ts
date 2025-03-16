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

  @ApiProperty({
    description:
      'En casos normales el password no se devuelve nunca pero en este caso se estara devolviendo en los gets',
  })
  password: string;
}
