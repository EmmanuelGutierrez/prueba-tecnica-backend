import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseProvider } from 'src/database/database.provider';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret } from 'src/common/constants/jwt.secret';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtSecret,
      signOptions: { expiresIn: '10m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: DatabaseProvider,
      useFactory: () => {
        return new DatabaseProvider('Usuarios');
      },
    },
  ],
})
export class AuthModule {}
