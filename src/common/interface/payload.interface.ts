import { roles } from '../enums/roles.enum';

export interface payload {
  correo_electronico: string;
  id: string;
  role: roles;
}
