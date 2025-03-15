import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { DatabaseProvider } from '../../database/database.provider';
// import { PerfilModule } from './perfil/perfil.module';
// import { PerfilService } from './perfil/perfil.service';
import { PerfilModule } from './perfil/perfil.module';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { fakeDatabase } from '../../database/database.mock';
// import { mockDatabaseProvider } from 'src/database/database.mock';

// const mockDatabaseProvider = {
//   find: jest.fn(),
//   findOneById: jest.fn(),
//   findOne: jest.fn(),
//   deleteById: jest.fn(),
//   create: jest.fn(),
//   updateById: jest.fn(),
// };

// const mockPerfilService = {
//   findOne: jest.fn(),
//   create: jest.fn(),
// };

describe('UsuarioService', () => {
  let service: UsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: DatabaseProvider,
          useFactory: () => {
            return new DatabaseProvider('Usuarios', fakeDatabase);
          },
        },
      ],
      imports: [PerfilModule],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe crear un usuario', () => {
      const userData: CreateUsuarioDto = {
        nombre: 'Test',
        edad: 21,
        correo_electronico: 'test@test.com',
        password: '123',
        perfil: {
          codigo: 'TEST',
          nombre_perfil: 'PERFIL TEST',
        },
      };
      const usuarios = service.findAll({});
      const res = service.create(userData);
      const nuevaLista = service.findAll({});

      const { perfil: resPerfil } = res;
      const { perfil: perfilData, password, ...data } = userData;
      expect(resPerfil).toMatchObject(perfilData);
      expect(res.password).not.toEqual(password);
      expect(res).toMatchObject(data);
      expect(nuevaLista.length).toBeGreaterThan(usuarios.length);
    });

    it('deberia devolver un error por usar un email ya registrado ', async () => {
      const userData: CreateUsuarioDto = {
        nombre: 'Test',
        edad: 21,
        correo_electronico: 'emma.g2705@gmail.com',
        password: '123',
        perfil: {
          codigo: 'TEST',
          nombre_perfil: 'PERFIL TEST',
        },
      };

      await expect(
        new Promise((resolve, rejects) => {
          try {
            resolve(service.create(userData));
          } catch (error) {
            rejects(error as Error);
          }
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('deberia devolver un array con usuarios y sus perfiles', () => {
      const res = service.findAll({});
      expect(res.length).toBeGreaterThanOrEqual(1);
    });

    it('deberia devolver un array con usuarios y sus perfiles (si el nombre es Emmanuel)', () => {
      const nombre = 'Emmanuel';
      const res = service.findAll({ nombre }) as Usuario[];
      expect(res.length).toBeGreaterThanOrEqual(1);
      expect(res[0].nombre).toEqual(nombre);
    });

    it('deberia devolver un array con usuarios y sus perfiles (si el nombre es emma.g2705@gmail.com)', () => {
      const correo = 'emma.g2705@gmail.com';
      const res = service.findAll({ correo }) as Usuario[];
      expect(res.length).toBeGreaterThanOrEqual(1);
      expect(res[0].correo_electronico).toEqual(correo);
    });
  });

  describe('findOne', () => {
    it('deberia devolver un usuario', () => {
      const id = '1';
      const res = service.findOne(id);
      expect(res).toBeDefined();
      expect(res.id).toEqual(id);
    });

    it('deberia devolver un error por no encontrarlo', async () => {
      const id = '2';
      await expect(
        new Promise((resolve, rejects) => {
          try {
            resolve(service.findOne(id));
          } catch (error) {
            rejects(error as Error);
          }
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deberia devolver un usuario actualizado (nombre diferente, id igual)', () => {
      const id = '1';
      const userData: UpdateUsuarioDto = {
        nombre: 'Testing',
      };
      const oldUser = service.findOne(id);

      expect(oldUser.nombre).not.toEqual(userData.nombre);
      const res = service.update(id, userData) as Usuario;
      expect(res).toBeDefined();
      expect(res.id).toEqual(id);
      expect(res.nombre).toEqual(userData.nombre);
    });

    it('Deberia devolver un error por no existir un usuario con el id recibido', async () => {
      const id = '2';
      const userData: UpdateUsuarioDto = {
        nombre: 'Testing',
      };
      await expect(
        new Promise((resolve, rejects) => {
          try {
            resolve(service.update(id, userData));
          } catch (error) {
            rejects(error as Error);
          }
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('deberia devolver un true por eliminar un usuario', () => {
      const id = '1';
      const res = service.remove(id);
      expect(res).toBeDefined();
      expect(res.userDeleted).toBeTruthy();
    });

    it('deberia devolver un error por no un usuario para borrar con ese id', async () => {
      const id = '2';
      await expect(
        new Promise((resolve, rejects) => {
          try {
            resolve(service.remove(id));
          } catch (error) {
            rejects(error as Error);
          }
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
