import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PerfilModule } from './perfil/perfil.module';
import { DatabaseProvider } from 'src/database/database.provider';

@Module({
  controllers: [UsuarioController],
  providers: [
    UsuarioService,
    {
      provide: DatabaseProvider,
      useFactory: () => {
        return new DatabaseProvider('Usuarios');
      },
    },
  ],
  imports: [PerfilModule],
})
export class UsuarioModule {}
