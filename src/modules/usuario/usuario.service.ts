import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { PerfilService } from './perfil/perfil.service';
import { DatabaseProvider } from 'src/database/database.provider';
import { QueryDto } from './dto/query.dto';
import { roles } from 'src/common/enums/roles.enum';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly perfilService: PerfilService,
    private readonly databaseProvider: DatabaseProvider,
  ) {}
  create({ password, perfil, ...createUsuarioDto }: CreateUsuarioDto) {
    const usuarioExistente = this.databaseProvider.findOne({
      correo_electronico: createUsuarioDto.correo_electronico,
    });
    if (usuarioExistente) {
      throw new ConflictException(
        'Ya existe un usuario con el mismo correo electronico registrado',
      );
    }
    const salt = bcrypt.genSaltSync(10);
    const nuevoUsuario: Usuario = {
      ...createUsuarioDto,
      id: uuidv4(),
      role: roles.USER,
      password: bcrypt.hashSync(password, salt),
    };
    const usuario = this.databaseProvider.create(nuevoUsuario);
    const newPerfil = this.perfilService.create(nuevoUsuario.id, perfil);

    return { ...usuario, perfil: newPerfil };
  }

  findAll(queryDto: QueryDto) {
    const query: { nombre?: string; correo_electronico?: string } = {};
    if (queryDto.nombre) {
      query.nombre = queryDto.nombre;
    }
    if (queryDto.correo) {
      query.correo_electronico = queryDto.correo;
    }
    const usuarios = this.databaseProvider.find({
      query,
      populateFields: [
        {
          localField: 'id',
          foreignField: 'usuario_id',
          model: 'Perfiles',
          fieldName: 'perfil',
        },
      ],
    });
    return usuarios;
  }

  findOne(id: string) {
    const usuario = this.databaseProvider.findOne({ id });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const perfil = this.perfilService.findOne({ usuario_id: id });
    return { ...usuario, perfil };
  }

  update(id: string, updateData: UpdateUsuarioDto) {
    this.findOne(id);
    const updatedData = this.databaseProvider.updateById(id, updateData);
    return updatedData;
  }

  remove(id: string) {
    this.findOne(id);
    const res = this.databaseProvider.deleteById(id);
    return {
      userDeleted: res,
    };
  }
}
