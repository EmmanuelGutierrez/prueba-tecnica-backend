import { Test } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RoleGuard } from './role.guard';
import { DatabaseProvider } from '../../../database/database.provider';
import { fakeDatabase } from '../../../database/database.mock';
import { Reflector } from '@nestjs/core';
import { roles } from '../../../common/enums/roles.enum';

describe('RoleGuard', () => {
  let guard: RoleGuard;

  beforeEach(async () => {
    const reflector = {
      get: jest.fn(),
      getAll: jest.fn(),
      getAllAndMerge: jest.fn(),
      getAllAndOverride: jest.fn(),
    } as Reflector;
    const moduleRef = await Test.createTestingModule({
      providers: [
        RoleGuard,
        { provide: Reflector, useValue: reflector },
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

    guard = moduleRef.get<RoleGuard>(RoleGuard);
  });

  it('No tendra acceso porque debe ser admin', async () => {
    const executionContext = {
      getHandler: () => undefined,
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: '1', role: roles.USER },
        }),
      }),
    } as any as ExecutionContext;

    await expect(
      new Promise((resolve, rejects) => {
        try {
          resolve(guard.canActivate(executionContext));
        } catch (error) {
          rejects(error as Error);
        }
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('tendra acceso pro ser admin', () => {
    const executionContext = {
      getHandler: () => undefined,
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: '1', role: roles.ADMIN },
        }),
      }),
    } as any as ExecutionContext;

    expect(guard.canActivate(executionContext)).toBeTruthy();
  });
});
