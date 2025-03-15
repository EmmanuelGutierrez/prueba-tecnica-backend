import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePerfilDto } from './dto/create-perfil.dto';
// import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { DatabaseProvider } from '../../../database/database.provider';
import { v4 as uuidv4 } from 'uuid';
import { Perfil } from './entities/perfil.entity';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Injectable()
export class PerfilService {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  create(userId: string, data: CreatePerfilDto) {
    const nuevoPerfil: Perfil = {
      ...data,
      usuario_id: userId,
      id: uuidv4(),
    };
    const perfil = this.databaseProvider.create(nuevoPerfil);
    return perfil;
  }

  update(perfilId: string, data: UpdatePerfilDto) {
    console.log(perfilId);
    const perfil = this.databaseProvider.updateById(perfilId, data);
    return perfil;
  }

  findOne(query: Partial<Perfil>) {
    const perfil = this.databaseProvider.findOne(query);
    if (!perfil) {
      throw new NotFoundException('Perfil no encontrado');
    }
    return perfil;
  }
}
