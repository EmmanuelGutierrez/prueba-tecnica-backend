import { Usuario } from '../modules/usuario/entities/usuario.entity';
import * as bcrypt from 'bcryptjs';
import { Perfil } from '../modules/usuario/perfil/entities/perfil.entity';
import { roles } from '../common/enums/roles.enum';
const salt = bcrypt.genSaltSync(10);

export const Database: { Perfiles: Perfil[]; Usuarios: Usuario[] } = {
  Perfiles: [
    {
      id: '1',
      codigo: 'EOG',
      nombre_perfil: 'Manu',
      usuario_id: '1',
    },
    {
      codigo: 'ASD',
      nombre_perfil: 'Manu',
      usuario_id: 'fbd86529-6723-4d49-bb7c-82e77f62385b',
      id: 'afcee723-9277-475a-92a4-f7c183996c8d',
    },
    {
      codigo: 'ASD',
      nombre_perfil: 'Manu',
      usuario_id: 'e3db41cb-d224-4340-a1ff-bd13375fa6cc',
      id: '043b7a25-9d69-414b-99e6-30119d59dae6',
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
    {
      correo_electronico: 'mail@mail.com',
      edad: 27,
      nombre: 'Manu',
      id: 'e3db41cb-d224-4340-a1ff-bd13375fa6cc',
      role: roles.USER,
      password: '$2b$10$edzP5x.ddv30POzuowFjWeQ9ktV5wzuVaiPRu6XAKAPLEQvoakXhy',
    },
    {
      correo_electronico: 'mail2@mail.com',
      edad: 23,
      nombre: 'emi',
      id: 'fbd86529-6723-4d49-bb7c-82e77f62385b',
      role: roles.USER,
      password: '$2b$10$giwbM5Ummda3b2TFt1FdhuqdHEY945CDyITEkKUWMwsJgdJm7NmzK',
    },
  ],
};

export type ModelType<T extends keyof typeof Database> = T extends 'Usuarios'
  ? Usuario
  : Perfil;
