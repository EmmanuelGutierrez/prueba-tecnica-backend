import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { roles } from 'src/common/enums/roles.enum';
import { payload } from 'src/common/interface/payload.interface';
import { DatabaseProvider } from 'src/database/database.provider';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private databaseProvider: DatabaseProvider,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const rolesArray: roles[] = this.reflector.get(
      'roles',
      context.getHandler(),
    ) ?? [roles.ADMIN];
    const payload = request['user'] as payload;
    const user = this.databaseProvider.findOne({ id: payload.id }) as Usuario;
    if (!user || user.role !== payload.role) {
      throw new UnauthorizedException();
    }
    const isAuth = rolesArray.includes(user.role);
    if (!isAuth) {
      throw new UnauthorizedException();
    }
    return isAuth;
  }
}
