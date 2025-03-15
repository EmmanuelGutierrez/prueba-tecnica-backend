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
import { DatabaseProvider } from '../../database/database.provider';
import { QueryDto } from './dto/query.dto';
import { roles } from '../../common/enums/roles.enum';
import { Perfil } from './perfil/entities/perfil.entity';

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
    const usuario = this.databaseProvider.create(nuevoUsuario) as Usuario;
    const newPerfil = this.perfilService.create(
      nuevoUsuario.id,
      perfil,
    ) as Perfil;

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
    const usuario = this.databaseProvider.findOne({ id }) as Usuario;
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const perfil = this.perfilService.findOne({ usuario_id: id });
    return { ...usuario, perfil };
  }

  update(id: string, { perfil, ...updateData }: UpdateUsuarioDto) {
    const usuario = this.findOne(id);

    const updatedData = this.databaseProvider.updateById(id, updateData);
    if (perfil) {
      this.perfilService.update(usuario.perfil.id, perfil);
    }
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
