import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
import * as bcrypt from 'bcryptjs';
import { Perfil } from 'src/modules/usuario/perfil/entities/perfil.entity';
import { roles } from 'src/common/enums/roles.enum';
const salt = bcrypt.genSaltSync(10);

export const Database: { Perfiles: Perfil[]; Usuarios: Usuario[] } = {
  Perfiles: [
    {
      id: '1',
      codigo: 'EOG',
      nombre_perfil: 'Manu',
      usuario_id: '1',
    },
  ],
  Usuarios: [
    {
      correo_electronico: 'emma.g2705@gmail.com',
      edad: 27,
      nombre: 'Emmanuel',
      id: '1', //
      role: roles.USER,
      password: bcrypt.hashSync('123456', salt),
    },
  ],
};

export type ModelType<T extends keyof typeof Database> = T extends 'Usuarios'
  ? Usuario
  : Perfil;
