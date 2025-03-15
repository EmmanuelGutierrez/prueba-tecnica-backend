import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { DatabaseProvider } from '../../database/database.provider';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../usuario/entities/usuario.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseProvider: DatabaseProvider,
    private readonly jwt: JwtService,
  ) {}
  async login({ correo_electronico, password }: LoginDto) {
    const user = this.databaseProvider.findOne({
      correo_electronico,
    }) as Usuario;
    if (!user) {
      throw new UnauthorizedException('Datos erroneos');
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      throw new UnauthorizedException('Datos erroneos');
    }
    const token = this.jwt.sign({
      correo_electronico: user.correo_electronico,
      role: user.role,
      id: user.id,
    });
    return { token };
  }
}
