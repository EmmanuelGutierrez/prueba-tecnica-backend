import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DatabaseProvider } from '../../database/database.provider';
import { fakeDatabase } from '../../database/database.mock';
import { JwtModule } from '@nestjs/jwt';
import { isString } from 'class-validator';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: DatabaseProvider,
          useFactory: () => {
            return new DatabaseProvider('Usuarios', fakeDatabase);
          },
        },
      ],
      imports: [
        JwtModule.register({
          global: true,
          secret: '123',
          signOptions: { expiresIn: '10m' },
        }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('Deberia devolver un objeto con el token', async () => {
      const res = await service.login({
        correo_electronico: 'emma.g2705@gmail.com',
        password: '123456',
      });
      expect(res).toBeDefined();
      expect(isString(res.token)).toBeTruthy();
    });

    it('Deberia devolver un error por password incorrecto', async () => {
      const res = service.login({
        correo_electronico: 'emma.g2705@gmail.com',
        password: '123457',
      });
      await expect(res).rejects.toThrow(UnauthorizedException);
    });

    it('Deberia devolver un error por usuario no encontrado', async () => {
      const res = service.login({
        correo_electronico: 'emmas.g2705@gmail.com',
        password: '123456',
      });
      await expect(res).rejects.toThrow(UnauthorizedException);
    });
  });
});
