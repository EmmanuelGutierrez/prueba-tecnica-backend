import { Test } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwt: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [JwtAuthGuard],
      imports: [
        JwtModule.register({
          global: true,
          secret: '123',
          signOptions: { expiresIn: '10m' },
        }),
      ],
    }).compile();

    guard = moduleRef.get<JwtAuthGuard>(JwtAuthGuard);
    jwt = moduleRef.get<JwtService>(JwtService);
  });

  it('should deny access', async () => {
    const executionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: null,
          headers: {
            authorization: 'Bearer token_fake',
          },
        }),
      }),
    } as any as ExecutionContext;

    await expect(guard.canActivate(executionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should grant access', async () => {
    const token = jwt.sign({ id: 1 });
    const executionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: null,
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      }),
    } as any as ExecutionContext;
    const auth = await guard.canActivate(executionContext);
    expect(auth).toBeTruthy();
  });
});
