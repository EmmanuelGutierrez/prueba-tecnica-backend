import * as bcrypt from 'bcryptjs';
import { roles } from '../common/enums/roles.enum';

const salt = bcrypt.genSaltSync(10);
export const fakeDatabase = {
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
      role: roles.ADMIN,
      password: bcrypt.hashSync('123456', salt),
    },
  ],
};
