import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { QueryDto } from './dto/query.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ErrorDto } from '../../common/dto/Error.dto';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @ApiConflictResponse({
    description: 'Ya existe un usuario con ese correo electronico',
    type: ErrorDto,
  })
  @ApiBadRequestResponse({
    description: 'No se cumplio la verificacion de datos en el body',
    type: ErrorDto,
  })
  @ApiCreatedResponse({
    description: 'Se devuelve el usuario creado',
    type: UserDto,
  })
  @Post('create')
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get('getAll')
  @ApiOkResponse({
    description:
      'Lista de usuarios filtrados por nombre o correo o ambos o ninguno. Si no encuntra ninguno se devuelve un array vacio',
    type: UserDto,
    isArray: true,
  })
  findAll(@Query() query: QueryDto) {
    return this.usuarioService.findAll(query);
  }

  @Get('getAllSecure')
  @UseGuards(JwtAuthGuard, RoleGuard) //Endpoint solo para usuarios admin que hayan hecho login
  @ApiOkResponse({
    description:
      'Hay que hacer login en auth/login y utilizar el token para usar este endpoint. Lista de usuarios filtrados por nombre o correo o ambos o ninguno. Si no encuntra ninguno se devuelve un array vacio',
    type: UserDto,
    isArray: true,
  })
  findAllSecure(@Query() query: QueryDto) {
    return this.usuarioService.findAll(query);
  }

  @Get('getOne/:id')
  @ApiNotFoundResponse({
    description: 'Usuario no encontrado',
    type: ErrorDto,
  })
  @ApiOkResponse({
    description: 'Se devuelve el usuario del correspondiente id',
    type: UserDto,
  })
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(id);
  }

  @Patch('update/:id')
  @ApiNotFoundResponse({
    description: 'Usuario para actualizar no encontrado',
    type: ErrorDto,
  })
  @ApiBadRequestResponse({
    description: 'No se cumplio la verificacion de datos en el body',
    type: ErrorDto,
  })
  @ApiOkResponse({
    description: 'Se devuelve el usuario actualizado',
    type: UserDto,
  })
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @ApiNotFoundResponse({
    description: 'Usuario para borrar no encontrado',
    type: ErrorDto,
  })
  @ApiOkResponse({
    description:
      'Se devuelve un valor true en caso de que elusuario hay sido borrado, en caso contrario se devuelve false',
  })
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(id);
  }
}
