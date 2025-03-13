import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PerfilModule } from './perfil/perfil.module';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService],
  imports: [PerfilModule],
})
export class UsuarioModule {}
