import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryDto {
  @ApiProperty({
    required: false,
    example: 'Emmanuel',
    description: 'Se buscara si el nombre es igual al ingresado',
  })
  @IsString()
  @IsOptional()
  public readonly nombre?: string;

  @ApiProperty({
    required: false,
    example: 'emma.g_2705@gmail.com',
    description: 'Se buscara si el correo electronico es igual al ingresado',
  })
  @IsString()
  @IsOptional()
  public readonly correo?: string;

  @ApiProperty({
    required: false,
    example: 'em',
    description:
      'Se buscara en todos los campos si alguno contiene la palabra clave ingresada',
  })
  @IsString()
  @IsOptional()
  public readonly like?: string;
}
