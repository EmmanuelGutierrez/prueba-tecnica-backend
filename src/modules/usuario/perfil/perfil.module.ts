import { Module } from '@nestjs/common';
import { PerfilService } from './perfil.service';
import { DatabaseProvider } from '../../../database/database.provider';

@Module({
  providers: [
    PerfilService,
    {
      provide: DatabaseProvider,
      useFactory: () => {
        return new DatabaseProvider('Perfiles');
      },
    },
  ],
  exports: [PerfilService],
})
export class PerfilModule {}
