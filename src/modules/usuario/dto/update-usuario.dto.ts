import { Type } from 'class-transformer';
import { UpdatePerfilDto } from '../perfil/dto/update-perfil.dto';
import { CreateUsuarioDto } from './create-usuario.dto';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(
  OmitType(CreateUsuarioDto, ['correo_electronico', 'password', 'perfil']),
) {
  @ApiProperty({
    example: {
      codigo: 'ASD',
      nombre_perfil: 'Manu',
    },
  })
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => UpdatePerfilDto)
  readonly perfil?: UpdatePerfilDto;
}
