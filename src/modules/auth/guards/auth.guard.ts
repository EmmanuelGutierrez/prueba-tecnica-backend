import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from 'src/common/constants/jwt.secret';
import { payload } from 'src/common/interface/payload.interface';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwt: JwtService,
  ) {}

  public extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic: boolean = this.reflector.get(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) return true;
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No autorizado');
    }
    try {
      const payload: payload = await this.jwt.verifyAsync(token, {
        secret: jwtSecret,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('No autorizado');
    }

    return true;
  }
}
