import { CreateUsuarioDto } from './create-usuario.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdateUsuarioDto extends PartialType(
  OmitType(CreateUsuarioDto, ['correo_electronico', 'password']),
) {}
